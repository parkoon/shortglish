/**
 * AccessToken 재발급 API
 */

import { apiRequest } from '@/lib/api-client'

import type { RefreshTokenRequest, RefreshTokenResponse } from './types'

/**
 * RefreshToken으로 AccessToken 재발급
 */
export const refreshToken = async (
  request: RefreshTokenRequest,
): Promise<RefreshTokenResponse['success']> => {
  return apiRequest<RefreshTokenResponse['success']>({
    method: 'POST',
    url: '/api/toss/auth/refresh-token',
    data: request,
  })
}

