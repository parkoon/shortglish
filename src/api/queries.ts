/**
 * React Query Hooks
 *
 * 모든 useQuery 훅을 도메인별로 관리
 */

import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

import {
  fetchClassById,
  fetchClasses,
  fetchQuizByDate,
  fetchSubtitles,
  fetchTodayQuiz,
  fetchVideoById,
  fetchVideoCategories,
  fetchVideos,
} from './endpoints'
import { queryKeys } from './query-keys'
import { downloadVideoContent } from './storage'
import type { VideoCursor } from './types'

const ONE_HOUR = 1000 * 60 * 60

// ============================================
// Video Queries
// ============================================

/**
 * 비디오 목록 조회 hook (infinite scroll)
 * @param category - 카테고리 필터
 */
export const useInfiniteVideosQuery = (categoryId?: string) => {
  return useInfiniteQuery({
    queryKey: queryKeys.videos.infinite(categoryId),
    queryFn: ({ pageParam }: { pageParam: VideoCursor | undefined }) =>
      fetchVideos({
        cursor: pageParam,
        limit: 10,
        categoryId,
      }),
    initialPageParam: undefined as VideoCursor | undefined,
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

// ============================================
// Class Queries
// ============================================

/**
 * 클래스 목록 조회 hook
 */
export const useClassesQuery = () => {
  return useQuery({
    queryKey: queryKeys.classes.all,
    queryFn: fetchClasses,
  })
}

/**
 * 클래스 상세 정보 조회 hook
 */
export const useClassDetailQuery = (classId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.classes.detail(classId!),
    queryFn: () => fetchClassById(classId!),
    enabled: !!classId,
  })
}

/**
 * 비디오 콘텐츠 JSON 조회 hook
 * @param videoId - 비디오 ID
 */
export const useVideoContentQuery = <T = unknown>(videoId: string | undefined) => {
  return useQuery({
    queryKey: ['contents', videoId],
    queryFn: () => downloadVideoContent<T>(videoId!),
    enabled: !!videoId,
  })
}
