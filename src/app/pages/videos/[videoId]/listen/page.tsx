import { Suspense, useRef, useState } from 'react'
import { Await, useLoaderData, useNavigate, useParams } from 'react-router'

import type { Subtitle } from '@/api'
import { PageLayout } from '@/components/layouts/page-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { paths } from '@/config/paths'
import { PlayerController } from '@/features/player/components/player-controller'
import { VideoProgressBar } from '@/features/player/components/video-progress-bar'
import { getNextSubtitle, getPreviousSubtitle } from '@/features/player/utils/subtitle'
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

  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)

  const playerRef = useRef<YouTubePlayerRef>(null)

  const timeTracking = useTimeTracking({
    subtitles,
    playerRef,
    onSubtitleChange: setCurrentSubtitle,
    onTimeUpdate: time => {
      setCurrentTime(time)
    },
    onAllSubtitlesEnd: () => {
      endVideo()
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

  const canPrevious = !!getPreviousSubtitle({ subtitles, currentSubtitle })
  const canNext = !!getNextSubtitle({ subtitles, currentSubtitle })

  return (
    <PageLayout>
      <YouTubePlayer
        ref={playerRef}
        videoId={videoId!}
        initialTime={subtitles[0]?.startTime ?? 0}
        onStateChange={handleStateChange}
      />
      <VideoProgressBar
        startTime={subtitles[0].startTime}
        endTime={subtitles[subtitles.length - 1].endTime}
        currentTime={currentTime}
      />

      {/* 여기에 */}
      <PlayerController
        canNext={canNext}
        canPrevious={canPrevious}
        isPlaying={isPlaying}
        onNext={handleNext}
        onPrevious={handlePrevious}
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
