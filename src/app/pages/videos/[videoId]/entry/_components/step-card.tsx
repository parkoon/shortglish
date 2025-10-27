import { IconCheck, IconLock } from '@tabler/icons-react'
import { type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type StepStatus = 'locked' | 'available' | 'completed'

type StepCardProps = {
  icon: ReactNode
  title: string
  description: string
  status: StepStatus
  onStart: () => void
}

export const StepCard = ({ icon, title, description, status, onStart }: StepCardProps) => {
  const isLocked = status === 'locked'
  const isCompleted = status === 'completed'
  const isAvailable = status === 'available'

  return (
    <div
      className={cn(
        'relative flex items-center gap-4 p-6 rounded-2xl border-2 transition-all',
        isLocked && 'bg-gray-50 border-gray-200 opacity-60',
        isAvailable && 'bg-blue-50 border-blue-400 shadow-md',
        isCompleted && 'bg-green-50 border-green-400',
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          'flex items-center justify-center w-14 h-14 rounded-full text-2xl',
          isLocked && 'bg-gray-200 text-gray-400',
          isAvailable && 'bg-blue-500 text-white',
          isCompleted && 'bg-green-500 text-white',
        )}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3
          className={cn(
            'text-lg font-bold mb-1',
            isLocked && 'text-gray-500',
            isAvailable && 'text-blue-900',
            isCompleted && 'text-green-900',
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            'text-sm',
            isLocked && 'text-gray-400',
            isAvailable && 'text-blue-700',
            isCompleted && 'text-green-700',
          )}
        >
          {description}
        </p>
      </div>

      {/* Status Icon or Button */}
      <div className="flex items-center">
        {isLocked && (
          <div className="w-10 h-10 flex items-center justify-center text-gray-400">
            <IconLock size={28} />
          </div>
        )}
        {isCompleted && (
          <div className="w-10 h-10 flex items-center justify-center text-green-600">
            <IconCheck size={32} strokeWidth={3} />
          </div>
        )}
        {isAvailable && (
          <Button onClick={onStart} className="bg-blue-600 hover:bg-blue-700">
            {isCompleted ? '다시하기' : '시작하기'}
          </Button>
        )}
      </div>
    </div>
  )
}
