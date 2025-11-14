/**
 * 백엔드 API 공통 응답 타입
 */

export type ApiSuccessResponse<T = unknown> = {
  success: true
  data: T
  message?: string
  meta?: {
    timestamp?: string
    [key: string]: unknown
  }
}

export type ApiErrorResponse = {
  success: false
  error: string
  message?: string
  meta?: {
    timestamp?: string
    [key: string]: unknown
  }
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

// ============================================
// Video Types
// ============================================

/**
 * 비디오 정보 타입
 */
export interface Video {
  id: string
  title: string
  thumbnail: string
  description: string | null
  duration: number
  createdAt: string | null
  difficulty: number | null
  categoryId: number | null
}

/**
 * 비디오 카테고리 타입
 */
export interface VideoCategory {
  id: number
  name: string
  order: number | null
}

/**
 * 비디오 페이지네이션 커서 타입
 */
export type VideoCursor = {
  createdAt: string
  id: string
}

// ============================================
// Subtitle Types
// ============================================

/**
 * 자막 타입
 * (src/types/subtitle.ts에서 재export)
 */
export type { Subtitle } from '@/types/subtitle'

// ============================================
// Quiz Types
// ============================================

/**
 * 오늘의 퀴즈 타입
 */
export interface TodayQuiz {
  date: string
  sentences: {
    id: string
    english: string
    korean: string
    words: {
      id: string
      word: string
      meaning: string
    }[]
  }[]
}
