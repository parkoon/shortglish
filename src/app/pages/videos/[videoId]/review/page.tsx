import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { PageLayout } from '@/components/layouts/page-layout'
import { paths } from '@/config/paths'
import {
  YOUTUBE_PLAYER_STATE,
  YouTubePlayer,
  type YouTubePlayerRef,
} from '@/features/video/components/youtube-player'
import type { Subtitle } from '@/features/video/types'
import { useGlobalModal } from '@/stores/modal-store'

import { FullDialogue } from './_components/full-dialogue'

const VideoPage = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const modal = useGlobalModal()
  const navigate = useNavigate()

  const [subtitles, setSubtitles] = useState<Subtitle[]>([])
  const [isLoadingDialogues, setIsLoadingDialogues] = useState(true)
  const [currentDialogue, setCurrentDialogue] = useState<Subtitle | null>(null)
  const [repeatDialogue, setRepeatDialogue] = useState<Subtitle | null>(null)

  const playerRef = useRef<YouTubePlayerRef>(null)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentDialogueRef = useRef(currentDialogue)
  const repeatDialogueRef = useRef(repeatDialogue)

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

  useEffect(() => {
    repeatDialogueRef.current = repeatDialogue
  }, [repeatDialogue])

  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // 100ms마다 현재 시간 업데이트 (더 부드러운 추적)
    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return

      const time = playerRef.current.getCurrentTime()

      const isInRepeatMode = repeatDialogueRef.current !== null

      if (isInRepeatMode && time >= repeatDialogueRef.current!.endTime!) {
        // Loop back to start
        playerRef.current?.seekTo(repeatDialogueRef.current!.startTime)
        return
      }

      const 시간에따른다이얼로그 = subtitles.find(d => {
        return time >= d.startTime && time < d.endTime
      })

      if (!시간에따른다이얼로그) {
        return
      }
      setCurrentDialogue(시간에따른다이얼로그)
    }, 100)
  }

  const stopTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleStateChange = (state: number) => {
    if (state === YOUTUBE_PLAYER_STATE.ENDED) {
      modal.open({
        title: '복습 완료',
        description: '복습을 완료했어요!',
        okText: '다시보기',
        cancelText: '홈으로',
        onCancel: () => {
          navigate(paths.home.root.getHref())
        },
        onOk: () => {
          playerRef.current?.seekTo(0)
          playerRef.current?.play()
          startTimeTracking()
        },
      })
      stopTimeTracking()
      return
    }

    if (state === YOUTUBE_PLAYER_STATE.PLAYING) {
      startTimeTracking()
      return
    }

    stopTimeTracking()
  }

  const handleDialogueRepeat = (dialogue: Subtitle) => {
    // Toggle: if same dialogue clicked, turn off; otherwise, set to this dialogue
    setRepeatDialogue(prev => (prev === dialogue ? null : dialogue))
    setCurrentDialogue(dialogue)

    // Start playback from the dialogue's start
    playerRef.current?.seekTo(dialogue.startTime)
    playerRef.current?.play()
  }

  if (!videoId) {
    return <div className="p-4">비디오를 찾을 수 없습니다.</div>
  }

  if (isLoadingDialogues) {
    return <div>비디오를 가지고 오는 중입니다.</div>
  }

  return (
    <PageLayout title="">
      <div className="sticky top-[52px] z-50 shadow-sm">
        <YouTubePlayer
          onStateChange={handleStateChange}
          ref={playerRef}
          videoId={videoId}
          initialTime={0}
          autoPlay
        />
      </div>

      <FullDialogue
        dialogues={subtitles}
        currentDialogue={currentDialogue}
        repeatDialogueIndex={repeatDialogue?.index}
        onRepeat={handleDialogueRepeat}
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
