/**
 * 사용자 정보 타입
 */
export interface User {
  id: string
  authProvider: string // 'TOSS', 'GOOGLE', 'APPLE' 등
  externalUserId: string // 토스의 경우 userKey (문자열)
  name?: string | null
  phone?: string | null
  birthday?: string | null
  ci?: string | null
  gender?: 'MALE' | 'FEMALE' | null
  nationality?: 'LOCAL' | 'FOREIGNER' | null
  email?: string | null
  nickname?: string | null
  agreedTerms?: string[] | null
  marketingConsent: boolean
  notificationEnabled: boolean
  lastLoginAt?: string | null
  deletedAt?: string | null
  createdAt: string
  updatedAt: string
}

