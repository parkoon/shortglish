/**
 * 사용자 정보 조회 API
 */

import { apiRequest } from '@/lib/api-client'

import type { DecryptedUserInfo } from './types'

/**
 * AccessToken으로 사용자 정보 조회 (복호화된 상태)
 * 서버에서 자동으로 복호화하여 반환합니다.
 */
export const getUserInfo = async (accessToken: string): Promise<DecryptedUserInfo> => {
  return apiRequest<DecryptedUserInfo>({
    method: 'GET',
    url: '/api/toss/user/me/decrypted',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
