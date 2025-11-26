import {
  // IconBrandSpeedtest,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconReload,
} from '@tabler/icons-react'
import { forwardRef, useImperativeHandle, useState } from 'react'

import { MotionButton } from '@/components/ui/motion-button'
import { usePrimaryColor } from '@/hooks/use-primary-color'
import { cn } from '@/lib/utils'

type VideoControllerProps = {
  canRepeat?: boolean
  canNext?: boolean
  canPrevious?: boolean
  currentSpeed?: number
  onPrevious?: () => void
  onNext?: () => void
  onRepeat?: () => void
  onSpeed?: () => void
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
      // currentSpeed,
      onRepeat,
      onPrevious,
      onNext,
      // onSpeed,
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
      <div className="bg-white py-3 px-4 border-b border-gray-200">
        <div className="relative flex items-center justify-between">
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
              'p-2 px-4 rounded-full text-primary border border-primary',
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
      </div>
    )
  },
)

VideoController.displayName = 'VideoController'
