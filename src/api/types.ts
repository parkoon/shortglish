/**
 * 도메인 타입 정의
 *
 * 모든 도메인 타입을 한 곳에서 관리
 * 인프라에 독립적 (Supabase, Firebase 등 상관없이 사용)
 */

// ============================================
// Video Domain
// ============================================

export type Video = {
  id: string
  title: string
  thumbnail: string
  description: string | null
  duration: number
}

export type Subtitle = {
  index: number
  startTime: number
  endTime: number
  originText: string
  blankedText: string
  translation: string
}

export type Category = {
  id: string
  label: string
  active?: boolean
}

/**
 * Video Category (DB에서 가져온 형태)
 */
export type VideoCategory = {
  id: string
  name: string
  order?: number | null
}

// ============================================
// Quiz Domain
// ============================================

/**
 * Quiz Exercise
 * 개별 퀴즈 문항
 */
export type QuizExercise = {
  text: string
  translation: string
  options: string[]
}

/**
 * Today Quiz
 * 오늘의 퀴즈 데이터
 */
export type TodayQuiz = {
  date?: string
  day?: number
  pattern: string
  pattern_korean: string
  exercises: QuizExercise[]
}
