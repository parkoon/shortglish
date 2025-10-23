import { IconPlayerPauseFilled, IconPlayerPlayFilled, IconX } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

// 상수 정의
const CIRCLE_RADIUS = 120
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_RADIUS
const WARNING_TIME_THRESHOLD = 10 // 10초 이하일 때 경고 색상

type TimerOverlayProps = {
  isOpen: boolean
  duration: number // seconds
  onClose: () => void
  onComplete?: () => void
}

export const TimerOverlay = ({ isOpen, duration, onClose, onComplete }: TimerOverlayProps) => {
  const [remainingTime, setRemainingTime] = useState(duration)
  const [isRunning, setIsRunning] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // duration이나 isOpen이 변경되면 타이머 초기화
  useEffect(() => {
    if (isOpen && duration > 0) {
      setRemainingTime(duration)
      setIsRunning(true)
    }
  }, [duration, isOpen])

  // 타이머 로직
  useEffect(() => {
    if (!isRunning || !isOpen) return

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        const newTime = prev - 1

        if (newTime <= 0) {
          clearInterval(interval)
          // 완료 알림음 재생
          audioRef.current?.play().catch(() => {
            // 오디오 재생 실패 시 무시 (사용자 상호작용 필요)
          })
          onComplete?.()
          return 0
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning, isOpen, onComplete])

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleTogglePlay = () => {
    setIsRunning(prev => !prev)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleBackdropTouch = (e: React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const minutes = Math.floor(remainingTime / 60)
  const seconds = remainingTime % 60
  const progress = duration > 0 ? ((duration - remainingTime) / duration) * 100 : 0
  const strokeDashoffset = CIRCLE_CIRCUMFERENCE * (1 - progress / 100)
  const isWarning = remainingTime <= WARNING_TIME_THRESHOLD && remainingTime > 0

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 cursor-default backdrop-blur-sm"
          onClick={handleBackdropClick}
          onMouseDown={handleBackdropClick}
          onTouchStart={handleBackdropTouch}
          role="dialog"
          aria-modal="true"
          aria-labelledby="timer-title"
        >
          {/* 오디오 엘리먼트 */}
          <audio ref={audioRef} src="/assets/ring.mp3" preload="auto" />

          {/* 닫기 버튼 */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 text-white hover:text-gray-300 transition-colors rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="타이머 닫기"
          >
            <IconX className="w-8 h-8" />
          </button>

          {/* 타이머 컨테이너 */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="flex flex-col items-center gap-8 px-4"
            onClick={e => e.stopPropagation()}
          >
            {/* 타이머 제목 (접근성) */}
            <h2 id="timer-title" className="sr-only">
              타이머
            </h2>

            {/* 원형 프로그레스 */}
            <motion.div
              className="relative w-64 h-64"
              animate={isWarning ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 1, repeat: isWarning ? Infinity : 0 }}
            >
              {/* SVG 원형 프로그레스 */}
              <svg className="w-full h-full transform -rotate-90" aria-hidden="true">
                {/* 배경 원 */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={CIRCLE_RADIUS}
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                  opacity="0.2"
                />
                {/* 프로그레스 원 */}
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r={CIRCLE_RADIUS}
                  stroke={isWarning ? '#ef4444' : 'white'}
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={CIRCLE_CIRCUMFERENCE}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-linear"
                  style={{
                    filter: isWarning ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))' : 'none',
                  }}
                />
              </svg>

              {/* 시간 표시 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  className={cn(
                    'text-6xl font-bold tabular-nums',
                    isWarning ? 'text-red-500' : 'text-white',
                  )}
                  animate={isWarning && remainingTime > 0 ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 1, repeat: isWarning ? Infinity : 0 }}
                  role="timer"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </motion.div>
              </div>
            </motion.div>

            {/* 재생/일시정지 버튼 */}
            <motion.button
              onClick={handleTogglePlay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={cn(
                'flex items-center justify-center w-16 h-16 rounded-full transition-all',
                'bg-white/20 hover:bg-white/30 backdrop-blur-sm',
                'focus:outline-none focus:ring-2 focus:ring-white/50',
                'active:bg-white/40',
              )}
              aria-label={isRunning ? '일시정지' : '재생'}
            >
              <AnimatePresence mode="wait">
                {isRunning ? (
                  <motion.div
                    key="pause"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconPlayerPauseFilled className="w-8 h-8 text-white" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="play"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconPlayerPlayFilled className="w-8 h-8 text-white ml-1" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
