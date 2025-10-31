import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PageLayout } from '@/components/layouts/page-layout'
import { paths } from '@/config/paths'
import {
  VideoController,
  type VideoControllerRef,
} from '@/features/video/components/video-controller'
import {
  WordSentenceBuilder,
  type WordSentenceBuilderRef,
} from '@/features/video/components/word-sentence-builder'
import {
  YOUTUBE_PLAYER_STATE,
  YouTubePlayer,
  type YouTubePlayerRef,
} from '@/features/video/components/youtube-player'
import { useSubtitles } from '@/features/video/hooks/use-subtitles'
import { useDialogueCompletionStore } from '@/features/video/store/dialogue-completion-store'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
import type { Subtitle } from '@/features/video/types'
import { analytics } from '@/lib/analytics'
import { useGlobalModal } from '@/stores/modal-store'

import { DevCompleteButton } from '../_components/dev-complete-button'
import { EmptySubtitle } from '../_components/empty-subtitle'
import { SubtitleProgressBar } from '../_components/subtitle-progress-bar'

type SelectedWordInfo = {
  word: string
  attempts: number
  id: number
}

const VideoPage = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const navigate = useNavigate()

  const { data: subtitles = [], isLoading: isLoadingDialogues } = useSubtitles(videoId)

  const [currentDialogue, setCurrentDialogue] = useState<Subtitle | null>(null)

  const { isCompleted, markAsCompleted, getCompletedWords } = useDialogueCompletionStore()
  const { markStepAsCompleted } = useVideoProgressStore()
  const modal = useGlobalModal()

  const playerRef = useRef<YouTubePlayerRef>(null)
  const videoControllerRef = useRef<VideoControllerRef>(null)
  const wordSentenceBuilderRef = useRef<WordSentenceBuilderRef>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentDialogueRef = useRef(currentDialogue)

  useEffect(() => {
    currentDialogueRef.current = currentDialogue
  }, [currentDialogue])

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

  const handlePrevious = () => {
    const currentIndex = subtitles.findIndex(d => d.index === currentDialogue?.index)
    const prevIndex = currentIndex - 1
    const prevDialogue = subtitles[prevIndex]

    // 이전 다이얼로그가 없음
    if (!prevDialogue) {
      return
    }

    // GA 이벤트: 이전 버튼 클릭
    if (videoId && prevDialogue) {
      analytics.clickPrevious({
        video_id: videoId,
        subtitle_index: prevDialogue.index,
        step_type: 'build',
      })
    }

    if (playerRef) {
      setCurrentDialogue(prevDialogue)
      playerRef.current?.seekTo(prevDialogue.startTime)
      // 이전 자막으로 이동하면 깜빡임 중지
      videoControllerRef.current?.stopBlink()
    }
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
      currentDialogue.text !== ''
    ) {
      return
    }

    // GA 이벤트: 다음 버튼 클릭
    if (videoId && nextDialogue) {
      analytics.clickNext({
        video_id: videoId,
        subtitle_index: nextDialogue.index,
        step_type: 'build',
      })
    }

    if (playerRef) {
      setCurrentDialogue(nextDialogue)

      playerRef.current?.seekTo(nextDialogue.startTime)
      playerRef.current?.play()
      // 다음 자막으로 이동하면 깜빡임 중지
      videoControllerRef.current?.stopBlink()
    }
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

    wordSentenceBuilderRef.current?.showHint()
  }

  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // 100ms마다 현재 시간 업데이트 (더 부드러운 추적)
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return

      const time = playerRef.current.getCurrentTime()
      const activeDialogue = currentDialogueRef.current

      // 케이스 1: 대사가 없을 때 (첫 지점) - 현재 시간에 맞는 대사 찾아서 설정
      if (!activeDialogue) {
        const foundDialogue = getCurrentDialogue(subtitles, time)

        if (foundDialogue) {
          setCurrentDialogue(foundDialogue)
        }
        return
      }

      const isEnded = time >= activeDialogue.endTime

      // 케이스 3: 대사가 없을 때 - 끝났는지만 체크
      if (isEnded && activeDialogue.text === '') {
        const foundDialogue = getCurrentDialogue(subtitles, time)

        if (foundDialogue) {
          setCurrentDialogue(foundDialogue)
        }

        return
      }

      // 케이스 2: 대사가 있을 때 - 끝났는지만 체크
      if (isEnded) {
        playerRef.current.pause()
        playerRef.current.seekTo(activeDialogue.startTime)
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

    const nextDialogue = getNextDialogue(subtitles, currentDialogue)
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

  // 현재 자막이 완성되었는지 확인
  const isCurrentSubtitleCompleted =
    !currentDialogue || !videoId
      ? true
      : isCompleted(videoId, currentDialogue.index) || currentDialogue.text === ''

  // 이전 자막이 있는지 확인
  const currentIndex = currentDialogue
    ? subtitles.findIndex(d => d.index === currentDialogue.index)
    : -1
  const canGoPrevious = currentIndex > 0

  if (!videoId) {
    return <div className="p-4">비디오를 찾을 수 없습니다.</div>
  }

  if (isLoadingDialogues) {
    return <div>비디오를 가지고 오는 중입니다.</div>
  }
  return (
    <PageLayout className="pb-[80px]">
      <div className="relative">
        <YouTubePlayer
          onStateChange={handleStateChange}
          ref={playerRef}
          videoId={videoId}
          initialTime={subtitles[0]?.startTime ?? 0}
          autoPlay
        />

        {/* {playerState === YOUTUBE_PLAYER_STATE.PAUSED && (
          <VideoRepeatOverlay onRepeat={handleRepeat} />
        )} */}
      </div>

      <SubtitleProgressBar current={currentDialogue?.index ?? 0} total={subtitles.length} />

      {currentDialogue?.text === '' && <EmptySubtitle />}
      {currentDialogue && videoId && (
        <div className="p-4">
          <WordSentenceBuilder
            ref={wordSentenceBuilderRef}
            key={`${videoId}-${currentDialogue.index}`}
            sentence={currentDialogue.text}
            translation={currentDialogue.translation}
            onComplete={handleSubtitleComplete}
            onWrong={handleRepeat}
            isCompleted={isCompleted(videoId, currentDialogue.index)}
            completedWords={getCompletedWords(videoId, currentDialogue.index)}
          />
        </div>
      )}

      <DevCompleteButton
        videoId={videoId}
        currentDialogue={currentDialogue}
        isCompleted={isCurrentSubtitleCompleted}
        onComplete={handleSubtitleComplete}
      />

      <VideoController
        ref={videoControllerRef}
        onRepeat={handleRepeat}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onHint={handleHint}
        canRepeat={!!currentDialogue}
        canNext={isCurrentSubtitleCompleted}
        canPrevious={canGoPrevious}
        canHint={!isCurrentSubtitleCompleted}
      />
    </PageLayout>
  )
}

const getCurrentDialogue = (subtitles: Subtitle[], time: number): Subtitle | null => {
  return (
    subtitles.find(d => {
      return time >= d.startTime && time < d.endTime
    }) ?? null
  )
}

const getNextDialogue = (subtitles: Subtitle[], currentDialogue: Subtitle): Subtitle | null => {
  return subtitles.find(d => d.index === currentDialogue.index + 1) ?? null
}

export default VideoPage
