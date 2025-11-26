/**
 * 진행률 표시 컴포넌트
 */

import { cn } from '@/lib/utils'

type ProgressIndicatorProps = {
  currentStep: number
  totalSteps: number
  completedSteps: number[]
}

export const ProgressIndicator = ({
  currentStep,
  totalSteps,
  completedSteps,
}: ProgressIndicatorProps) => {
  return (
    <div className="flex justify-center py-4 gap-2">
      {Array.from({ length: totalSteps }, (_, index) => {
        const step = index + 1
        const isActive = step === currentStep
        const isCompleted = completedSteps.includes(step)

        return (
          <div
            key={step}
            className={cn(
              'h-1 rounded-full transition-all',
              isActive || isCompleted ? 'bg-blue-500 w-8' : 'bg-gray-200 w-8',
            )}
          />
        )
      })}
    </div>
  )
}

