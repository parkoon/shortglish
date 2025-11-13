/**
 * 인증 상태 관리 스토어
 */

import { create } from 'zustand'
import type { User } from '@supabase/supabase-js'

import { supabase } from '@/lib/supabase'

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

      // 현재 세션 확인
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error('Failed to get session:', error)
        set({ user: null, isLoading: false, isInitialized: true })
        return
      }

      set({
        user: session?.user ?? null,
        isLoading: false,
        isInitialized: true,
      })

      // 인증 상태 변경 리스너 등록
      supabase.auth.onAuthStateChange((_event, session) => {
        set({
          user: session?.user ?? null,
        })
      })
    } catch (error) {
      console.error('Failed to initialize auth:', error)
      set({ user: null, isLoading: false, isInitialized: true })
    }
  },

  signOut: async () => {
    try {
      set({ isLoading: true })
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
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
  const { user, isLoading, isInitialized, initialize, signOut } = useAuthStore()

  return {
    user,
    isLoading,
    isInitialized,
    isAuthenticated: !!user,
    initialize,
    signOut,
  }
}

