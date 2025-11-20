import { useEffect, useRef } from 'react'

import type { Subtitle } from '@/api'
import { getSubtitleInfo } from '@/features/player/utils/subtitle'
import type { YouTubePlayerRef } from '@/features/video/components/youtube-player'

type UseTimeTrackingParams = {
  subtitles: Subtitle[]
  playerRef: React.RefObject<YouTubePlayerRef | null>
  onSubtitleChange: (dialogue: Subtitle | null) => void
  onAllSubtitlesEnd?: () => void
}

const INTERVAL_TIME = 100
/**
 * 비디오 재생 시간을 추적하고 현재 자막을 업데이트하는 훅
 */
export const useTimeTracking = ({
  subtitles,
  playerRef,
  onSubtitleChange,
  onAllSubtitlesEnd,
}: UseTimeTrackingParams) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // 100ms마다 현재 시간 업데이트 (더 부드러운 추적)
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return

      // 현재 자막 상태 추적
      const status = getSubtitleInfo({ subtitles, player: playerRef.current })
      onSubtitleChange(status.currentSubtitle)

      if (status.isAllSubtitlesEnded) {
        stopTimeTracking()
        playerRef.current?.pause()
        onAllSubtitlesEnd?.()
      }
    }, INTERVAL_TIME)
  }

  const stopTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Cleanup: 컴포넌트 unmount 시 interval 정리
  useEffect(() => {
    return () => {
      stopTimeTracking()
    }
  }, [])

  return {
    startTimeTracking,
    stopTimeTracking,
  }
}
