/**
 * AccessToken 발급 API
 */

import { apiRequest } from '@/lib/api-client'

import type { GenerateTokenRequest, GenerateTokenResponse } from './types'

/**
 * 인가 코드로 AccessToken 발급
 */
export const generateToken = async (
  request: GenerateTokenRequest,
): Promise<GenerateTokenResponse['success']> => {
  return apiRequest<GenerateTokenResponse['success']>({
    method: 'POST',
    url: '/api/toss/auth/generate-token',
    data: request,
  })
}
