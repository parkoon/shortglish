/**
 * 사용자 정보 조회 API
 */

import { env } from '@/config/env'

import type { LoginMeResponse } from './types'

/**
 * AccessToken으로 사용자 정보 조회
 */
export const loginMe = async (accessToken: string): Promise<LoginMeResponse['success']> => {
  const response = await fetch(`${env.API_BASE_URL}/api/toss/login-me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    let errorMessage = `Failed to get user info: ${response.statusText}`
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
