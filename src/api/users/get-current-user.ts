/**
 * 현재 사용자 정보 조회 API
 */

import { apiRequest } from '@/lib/api-client'

import type { User } from './types'

/**
 * 현재 로그인한 사용자 정보 조회
 * 토스 AccessToken으로 인증
 */
export const getCurrentUser = async (): Promise<User> => {
  return apiRequest<User>({
    method: 'GET',
    url: '/api/users/me',
  })
}

