/**
 * 사용자 정보 업데이트 API
 */

import { apiRequest } from '@/lib/api-client'

import type { User } from './types'

/**
 * 사용자 정보 업데이트 (토스 사용자 정보로 동기화)
 */
export const updateCurrentUser = async (): Promise<User> => {
  return apiRequest<User>({
    method: 'POST',
    url: '/api/users/me',
  })
}

