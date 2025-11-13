/**
 * 로그인 연결 끊기 API
 */

import { env } from '@/config/env'

import type { UnlinkByUserKeyRequest, UnlinkResponse } from './types'

/**
 * AccessToken으로 로그인 연결 끊기
 */
export const unlinkByAccessToken = async (accessToken: string): Promise<void> => {
  const response = await fetch(`${env.API_BASE_URL}/api/toss/unlink/access-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to unlink: ${response.statusText}`)
  }
}

/**
 * userKey로 로그인 연결 끊기
 */
export const unlinkByUserKey = async (
  accessToken: string,
  request: UnlinkByUserKeyRequest,
): Promise<UnlinkResponse['success']> => {
  const response = await fetch(`${env.API_BASE_URL}/api/toss/unlink/user-key`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    let errorMessage = `Failed to unlink: ${response.statusText}`
    try {
      const errorData = await response.json()
      errorMessage = errorData.error || errorMessage
    } catch {
      // JSON 파싱 실패 시 기본 메시지 사용
    }
    throw new Error(errorMessage)
  }

  const data = await response.json()

  // 백엔드에서 직접 success 객체를 반환하므로 바로 반환
  return data
}

