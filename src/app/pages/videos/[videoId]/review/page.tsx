import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PageLayout } from '@/components/layouts/page-layout'
import { paths } from '@/config/paths'
import {
  YOUTUBE_PLAYER_STATE,
  YouTubePlayer,
  type YouTubePlayerRef,
} from '@/features/video/components/youtube-player'
import { useSubtitles } from '@/features/video/hooks/use-subtitles'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
import type { Subtitle } from '@/features/video/types'
import { useGlobalModal } from '@/stores/modal-store'

import { FullDialogue } from './_components/full-dialogue'

const VideoPage = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const modal = useGlobalModal()
  const navigate = useNavigate()
  const { markStepAsCompleted } = useVideoProgressStore()

  const { data: subtitles = [], isLoading: isLoadingDialogues } = useSubtitles(videoId)

  const [currentDialogue, setCurrentDialogue] = useState<Subtitle | null>(null)
  const [repeatDialogue, setRepeatDialogue] = useState<Subtitle | null>(null)

  const playerRef = useRef<YouTubePlayerRef>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentDialogueRef = useRef(currentDialogue)
  const repeatDialogueRef = useRef(repeatDialogue)

  const endVideo = () => {
    if (videoId) {
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
        navigate(paths.home.root.getHref())
      },
      onOk: () => {
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

  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // 100ms마다 현재 시간 업데이트 (더 부드러운 추적)
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return

      const time = playerRef.current.getCurrentTime()

      if (isDialogueEnded(time, subtitles)) {
        endVideo()
        return
      }

      const isInRepeatMode = repeatDialogueRef.current !== null

      if (isInRepeatMode && time >= repeatDialogueRef.current!.endTime!) {
        // Loop back to start
        playerRef.current?.seekTo(repeatDialogueRef.current!.startTime)
        return
      }

      const 시간에따른다이얼로그 = subtitles.find(d => {
        return time >= d.startTime && time < d.endTime
      })

      console.log(시간에따른다이얼로그)

      if (!시간에따른다이얼로그) {
        return
      }
      setCurrentDialogue(시간에따른다이얼로그)
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
      <div className="sticky top-0 shadow-sm">
        <YouTubePlayer
          onStateChange={handleStateChange}
          ref={playerRef}
          videoId={videoId}
          initialTime={0}
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
const isDialogueEnded = (time: number, subtitles: Subtitle[]) => {
  const lastDialogue = subtitles[subtitles.length - 1]
  return time >= lastDialogue.endTime
}

export default VideoPage
