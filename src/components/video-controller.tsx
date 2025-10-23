import {
  IconPlayerPauseFilled,
  IconPlayerPlayFilled,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconRepeat,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { forwardRef, useImperativeHandle, useState } from 'react'

import { usePrimaryColor } from '@/hooks/use-primary-color'
import { cn } from '@/lib/utils'

type VideoControllerProps = {
  isPlaying: boolean
  isRepeatMode: boolean
  onPrevious: () => void
  onNext: () => void
  togglePlay: () => void
  toggleRepeat: () => void
}

export type VideoControllerRef = {
  startBlink: () => void
  stopBlink: () => void
}

export const VideoController = forwardRef<VideoControllerRef, VideoControllerProps>(
  ({ togglePlay, isPlaying, isRepeatMode, onPrevious, onNext, toggleRepeat }, ref) => {
    const [isBlinking, setIsBlinking] = useState(false)
    const primaryColor = usePrimaryColor()

    useImperativeHandle(ref, () => ({
      startBlink: () => setIsBlinking(true),
      stopBlink: () => setIsBlinking(false),
    }))

    return (
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 shadow-lg z-50">
        <div className="max-w-[640px] mx-auto">
          <div className="relative flex items-center justify-between py-2 px-8">
            <div />
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
              <button onClick={onPrevious} className="p-2 disabled:opacity-50">
                <IconPlayerSkipBackFilled />
              </button>

              <motion.button
                onClick={togglePlay}
                className="p-2 rounded-full"
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
                {isPlaying ? <IconPlayerPauseFilled /> : <IconPlayerPlayFilled />}
              </motion.button>

              <button onClick={onNext} className="p-2 disabled:opacity-50">
                <IconPlayerSkipForwardFilled />
              </button>
            </div>
            <button
              onClick={toggleRepeat}
              className={cn('p-2 rounded-full transition-color', isRepeatMode && 'text-primary')}
            >
              <IconRepeat />
            </button>
          </div>
        </div>
      </div>
    )
  },
)

VideoController.displayName = 'VideoController'
