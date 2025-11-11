/**
 * 웨이브폼 애니메이션 컴포넌트
 *
 * 음성 폭이 무한히 흘러가는 효과를 제공합니다.
 */

import { motion } from 'framer-motion'
import { useMemo } from 'react'

interface WaveformAnimationProps {
  /**
   * 애니메이션이 활성화되어야 하는지 여부
   */
  isActive: boolean
}

/**
 * 웨이브폼 애니메이션 컴포넌트
 *
 * 여러 개의 세로 바가 위아래로 출렁거리는 효과를 제공합니다.
 */
export const WaveformAnimation = ({ isActive }: WaveformAnimationProps) => {
  // 웨이브폼 바 개수와 각 바의 속성을 메모이제이션
  const bars = useMemo(() => {
    const barCount = 30
    const maxHeight = 16 // 최대 높이 16px
    const minHeight = 4 // 최소 높이 4px
    return Array.from({ length: barCount }, (_, i) => ({
      id: i,
      baseHeight: minHeight + Math.random() * (maxHeight - minHeight), // 4px ~ 16px
      delay: (i / barCount) * 3, // 각 바의 시작 지연
      duration: 1.5 + Math.random() * 1, // 높이 변화 속도
    }))
  }, [])

  if (!isActive) return null

  return (
    <div className="w-full h-8 overflow-hidden relative bg-transparent">
      <div className="flex items-end justify-center gap-0.5 h-full px-2">
        {bars.map(bar => (
          <motion.div
            key={bar.id}
            className="bg-red-500 rounded-full"
            style={{
              width: '4px',
            }}
            animate={{
              height: [
                `${bar.baseHeight * 0.3}px`,
                `${bar.baseHeight}px`,
                `${bar.baseHeight * 0.3}px`,
              ],
            }}
            transition={{
              height: {
                duration: bar.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: bar.delay,
              },
            }}
          />
        ))}
      </div>
    </div>
  )
}
