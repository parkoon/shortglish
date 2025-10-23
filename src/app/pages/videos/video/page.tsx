import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { PageLayout } from '@/components/layouts/page-layout'
import { VideoController, type VideoControllerRef } from '@/components/video-controller'
import { VideoSubtitles } from '@/components/video-subtitles'
import { YouTubePlayer, type YouTubePlayerRef } from '@/features/video/components/youtube-player'
import type { Subtitle } from '@/features/video/types'

import { SubtitleProgressBar } from './_components/subtitle-progress-bar'

const VideoPage = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [isLoadingDialogues, setIsLoadingDialogues] = useState(true)
  const [currentDialogue, setCurrentDialogue] = useState<Subtitle | null>(null)
  console.log('🚀 ~ VideoPage ~ currentDialogue:', currentDialogue)

  const playerRef = useRef<YouTubePlayerRef>(null)
  const videoControllerRef = useRef<VideoControllerRef>(null)

  const [playerState, setPlayerState] = useState(-1)

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

  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // 100ms마다 현재 시간 업데이트 (더 부드러운 추적)
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return

      const time = playerRef.current.getCurrentTime()
      const activeDialogue = currentDialogueRef.current

      // 케이스 1: 대사가 없을 때 - 현재 시간에 맞는 대사 찾아서 설정
      if (!activeDialogue) {
        const foundDialogue = subtitles.find(d => {
          return time >= d.startTime && time < d.endTime
        })

        if (foundDialogue) {
          setCurrentDialogue(foundDialogue)
        }
        return
      }

      // 케이스 2: 대사가 있을 때 - 끝났는지만 체크
      if (time >= activeDialogue.endTime) {
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

      {currentDialogue ? (
        <VideoSubtitles data={currentDialogue} />
      ) : (
        <div className="p-4 text-center text-gray-500">재생할 대사가 없어요~</div>
      )}

      <VideoController
        ref={videoControllerRef}
        onRepeat={handleRepeat}
        onPrevious={handlePrevious}
        onNext={handleNext}
        canRepeat={!!currentDialogue}
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

export default VideoPage
