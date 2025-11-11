/**
 * 순차적 하이라이트 애니메이션 훅
 *
 * 배열의 각 항목을 순차적으로 하이라이트하는 애니메이션을 제공합니다.
 */

import { useEffect, useState } from 'react'

interface UseSequentialHighlightOptions {
  /**
   * 애니메이션이 활성화되어야 하는 조건
   */
  isActive: boolean
  /**
   * 하이라이트할 항목의 총 개수
   */
  totalItems: number
  /**
   * 각 항목이 하이라이트되는 시간 (밀리초)
   * @default 1500
   */
  interval?: number
}

/**
 * 순차적 하이라이트 애니메이션 훅
 *
 * @param options - 훅 옵션
 * @returns 현재 하이라이트된 인덱스 (null이면 비활성화)
 *
 * @example
 * const highlightedIndex = useSequentialHighlight({
 *   isActive: currentStep === 1,
 *   totalItems: words.length,
 *   interval: 1500
 * })
 */
export const useSequentialHighlight = ({
  isActive,
  totalItems,
  interval = 1500,
}: UseSequentialHighlightOptions): number | null => {
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)

  useEffect(() => {
    if (!isActive) {
      setHighlightedIndex(null)
      return
    }

    // 첫 번째 항목부터 시작
    setHighlightedIndex(0)

    const intervalId = setInterval(() => {
      setHighlightedIndex(prev => {
        if (prev === null) return 0
        const next = (prev + 1) % totalItems
        return next
      })
    }, interval)

    return () => clearInterval(intervalId)
  }, [isActive, totalItems, interval])

  return highlightedIndex
}
