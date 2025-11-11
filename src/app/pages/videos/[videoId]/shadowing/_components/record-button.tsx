/**
 * 녹음 버튼 컴포넌트
 *
 * 3가지 상태를 가집니다:
 * 1. idle: 녹음 전 (버튼만 표시)
 * 2. recording: 녹음 중 (웨이브폼 애니메이션 + 녹음 버튼)
 * 3. recorded: 녹음 후 (진행 바 + 시간 표시 + 재생 버튼)
 */

import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'

import { MotionButton } from '@/components/ui/motion-button'

import { DurationDisplay } from './_sub-components/duration-display'
import { ProgressBar } from './_sub-components/progress-bar'
import { WaveformAnimation } from './_sub-components/waveform-animation'

type RecordStatus = 'idle' | 'recording' | 'recorded'

interface RecordButtonProps {
  /**
   * 녹음 완료 시 호출되는 콜백
   */
  onRecordComplete?: () => void
}

/**
 * 녹음 버튼 컴포넌트
 */
export const RecordButton = ({ onRecordComplete }: RecordButtonProps) => {
  const [status, setStatus] = useState<RecordStatus>('idle')
  const [durationMs, setDurationMs] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // 녹음 시작
  const handleStartRecording = async () => {
    // 재생 중이면 정지
    if (audioRef.current && isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    }

    // 기존 오디오 URL 정리
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
      setAudioUrl(null)
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(audioBlob)
        setAudioUrl(url)

        // 스트림 정리
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      startTimeRef.current = Date.now()
      setStatus('recording')
    } catch (error) {
      console.error('녹음 시작 실패:', error)
      alert('마이크 권한이 필요합니다.')
    }
  }

  // 녹음 중지
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      const duration = Date.now() - startTimeRef.current
      setDurationMs(duration)
      setStatus('recorded')
      onRecordComplete?.()
    }
  }

  // 재생/정지 토글
  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  // 오디오 이벤트 핸들러
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => {
      setIsPlaying(false)
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [audioUrl])

  // 정리
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [audioUrl])

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 웨이브폼 애니메이션 또는 진행 바 */}
      <div className="w-full">
        {status === 'recording' ? (
          <WaveformAnimation isActive={true} />
        ) : status === 'recorded' ? (
          <ProgressBar progress={1} />
        ) : null}
      </div>

      {/* 녹음 후 시간 표시 */}
      {status === 'recorded' && <DurationDisplay durationMs={durationMs} />}

      {/* 버튼 영역 */}
      <div className="flex items-center justify-center gap-4">
        {/* 녹음 버튼 */}
        {status === 'idle' && (
          <MotionButton
            onClick={handleStartRecording}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-white border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
          >
            <div className="w-6 h-6 bg-red-500 rounded-full" />
          </MotionButton>
        )}

        {status === 'recording' && (
          <MotionButton
            onClick={handleStopRecording}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-red-500 border-2 border-gray-300 flex items-center justify-center"
          >
            <div className="w-6 h-6 bg-white rounded-sm" />
          </MotionButton>
        )}

        {/* 녹음 후: 녹음 버튼 + 재생/정지 버튼 */}
        {status === 'recorded' && (
          <>
            <MotionButton
              onClick={handleStartRecording}
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 rounded-full bg-white border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
            >
              <div className="w-6 h-6 bg-red-500 rounded-full" />
            </MotionButton>
            <MotionButton
              onClick={handlePlayPause}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
            >
              {isPlaying ? (
                <IconPlayerPause size={16} className="text-gray-700" />
              ) : (
                <IconPlayerPlay size={16} className="text-gray-700 ml-0.5" />
              )}
            </MotionButton>
            {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" />}
          </>
        )}
      </div>
    </div>
  )
}
