import type { Video } from '../types'

/**
 * 비디오 목록 조회
 */
export const fetchVideos = async (): Promise<Video[]> => {
  const response = await fetch('/videos.json')

  if (!response.ok) {
    throw new Error(`Failed to fetch videos: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 비디오 상세 정보 조회 (Entry 페이지용)
 */
export type VideoDetailResponse = {
  title: string
  description: string
  thumbnail: string
}

export const fetchVideoDetail = async (videoId: string): Promise<VideoDetailResponse> => {
  const response = await fetch(`/detail/${videoId}.json`)

  if (!response.ok) {
    throw new Error(`Failed to fetch video detail: ${response.statusText}`)
  }

  return response.json()
}
