import { useEffect, useRef } from 'react'

import type { Subtitle } from '@/api'
import { getSubtitleInfo } from '@/features/player/utils/subtitle'
import type { YouTubePlayerRef } from '@/features/video/components/youtube-player'

type UseTimeTrackingParams = {
  subtitles: Subtitle[]
  playerRef: React.RefObject<YouTubePlayerRef | null>
  onSubtitleChange: (dialogue: Subtitle | null) => void
  onTimeUpdate?: (time: number) => void
  onAllSubtitlesEnd?: () => void
}

/**
 * 비디오 재생 시간을 추적하고 현재 자막을 업데이트하는 훅
 * requestAnimationFrame을 사용하여 더 정확하고 부드러운 추적 제공
 */
export const useTimeTracking = ({
  subtitles,
  playerRef,
  onSubtitleChange,
  onTimeUpdate,
  onAllSubtitlesEnd,
}: UseTimeTrackingParams) => {
  const animationFrameRef = useRef<number | null>(null)

  const startTimeTracking = () => {
    // 기존 animation frame이 있으면 취소
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // 재귀적으로 호출되는 함수
    const updateTime = () => {
      if (!playerRef.current) {
        animationFrameRef.current = null
        return
      }

      // 현재 자막 상태 추적
      const status = getSubtitleInfo({ subtitles, player: playerRef.current })
      onSubtitleChange(status.currentSubtitle)
      onTimeUpdate?.(status.time)

      if (status.isAllSubtitlesEnded) {
        stopTimeTracking()
        playerRef.current?.pause()
        onAllSubtitlesEnd?.()
        return
      }

      // 다음 프레임 요청
      animationFrameRef.current = requestAnimationFrame(updateTime)
    }

    // 첫 프레임 요청
    animationFrameRef.current = requestAnimationFrame(updateTime)
  }

  const stopTimeTracking = () => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
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
