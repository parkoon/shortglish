import {
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconRepeat,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { forwardRef, useImperativeHandle, useState } from 'react'

import { usePrimaryColor } from '@/hooks/use-primary-color'
import { cn } from '@/lib/utils'

type VideoControllerProps = {
  onPrevious: () => void
  onNext: () => void
  onRepeat: () => void
  canRepeat: boolean
  canNext?: boolean
}

export type VideoControllerRef = {
  startBlink: () => void
  stopBlink: () => void
}

export const VideoController = forwardRef<VideoControllerRef, VideoControllerProps>(
  ({ onRepeat, onPrevious, onNext, canRepeat, canNext = true }, ref) => {
    const [isBlinking, setIsBlinking] = useState(false)
    const primaryColor = usePrimaryColor()

    useImperativeHandle(ref, () => ({
      startBlink: () => setIsBlinking(true),
      stopBlink: () => setIsBlinking(false),
    }))

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 max-w-[640px] mx-auto">
        <div className="relative flex items-center justify-between py-2 px-8 h-[46px]">
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
            <button onClick={onPrevious} className="p-2 disabled:opacity-50">
              <IconPlayerSkipBackFilled />
            </button>

            <motion.button
              onClick={onRepeat}
              className={cn('p-2', !canRepeat && 'opacity-50 pointer-events-none')}
              animate={
                isBlinking
                  ? {
                      color: ['#000', primaryColor, '#000'],
                    }
                  : {
                      color: '#000',
                    }
              }
              transition={
                isBlinking
                  ? {
                      duration: 1,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : { duration: 0.2 }
              }
            >
              <IconRepeat />
            </motion.button>

            <button
              onClick={onNext}
              disabled={!canNext}
              className={cn('p-2', !canNext && 'opacity-50 cursor-not-allowed')}
            >
              <IconPlayerSkipForwardFilled />
            </button>
          </div>
        </div>
      </div>
    )
  },
)

VideoController.displayName = 'VideoController'
