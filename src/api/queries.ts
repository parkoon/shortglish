/**
 * React Query Hooks
 *
 * 모든 useQuery 훅을 도메인별로 관리
 */

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import {
  fetchQuizByDate,
  fetchSubtitles,
  fetchTodayQuiz,
  fetchVideoById,
  fetchVideoCategories,
  fetchVideos,
} from './endpoints'
import { queryKeys } from './query-keys'

const ONE_HOUR = 1000 * 60 * 60

// ============================================
// Video Queries
// ============================================

/**
 * 비디오 목록 조회 hook (기존 - 모든 데이터 한 번에)
 * @deprecated infinite scroll을 위해 useInfiniteVideosQuery 사용 권장
 */
export const useVideosQuery = () => {
  return useQuery({
    queryKey: queryKeys.videos.all,
    queryFn: () => fetchVideos().then(result => result.data),
  })
}

/**
 * 비디오 목록 조회 hook (infinite scroll)
 * @param category - 카테고리 필터 (향후 확장용)
 */
export const useInfiniteVideosQuery = (category?: string) => {
  return useInfiniteQuery({
    queryKey: queryKeys.videos.infinite(category),
    queryFn: ({ pageParam }: { pageParam: string | undefined }) => fetchVideos(pageParam, 10),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage => lastPage.nextCursor,
  })
}

/**
 * 비디오 상세 정보 조회 hook
 */
export const useVideoDetailQuery = (videoId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.videos.detail(videoId!),
    queryFn: () => fetchVideoById(videoId!),
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

/**
 * 비디오 카테고리 목록 조회 hook
 */
export const useVideoCategoriesQuery = () => {
  return useQuery({
    queryKey: queryKeys.videoCategories.all,
    queryFn: fetchVideoCategories,
    staleTime: ONE_HOUR,
    gcTime: ONE_HOUR,
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
