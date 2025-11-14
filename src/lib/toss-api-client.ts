/**
 * 토스 API 클라이언트
 * 토큰 자동 갱신 및 에러 처리 포함
 */

import { refreshToken } from '@/api/toss/refresh-token'
import { getAccessToken, getRefreshToken, hasValidToken, saveTokens } from '@/lib/toss-token'

/**
 * AccessToken을 가져오고, 만료되었으면 자동으로 갱신합니다.
 */
export async function getValidAccessToken(): Promise<string> {
  // 토큰이 유효하면 반환
  if (hasValidToken()) {
    const token = getAccessToken()
    if (token) {
      return token
    }
  }

  // 토큰이 만료되었거나 없으면 RefreshToken으로 갱신 시도
  const refresh = getRefreshToken()
  if (!refresh) {
    throw new Error('토큰이 만료되었고 RefreshToken이 없습니다. 다시 로그인해주세요.')
  }

  try {
    const tokenData = await refreshToken({ refreshToken: refresh })
    saveTokens({
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      expiresIn: tokenData.expiresIn,
    })
    return tokenData.accessToken
  } catch {
    throw new Error('토큰 갱신에 실패했습니다. 다시 로그인해주세요.')
  }
}

/**
 * API 요청을 보내고, 401 에러 시 토큰을 자동으로 갱신하여 재시도합니다.
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {},
  retryCount = 0,
): Promise<Response> {
  const accessToken = await getValidAccessToken()

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...options.headers,
    },
  })

  // 401 에러이고 아직 재시도하지 않았으면 토큰 갱신 후 재시도
  if (response.status === 401 && retryCount === 0) {
    // 토큰 강제 만료 처리하여 갱신 유도
    const refresh = getRefreshToken()
    if (refresh) {
      try {
        const tokenData = await refreshToken({ refreshToken: refresh })
        saveTokens({
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          expiresIn: tokenData.expiresIn,
        })
        // 재시도
        return fetchWithAuth(url, options, retryCount + 1)
      } catch {
        // 토큰 갱신 실패 시 원래 응답 반환
      }
    }
  }

  return response
}
