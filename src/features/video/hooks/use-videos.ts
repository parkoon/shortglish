import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { fetchVideos } from '../api/video-api'

/**
 * 비디오 목록 조회 hook
 */
export const useVideos = () => {
  return useQuery({
    queryKey: queryKeys.videos.all,
    queryFn: fetchVideos,
  })
}
