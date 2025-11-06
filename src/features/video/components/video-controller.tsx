import {
  IconBrandSpeedtest,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconReload,
  IconWand,
} from '@tabler/icons-react'
import { forwardRef, useImperativeHandle, useState } from 'react'

import { MotionButton } from '@/components/ui/motion-button'
import { MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { usePrimaryColor } from '@/hooks/use-primary-color'
import { cn } from '@/lib/utils'

type VideoControllerProps = {
  canRepeat: boolean
  canNext?: boolean
  canPrevious?: boolean
  canHint?: boolean
  currentSpeed: number
  onPrevious: () => void
  onNext: () => void
  onRepeat: () => void
  onHint: () => void
  onSpeed: () => void
}

export type VideoControllerRef = {
  startBlink: () => void
  stopBlink: () => void
}

export const VideoController = forwardRef<VideoControllerRef, VideoControllerProps>(
  (
    {
      canRepeat,
      canNext = true,
      canPrevious = true,
      canHint = true,
      currentSpeed,
      onRepeat,
      onPrevious,
      onNext,
      onHint,
      onSpeed,
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
      <div
        className="fixed bottom-0 left-0 right-0 bg-red mx-auto p-4 bg-white"
        style={{ maxWidth: MAX_APP_SCREEN_WIDTH }}
      >
        <div className="relative flex items-center justify-between">
          {/* 힌트 버튼 (왼쪽) */}
          <MotionButton onClick={onSpeed} className="p-2">
            <div className="flex items-center flex-col">
              <IconBrandSpeedtest strokeWidth={1.5} />
              <span className="text-xs -mb-2 -mt-1 font-semibold">{currentSpeed}x</span>
            </div>
          </MotionButton>

          <div className="flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
            <MotionButton
              onClick={onPrevious}
              disabled={!canPrevious}
              className={cn('p-2', !canPrevious && 'opacity-30 cursor-not-allowed')}
            >
              <IconPlayerSkipBackFilled />
            </MotionButton>

            <MotionButton
              onClick={onRepeat}
              disabled={!canRepeat}
              className={cn(
                'p-2 px-5 border bg-white rounded-2xl text-primary',
                !canRepeat && 'opacity-30 pointer-events-none',
              )}
            >
              <IconReload />
            </MotionButton>

            <MotionButton
              onClick={onNext}
              disabled={!canNext}
              className={cn('p-2', !canNext && 'opacity-30 cursor-not-allowed')}
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
                  : { duration: 0.1 }
              }
            >
              <IconPlayerSkipForwardFilled />
            </MotionButton>
          </div>

          <MotionButton
            onClick={onHint}
            disabled={!canHint}
            className={cn('p-2', !canHint && 'opacity-30 cursor-not-allowed')}
            title="힌트"
          >
            <IconWand strokeWidth={1.5} />
          </MotionButton>
        </div>
      </div>
    )
  },
)

VideoController.displayName = 'VideoController'
