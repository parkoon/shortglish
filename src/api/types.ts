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
 * 비디오 콘텐츠 자막 타입
 */
export type VideoContentSubtitle = {
  original: string
  translation: string
  vocabulary?: Array<{
    word: string
    meaning: string
  }>
  grammar?: Array<{
    pattern: string
    explanation: string
    example?: string
  }>
  pronunciation?: string[]
  nativeComments?: string[]
  timestamps: {
    from: string
    to: string
  }
  offsets: {
    from: number
    to: number
  }
}

/**
 * 비디오 콘텐츠 타입 (Storage에서 가져오는 전체 데이터)
 */
export type VideoContent = {
  id: string
  videoId: string
  title: string
  description: string
  thumbnail: string
  duration: number
  subtitles: VideoContentSubtitle[]
}

/**
 * 비디오 정보 타입 (API에서 가져오는 기본 정보)
 */
export interface Video {
  id: string
  videoId?: string // Storage에서 가져오는 경우에만 존재
  title: string
  description: string
  thumbnail: string
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
// Class Types
// ============================================

/**
 * 클래스 피드 정보 타입
 */
export interface ClassFeed {
  id: string
  title: string
  description: string | null
  duration: number
  difficulty: number | null
}

/**
 * 클래스 정보 타입 (목록용)
 */
export interface Class {
  id: string
  title: string
  thumbnail: string
  description: string | null
  difficulty: number | null
}

/**
 * 클래스 상세 정보 타입
 */
export interface ClassDetail extends Class {
  feeds: ClassFeed[]
}

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
