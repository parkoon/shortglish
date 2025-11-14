/**
 * 로그인 연결 끊기 API
 */

import { apiRequest } from '@/lib/api-client'

import type { UnlinkByUserKeyRequest, UnlinkResponse } from './types'

/**
 * AccessToken으로 로그인 연결 끊기
 */
export const unlinkByAccessToken = async (accessToken: string): Promise<void> => {
  return apiRequest<void>({
    method: 'POST',
    url: '/api/toss/auth/remove-by-access-token',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

/**
 * userKey로 로그인 연결 끊기
 */
export const unlinkByUserKey = async (
  accessToken: string,
  request: UnlinkByUserKeyRequest,
): Promise<UnlinkResponse['success']> => {
  return apiRequest<UnlinkResponse['success']>({
    method: 'POST',
    url: '/api/toss/auth/remove-by-user-key',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    data: request,
  })
}

