/**
 * 웨이브폼 애니메이션 컴포넌트
 *
 * 실제 음성 입력에 반응하여 웨이브폼을 표시합니다.
 */

import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

// 상수 정의
const BAR_COUNT = 30
const MAX_HEIGHT = 16 // 최대 높이 16px
const MIN_HEIGHT = 4 // 최소 높이 4px

interface WaveformAnimationProps {
  /**
   * 애니메이션이 활성화되어야 하는지 여부
   */
  isActive: boolean
  /**
   * 오디오 스트림 (실제 음성 입력)
   */
  audioStream?: MediaStream | null
}

/**
 * 웨이브폼 애니메이션 컴포넌트
 *
 * 실제 음성 입력에 반응하여 웨이브폼을 표시합니다.
 */
export const WaveformAnimation = ({ isActive, audioStream }: WaveformAnimationProps) => {
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const [barHeights, setBarHeights] = useState<number[]>(
    Array.from({ length: BAR_COUNT }, () => MIN_HEIGHT),
  )

  // AudioContext 및 AnalyserNode 설정
  useEffect(() => {
    if (!isActive || !audioStream) {
      // 스트림이 없으면 기본 애니메이션
      const interval = setInterval(() => {
        setBarHeights(
          Array.from({ length: BAR_COUNT }, () => {
            const baseHeight = MIN_HEIGHT + Math.random() * (MAX_HEIGHT - MIN_HEIGHT)
            return baseHeight * (0.3 + Math.random() * 0.7)
          }),
        )
      }, 100)
      return () => clearInterval(interval)
    }

    // AudioContext 생성
    const AudioContextClass =
      window.AudioContext ||
      (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) {
      console.error('AudioContext를 지원하지 않습니다.')
      return
    }

    const audioContext = new AudioContextClass()
    const analyser = audioContext.createAnalyser()
    const source = audioContext.createMediaStreamSource(audioStream)

    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.8
    source.connect(analyser)

    audioContextRef.current = audioContext
    analyserRef.current = analyser

    // 오디오 레벨 업데이트
    const updateWaveform = () => {
      if (!analyserRef.current) return

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
      analyserRef.current.getByteFrequencyData(dataArray)

      // 주파수 데이터를 바 개수로 나누어 각 바의 높이 계산
      const newHeights = Array.from({ length: BAR_COUNT }, (_, i) => {
        const dataIndex = Math.floor((i / BAR_COUNT) * dataArray.length)
        const value = dataArray[dataIndex] || 0
        // 0-255 값을 4-16px로 변환
        const height = MIN_HEIGHT + (value / 255) * (MAX_HEIGHT - MIN_HEIGHT)
        return Math.max(MIN_HEIGHT, height)
      })

      setBarHeights(newHeights)
      animationFrameRef.current = requestAnimationFrame(updateWaveform)
    }

    updateWaveform()

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [isActive, audioStream])

  if (!isActive) return null

  return (
    <div className="w-full h-8 overflow-hidden relative bg-transparent">
      <div className="flex items-end justify-center gap-0.5 h-full px-2">
        {barHeights.map((height, index) => (
          <motion.div
            key={index}
            className="bg-red-500 rounded-full"
            style={{
              width: '4px',
            }}
            animate={{
              height: `${height}px`,
            }}
            transition={{
              duration: 0.1,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}
