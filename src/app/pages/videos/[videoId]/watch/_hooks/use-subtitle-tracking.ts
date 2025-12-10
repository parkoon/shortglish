import { useCallback, useEffect, useRef } from 'react'

import type { Subtitle } from '@/api'
import type { YouTubePlayerRef } from '@/features/video/components/youtube-player'
import { YOUTUBE_PLAYER_STATE } from '@/features/video/components/youtube-player'

type UseSubtitleTrackingParams = {
  subtitles: Subtitle[]
  playerRef: React.RefObject<YouTubePlayerRef | null>
  playerState: number
  isRepeatActive: boolean
  isPracticeActive: boolean
  onSubtitleFound: (subtitle: Subtitle | null) => void
}

export const useSubtitleTracking = ({
  subtitles,
  playerRef,
  playerState,
  isRepeatActive,
  isPracticeActive,
  onSubtitleFound,
}: UseSubtitleTrackingParams) => {
  const animationFrameRef = useRef<number | null>(null)
  const lastSubtitleIndexRef = useRef<number | null>(null)

  const findSubtitleByTime = useCallback(
    (currentTimeMs: number): Subtitle | null => {
      if (subtitles.length === 0) return null

      // 현재 시간(초)을 밀리초로 변환
      const currentTime = currentTimeMs

      // 현재 시간과 일치하는 자막 찾기
      for (let i = 0; i < subtitles.length; i++) {
        const subtitle = subtitles[i]
        if (currentTime >= subtitle.startTime && currentTime <= subtitle.endTime) {
          return subtitle
        }
      }

      // 일치하는 자막이 없으면 마지막으로 표시된 자막 유지
      return null
    },
    [subtitles],
  )

  const trackingLoop = useCallback(() => {
    if (!playerRef.current) {
      animationFrameRef.current = requestAnimationFrame(trackingLoop)
      return
    }

    const currentTime = playerRef.current.getCurrentTime() * 1000 // 초를 밀리초로 변환
    const foundSubtitle = findSubtitleByTime(currentTime)

    // 자막이 변경되었을 때만 업데이트
    if (foundSubtitle) {
      const currentIndex = subtitles.findIndex(s => s.index === foundSubtitle.index)
      if (lastSubtitleIndexRef.current !== currentIndex) {
        lastSubtitleIndexRef.current = currentIndex
        onSubtitleFound(foundSubtitle)
      }

      // 반복 모드 + 연습 모드: 자막이 끝나면 시작 시간으로 돌아가기
      if (isRepeatActive && isPracticeActive && currentTime >= foundSubtitle.endTime) {
        playerRef.current.seekTo(foundSubtitle.startTime / 1000)
      }
    }

    animationFrameRef.current = requestAnimationFrame(trackingLoop)
  }, [playerRef, findSubtitleByTime, subtitles, onSubtitleFound, isRepeatActive, isPracticeActive])

  const startTracking = useCallback(() => {
    if (animationFrameRef.current !== null) {
      return // 이미 추적 중
    }
    animationFrameRef.current = requestAnimationFrame(trackingLoop)
  }, [trackingLoop])

  const stopTracking = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }, [])

  // 플레이어 상태에 따라 추적 시작/중지
  useEffect(() => {
    if (playerState === YOUTUBE_PLAYER_STATE.PLAYING) {
      startTracking()
    } else {
      stopTracking()
    }

    return () => {
      stopTracking()
    }
  }, [playerState, startTracking, stopTracking])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      stopTracking()
    }
  }, [stopTracking])

  return {
    startTracking,
    stopTracking,
  }
}
