/**
 * 디버그 활성화 영역
 * 우측 하단 16x16 영역을 연속으로 5번 클릭하면 디버그 모드를 활성화합니다.
 */

import { useEffect, useRef } from 'react'

import { useConsoleLogStore } from '@/stores/console-log-store'

const CLICK_COUNT_THRESHOLD = 5
const AREA_SIZE = 16
const RESET_TIMEOUT = 2000 // 2초 내에 클릭하지 않으면 리셋

export const DebugActivationArea = () => {
  const clickCountRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { isEnabled, setEnabled } = useConsoleLogStore()

  useEffect(() => {
    // 이미 활성화되어 있으면 리스너 추가하지 않음
    if (isEnabled) {
      return
    }

    const handleClick = (e: MouseEvent) => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      // 우측 하단 16x16 영역 체크
      const isInArea =
        e.clientX >= windowWidth - AREA_SIZE &&
        e.clientX <= windowWidth &&
        e.clientY >= windowHeight - AREA_SIZE &&
        e.clientY <= windowHeight

      if (!isInArea) {
        return
      }

      // 기존 타임아웃 클리어
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      clickCountRef.current += 1
      const newCount = clickCountRef.current

      if (newCount >= CLICK_COUNT_THRESHOLD) {
        setEnabled(true)
        clickCountRef.current = 0
        return
      }

      // 2초 후 리셋
      timeoutRef.current = setTimeout(() => {
        clickCountRef.current = 0
      }, RESET_TIMEOUT)
    }

    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
      if (!timeoutRef.current) {
        return
      }
      clearTimeout(timeoutRef.current)
    }
  }, [isEnabled, setEnabled])

  // 활성화 영역 시각적 표시 (개발용, 선택사항)
  if (isEnabled) {
    return null
  }

  return (
    <div
      className="fixed bottom-0 right-0 bg-transparent pointer-events-none"
      style={{
        width: `${AREA_SIZE}px`,
        height: `${AREA_SIZE}px`,
        zIndex: 9999,
      }}
      aria-hidden="true"
    />
  )
}
