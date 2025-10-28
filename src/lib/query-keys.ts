/**
 * Query Keys Factory
 *
 * React Query의 query key를 중앙에서 관리하는 factory 패턴
 * 타입 안전성과 재사용성을 보장합니다.
 */

export const queryKeys = {
  videos: {
    all: ['videos'] as const,
    detail: (videoId: string) => ['videos', 'detail', videoId] as const,
  },
  subtitles: {
    all: ['subtitles'] as const,
    byVideo: (videoId: string) => ['subtitles', videoId] as const,
  },
}
