/**
 * 클라이언트 인증서 설정
 */

import * as fs from 'fs'
import * as path from 'path'

import { env } from './env'

export interface ClientCertConfig {
  cert: Buffer
  key: Buffer
}

/**
 * 클라이언트 인증서를 로드합니다.
 * 환경 변수에서 경로를 읽거나, Base64 인코딩된 문자열을 사용합니다.
 */
export function loadClientCert(): ClientCertConfig | null {
  // 환경 변수에서 Base64 인코딩된 인증서가 있는 경우 (Railway 등에서 사용)
  const certBase64 = process.env.TOSS_CLIENT_CERT_BASE64
  const keyBase64 = process.env.TOSS_CLIENT_KEY_BASE64

  if (certBase64 && keyBase64) {
    try {
      const cert = Buffer.from(certBase64, 'base64')
      const key = Buffer.from(keyBase64, 'base64')
      return { cert, key }
    } catch (error) {
      console.error('Base64 인증서 디코딩 실패:', error)
      return null
    }
  }

  // 파일에서 로드
  const certPath = env.TOSS_CLIENT_CERT_PATH || path.join(process.cwd(), 'certs', 'client-cert.pem')
  const keyPath = env.TOSS_CLIENT_KEY_PATH || path.join(process.cwd(), 'certs', 'client-key.pem')

  try {
    // 파일 존재 확인
    if (!fs.existsSync(certPath) || !fs.existsSync(keyPath)) {
      console.warn(
        `클라이언트 인증서 파일을 찾을 수 없습니다. cert: ${certPath}, key: ${keyPath}`,
      )
      return null
    }

    const cert = fs.readFileSync(certPath)
    const key = fs.readFileSync(keyPath)

    return { cert, key }
  } catch (error) {
    console.error('클라이언트 인증서 로드 실패:', error)
    return null
  }
}

