import { Suspense, useRef, useState } from 'react'
import { Await, useLoaderData, useNavigate, useParams } from 'react-router'

import type { Subtitle } from '@/api'
import { PageLayout } from '@/components/layouts/page-layout'
import { Skeleton } from '@/components/ui/skeleton'
import { paths } from '@/config/paths'
import { getNextSubtitle, getPreviousSubtitle } from '@/features/player/utils/subtitle'
import {
  VideoController,
  type VideoControllerRef,
} from '@/features/video/components/video-controller'
import {
  YOUTUBE_PLAYER_STATE,
  YouTubePlayer,
  type YouTubePlayerRef,
} from '@/features/video/components/youtube-player'
import { useDialogueCompletionStore } from '@/features/video/store/dialogue-completion-store'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
import { type SelectedWordInfo, WordSentenceBuilder } from '@/features/word-sentence-builder'
import { analytics } from '@/lib/analytics'
import { useModal } from '@/stores/modal-store'

import { DevCompleteButton } from '../_components/dev-complete-button'
import { EmptySubtitle } from '../_components/empty-subtitle'
import { SubtitleProgressBar } from '../_components/subtitle-progress-bar'
import { VideoSpeedBottomSheet } from './_components/video-speed-bottom-sheet'
import { useBuildTimeTracking } from './_hooks/use-build-time-tracking'
import { clientLoader } from './loader'

