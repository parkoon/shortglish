import {
  IconPlayerPause,
  IconPlayerPlay,
  IconPlayerSkipBackFilled,
  IconPlayerSkipForwardFilled,
  IconRepeat,
} from '@tabler/icons-react'

import { MotionButton } from '@/components/ui/motion-button'
import { cn } from '@/lib/utils'

type PlayerControllerProps = {
  canNext?: boolean
  canPrevious?: boolean
  isPlaying: boolean
  isRepeatActive: boolean
  onNext: () => void
  onPrevious: () => void
  onRepeatToggle: () => void
  onStartStop: () => void
}

export const PlayerController = ({
  canNext = true,
  canPrevious = true,
  isPlaying,
  isRepeatActive,
  onNext,
  onPrevious,
  onRepeatToggle,
  onStartStop,
}: PlayerControllerProps) => {
  return (
    <div className="bg-white py-3 px-4 relative shadow-xs">
      <div className="relative flex items-center justify-between">
        <MotionButton
          onClick={onPrevious}
          disabled={!canPrevious}
          className={cn('p-2', !canPrevious && 'opacity-30 cursor-not-allowed')}
        >
          <IconPlayerSkipBackFilled />
        </MotionButton>

        <MotionButton
          onClick={onStartStop}
          className="p-2 px-4 rounded-full text-primary border border-primary absolute left-1/2 -translate-x-1/2"
        >
          {isPlaying ? <IconPlayerPause /> : <IconPlayerPlay />}
        </MotionButton>

        <MotionButton
          onClick={onRepeatToggle}
          className={cn('p-2 absolute left-1/2 translate-x-12.5', isRepeatActive && 'text-primary')}
        >
          <IconRepeat />
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
