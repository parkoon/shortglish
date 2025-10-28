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
import { useDialogueCompletionStore } from '@/features/video/store/dialogue-completion-store'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
import type { Subtitle } from '@/features/video/types'
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
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [isLoadingDialogues, setIsLoadingDialogues] = useState(true)
  const [currentDialogue, setCurrentDialogue] = useState<Subtitle | null>(null)
  const [canShowBookmark, setCanShowBookmark] = useState(false)

  const { isCompleted, markAsCompleted, getCompletedWords } = useDialogueCompletionStore()
  const { markStepAsCompleted } = useVideoProgressStore()
  const modal = useGlobalModal()

  const playerRef = useRef<YouTubePlayerRef>(null)
  const videoControllerRef = useRef<VideoControllerRef>(null)
  const wordSentenceBuilderRef = useRef<WordSentenceBuilderRef>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentDialogueRef = useRef(currentDialogue)

  // Load dialogues for the current video
  useEffect(() => {
    if (!videoId) return

    const loadDialogues = async () => {
      setIsLoadingDialogues(true)
      const data = await getSubtitle(videoId)
      setSubtitles(data)
      // 초기 상태는 null로 유지, interval에서 자동으로 찾음
      setIsLoadingDialogues(false)
    }

    loadDialogues()
  }, [videoId])

  useEffect(() => {
    currentDialogueRef.current = currentDialogue
  }, [currentDialogue])

  const handleRepeat = () => {
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

    if (playerRef) {
      setCurrentDialogue(prevDialogue)
      playerRef.current?.seekTo(prevDialogue.startTime)
      // 이전 자막으로 이동하면 북마크 버튼 숨김 & 깜빡임 중지
      setCanShowBookmark(false)
      videoControllerRef.current?.stopBlink()
    }
  }

  const handleNext = () => {
    if (!videoId) return

    const currentIndex = subtitles.findIndex(d => d.index === currentDialogue?.index)
    const nextIndex = currentIndex + 1
    const nextDialogue = subtitles[nextIndex]
    console.log('🚀 ~ handleNext ~ nextDialogue:', nextDialogue)

    // 다음 다이얼로그가 없음
    if (!nextDialogue) {
      return
    }

    // 현재 자막이 있고 완성되지 않았으면 이동 불가
    if (currentDialogue && !isCompleted(videoId, currentDialogue.index)) {
      return
    }

    if (playerRef) {
      setCurrentDialogue(nextDialogue)

      playerRef.current?.seekTo(nextDialogue.startTime)
      playerRef.current?.play()
      // 다음 자막으로 이동하면 북마크 버튼 숨김 & 깜빡임 중지
      setCanShowBookmark(false)
      videoControllerRef.current?.stopBlink()
    }
  }

  const handleHint = () => {
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

    // store에 저장
    markAsCompleted(videoId, currentDialogue.index, selectedWords)

    const nextDialogue = getNextDialogue(subtitles, currentDialogue)
    // 다음 자막이 없으면, 학습 종료
    if (!nextDialogue) {
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

    // 자막 완성 시 북마크 버튼 활성화
    setCanShowBookmark(true)
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
    <PageLayout title="">
      <div className="relative">
        <YouTubePlayer
          onStateChange={handleStateChange}
          ref={playerRef}
          videoId={videoId}
          initialTime={0}
          autoPlay
          devMode={process.env.NODE_ENV === 'development'}
        />

        {/* {playerState === YOUTUBE_PLAYER_STATE.PAUSED && (
          <VideoRepeatOverlay onRepeat={handleRepeat} />
        )} */}
      </div>

      <SubtitleProgressBar current={currentDialogue?.index ?? 0} total={subtitles.length} />

      {currentDialogue?.text === '' ? (
        <EmptySubtitle />
      ) : currentDialogue && videoId ? (
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
          {canShowBookmark && (
            <div className="mt-4 text-center text-sm text-green-600">
              ✨ 문장을 완성했어요! 북마크할 수 있어요.
            </div>
          )}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">재생할 대사가 없어요~</div>
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

const getSubtitle = async (videoId: string): Promise<Subtitle[]> => {
  try {
    const response = await fetch(`/subtitles/${videoId}.json`)
    if (!response.ok) {
      throw new Error(`Failed to fetch subtitle: ${response.statusText}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error(`Failed to load subtitle for video: ${videoId}`, error)
    return []
  }
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
