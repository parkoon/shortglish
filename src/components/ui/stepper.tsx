import { motion } from 'framer-motion'
import { type ReactNode } from 'react'

import { cn } from '@/lib/utils'

type StepItem = {
  number: string
  title: string
  description?: string
  right?: ReactNode
}

type StepperProps = {
  items: StepItem[]
  animated?: boolean
  className?: string
}

const Stepper = ({ items, animated = true, className }: StepperProps) => {
  return (
    <div className={cn('flex flex-col', className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <motion.div
            key={index}
            initial={animated ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              ease: 'easeOut',
            }}
          >
            <div className="flex">
              {/* Left: Number Icon */}
              <div className="flex flex-col items-center pr-4">
                <NumberIcon value={Number(item.number)} />
                {/* Connector Line */}
                {!isLast && <div className="w-[2px] flex-1 min-h-8 my-1 bg-gray-200" />}
              </div>

              {/* Center: Content */}
              <div className={cn('flex-1 pt-1', !isLast && 'pb-6')}>
                <StepContent title={item.title} description={item.description} />
              </div>

              {/* Right: Status Icon */}
              {item.right && <div className="ml-2 pt-1">{item.right}</div>}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

type NumberIconProps = {
  value: number
}

const NumberIcon = ({ value }: NumberIconProps) => {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm bg-gray-100">
      {value}
    </div>
  )
}

type StepContentProps = {
  title: string
  description?: string
}

const StepContent = ({ title, description }: StepContentProps) => {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-sm text-gray-700">{description}</p>}
    </div>
  )
}

export { Stepper as TossStepper }
export type { StepItem, StepperProps as TossStepperProps }
