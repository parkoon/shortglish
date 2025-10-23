import {
  IconClock,
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlus,
} from '@tabler/icons-react'
import { useRef, useState } from 'react'

import { TimePickerBottomSheet } from '@/components/time-picker-bottom-sheet'
import { cn } from '@/lib/utils'

import { type Timer, useTimer } from '../hooks/use-timer'

const DEFAULT_TIMERS: Timer[] = []

type TimerListProps = {
  onTimerComplete?: () => void
}

export const TimerList = ({ onTimerComplete }: TimerListProps) => {
  const [timers, setTimers] = useState<Timer[]>(DEFAULT_TIMERS)
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false)
  const { timerState, startTimer, pauseTimer, resumeTimer, resetTimer } = useTimer({
    onComplete: onTimerComplete,
  })
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleTimerClick = (timer: Timer) => {
    const isCurrentTimer = timerState.timerId === timer.id

    // 현재 타이머를 클릭한 경우 - 토글
    if (isCurrentTimer) {
      if (timerState.isRunning) {
        pauseTimer()
      } else {
        resumeTimer()
      }
      return
    }

    // 다른 타이머 시작
    startTimer(timer.id, timer.duration)
  }

  const handleLongPressStart = (timer: Timer) => {
    longPressTimer.current = setTimeout(() => {
      // 길게 누르면 리셋
      if (timerState.timerId === timer.id) {
        resetTimer()
      }
    }, 800) // 800ms 길게 누르기
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handleAddTimer = () => {
    setIsTimePickerOpen(true)
  }

  const handleTimePickerConfirm = (minutes: number, seconds: number) => {
    const totalSeconds = minutes * 60 + seconds

    const newTimer: Timer = {
      id: Date.now().toString(),
      duration: totalSeconds,
    }

    setTimers([...timers, newTimer])
    setIsTimePickerOpen(false)
  }

  const handleTimePickerClose = () => {
    setIsTimePickerOpen(false)
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const isTimerRunning = timerState.isRunning

  return (
    <>
      <div className="flex gap-2 items-center">
        {/* + 버튼 고정 */}
        <button
          onClick={handleAddTimer}
          disabled={isTimerRunning}
          className={cn(
            '  flex-shrink-0 flex gap-1 items-center justify-center px-3 h-8 rounded-full transition-colors border border-gray-300 border-dashed',
            isTimerRunning
              ? 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed'
              : ' text-gray-600',
          )}
          aria-label="타이머 추가"
        >
          <IconPlus className="w-4 h-4" />
          <span className="text-sm font-semibold">타이머</span>
        </button>

        {/* 타이머 버튼 스크롤 영역 */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {timers.map(timer => {
            const isActive = timerState.timerId === timer.id
            const isDisabled = isTimerRunning && !isActive
            const displayTime = isActive ? timerState.remainingTime : timer.duration

            return (
              <button
                key={timer.id}
                onClick={() => handleTimerClick(timer)}
                onMouseDown={() => handleLongPressStart(timer)}
                onMouseUp={handleLongPressEnd}
                onMouseLeave={handleLongPressEnd}
                onTouchStart={() => handleLongPressStart(timer)}
                onTouchEnd={handleLongPressEnd}
                disabled={isDisabled}
                className={cn(
                  'flex-shrink-0 px-3 h-8 rounded-full transition-all border border-gray-300',
                  isActive
                    ? 'bg-orange-400 border-orange-400 text-white '
                    : isDisabled
                      ? 'bg-gray-100 text-gray-400 opacity-50 cursor-not-allowed'
                      : 'text-gray-700 ',
                )}
              >
                <div className="flex items-center gap-1">
                  {isActive ? (
                    timerState.isRunning ? (
                      <IconPlayerPauseFilled className="w-5 h-5" />
                    ) : (
                      <IconPlayerPlayFilled className="w-5 h-5" />
                    )
                  ) : (
                    <IconClock className="w-5 h-5 text-orange-500" />
                  )}
                  <span className="text-sm font-semibold">{formatTime(displayTime)}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <TimePickerBottomSheet
        open={isTimePickerOpen}
        onClose={handleTimePickerClose}
        onConfirm={handleTimePickerConfirm}
        initialMinutes={0}
        initialSeconds={30}
      />
    </>
  )
}
