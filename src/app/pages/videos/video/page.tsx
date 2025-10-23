import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { PageLayout } from '@/components/layouts/page-layout'
import { VideoController, type VideoControllerRef } from '@/components/video-controller'
import { VideoSubtitles } from '@/components/video-subtitles'
import { TimerList } from '@/features/video/components/timer-list'
import { YouTubePlayer, type YouTubePlayerRef } from '@/features/video/components/youtube-player'
import type { Subtitle } from '@/features/video/types'

import { SubtitleProgressBar } from './_components/subtitle-progress-bar'

const VideoPage = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const [isRepeatMode, setIsRepeatMode] = useState(false)
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [isLoadingDialogues, setIsLoadingDialogues] = useState(true)
  const [currentDialogue, setCurrentDialogue] = useState<Subtitle>(subtitles[0])
  const isRepeatModeRef = useRef(isRepeatMode)

  const playerRef = useRef<YouTubePlayerRef>(null)
  const videoControllerRef = useRef<VideoControllerRef>(null)

  const [playerState, setPlayerState] = useState(-1)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  // isRepeatMode의 최신 값을 참조하기 위한 ref
  const hasCommentaryRef = useRef(false)
  const endTimeRef = useRef(0)
  const currentDialogueRef = useRef(currentDialogue)

  // Load dialogues for the current video
  useEffect(() => {
    if (!videoId) return

    const loadDialogues = async () => {
      setIsLoadingDialogues(true)
      const data = await getSubtitle(videoId)
      setSubtitles(data)
      if (data.length > 0) {
        setCurrentDialogue(data[0])
      }
      setIsLoadingDialogues(false)
    }

    loadDialogues()
  }, [videoId])

  useEffect(() => {
    currentDialogueRef.current = currentDialogue
  }, [currentDialogue])

  // 다이얼로그 변경 감지 및 처리
  const previousDialogueIndexRef = useRef<number | null>(null)

  useEffect(() => {
    // 최초 렌더링 시에는 이전 index만 저장
    if (previousDialogueIndexRef.current === null) {
      previousDialogueIndexRef.current = currentDialogue?.index ?? 0
      return
    }

    // 이전 다이얼로그와 현재 다이얼로그가 다른 경우에만 처리
    if (currentDialogue && previousDialogueIndexRef.current !== currentDialogue.index) {
      playerRef.current?.pause()
      console.log(`자막 ${currentDialogue.index + 1}: ${currentDialogue.text}`)

      // 현재 index를 이전 index로 저장
      previousDialogueIndexRef.current = currentDialogue.index
    }
  }, [currentDialogue])

  const handleTogglePlay = () => {
    if (playerState === 1) {
      playerRef.current?.pause()

      return
    }

    hasCommentaryRef.current = false
    endTimeRef.current = 0
    videoControllerRef.current?.stopBlink()

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
    }
  }

  const handleNext = () => {
    const currentIndex = subtitles.findIndex(d => d.index === currentDialogue?.index)
    const nextIndex = currentIndex + 1
    const nextDialogue = subtitles[nextIndex]

    // 다음 다이얼로그가 없음
    if (!nextDialogue) {
      return
    }

    if (playerRef) {
      setCurrentDialogue(nextDialogue)
      playerRef.current?.seekTo(nextDialogue.startTime)
    }
  }

  const handleToggleRepeat = () => {
    setIsRepeatMode(prev => {
      const newValue = !prev
      // ref도 함께 업데이트
      isRepeatModeRef.current = newValue
      return newValue
    })
  }

  const handleDialogueEnded = () => {
    playerRef.current?.pause()

    alert('가이드 종료')
  }

  const handleRepeatMode = (time: number) => {
    const endTime = currentDialogue.endTime

    if (time >= endTime) {
      playerRef.current?.seekTo(currentDialogue.startTime)
      setCurrentDialogue(currentDialogue)
    }
  }

  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // 100ms마다 현재 시간 업데이트 (더 부드러운 추적)
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        const time = playerRef.current.getCurrentTime()

        if (isDialogueEnded(time, subtitles)) {
          handleDialogueEnded()
          return
        }

        const isRepeatMode = isRepeatModeRef.current

        if (isRepeatMode) {
          handleRepeatMode(time)
          return
        }

        const 시간에따른다이얼로그 = subtitles.find(d => {
          return time >= d.startTime && time < d.endTime
        })

        if (!시간에따른다이얼로그) {
          return
        }

        // 현재 다이얼로그와 다를 때만 업데이트
        setCurrentDialogue(시간에따른다이얼로그)
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
    const isPlaying = state === 1

    setPlayerState(state)

    if (isPlaying) {
      startTimeTracking()

      return
    }
    stopTimeTracking()
  }

  if (!videoId) {
    return <div className="p-4">비디오를 찾을 수 없습니다.</div>
  }

  if (isLoadingDialogues) {
    return <div>비디오를 가지고 오는 중입니다.</div>
  }

  return (
    <PageLayout title="">
      <YouTubePlayer
        onStateChange={handleStateChange}
        ref={playerRef}
        videoId={videoId}
        initialTime={0}
      />
      <SubtitleProgressBar current={currentDialogue?.index ?? 0} total={subtitles.length} />
      {/* <MaterialAccordion materials={materials} /> */}

      <div className="p-4">
        <TimerList
          onTimerComplete={() => {
            alert('타이머가 종료되었습니다!')
          }}
        />
      </div>

      {currentDialogue && <VideoSubtitles data={currentDialogue} />}

      <VideoController
        ref={videoControllerRef}
        isPlaying={playerState === 1}
        isRepeatMode={isRepeatMode}
        togglePlay={handleTogglePlay}
        onPrevious={handlePrevious}
        onNext={handleNext}
        toggleRepeat={handleToggleRepeat}
      />
    </PageLayout>
  )
}

const isDialogueEnded = (time: number, subtitles: Subtitle[]) => {
  const lastDialogue = subtitles[subtitles.length - 1]
  return time >= lastDialogue.endTime
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

export default VideoPage
