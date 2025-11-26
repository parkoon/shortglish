import { Suspense, useRef, useState } from 'react'
import { Await, useLoaderData, useNavigate } from 'react-router'

import type { Subtitle } from '@/api'
import { subscribeAlarm } from '@/api/alarms'
import { PageLayout } from '@/components/layouts/page-layout'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
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
import { type SelectedWordInfo, WordSentenceBuilder } from '@/features/word-sentence-builder'
import { analytics } from '@/lib/analytics'
import { useAuthStore } from '@/stores/auth-store'

import { DevCompleteButton } from '../../videos/[videoId]/_components/dev-complete-button'
import { EmptySubtitle } from '../../videos/[videoId]/_components/empty-subtitle'
import { SubtitleProgressBar } from '../../videos/[videoId]/_components/subtitle-progress-bar'
import { useBuildTimeTracking } from '../../videos/[videoId]/build/_hooks/use-build-time-tracking'
import { clientLoader } from './loader'

export const TEST_A_VIDEO_ID = 'eLSk4uxXdvU'

const BuildPageContent = ({ subtitles }: { subtitles: Subtitle[] }) => {
  const navigate = useNavigate()

  const [currentDialogue, setCurrentDialogue] = useState<Subtitle | null>(subtitles[0] ?? null)

  const { isCompleted, markAsCompleted, getCompletedWords } = useDialogueCompletionStore()

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

  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const user = useAuthStore(state => state.user)

  const handleRepeat = () => {
    // GA 이벤트: 반복 버튼 클릭
    if (currentDialogue) {
      analytics.clickRepeat({
        video_id: TEST_A_VIDEO_ID,
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
    if (currentDialogue) {
      analytics.useHint({
        video_id: TEST_A_VIDEO_ID,
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

    analytics.clickPrevious({
      video_id: TEST_A_VIDEO_ID,
      subtitle_index: prevDialogue.index,
      step_type: 'build',
    })

    setCurrentDialogue(prevDialogue)
    playerRef.current?.seekTo(prevDialogue.startTime)
    // 이전 자막으로 이동하면 깜빡임 중지
    videoControllerRef.current?.stopBlink()
  }

  const handleNext = () => {
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
      !isCompleted(TEST_A_VIDEO_ID, currentDialogue.index) &&
      currentDialogue.originText !== ''
    ) {
      return
    }

    // GA 이벤트: 다음 버튼 클릭
    analytics.clickNext({
      video_id: TEST_A_VIDEO_ID,
      subtitle_index: nextDialogue.index,
      step_type: 'build',
    })

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
    if (!currentDialogue) {
      return
    }

    // GA 이벤트: 자막 완성
    const maxAttempts = Math.max(...selectedWords.map(w => w.attempts), 1)
    analytics.subtitleCompleted({
      video_id: TEST_A_VIDEO_ID,
      subtitle_index: currentDialogue.index,
      attempts: maxAttempts,
    })

    // store에 저장
    markAsCompleted(TEST_A_VIDEO_ID, currentDialogue.index, selectedWords)

    const nextDialogue = getNextSubtitle({ subtitles, currentSubtitle: currentDialogue })
    // 다음 자막이 없으면, 학습 종료
    if (!nextDialogue) {
      // GA 이벤트: Build 모드 전체 완료
      analytics.completeBuildMode({
        video_id: TEST_A_VIDEO_ID,
        total_subtitles: subtitles.length,
      })

      setShowBottomSheet(true)

      return
    }

    // Next 버튼 깜빡임 시작
    videoControllerRef.current?.startBlink()
  }

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true)
      await subscribeAlarm({
        userId: user?.id ?? 'unknown',
        phoneNumber: user?.phone ?? 'unknown',
        videoId: TEST_A_VIDEO_ID ?? '',
        type: 'b',
        userName: user?.name ?? 'unknown',
        notificationConsent: true,
      })
      navigate(paths.videos.root.getHref(), { replace: true })
      setShowBottomSheet(false)
    } catch (error) {
      console.error('Failed to subscribe alarm:', error)
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleCloseBottomSheet = () => {
    navigate(paths.videos.root.getHref(), { replace: true })
    setShowBottomSheet(false)
  }

  // 현재 자막이 완성되었는지 확인
  const isCurrentSubtitleCompleted = !currentDialogue
    ? false
    : isCompleted(TEST_A_VIDEO_ID, currentDialogue.index) || currentDialogue.originText === ''

  // 이전 자막이 있는지 확인
  const currentIndex = currentDialogue
    ? subtitles.findIndex(d => d.index === currentDialogue.index)
    : -1
  const canGoPrevious = currentIndex > 0

  const showBuilder = currentDialogue && currentDialogue.originText !== ''

  return (
    <PageLayout className="pb-[80px]">
      <YouTubePlayer
        onStateChange={handleStateChange}
        ref={playerRef}
        videoId={TEST_A_VIDEO_ID}
        initialTime={subtitles[0]?.startTime ?? 0}
        autoPlay
      />
      <SubtitleProgressBar current={currentDialogue?.index ?? 0} total={subtitles.length} />

      {/* {playerState === YOUTUBE_PLAYER_STATE.PAUSED && (
          <VideoRepeatOverlay onRepeat={handleRepeat} />
        )} */}
      <VideoController
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
              key={`${TEST_A_VIDEO_ID}-${currentDialogue.index}`}
              sentence={currentDialogue.originText}
              translation={currentDialogue.translation}
              isCompleted={isCompleted(TEST_A_VIDEO_ID, currentDialogue.index)}
              completedWords={getCompletedWords(TEST_A_VIDEO_ID, currentDialogue.index)}
              currentDialogueIndex={currentDialogue.index}
              totalDialogueCount={subtitles.length}
              onComplete={handleSubtitleComplete}
              onWrong={handleRepeat}
              onHint={handleHint}
            />
            <DevCompleteButton
              videoId={TEST_A_VIDEO_ID}
              currentDialogue={currentDialogue}
              isCompleted={isCurrentSubtitleCompleted}
              onComplete={handleSubtitleComplete}
            />
          </>
        ) : (
          <EmptySubtitle />
        )}
      </div>

      <BottomSheet
        title="Did you(지쥬) 영상 알림받기"
        description="원어민의 발음을 이해해야 나도 원어민처럼 말할 수 있어요."
        open={showBottomSheet}
        onClose={handleCloseBottomSheet}
      >
        <div className="flex items-center justify-center mb-3">
          <img src="/images/test.png" width={210} />
        </div>

        <Button
          className="w-full"
          size="lg"
          loading={isSubscribing}
          onClick={handleSubscribe}
          disabled={isSubscribing}
        >
          알림받기
        </Button>
      </BottomSheet>
    </PageLayout>
  )
}

const BuildPage = () => {
  const data = useLoaderData<{ subtitles: Promise<Subtitle[]> }>()

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