const BuildPageContent = ({ subtitles }: { subtitles: Subtitle[] }) => {
  const { videoId } = useParams<{ videoId: string }>()
  const navigate = useNavigate()

  const [currentDialogue, setCurrentDialogue] = useState<Subtitle | null>(subtitles[0] ?? null)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0)
  const [isSpeedBottomSheetOpen, setIsSpeedBottomSheetOpen] = useState(false)

  const { isCompleted, markAsCompleted, getCompletedWords } = useDialogueCompletionStore()
  const { markStepAsCompleted } = useVideoProgressStore()
  const modal = useModal()

  const playerRef = useRef<YouTubePlayerRef>(null)
  const videoControllerRef = useRef<VideoControllerRef>(null)

  const { startTimeTracking, stopTimeTracking } = useBuildTimeTracking({
    subtitles,
    playerRef,
    currentDialogue,
    onSubtitleFound: foundDialogue => {
      setCurrentDialogue(foundDialogue)
    },
  })

  const handleRepeat = () => {
    // GA 이벤트: 반복 버튼 클릭
    if (videoId && currentDialogue) {
      analytics.clickRepeat({
        video_id: videoId,
        subtitle_index: currentDialogue.index,
        step_type: 'build',
      })
    }

    if (currentDialogue) {
      playerRef.current?.seekTo(currentDialogue.startTime)
    } else {
      // 대사가 없으면 0초부터 재생
      playerRef.current?.seekTo(0)
    }
    playerRef.current?.play()
  }

  const handleHint = () => {
    // GA 이벤트: 힌트 사용
    if (videoId && currentDialogue) {
      analytics.useHint({
        video_id: videoId,
        subtitle_index: currentDialogue.index,
        step_type: 'build',
      })
    }
  }

  const handlePrevious = () => {
    const prevDialogue = getPreviousSubtitle({ subtitles, currentSubtitle: currentDialogue })

    // 이전 다이얼로그가 없음
    if (!prevDialogue) {
      return
    }

    // GA 이벤트: 이전 버튼 클릭
    if (videoId) {
      analytics.clickPrevious({
        video_id: videoId,
        subtitle_index: prevDialogue.index,
        step_type: 'build',
      })
    }

    setCurrentDialogue(prevDialogue)
    playerRef.current?.seekTo(prevDialogue.startTime)
    // 이전 자막으로 이동하면 깜빡임 중지
    videoControllerRef.current?.stopBlink()
  }

  const handleNext = () => {
    if (!videoId) return

    const currentIndex = subtitles.findIndex(d => d.index === currentDialogue?.index)
    const nextIndex = currentIndex + 1
    const nextDialogue = subtitles[nextIndex]

    // 다음 다이얼로그가 없음
    if (!nextDialogue) {
      return
    }

    // 현재 자막이 있고 완성되지 않았으면 이동 불가 (단, 빈 자막은 완성된 것으로 간주)
    if (
      currentDialogue &&
      !isCompleted(videoId, currentDialogue.index) &&
      currentDialogue.originText !== ''
    ) {
      return
    }

    // GA 이벤트: 다음 버튼 클릭
    if (videoId) {
      analytics.clickNext({
        video_id: videoId,
        subtitle_index: nextDialogue.index,
        step_type: 'build',
      })
    }

    setCurrentDialogue(nextDialogue)
    playerRef.current?.seekTo(nextDialogue.startTime)
    playerRef.current?.play()
    // 다음 자막으로 이동하면 깜빡임 중지
    videoControllerRef.current?.stopBlink()
  }

  const handleStateChange = (state: number) => {
    if (state === YOUTUBE_PLAYER_STATE.PLAYING) {
      startTimeTracking()
      return
    }

    stopTimeTracking()
  }

  const handleSubtitleComplete = (selectedWords: SelectedWordInfo[]) => {
    if (!currentDialogue || !videoId) {
      return
    }

    // GA 이벤트: 자막 완성
    const maxAttempts = Math.max(...selectedWords.map(w => w.attempts), 1)
    analytics.subtitleCompleted({
      video_id: videoId,
      subtitle_index: currentDialogue.index,
      attempts: maxAttempts,
    })

    // store에 저장
    markAsCompleted(videoId, currentDialogue.index, selectedWords)

    const nextDialogue = getNextSubtitle({ subtitles, currentSubtitle: currentDialogue })
    // 다음 자막이 없으면, 학습 종료
    if (!nextDialogue) {
      // GA 이벤트: Build 모드 전체 완료
      analytics.completeBuildMode({
        video_id: videoId,
        total_subtitles: subtitles.length,
      })

      // build 단계 완료로 표시
      markStepAsCompleted(videoId, 'build')

      modal.open({
        title: '단어 조합 완료',
        description: '모든 문장을 완성했어요!\n다음 단계인 빈칸 채우기로 이어서 학습할까요?',
        okText: '다음 단계로',
        cancelText: '나중에',
        onOk: () => {
          navigate(paths.videos.fill.getHref(videoId ?? ''))
        },
        onCancel: () => {
          navigate(paths.videos.entry.getHref(videoId ?? ''))
        },
      })

      return
    }

    // Next 버튼 깜빡임 시작
    videoControllerRef.current?.startBlink()
  }

  const handleSpeedChange = () => {
    setIsSpeedBottomSheetOpen(true)
  }

  const handleSpeedSelect = (speed: number) => {
    setPlaybackSpeed(speed)
    playerRef.current?.setPlaybackRate(speed)
  }

  // 현재 자막이 완성되었는지 확인
  const isCurrentSubtitleCompleted =
    !currentDialogue || !videoId
      ? false
      : isCompleted(videoId, currentDialogue.index) || currentDialogue.originText === ''

  // 이전 자막이 있는지 확인
  const currentIndex = currentDialogue
    ? subtitles.findIndex(d => d.index === currentDialogue.index)
    : -1
  const canGoPrevious = currentIndex > 0

  const showBuilder = currentDialogue && currentDialogue.originText !== '' && videoId

  if (!videoId) {
    return <div className="p-4">비디오를 찾을 수 없습니다.</div>
  }

  return (
    <PageLayout className="pb-[80px]">
      <YouTubePlayer
        onStateChange={handleStateChange}
        ref={playerRef}
        videoId={videoId}
        initialTime={subtitles[0]?.startTime ?? 0}
        autoPlay
      />
      <SubtitleProgressBar current={currentDialogue?.index ?? 0} total={subtitles.length} />

      {/* {playerState === YOUTUBE_PLAYER_STATE.PAUSED && (
          <VideoRepeatOverlay onRepeat={handleRepeat} />
        )} */}
      <VideoController
        currentSpeed={playbackSpeed}
        onSpeed={handleSpeedChange}
        ref={videoControllerRef}
        onRepeat={handleRepeat}
        onPrevious={handlePrevious}
        onNext={handleNext}
        canRepeat={!!currentDialogue}
        canNext={isCurrentSubtitleCompleted}
        canPrevious={canGoPrevious}
      />
      <div className="bg-white px-4 pt-2 pb-6 mt-2">
        {showBuilder ? (
          <>
            <WordSentenceBuilder
              key={`${videoId}-${currentDialogue.index}`}
              sentence={currentDialogue.originText}
              translation={currentDialogue.translation}
              isCompleted={isCompleted(videoId, currentDialogue.index)}
              completedWords={getCompletedWords(videoId, currentDialogue.index)}
              currentDialogueIndex={currentDialogue.index}
              totalDialogueCount={subtitles.length}
              onComplete={handleSubtitleComplete}
              onWrong={handleRepeat}
              onHint={handleHint}
            />
            <DevCompleteButton
              videoId={videoId}
              currentDialogue={currentDialogue}
              isCompleted={isCurrentSubtitleCompleted}
              onComplete={handleSubtitleComplete}
            />
          </>
        ) : (
          <EmptySubtitle />
        )}
      </div>

      <VideoSpeedBottomSheet
        open={isSpeedBottomSheetOpen}
        currentSpeed={playbackSpeed}
        onClose={() => setIsSpeedBottomSheetOpen(false)}
        onSelect={handleSpeedSelect}
      />
    </PageLayout>
  )
}

const BuildPage = () => {
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
          <VideoController
            canRepeat={false}
            onNext={() => {}}
            onPrevious={() => {}}
            onRepeat={() => {}}
            currentSpeed={1.0}
            onSpeed={() => {}}
            canNext={false}
            canPrevious={false}
          />
        </PageLayout>
      }
    >
      <Await resolve={data.subtitles}>
        {subtitles => <BuildPageContent subtitles={subtitles} />}
      </Await>
    </Suspense>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export { clientLoader }

export default BuildPage
