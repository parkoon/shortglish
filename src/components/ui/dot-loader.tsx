import { cn } from '@/lib/utils'

const sizes = {
  sm: 'size-1.5',
  md: 'size-2',
  lg: 'size-2.5',
}

const variants = {
  default: 'bg-current',
  light: 'bg-white',
  primary: 'bg-primary',
}

export type DotLoaderProps = {
  size?: keyof typeof sizes
  variant?: keyof typeof variants
  className?: string
}

/**
 * 3개의 점이 순차적으로 깜빡이는 로딩 인디케이터
 */
export const DotLoader = ({ size = 'md', variant = 'default', className = '' }: DotLoaderProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn('rounded-full dot-pulse', sizes[size], variants[variant])}
        style={{ animationDelay: '0s' }}
      />
      <span
        className={cn('rounded-full dot-pulse', sizes[size], variants[variant])}
        style={{ animationDelay: '0.15s' }}
      />
      <span
        className={cn('rounded-full dot-pulse', sizes[size], variants[variant])}
        style={{ animationDelay: '0.3s' }}
      />
    </div>
  )
}
