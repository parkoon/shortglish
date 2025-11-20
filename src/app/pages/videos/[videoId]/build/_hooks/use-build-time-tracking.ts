import { useEffect, useRef } from 'react'

import type { Subtitle } from '@/api'
import { getCurrentSubtitleFromPlayer } from '@/features/player/utils/subtitle'
import type { YouTubePlayerRef } from '@/features/video/components/youtube-player'
import { useSyncedRef } from '@/hooks/use-synced-ref'

type UseBuildTimeTrackingParams = {
  subtitles: Subtitle[]
  playerRef: React.RefObject<YouTubePlayerRef | null>
  currentDialogue: Subtitle | null
  onSubtitleFound: (foundDialogue: Subtitle) => void
}

/**
 * Build 페이지용 시간 추적 훅
 * requestAnimationFrame을 사용하여 자막 추적 및 자동 pause 처리
 */
export const useBuildTimeTracking = ({
  subtitles,
  playerRef,
  currentDialogue,
  onSubtitleFound,
}: UseBuildTimeTrackingParams) => {
  const animationFrameRef = useRef<number | null>(null)
  const currentDialogueRef = useSyncedRef(currentDialogue)

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

      const time = playerRef.current.getCurrentTime()
      const activeDialogue = currentDialogueRef.current

      // 대사가 없거나 빈 대사가 끝났을 때 → 현재 시간에 맞는 대사 찾기
      if (!activeDialogue || (time >= activeDialogue.endTime && activeDialogue.originText === '')) {
        const foundDialogue = getCurrentSubtitleFromPlayer(subtitles, playerRef.current)
        if (foundDialogue) {
          onSubtitleFound(foundDialogue)
        }
        animationFrameRef.current = requestAnimationFrame(updateTime)
        return
      }

      // 일반 대사가 끝났을 때 → pause + seek
      if (time >= activeDialogue.endTime && activeDialogue.originText !== '') {
        playerRef.current.pause()
        playerRef.current.seekTo(activeDialogue.startTime)
        animationFrameRef.current = null
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

  // Cleanup: 컴포넌트 unmount 시 animation frame 정리
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
