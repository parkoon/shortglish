import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import type { Subtitle } from '@/api'
import { useSubtitlesQuery } from '@/api'
import { PageLayout } from '@/components/layouts/page-layout'
import { paths } from '@/config/paths'
import { getSubtitleInfo } from '@/features/player/utils/subtitle'
import {
  YOUTUBE_PLAYER_STATE,
  YouTubePlayer,
  type YouTubePlayerRef,
} from '@/features/video/components/youtube-player'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
import { analytics } from '@/lib/analytics'
import { useModal } from '@/stores/modal-store'

import { FullDialogue } from './_components/full-dialogue'

const VideoPage = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const modal = useModal()
  const navigate = useNavigate()
  const { markStepAsCompleted } = useVideoProgressStore()

  const { data: subtitles = [], isLoading: isLoadingDialogues } = useSubtitlesQuery(videoId)

  const [currentDialogue, setCurrentDialogue] = useState<Subtitle | null>(null)
  const [repeatDialogue, setRepeatDialogue] = useState<Subtitle | null>(null)

  const playerRef = useRef<YouTubePlayerRef>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentDialogueRef = useRef(currentDialogue)
  const repeatDialogueRef = useRef(repeatDialogue)

  // GA 이벤트: Review 모드 진입
  useEffect(() => {
    if (videoId) {
      analytics.startReview({
        video_id: videoId,
      })
    }
  }, [videoId])

  const endVideo = () => {
    // GA 이벤트: Review 모드 완료
    if (videoId) {
      analytics.completeReview({
        video_id: videoId,
      })

      markStepAsCompleted(videoId, 'review')
    }

    stopTimeTracking()
    playerRef.current?.pause()
    modal.open({
      title: '전체 복습 완료',
      description: '모든 학습 단계를 완료했어요!\n수고하셨습니다!',
      okText: '다시보기',
      cancelText: '홈으로',
      onCancel: () => {
        navigate(paths.videos.root.getHref())
      },
      onOk: () => {
        // GA 이벤트: Review 다시보기
        if (videoId) {
          analytics.reviewRewatch({
            video_id: videoId,
          })
        }

        playerRef.current?.seekTo(0)
        playerRef.current?.play()
        startTimeTracking()
      },
    })
  }

  useEffect(() => {
    currentDialogueRef.current = currentDialogue
  }, [currentDialogue])

  useEffect(() => {
    repeatDialogueRef.current = repeatDialogue
  }, [repeatDialogue])

  // Cleanup: 컴포넌트 unmount 시 interval 정리
  useEffect(() => {
    return () => {
      stopTimeTracking()
    }
  }, [])

  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // 100ms마다 현재 시간 업데이트 (더 부드러운 추적)
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return

      const status = getSubtitleInfo({ subtitles, player: playerRef.current })

      // 모든 자막이 끝났으면 종료
      if (status.isAllSubtitlesEnded) {
        endVideo()
        return
      }

      const isInRepeatMode = repeatDialogueRef.current !== null

      if (isInRepeatMode && status.time >= repeatDialogueRef.current!.endTime!) {
        // Loop back to start
        playerRef.current?.seekTo(repeatDialogueRef.current!.startTime)
        return
      }

      if (status.currentSubtitle) {
        setCurrentDialogue(status.currentSubtitle)
      }
    }, 100)
  }

  const stopTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleStateChange = (state: number) => {
    if (state === YOUTUBE_PLAYER_STATE.ENDED) {
      // review 단계 완료로 표시
      endVideo()
      return
    }

    if (state === YOUTUBE_PLAYER_STATE.PLAYING) {
      startTimeTracking()
      return
    }

    stopTimeTracking()
  }

  const handleDialogueRepeat = (dialogue: Subtitle) => {
    // GA 이벤트: 자막 반복 재생
    if (videoId) {
      analytics.repeatSubtitle({
        video_id: videoId,
        subtitle_index: dialogue.index,
        step_type: 'review',
      })
    }

    // Toggle: if same dialogue clicked, turn off; otherwise, set to this dialogue
    setRepeatDialogue(prev => (prev === dialogue ? null : dialogue))
    setCurrentDialogue(dialogue)

    // Start playback from the dialogue's start
    playerRef.current?.seekTo(dialogue.startTime)
    playerRef.current?.play()
  }

  if (!videoId) {
    return <div className="p-4">비디오를 찾을 수 없습니다.</div>
  }

  if (isLoadingDialogues) {
    return <div>비디오를 가지고 오는 중입니다.</div>
  }

  return (
    <PageLayout>
      <div className="sticky top-0 shadow-sm z-10">
        <YouTubePlayer
          onStateChange={handleStateChange}
          ref={playerRef}
          videoId={videoId}
          initialTime={subtitles[0]?.startTime ?? 0}
          autoPlay
        />
      </div>

      <FullDialogue
        dialogues={subtitles}
        currentDialogue={currentDialogue}
        repeatDialogueIndex={repeatDialogue?.index}
        onRepeat={handleDialogueRepeat}
      />
    </PageLayout>
  )
}
export default VideoPage
