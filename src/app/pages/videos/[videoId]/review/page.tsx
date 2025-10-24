import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import { PageLayout } from '@/components/layouts/page-layout'
import { type VideoControllerRef } from '@/components/video-controller'
import {
  YOUTUBE_PLAYER_STATE,
  YouTubePlayer,
  type YouTubePlayerRef,
} from '@/features/video/components/youtube-player'
import type { Subtitle } from '@/features/video/types'

import { FullDialogue } from './_components/full-dialogue'

const VideoPage = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [isLoadingDialogues, setIsLoadingDialogues] = useState(true)
  const [currentDialogue, setCurrentDialogue] = useState<Subtitle | null>(null)

  const playerRef = useRef<YouTubePlayerRef>(null)
  const videoControllerRef = useRef<VideoControllerRef>(null)

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

  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // 100ms마다 현재 시간 업데이트 (더 부드러운 추적)
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return

      const time = playerRef.current.getCurrentTime()

      const 시간에따른다이얼로그 = subtitles.find(d => {
        return time >= d.startTime && time < d.endTime
      })

      if (!시간에따른다이얼로그) {
        return
      }
      setCurrentDialogue(시간에따른다이얼로그)
      console.log('🚀 ~ startTimeTracking ~ 시간에따른다이얼로그:', 시간에따른다이얼로그)

      // // 케이스 1: 대사가 없을 때 (첫 지점) - 현재 시간에 맞는 대사 찾아서 설정
      // if (!activeDialogue) {
      //   const foundDialogue = getCurrentDialogue(subtitles, time)

      //   if (foundDialogue) {
      //     setCurrentDialogue(foundDialogue)
      //   }
      //   return
      // }

      // const isEnded = time >= activeDialogue.endTime

      // // 케이스 3: 대사가 없을 때 - 끝났는지만 체크
      // if (isEnded && activeDialogue.text === '') {
      //   const foundDialogue = getCurrentDialogue(subtitles, time)

      //   if (foundDialogue) {
      //     setCurrentDialogue(foundDialogue)
      //   }

      //   return
      // }

      // // 케이스 2: 대사가 있을 때 - 끝났는지만 체크
      // if (isEnded) {
      //   playerRef.current.pause()
      //   playerRef.current.seekTo(activeDialogue.startTime)
      // }
    }, 100)
  }

  const stopTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleStateChange = (state: number) => {
    console.log('🚀 ~ handleStateChange ~ state:', state)

    if (state === YOUTUBE_PLAYER_STATE.ENDED) {
      alert('비디오 종료')
      return
    }

    if (state === YOUTUBE_PLAYER_STATE.PLAYING) {
      startTimeTracking()
      return
    }

    stopTimeTracking()
  }

  const handleDialogueRepeat = (dialogue: Subtitle) => {
    console.log(dialogue)
    // playerRef.current?.seekTo(dialogue.startTime)
    // playerRef.current?.play()
  }

  if (!videoId) {
    return <div className="p-4">비디오를 찾을 수 없습니다.</div>
  }

  if (isLoadingDialogues) {
    return <div>비디오를 가지고 오는 중입니다.</div>
  }

  return (
    <PageLayout title="">
      {/* Sticky YouTube Player */}
      <div className="sticky top-[52px] z-50 shadow-sm">
        <YouTubePlayer
          onStateChange={handleStateChange}
          ref={playerRef}
          videoId={videoId}
          initialTime={0}
          autoPlay
        />
      </div>

      {/* Scrollable Dialogue List */}
      <FullDialogue
        dialogues={subtitles}
        currentDialogue={currentDialogue}
        onRepeat={handleDialogueRepeat}
      />

      {/* <VideoController
        ref={videoControllerRef}
        isPlaying={playerState === 1}
        isRepeatMode={isRepeatMode}
        togglePlay={handleTogglePlay}
        onPrevious={handlePrevious}
        onNext={handleNext}
        toggleRepeat={handleToggleRepeat}
      /> */}
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
