/**
 * 사용자 탈퇴 API
 */

import { apiRequest } from '@/lib/api-client'

/**
 * 사용자 탈퇴
 */
export const deleteCurrentUser = async (): Promise<void> => {
  return apiRequest<void>({
    method: 'DELETE',
    url: '/api/users/me',
  })
}

