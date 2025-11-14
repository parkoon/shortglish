/**
 * API Endpoints
 * 모든 API 호출 함수들을 도메인별로 관리
 */

import { supabase } from '@/lib/supabase'

import type { Subtitle, TodayQuiz, Video, VideoCategory, VideoCursor } from './types'
import { arrayToCamel, objectToCamel } from './utils'

// ============================================
// Video API
// ============================================

/**
 * fetchVideos 함수 파라미터
 */
export type FetchVideosParams = {
  cursor?: VideoCursor
  limit?: number
  categoryId?: string
}

/**
 * 비디오 목록 조회 (cursor 기반 페이지네이션)
 * @param params - 쿼리 파라미터
 * @param params.cursor - 마지막 비디오의 { createdAt, id }
 * @param params.limit - 가져올 비디오 개수 (기본값: 10)
 * @param params.categoryId - 카테고리 필터 (선택사항)
 * @returns 비디오 목록과 다음 cursor
 */
export const fetchVideos = async ({
  cursor,
  limit = 10,
  categoryId,
}: FetchVideosParams = {}): Promise<{ data: Video[]; nextCursor: VideoCursor | null }> => {
  let query = supabase
    .from('video')
    .select('id, title, thumbnail, description, duration, created_at, difficulty, category_id')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .order('id', { ascending: false }) // 같은 created_at일 때 id로 정렬
    .limit(limit + 1) // 다음 페이지 존재 여부 확인을 위해 +1

  // 카테고리 필터링
  if (categoryId) {
    query = query.eq('category_id', Number(categoryId))
  }

  // cursor가 있으면 복합 조건 적용
  // (created_at < cursor.createdAt) OR (created_at = cursor.createdAt AND id < cursor.id)
  if (cursor) {
    query = query.or(
      `created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`,
    )
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Failed to fetch videos: ${error.message}`)
  }

  // DB의 snake_case → 도메인의 camelCase 자동 변환
  const camelData = arrayToCamel<Video>(data)

  // 다음 페이지 존재 여부 확인
  const hasNextPage = camelData.length > limit
  const videos = hasNextPage ? camelData.slice(0, limit) : camelData

  // 다음 cursor는 마지막 비디오의 { createdAt, id } (다음 페이지가 있을 때만)
  const lastVideo = videos[videos.length - 1]
  const nextCursor: VideoCursor | null =
    hasNextPage && lastVideo && lastVideo.createdAt
      ? {
          createdAt: lastVideo.createdAt,
          id: lastVideo.id,
        }
      : null

  return {
    data: videos,
    nextCursor,
  }
}

/**
 * 단일 비디오 정보 조회 (Entry 페이지용)
 * video 테이블에서만 조회
 */
export const fetchVideoById = async (videoId: string): Promise<Video> => {
  const { data, error } = await supabase
    .from('video')
    .select('id, title, thumbnail, description, duration, created_at, difficulty, category_id')
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
