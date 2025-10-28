import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { fetchVideoDetail } from '../api/video-api'

/**
 * 비디오 상세 정보 조회 hook
 */
export const useVideoDetail = (videoId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.videos.detail(videoId!),
    queryFn: () => fetchVideoDetail(videoId!),
    enabled: !!videoId,
  })
}
