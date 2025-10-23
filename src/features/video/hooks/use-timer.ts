import { useCallback, useEffect, useRef, useState } from 'react'

export type Timer = {
  id: string
  duration: number // seconds
}

export type TimerState = {
  timerId: string | null
  remainingTime: number // seconds
  isRunning: boolean
}

type UseTimerOptions = {
  onComplete?: () => void
}

export const useTimer = (options?: UseTimerOptions) => {
  const [timerState, setTimerState] = useState<TimerState>({
    timerId: null,
    remainingTime: 0,
    isRunning: false,
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const initialDurationRef = useRef<number>(0)
  const onCompleteRef = useRef(options?.onComplete)

  // onComplete 업데이트
  useEffect(() => {
    onCompleteRef.current = options?.onComplete
  }, [options?.onComplete])

  // 타이머 시작
  const startTimer = useCallback((timerId: string, duration: number) => {
    // 기존 타이머가 있다면 리셋
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    // 초기 duration 저장
    initialDurationRef.current = duration

    // 새 타이머 설정
    setTimerState({
      timerId,
      remainingTime: duration,
      isRunning: true,
    })
  }, [])

  // 타이머 일시정지
  const pauseTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setTimerState(prev => ({
      ...prev,
      isRunning: false,
    }))
  }, [])

  // 타이머 재개
  const resumeTimer = useCallback(() => {
    setTimerState(prev => ({
      ...prev,
      isRunning: true,
    }))
  }, [])

  // 타이머 리셋
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setTimerState({
      timerId: null,
      remainingTime: 0,
      isRunning: false,
    })
    initialDurationRef.current = 0
  }, [])

  // 타이머 로직 실행
  useEffect(() => {
    if (!timerState.isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // 이미 interval이 실행 중이면 새로 생성하지 않음
    if (intervalRef.current) {
      return
    }

    intervalRef.current = setInterval(() => {
      setTimerState(prev => {
        const newRemainingTime = prev.remainingTime - 1

        // 타이머 종료
        if (newRemainingTime <= 0) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
            intervalRef.current = null
          }

          // 타이머 종료 콜백 실행
          if (onCompleteRef.current) {
            onCompleteRef.current()
          }

          return {
            timerId: null,
            remainingTime: 0,
            isRunning: false,
          }
        }

        return {
          ...prev,
          remainingTime: newRemainingTime,
        }
      })
    }, 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [timerState.isRunning])

  return {
    timerState,
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer,
  }
}
