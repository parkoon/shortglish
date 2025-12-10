import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import type { Subtitle, VideoContent as VideoContentType } from '@/api'
import { PageLayout } from '@/components/layouts/page-layout'
import { paths } from '@/config/paths'
import type { YouTubePlayerRef } from '@/features/video/components/youtube-player'
import { YOUTUBE_PLAYER_STATE, YouTubePlayer } from '@/features/video/components/youtube-player'
import { useModal } from '@/stores/modal-store'

import { useSubtitleTracking } from '../_hooks/use-subtitle-tracking'
import { CustomVideoController } from './custom-video-controller'
import { SubtitleDisplay } from './subtitle-display'

type VideoContentProps = {
  content: VideoContentType
}

export const VideoContent = ({ content }: VideoContentProps) => {
  const navigate = useNavigate()
  const modal = useModal()
  const playerRef = useRef<YouTubePlayerRef>(null)

  // VideoContent에서 Subtitle 배열 생성
  const subtitles: Subtitle[] = useMemo(() => {
    return content.subtitles.map((subtitle, index) => ({
      index,
      startTime: subtitle.offsets.from,
      endTime: subtitle.offsets.to,
      originText: subtitle.original,
      blankedText: subtitle.original, // 원문과 동일하게 설정 (나중에 수정 가능)
      translation: subtitle.translation,
    }))
  }, [content])

  const [playerState, setPlayerState] = useState<number>(YOUTUBE_PLAYER_STATE.UNSTARTED)
  const [currentSubtitle, setCurrentSubtitle] = useState<Subtitle | null>(null)
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0)
  const [isPracticeActive, setIsPracticeActive] = useState(false)
  const [isRepeatActive] = useState(false) // useSubtitleTracking에서 사용
  const [showEndModal, setShowEndModal] = useState(false)

  // 현재 자막에 해당하는 원본 VideoContentSubtitle 데이터 찾기
  const currentSubtitleData = useMemo(() => {
    if (currentSubtitleIndex >= 0 && currentSubtitleIndex < content.subtitles.length) {
      return content.subtitles[currentSubtitleIndex]
    }
    return null
  }, [currentSubtitleIndex, content.subtitles])

  // 자막 추적
  useSubtitleTracking({
    subtitles,
    playerRef,
    playerState,
    isRepeatActive,
    isPracticeActive,
    onSubtitleFound: subtitle => {
      if (subtitle) {
        setCurrentSubtitle(subtitle)
        const index = subtitles.findIndex(s => s.index === subtitle.index)
        setCurrentSubtitleIndex(index >= 0 ? index : 0)
      }
    },
  })

  // 플레이어 상태 변경 핸들러
  const handleStateChange = (state: number) => {
    setPlayerState(state)

    // 비디오 종료 시 모달 표시
    if (state === YOUTUBE_PLAYER_STATE.ENDED && !showEndModal) {
      setShowEndModal(true)
      modal.open({
        title: '비디오 종료',
        description: '훌륭해요! 다른 비디오로 계속 학습해보세요.',
        okText: '홈으로',
        cancelText: '닫기',
        onOk: () => {
          navigate(paths.home.root.getHref())
        },
        onCancel: () => {
          setShowEndModal(false)
        },
      })
    }
  }

  // 재생/일시정지
  const handlePlayPause = () => {
    if (!playerRef.current) return

    if (playerState === YOUTUBE_PLAYER_STATE.PLAYING) {
      playerRef.current.pause()
    } else {
      playerRef.current.play()
    }
  }

  // 이전 자막
  const handlePrevious = () => {
    if (currentSubtitleIndex > 0 && playerRef.current) {
      const prevIndex = currentSubtitleIndex - 1
      const prevSubtitle = subtitles[prevIndex]
      setCurrentSubtitleIndex(prevIndex)
      setCurrentSubtitle(prevSubtitle)
      playerRef.current.seekTo(prevSubtitle.startTime / 1000)
    }
  }

  // 다음 자막
  const handleNext = () => {
    if (currentSubtitleIndex < subtitles.length - 1 && playerRef.current) {
      const nextIndex = currentSubtitleIndex + 1
      const nextSubtitle = subtitles[nextIndex]
      setCurrentSubtitleIndex(nextIndex)
      setCurrentSubtitle(nextSubtitle)
      playerRef.current.seekTo(nextSubtitle.startTime / 1000)
    }
  }

  // 첫 번째 자막으로 초기화
  useEffect(() => {
    if (subtitles.length > 0 && !currentSubtitle) {
      setCurrentSubtitle(subtitles[0])
      setCurrentSubtitleIndex(0)
    }
  }, [subtitles, currentSubtitle])

  // 데이터 검증
  if (!content || !content.subtitles || subtitles.length === 0) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-gray-500">비디오 콘텐츠를 불러올 수 없습니다.</p>
          <p className="text-gray-400 text-sm">자막 데이터가 없거나 형식이 올바르지 않습니다.</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="flex flex-col">
        {/* 비디오 플레이어 */}
        <YouTubePlayer
          ref={playerRef}
          videoId={content.videoId || content.id}
          onStateChange={handleStateChange}
        />

        {/* 비디오 컨트롤러 */}
        <CustomVideoController
          isPlaying={playerState === YOUTUBE_PLAYER_STATE.PLAYING}
          canPrevious={currentSubtitleIndex > 0}
          canNext={currentSubtitleIndex < subtitles.length - 1}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
        />

        {/* 자막 표시 */}
        <SubtitleDisplay
          currentSubtitle={currentSubtitle}
          currentSubtitleData={currentSubtitleData}
          currentIndex={currentSubtitleIndex}
          totalSubtitles={subtitles.length}
          isPracticeActive={isPracticeActive}
          onPracticeToggle={() => setIsPracticeActive(!isPracticeActive)}
          onPrevious={handlePrevious}
          onNext={handleNext}
          canPrevious={currentSubtitleIndex > 0}
          canNext={currentSubtitleIndex < subtitles.length - 1}
        />
      </div>
    </PageLayout>
  )
}
