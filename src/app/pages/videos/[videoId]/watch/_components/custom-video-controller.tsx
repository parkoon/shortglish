import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
} from '@tabler/icons-react'

import { MotionButton } from '@/components/ui/motion-button'
import { cn } from '@/lib/utils'

type CustomVideoControllerProps = {
  isPlaying: boolean
  canPrevious: boolean
  canNext: boolean
  onPlayPause: () => void
  onPrevious: () => void
  onNext: () => void
}

export const CustomVideoController = ({
  isPlaying,
  canPrevious,
  canNext,
  onPlayPause,
  onPrevious,
  onNext,
}: CustomVideoControllerProps) => {
  return (
    <div className="bg-white py-3 px-4 border-b border-gray-200 rounded-br-xl rounded-bl-xl">
      <div className="relative flex items-center justify-between">
        <MotionButton
          onClick={onPrevious}
          disabled={!canPrevious}
          className={cn('p-2', !canPrevious && 'opacity-30 cursor-not-allowed')}
        >
          <IconPlayerSkipBackFilled />
        </MotionButton>

        <MotionButton
          onClick={onPlayPause}
          className={cn('p-2 px-4 rounded-full text-primary border border-primary')}
        >
          {isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
        </MotionButton>

        <MotionButton
          onClick={onNext}
          disabled={!canNext}
          className={cn('p-2', !canNext && 'opacity-30 cursor-not-allowed')}
        >
          <IconPlayerSkipForwardFilled />
        </MotionButton>
      </div>
    </div>
  )
}
