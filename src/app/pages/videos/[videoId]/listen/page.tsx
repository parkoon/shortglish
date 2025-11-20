import { Suspense, useEffect, useRef, useState } from 'react'
import { Await, useLoaderData, useNavigate, useParams } from 'react-router'

import type { Subtitle } from '@/api'
import { PageLayout } from '@/components/layouts/page-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { paths } from '@/config/paths'
import { PlayerController } from '@/features/player/components/player-controller'
import {
  YOUTUBE_PLAYER_STATE,
  YouTubePlayer,
  type YouTubePlayerRef,
} from '@/features/video/components/youtube-player'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
import { analytics } from '@/lib/analytics'
import { useModal } from '@/stores/modal-store'

import { SubtitleSection } from './_components/subtitle-section'
import { useTimeTracking } from './_hooks/use-time-tracking'
import { clientLoader } from './loader'

const ListenPageContent = ({ subtitles }: { subtitles: Subtitle[] }) => {
  const { videoId } = useParams<{ videoId: string }>()
  const modal = useModal()
  const navigate = useNavigate()
  const { markStepAsCompleted } = useVideoProgressStore()

  const [currentDialogue, setCurrentDialogue] = useState<Subtitle | null>(null)
  const [repeatDialogue, setRepeatDialogue] = useState<Subtitle | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const playerRef = useRef<YouTubePlayerRef>(null)

  const endVideo = () => {
    // GA 이벤트: Review 모드 완료
    if (videoId) {
      analytics.completeReview({
        video_id: videoId,
      })

      markStepAsCompleted(videoId, 'review')
    }

    timeTracking.stopTimeTracking()
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
        // GA 이벤트: Review 다시보기
        if (videoId) {
          analytics.reviewRewatch({
            video_id: videoId,
          })
        }

        playerRef.current?.seekTo(0)
        playerRef.current?.play()
        timeTracking.startTimeTracking()
      },
    })
  }

  const timeTracking = useTimeTracking({
    subtitles,
    playerRef,
    onSubtitleChange: setCurrentDialogue,
    onAllSubtitlesEnd: () => {
      endVideo()
    },
  })

  const handleStateChange = (state: number) => {
    if (state === YOUTUBE_PLAYER_STATE.PLAYING) {
      setIsPlaying(true)
      timeTracking.startTimeTracking()
      return
    }

    if (state === YOUTUBE_PLAYER_STATE.PAUSED) {
      setIsPlaying(false)
      timeTracking.stopTimeTracking()
      return
    }

    timeTracking.stopTimeTracking()
  }

  useEffect(() => {
    const initDialogue = subtitles[0]
    setCurrentDialogue(initDialogue)
  }, [subtitles])

  const handleStartStop = () => {
    if (isPlaying) {
      playerRef.current?.pause()
    } else {
      playerRef.current?.play()
    }
  }

  const handlePrevious = () => {
    if (!currentDialogue) return

    const currentIndex = subtitles.findIndex(s => s.index === currentDialogue.index)
    const prevIndex = currentIndex - 1
    const prevDialogue = subtitles[prevIndex]

    if (prevDialogue) {
      setCurrentDialogue(prevDialogue)
      playerRef.current?.seekTo(prevDialogue.startTime)
      playerRef.current?.play()
    }
  }

  const handleNext = () => {
    if (!currentDialogue) return

    const currentIndex = subtitles.findIndex(s => s.index === currentDialogue.index)
    const nextIndex = currentIndex + 1
    const nextDialogue = subtitles[nextIndex]

    if (nextDialogue) {
      setCurrentDialogue(nextDialogue)
      playerRef.current?.seekTo(nextDialogue.startTime)
      playerRef.current?.play()
    }
  }

  const handleRepeatToggle = () => {
    if (!currentDialogue) return

    // Toggle: if same dialogue is already repeating, turn off; otherwise, set to current dialogue
    if (repeatDialogue?.index === currentDialogue.index) {
      setRepeatDialogue(null)
    } else {
      setRepeatDialogue(currentDialogue)
      // GA 이벤트: 자막 반복 재생
      if (videoId) {
        analytics.repeatSubtitle({
          video_id: videoId,
          subtitle_index: currentDialogue.index,
          step_type: 'review',
        })
      }
      // Start playback from the dialogue's start
      playerRef.current?.seekTo(currentDialogue.startTime)
      playerRef.current?.play()
    }
  }

  // Repeat 기능: repeatDialogue가 설정되어 있고 해당 자막이 끝나면 다시 시작
  useEffect(() => {
    if (!repeatDialogue || !playerRef.current) return

    const checkRepeat = setInterval(() => {
      const currentTime = playerRef.current?.getCurrentTime() || 0
      if (currentTime >= repeatDialogue.endTime) {
        playerRef.current?.seekTo(repeatDialogue.startTime)
        playerRef.current?.play()
      }
    }, 100)

    return () => clearInterval(checkRepeat)
  }, [repeatDialogue])

  const currentIndex = currentDialogue
    ? subtitles.findIndex(s => s.index === currentDialogue.index)
    : -1
  const canPrevious = currentIndex > 0
  const canNext = currentIndex >= 0 && currentIndex < subtitles.length - 1
  const isRepeatActive = repeatDialogue?.index === currentDialogue?.index

  return (
    <PageLayout>
      <YouTubePlayer
        ref={playerRef}
        videoId={videoId!}
        initialTime={subtitles[0]?.startTime ?? 0}
        onStateChange={handleStateChange}
      />
      <PlayerController
        canNext={canNext}
        canPrevious={canPrevious}
        isPlaying={isPlaying}
        isRepeatActive={isRepeatActive}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onRepeatToggle={handleRepeatToggle}
        onStartStop={handleStartStop}
      />
      <div className="h-2" />
      <SubtitleSection currentSubtitle={currentDialogue} totalSubtitles={subtitles.length} />
    </PageLayout>
  )
}

const ListenPage = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const data = useLoaderData<{ subtitles: Promise<Subtitle[]> }>()

  if (!videoId) {
    return <div className="p-4">비디오를 찾을 수 없습니다.</div>
  }

  return (
    <Suspense
      fallback={
        <PageLayout>
          <Skeleton className="w-full aspect-video rounded-none" />
        </PageLayout>
      }
    >
      <Await resolve={data.subtitles}>
        {subtitles => <ListenPageContent subtitles={subtitles} />}
      </Await>
    </Suspense>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { clientLoader }

export default ListenPage
