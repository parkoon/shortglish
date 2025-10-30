import type { Subtitle } from '../types'

/**
 * 자막 데이터 조회
 */
export const fetchSubtitles = async (videoId: string): Promise<Subtitle[]> => {
  const response = await fetch(`/detail/${videoId}.json`)

  if (!response.ok) {
    throw new Error(`Failed to fetch subtitles: ${response.statusText}`)
  }

  const data = await response.json()
  return data.subtitles
}
