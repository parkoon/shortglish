/**
 * 녹음 및 재생 로직을 관리하는 커스텀 훅
 *
 * 단일책임 원칙에 따라 녹음과 재생 로직을 분리하여 관리합니다.
 */

import { useCallback, useEffect, useRef, useState } from 'react'

type RecordStatus = 'idle' | 'recording' | 'recorded'

interface UseRecordingReturn {
  status: RecordStatus
  durationMs: number
  audioUrl: string | null
  getAudioStream: () => MediaStream | null
  startRecording: () => Promise<void>
  stopRecording: () => void
  cleanup: () => void
}

/**
 * 녹음 로직을 관리하는 커스텀 훅
 */
export const useRecording = (onRecordComplete?: () => void): UseRecordingReturn => {
  const [status, setStatus] = useState<RecordStatus>('idle')
  const [durationMs, setDurationMs] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)

  /**
   * 기존 녹음 리소스 정리
   */
  const cleanupPreviousRecording = useCallback((previousAudioUrl: string | null) => {
    if (previousAudioUrl) {
      URL.revokeObjectURL(previousAudioUrl)
    }
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach(track => track.stop())
      audioStreamRef.current = null
    }
  }, [])

  /**
   * MediaRecorder 설정
   */
  const setupMediaRecorder = useCallback((stream: MediaStream) => {
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
      audioStreamRef.current = null
    }
  }, [])

  /**
   * 녹음 시작
   */
  const startRecording = useCallback(async () => {
    // 기존 오디오 URL 정리
    cleanupPreviousRecording(audioUrl)
    setAudioUrl(null)

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreamRef.current = stream
      setupMediaRecorder(stream)

      mediaRecorderRef.current?.start()
      startTimeRef.current = Date.now()
      setStatus('recording')
    } catch (error) {
      console.error('녹음 시작 실패:', error)
      throw new Error('마이크 권한이 필요합니다.')
    }
  }, [audioUrl, cleanupPreviousRecording, setupMediaRecorder])

  /**
   * 녹음 중지
   */
  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current) return
    if (mediaRecorderRef.current.state === 'inactive') return

    mediaRecorderRef.current.stop()
    const duration = Date.now() - startTimeRef.current
    setDurationMs(duration)
    setStatus('recorded')
    onRecordComplete?.()
  }, [onRecordComplete])

  /**
   * 리소스 정리
   */
  const cleanup = useCallback(() => {
    cleanupPreviousRecording(audioUrl)
    setAudioUrl(null)
  }, [audioUrl, cleanupPreviousRecording])

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      cleanupPreviousRecording(audioUrl)
    }
  }, [audioUrl, cleanupPreviousRecording])

  /**
   * 현재 오디오 스트림을 가져오는 getter 함수
   * recording 상태일 때만 유효한 스트림을 반환합니다.
   */
  const getAudioStream = useCallback(() => {
    return audioStreamRef.current
  }, [])

  return {
    status,
    durationMs,
    audioUrl,
    getAudioStream,
    startRecording,
    stopRecording,
    cleanup,
  }
}

interface UsePlaybackReturn {
  isPlaying: boolean
  playbackProgress: number
  playPause: () => void
  stop: () => void
  audioRef: React.RefObject<HTMLAudioElement | null>
}

/**
 * 재생 로직을 관리하는 커스텀 훅
 */
export const usePlayback = (audioUrl: string | null): UsePlaybackReturn => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackProgress, setPlaybackProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  /**
   * 재생/정지 토글
   */
  const playPause = useCallback(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(error => {
        console.error('재생 실패:', error)
      })
    }
  }, [audioUrl, isPlaying])

  /**
   * 재생 정지
   */
  const stop = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    audio.currentTime = 0
    setIsPlaying(false)
    setPlaybackProgress(0)
  }, [])

  // 오디오 이벤트 리스너 설정
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audioUrl) return

    const handleTimeUpdate = () => {
      if (audio.duration && audio.duration > 0) {
        const progress = audio.currentTime / audio.duration
        setPlaybackProgress(progress)
      }
    }

    const handlePlay = () => {
      setIsPlaying(true)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [audioUrl])

  return {
    isPlaying,
    playbackProgress,
    playPause,
    stop,
    audioRef,
  }
}
