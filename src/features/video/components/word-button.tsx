import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

type WordButtonProps = {
  word: string
  isWrong: boolean
  isSelected: boolean
  isHint?: boolean
  onClick: () => void
  onHintComplete: () => void
}

/**
 * 개별 단어 버튼 컴포넌트
 *
 * 책임:
 * - 단어 버튼 렌더링
 * - 클릭 이벤트 처리
 * - 오답 시 진동 애니메이션 및 시각적 피드백
 * - 선택된 단어는 회색 영역으로 표시 (레이아웃 유지)
 */
export const WordButton = ({
  word,
  isWrong,
  isSelected,
  isHint = false,
  onClick,
  onHintComplete,
}: WordButtonProps) => {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  // isWrong이 true로 변경될 때 애니메이션 트리거
  useEffect(() => {
    if (isWrong) {
      setShouldAnimate(true)
    }
  }, [isWrong])

  const handleClick = () => {
    if (isWrong || isSelected) return
    onClick()
  }

  // 선택된 단어는 회색 placeholder로 표시
  if (isSelected) {
    return (
      <div
        className={cn(
          'px-4 py-1.5 text-lg font-medium rounded',
          'bg-gray-100 border-1 border-gray-200 text-transparent',
          'shadow-none',
        )}
      >
        {word}
      </div>
    )
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={isWrong}
      className={cn(
        'px-4 py-1.5 text-lg font-medium rounded transition-all',
        'bg-white border-1 border-gray-300 text-gray-900',
        'shadow-md',
        !isWrong && 'cursor-pointer',
        isWrong && 'line-through opacity-50 cursor-not-allowed shadow-none hover:translate-y-0',
      )}
      animate={
        shouldAnimate && isWrong
          ? {
              x: [-10, 10, -10, 10, 0],
              transition: {
                duration: 0.4,
                ease: 'easeInOut',
              },
            }
          : isHint
            ? {
                y: [0, -20, 0],
                transition: {
                  duration: 0.5,
                  repeat: 4,
                  repeatDelay: 0.1,
                  ease: [0.34, 1.56, 0.64, 1],
                  times: [0, 0.4, 1],
                },
              }
            : {}
      }
      onAnimationComplete={() => {
        if (shouldAnimate && isWrong) {
          setShouldAnimate(false)
        }
        if (isHint) {
          onHintComplete()
        }
      }}
    >
      {word}
    </motion.button>
  )
}
