/**
 * React Query Hooks
 *
 * 모든 useQuery 훅을 도메인별로 관리
 */

import { useQuery } from '@tanstack/react-query'

import {
  fetchQuizByDate,
  fetchSubtitles,
  fetchTodayQuiz,
  fetchVideoDetail,
  fetchVideos,
} from './endpoints'
import { queryKeys } from './query-keys'

// ============================================
// Video Queries
// ============================================

/**
 * 비디오 목록 조회 hook
 */
export const useVideosQuery = () => {
  return useQuery({
    queryKey: queryKeys.videos.all,
    queryFn: fetchVideos,
  })
}

/**
 * 비디오 상세 정보 조회 hook
 */
export const useVideoDetailQuery = (videoId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.videos.detail(videoId!),
    queryFn: () => fetchVideoDetail(videoId!),
    enabled: !!videoId,
  })
}

/**
 * 자막 데이터 조회 hook
 */
export const useSubtitlesQuery = (videoId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.subtitles.byVideo(videoId!),
    queryFn: () => fetchSubtitles(videoId!),
    enabled: !!videoId,
  })
}

// ============================================
// Quiz Queries
// ============================================

/**
 * 오늘의 퀴즈 조회 hook
 */
export const useTodayQuizQuery = () => {
  return useQuery({
    queryKey: queryKeys.quiz.today,
    queryFn: fetchTodayQuiz,
  })
}

/**
 * 특정 날짜의 퀴즈 조회 hook
 */
export const useQuizByDateQuery = (date: string) => {
  return useQuery({
    queryKey: queryKeys.quiz.byDate(date),
    queryFn: () => fetchQuizByDate(date),
  })
}
