import type { QueryClient } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router'

import { fetchSubtitles } from '@/api'
import { queryKeys } from '@/api/query-keys'

/**
 * 페이지 진입 전 자막 데이터를 미리 로드하는 loader
 */
export const clientLoader = (queryClient: QueryClient) => {
  return async ({ params }: LoaderFunctionArgs) => {
    const videoId = params.videoId
    if (!videoId) {
      throw new Error('videoId is required')
    }

    // 자막 데이터를 미리 로드하고 Promise를 반환
    const subtitlesPromise = queryClient.ensureQueryData({
      queryKey: queryKeys.subtitles.byVideo(videoId),
      queryFn: () => fetchSubtitles(videoId),
    })

    return {
      subtitles: subtitlesPromise,
    }
  }
}
