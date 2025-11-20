import { Suspense, useEffect, useRef, useState } from 'react'
import { Await, useLoaderData, useNavigate, useParams } from 'react-router'

import type { Subtitle } from '@/api'
import { PageLayout } from '@/components/layouts/page-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { paths } from '@/config/paths'
import { PlayerController } from '@/features/player/components/player-controller'
import { getNextSubtitle, getPreviousSubtitle } from '@/features/player/utils/subtitle'
import {
  YOUTUBE_PLAYER_STATE,
  YouTubePlayer,
  type YouTubePlayerRef,
} from '@/features/video/components/youtube-player'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
import { useSyncedRef } from '@/hooks/use-synced-ref'
import { analytics } from '@/lib/analytics'
import { useModal } from '@/stores/modal-store'

import { SubtitleProgressBar } from '../_components/subtitle-progress-bar'
import { SubtitleSection } from './_components/subtitle-section'
import { useTimeTracking } from './_hooks/use-time-tracking'
import { clientLoader } from './loader'

const ListenPageContent = ({ subtitles }: { subtitles: Subtitle[] }) => {
  const { videoId } = useParams<{ videoId: string }>()
  const modal = useModal()
  const navigate = useNavigate()
  const { markStepAsCompleted } = useVideoProgressStore()

  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRepeated, setIsRepeated] = useState(false)

  const playerRef = useRef<YouTubePlayerRef>(null)
  const isRepeatedRef = useSyncedRef(isRepeated)
  const currentSubtitleRef = useSyncedRef(currentSubtitle)

  const timeTracking = useTimeTracking({
    subtitles,
    playerRef,
    onSubtitleChange: subtitle => {
      if (isRepeatedRef.current) {
        return
      }

      setCurrentSubtitle(subtitle)
    },
    onAllSubtitlesEnd: () => {
      // repeat 중이면 모달을 표시하지 않음
      if (!isRepeatedRef.current) {
        endVideo()
      }
    },
  })

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
      title: '듣기 완료',
      description: '모든 자막을 들었어요!\n다음 단계인 빈칸 채우기로 이어서 학습할까요?',
      okText: '다음 단계로',
      cancelText: '나중에',
      onCancel: () => {
        navigate(paths.videos.entry.getHref(videoId ?? ''), { replace: true })
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

  const handleStartStop = () => {
    if (isPlaying) {
      playerRef.current?.pause()
    } else {
      playerRef.current?.play()
    }
  }

  const handlePrevious = () => {
    const prevSubtitle = getPreviousSubtitle({ subtitles, currentSubtitle })
    if (prevSubtitle) {
      setCurrentSubtitle(prevSubtitle)
      playerRef.current?.seekTo(prevSubtitle.startTime)
      playerRef.current?.play()
    }
  }

  const handleNext = () => {
    const nextSubtitle = getNextSubtitle({ subtitles, currentSubtitle })
    if (nextSubtitle) {
      setCurrentSubtitle(nextSubtitle)
      playerRef.current?.seekTo(nextSubtitle.startTime)
      playerRef.current?.play()
    }
  }

  const handleRepeatToggle = () => {
    if (!currentSubtitle) return

    const newIsRepeated = !isRepeated
    setIsRepeated(newIsRepeated)

    // GA 이벤트: 자막 반복 재생
    if (newIsRepeated && videoId) {
      analytics.repeatSubtitle({
        video_id: videoId,
        subtitle_index: currentSubtitle.index,
        step_type: 'review',
      })
    }

    // 반복 모드 켜면 현재 자막의 시작으로 이동
    if (newIsRepeated) {
      playerRef.current?.seekTo(currentSubtitle.startTime)
      playerRef.current?.play()
    }
  }

  // Repeat 기능: isRepeated가 true이고 currentSubtitle이 끝나면 다시 시작
  useEffect(() => {
    if (!isRepeated || !currentSubtitle || !playerRef.current) return

    let animationFrameId: number | null = null

    const checkRepeat = () => {
      if (!playerRef.current || !isRepeatedRef.current) {
        animationFrameId = null
        return
      }

      const subtitle = currentSubtitleRef.current
      if (!subtitle) {
        animationFrameId = null
        return
      }

      const currentTime = playerRef.current.getCurrentTime()
      if (currentTime >= subtitle.endTime) {
        playerRef.current.seekTo(subtitle.startTime)
        playerRef.current.play()
        // 계속 반복되도록 다음 프레임 요청
        animationFrameId = requestAnimationFrame(checkRepeat)
        return
      }

      // 다음 프레임 요청
      animationFrameId = requestAnimationFrame(checkRepeat)
    }

    // 첫 프레임 요청
    animationFrameId = requestAnimationFrame(checkRepeat)

    return () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRepeated, currentSubtitle])

  const canPrevious =
    !!getPreviousSubtitle({ subtitles, currentSubtitle }) && currentSubtitle?.originText !== ''
  const canNext =
    !!getNextSubtitle({ subtitles, currentSubtitle }) && currentSubtitle?.originText !== ''

  return (
    <PageLayout>
      <YouTubePlayer
        ref={playerRef}
        videoId={videoId!}
        initialTime={subtitles[0]?.startTime ?? 0}
        onStateChange={handleStateChange}
      />
      <SubtitleProgressBar current={currentSubtitle?.index ?? 0} total={subtitles.length} />

      {/* 여기에 */}
      <PlayerController
        canRepeat={currentSubtitle?.originText !== ''}
        canNext={canNext}
        canPrevious={canPrevious}
        isPlaying={isPlaying}
        isRepeatActive={isRepeated}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onRepeatToggle={handleRepeatToggle}
        onStartStop={handleStartStop}
      />
      <div className="h-2" />

      {currentSubtitle ? (
        <SubtitleSection currentSubtitle={currentSubtitle} totalSubtitles={subtitles.length} />
      ) : (
        <></>
      )}
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
