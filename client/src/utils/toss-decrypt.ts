/**
 * 토스 사용자 정보 복호화 유틸리티
 * AES-256-GCM 알고리즘을 사용하여 암호화된 사용자 정보를 복호화합니다.
 */

import { env } from '@/config/env'

/**
 * Base64 문자열을 ArrayBuffer로 변환
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

/**
 * ArrayBuffer를 문자열로 변환
 */
function arrayBufferToString(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let result = ''
  for (let i = 0; i < bytes.length; i++) {
    result += String.fromCharCode(bytes[i])
  }
  return result
}

/**
 * 토스에서 받은 암호화된 사용자 정보를 복호화합니다.
 * @param encryptedText - Base64로 인코딩된 암호화된 텍스트
 * @param base64EncodedAesKey - Base64로 인코딩된 AES 키 (환경 변수에서 가져옴)
 * @param aad - Additional Authenticated Data (환경 변수에서 가져옴, 기본값: "TOSS")
 * @returns 복호화된 문자열
 * @throws 복호화 실패 시 에러 발생
 */
export async function decryptTossUserInfo(
  encryptedText: string | null,
  base64EncodedAesKey?: string,
  aad?: string,
): Promise<string | null> {
  // null이거나 빈 문자열인 경우 null 반환
  if (!encryptedText) {
    return null
  }

  // 복호화 키가 없으면 에러
  const decryptKey = base64EncodedAesKey || env.TOSS_DECRYPT_KEY
  if (!decryptKey) {
    throw new Error('복호화 키가 설정되지 않았습니다. TOSS_DECRYPT_KEY 환경 변수를 확인해주세요.')
  }

  const aadValue = aad || env.TOSS_AAD

  try {
    // Base64 디코딩
    const decoded = base64ToArrayBuffer(encryptedText)

    // IV 길이는 12바이트 (GCM 모드)
    const IV_LENGTH = 12
    const TAG_LENGTH = 16

    // IV 추출 (앞 12바이트)
    const iv = decoded.slice(0, IV_LENGTH)

    // 암호문과 태그 추출 (나머지)
    const ciphertextWithTag = decoded.slice(IV_LENGTH)
    const ciphertext = ciphertextWithTag.slice(0, -TAG_LENGTH)
    const tag = ciphertextWithTag.slice(-TAG_LENGTH)

    // 키 디코딩
    const keyBuffer = base64ToArrayBuffer(decryptKey)

    // Web Crypto API를 사용하여 복호화
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt'],
    )

    // AAD를 Uint8Array로 변환
    const aadBytes = new TextEncoder().encode(aadValue)

    // 복호화 수행
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
        tag: tag,
        additionalData: aadBytes,
      },
      cryptoKey,
      ciphertext,
    )

    // 복호화된 데이터를 문자열로 변환
    return arrayBufferToString(decryptedBuffer)
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`복호화 실패: ${error.message}`)
    }
    throw new Error('복호화 중 알 수 없는 오류가 발생했습니다.')
  }
}

/**
 * 여러 필드를 한 번에 복호화합니다.
 * @param encryptedFields - 암호화된 필드들의 객체
 * @param base64EncodedAesKey - Base64로 인코딩된 AES 키
 * @param aad - Additional Authenticated Data
 * @returns 복호화된 필드들의 객체
 */
export async function decryptTossUserFields<T extends Record<string, string | null>>(
  encryptedFields: T,
  base64EncodedAesKey?: string,
  aad?: string,
): Promise<{ [K in keyof T]: string | null }> {
  const decrypted: { [K in keyof T]: string | null } = {} as { [K in keyof T]: string | null }

  await Promise.all(
    Object.entries(encryptedFields).map(async ([key, value]) => {
      try {
        decrypted[key as keyof T] = await decryptTossUserInfo(value, base64EncodedAesKey, aad)
      } catch (error) {
        // 복호화 실패 시 null로 설정
        console.error(`Failed to decrypt field ${key}:`, error)
        decrypted[key as keyof T] = null
      }
    }),
  )

  return decrypted
}

