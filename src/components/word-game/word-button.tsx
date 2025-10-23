import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

type WordButtonProps = {
  word: string
  isWrong: boolean
  onClick: () => void
}

/**
 * 개별 단어 버튼 컴포넌트
 *
 * 책임:
 * - 단어 버튼 렌더링
 * - 클릭 이벤트 처리
 * - 오답 시 진동 애니메이션 및 시각적 피드백
 */
export const WordButton = ({ word, isWrong, onClick }: WordButtonProps) => {
  const [shouldAnimate, setShouldAnimate] = useState(false)

  // isWrong이 true로 변경될 때 애니메이션 트리거
  useEffect(() => {
    if (isWrong) {
      setShouldAnimate(true)
    }
  }, [isWrong])

  const handleClick = () => {
    if (isWrong) return
    onClick()
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={isWrong}
      className={cn(
        'px-4 py-3 text-lg font-medium rounded-lg transition-all',
        'bg-white border-2 border-gray-300 text-gray-900',
        'hover:bg-gray-50 active:scale-95',
        'shadow-sm',
        !isWrong && 'cursor-pointer',
        isWrong && 'line-through opacity-50 cursor-not-allowed shadow-none',
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
          : {}
      }
      onAnimationComplete={() => setShouldAnimate(false)}
    >
      {word}
    </motion.button>
  )
}
