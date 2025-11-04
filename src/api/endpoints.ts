/**
 * API Endpoints
 * 모든 API 호출 함수들을 도메인별로 관리
 */

import { supabase } from '@/lib/supabase'

import type { Subtitle, TodayQuiz, Video } from './types'
import { arrayToCamel } from './utils'

// ============================================
// Video API
// ============================================

/**
 * 비디오 목록 조회
 */
export const fetchVideos = async (): Promise<Video[]> => {
  const { data, error } = await supabase
    .from('video')
    .select('id, title, thumbnail, description, duration')
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch videos: ${error.message}`)
  }

  return data
}

/**
 * 단일 비디오 정보 조회 (Entry 페이지용)
 * video 테이블에서만 조회
 */
export const fetchVideoById = async (videoId: string): Promise<Video> => {
  const { data, error } = await supabase
    .from('video')
    .select('id, title, thumbnail, description, duration')
    .eq('id', videoId)
    .single()

  if (error) {
    throw new Error(`Failed to fetch video: ${error.message}`)
  }

  return data
}

// ============================================
// Subtitle API
// ============================================

/**
 * 자막 데이터 조회
 * DB의 snake_case를 앱의 camelCase로 자동 변환
 */
export const fetchSubtitles = async (videoId: string): Promise<Subtitle[]> => {
  const { data, error } = await supabase
    .from('video_subtitle')
    .select('index, start_time, end_time, origin_text, blanked_text, translation')
    .eq('video_id', videoId)
    .order('index', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch subtitles: ${error.message}`)
  }

  // DB의 snake_case → 도메인의 camelCase 자동 변환
  return arrayToCamel<Subtitle>(data)
}

// ============================================
// Quiz API
// ============================================

/**
 * 특정 날짜의 퀴즈 조회
 */
export const fetchQuizByDate = async (date: string): Promise<TodayQuiz> => {
  const response = await fetch(`/quiz/${date}.json`)

  if (!response.ok) {
    throw new Error(`Failed to fetch quiz for ${date}: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 오늘의 퀴즈 조회
 */
export const fetchTodayQuiz = async (): Promise<TodayQuiz> => {
  // 현재 날짜를 YYYY-MM-DD 형식으로 포맷
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const dateString = `${year}-${month}-${day}`

  return fetchQuizByDate(dateString)
}
