/**
 * 녹음 버튼 컴포넌트
 *
 * 3가지 상태를 가집니다:
 * 1. idle: 녹음 전 (버튼만 표시)
 * 2. recording: 녹음 중 (웨이브폼 애니메이션 + 정지 버튼)
 * 3. recorded: 녹음 후 (진행 바 + 시간 표시 + 재생/정지 버튼 + 다시 녹음 버튼)
 */

import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'
import { useState } from 'react'

import { MotionButton } from '@/components/ui/motion-button'

import { DurationDisplay } from './duration-display'
import { ProgressBar } from './progress-bar'
import { usePlayback, useRecording } from './use-record-audio'
import { WaveformAnimation } from './waveform-animation'

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const {
    status,
    durationMs,
    audioUrl,
    getAudioStream,
    startRecording: startRecordingHook,
    stopRecording,
    cleanup,
  } = useRecording(onRecordComplete)

  const { isPlaying, playbackProgress, playPause, stop, audioRef } = usePlayback(audioUrl)

  /**
   * 녹음 시작 핸들러
   * 재생 중이면 먼저 정지하고 녹음을 시작합니다.
   */
  const handleStartRecording = async () => {
    // 재생 중이면 정지
    if (isPlaying) {
      stop()
    }

    // 기존 녹음 정리
    cleanup()

    try {
      await startRecordingHook()
      setErrorMessage(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : '마이크 권한이 필요합니다.'
      setErrorMessage(message)
      console.error('녹음 시작 실패:', error)
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* 에러 메시지 */}
      {errorMessage && (
        <div className="text-sm text-red-500 text-center px-4 py-2 bg-red-50 rounded-md">
          {errorMessage}
        </div>
      )}

      {/* 웨이브폼 애니메이션 또는 진행 바 */}
      <div className="w-full">
        {status === 'recording' && (
          <WaveformAnimation isActive={true} audioStream={getAudioStream()} />
        )}
        {status === 'recorded' && <ProgressBar progress={playbackProgress} />}
      </div>

      {/* 녹음 후 시간 표시 */}
      {status === 'recorded' && <DurationDisplay durationMs={durationMs} />}

      {/* 버튼 영역 */}
      <div className="flex items-center justify-center gap-4">
        {/* idle 상태: 녹음 버튼 */}
        {status === 'idle' && (
          <MotionButton
            onClick={handleStartRecording}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-white border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
          >
            <div className="w-6 h-6 bg-red-500 rounded-full" />
          </MotionButton>
        )}

        {/* recording 상태: 정지 버튼 */}
        {status === 'recording' && (
          <MotionButton
            onClick={stopRecording}
            whileTap={{ scale: 0.9 }}
            className="w-16 h-16 rounded-full bg-red-500 border-2 border-gray-300 flex items-center justify-center"
          >
            <div className="w-6 h-6 bg-white rounded-sm" />
          </MotionButton>
        )}

        {/* recorded 상태: 다시 녹음 버튼 + 재생/정지 버튼 */}
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
              onClick={playPause}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-white border-2 border-gray-300 hover:border-gray-400 flex items-center justify-center"
            >
              {isPlaying ? (
                <IconPlayerPause size={16} className="text-gray-700" />
              ) : (
                <IconPlayerPlay size={16} className="text-gray-700 ml-0.5" />
              )}
            </MotionButton>
          </>
        )}
      </div>

      {/* 오디오 요소: audioUrl이 있을 때만 렌더링 */}
      {audioUrl && <audio ref={audioRef} src={audioUrl} className="hidden" preload="metadata" />}
    </div>
  )
}
