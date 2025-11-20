import type { Subtitle } from '@/api'
import type { YouTubePlayerRef } from '@/features/video/components/youtube-player'

/**
 * 현재 시간을 기준으로 해당하는 dialogue를 찾는 함수
 *
 * @param subtitles - 자막 배열
 * @param time - 현재 재생 시간 (초)
 * @returns 현재 시간에 해당하는 Subtitle 또는 null
 */
export const getCurrentSubtitleFromPlayer = (
  subtitles: Subtitle[],
  player: YouTubePlayerRef,
): Subtitle | null => {
  const time = player.getCurrentTime()
  return (
    subtitles.find(d => {
      return time >= d.startTime && time < d.endTime
    }) ?? null
  )
}

/**
 * 자막 상태 정보
 */
export type SubtitleInfo = {
  /** 현재 시간에 해당하는 자막 */
  currentSubtitle: Subtitle | null

  /** 모든 자막이 끝났는지 여부 (마지막 자막의 endTime을 넘었는지) */
  isAllSubtitlesEnded: boolean
  /** 현재 재생 시간 (초) */
  time: number
}

export type GetSubtitleInfoParams = {
  subtitles: Subtitle[]
  player: YouTubePlayerRef
}

/**
 * 플레이어로부터 현재 자막 상태를 추적하는 함수
 *
 * @param subtitles - 자막 배열
 * @param player - YouTube 플레이어 ref
 * @param currentSubtitle - 현재 활성화된 자막 (옵션, 없으면 time 기준으로 찾음)
 * @returns 자막 상태 정보
 */
export const getSubtitleInfo = ({ subtitles, player }: GetSubtitleInfoParams): SubtitleInfo => {
  const time = player.getCurrentTime()

  // currentSubtitle이 제공되지 않으면 time 기준으로 찾기
  const currentSubtitle = getCurrentSubtitleFromPlayer(subtitles, player)

  // 모든 자막이 끝났는지 확인 (마지막 자막의 endTime을 넘었는지)
  const lastSubtitle = subtitles[subtitles.length - 1]
  const isAllSubtitlesEnded = lastSubtitle ? time >= lastSubtitle.endTime : false

  return {
    currentSubtitle,
    isAllSubtitlesEnded,
    time,
  }
}
