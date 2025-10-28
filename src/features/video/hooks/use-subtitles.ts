import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { fetchSubtitles } from '../api/subtitle-api'

/**
 * 자막 데이터 조회 hook
 */
export const useSubtitles = (videoId: string | undefined) => {
  return useQuery({
    queryKey: queryKeys.subtitles.byVideo(videoId!),
    queryFn: () => fetchSubtitles(videoId!),
    enabled: !!videoId,
  })
}
