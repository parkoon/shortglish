import type { QueryClient } from '@tanstack/react-query'

import { fetchSubtitles } from '@/api'
import { queryKeys } from '@/api/query-keys'

import { TEST_A_VIDEO_ID } from './page'

/**
 * 페이지 진입 전 자막 데이터를 미리 로드하는 loader
 */
export const clientLoader = (queryClient: QueryClient) => {
  return async () => {
    // 자막 데이터를 미리 로드하고 Promise를 반환
    const subtitlesPromise = queryClient.ensureQueryData({
      queryKey: queryKeys.subtitles.byVideo(TEST_A_VIDEO_ID),
      queryFn: () => fetchSubtitles(TEST_A_VIDEO_ID),
    })

    return {
      subtitles: subtitlesPromise,
    }
  }
}
