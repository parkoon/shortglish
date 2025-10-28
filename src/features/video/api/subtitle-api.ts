import type { Subtitle } from '../types'

/**
 * 자막 데이터 조회
 */
export const fetchSubtitles = async (videoId: string): Promise<Subtitle[]> => {
  const response = await fetch(`/subtitles/${videoId}.json`)

  if (!response.ok) {
    throw new Error(`Failed to fetch subtitles: ${response.statusText}`)
  }

  return response.json()
}
