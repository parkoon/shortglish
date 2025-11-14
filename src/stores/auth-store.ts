/**
 * 인증 상태 관리 스토어
 */

import { create } from 'zustand'
import { getCurrentUser } from '@/api/users'
import type { User } from '@/api/users/types'
import { getAccessToken, hasValidToken } from '@/lib/toss-token'

type AuthState = {
  user: User | null
  isLoading: boolean
  isInitialized: boolean
}

type AuthActions = {
  setUser: (user: User | null) => void
  setLoading: (isLoading: boolean) => void
  initialize: () => Promise<void>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

type AuthStore = AuthState & AuthActions

/**
 * 인증 상태를 관리하는 Zustand 스토어
 */
export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  isLoading: true,
  isInitialized: false,

  setUser: (user: User | null) => {
    set({ user })
  },

  setLoading: (isLoading: boolean) => {
    set({ isLoading })
  },

  initialize: async () => {
    try {
      set({ isLoading: true })

      // 토스 토큰이 있는지 확인
      if (!hasValidToken()) {
        set({ user: null, isLoading: false, isInitialized: true })
        return
      }

      // 백엔드 API로 사용자 정보 조회
      try {
        const user = await getCurrentUser()
        set({ user, isLoading: false, isInitialized: true })
      } catch (error) {
        // 토큰이 유효하지 않거나 사용자가 없는 경우
        console.error('Failed to get user:', error)
        set({ user: null, isLoading: false, isInitialized: true })
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      set({ user: null, isLoading: false, isInitialized: true })
    }
  },

  refreshUser: async () => {
    try {
      if (!hasValidToken()) {
        set({ user: null })
        return
      }

      const user = await getCurrentUser()
      set({ user })
    } catch (error) {
      console.error('Failed to refresh user:', error)
      set({ user: null })
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true })

      // 토스 토큰 제거
      const { clearTokens } = await import('@/lib/toss-token')
      clearTokens()

      set({ user: null, isLoading: false })
    } catch (error) {
      console.error('Failed to sign out:', error)
      set({ isLoading: false })
      throw error
    }
  },
}))

/**
 * 인증 상태를 쉽게 사용할 수 있는 헬퍼 훅
 */
export const useAuth = () => {
  const { user, isLoading, isInitialized, initialize, signOut, refreshUser } = useAuthStore()

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user && hasValidToken(),
    initialize,
    signOut,
    refreshUser,
  }
}

