/**
 * API Endpoints
 * 모든 API 호출 함수들을 도메인별로 관리
 */

import { supabase } from '@/lib/supabase'

import type { Subtitle, TodayQuiz, Video, VideoCategory } from './types'
import { arrayToCamel, objectToCamel } from './utils'

// ============================================
// Video API
// ============================================

/**
 * 비디오 목록 조회 (cursor 기반 페이지네이션)
 * @param cursor - 마지막 비디오의 createdAt (ISO string). 첫 페이지는 undefined
 * @param limit - 가져올 비디오 개수 (기본값: 10)
 * @returns 비디오 목록과 다음 cursor
 */
export const fetchVideos = async (
  cursor?: string,
  limit: number = 10,
): Promise<{ data: Video[]; nextCursor: string | null }> => {
  let query = supabase
    .from('video')
    .select('id, title, thumbnail, description, duration, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(limit + 1) // 다음 페이지 존재 여부 확인을 위해 +1

  // cursor가 있으면 해당 시점 이전의 데이터만 조회
  if (cursor) {
    query = query.lt('created_at', cursor)
  }

  const { data, error } = await query
  console.log('🚀 ~ fetchVideos ~ data:', data)

  if (error) {
    throw new Error(`Failed to fetch videos: ${error.message}`)
  }

  // DB의 snake_case → 도메인의 camelCase 자동 변환
  const camelData = arrayToCamel<Video>(data)

  // 다음 페이지 존재 여부 확인
  const hasNextPage = camelData.length > limit
  const videos = hasNextPage ? camelData.slice(0, limit) : camelData
  console.log('🚀 ~ fetchVideos ~ videos:', videos)

  // 다음 cursor는 마지막 비디오의 createdAt
  const nextCursor = videos.length > 0 ? videos[videos.length - 1].createdAt : null
  console.log('🚀 ~ fetchVideos ~ nextCursor:', nextCursor)

  return {
    data: videos,
    nextCursor: hasNextPage ? nextCursor : null,
  }
}

/**
 * 단일 비디오 정보 조회 (Entry 페이지용)
 * video 테이블에서만 조회
 */
export const fetchVideoById = async (videoId: string): Promise<Video> => {
  const { data, error } = await supabase
    .from('video')
    .select('id, title, thumbnail, description, duration, created_at')
    .eq('id', videoId)
    .eq('status', 'published') // published인 것만 조회
    .single()

  if (error) {
    throw new Error(`Failed to fetch video: ${error.message}`)
  }

  // DB의 snake_case → 도메인의 camelCase 자동 변환
  return objectToCamel<Video>(data)
}

/**
 * 비디오 카테고리 목록 조회
 */
export const fetchVideoCategories = async (): Promise<VideoCategory[]> => {
  const { data, error } = await supabase
    .from('video_category')
    .select('id, name, order')
    .order('order', { ascending: true, nullsFirst: false })

  if (error) {
    throw new Error(`Failed to fetch video categories: ${error.message}`)
  }

  // DB의 snake_case → 도메인의 camelCase 자동 변환
  return arrayToCamel<VideoCategory>(data)
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
