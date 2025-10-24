import {
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconRepeat,
  IconWand,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { forwardRef, useImperativeHandle, useState } from 'react'

import { usePrimaryColor } from '@/hooks/use-primary-color'
import { cn } from '@/lib/utils'

type VideoControllerProps = {
  onPrevious: () => void
  onNext: () => void
  onRepeat: () => void
  onHint: () => void
  canRepeat: boolean
  canNext?: boolean
  canPrevious?: boolean
  canHint?: boolean
}

export type VideoControllerRef = {
  startBlink: () => void
  stopBlink: () => void
}

export const VideoController = forwardRef<VideoControllerRef, VideoControllerProps>(
  (
    {
      onRepeat,
      onPrevious,
      onNext,
      onHint,
      canRepeat,
      canNext = true,
      canPrevious = true,
      canHint = true,
    },
    ref,
  ) => {
    const [isBlinking, setIsBlinking] = useState(false)
    const primaryColor = usePrimaryColor()

    useImperativeHandle(ref, () => ({
      startBlink: () => setIsBlinking(true),
      stopBlink: () => setIsBlinking(false),
    }))

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 max-w-[640px] mx-auto">
        <div className="relative flex items-center justify-between py-2 px-4 h-[46px]">
          {/* 힌트 버튼 (왼쪽) */}
          <div />

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
            <button
              onClick={onPrevious}
              disabled={!canPrevious}
              className={cn('p-2', !canPrevious && 'opacity-50 cursor-not-allowed')}
            >
              <IconPlayerSkipBackFilled />
            </button>

            <button
              onClick={onRepeat}
              className={cn('p-2', !canRepeat && 'opacity-50 pointer-events-none')}
            >
              <IconRepeat />
            </button>

            <motion.button
              onClick={onNext}
              disabled={!canNext}
              className={cn('p-2', !canNext && 'opacity-50 cursor-not-allowed')}
              animate={
                isBlinking && canNext
                  ? {
                      color: ['#000', primaryColor, '#000'],
                    }
                  : {
                      color: '#000',
                    }
              }
              transition={
                isBlinking && canNext
                  ? {
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : { duration: 0.2 }
              }
            >
              <IconPlayerSkipForwardFilled />
            </motion.button>
          </div>

          <button
            onClick={onHint}
            disabled={!canHint}
            className={cn('p-2 text-amber-400', !canHint && 'opacity-50 cursor-not-allowed')}
            title="힌트"
          >
            <IconWand />
          </button>
        </div>
      </div>
    )
  },
)

VideoController.displayName = 'VideoController'
