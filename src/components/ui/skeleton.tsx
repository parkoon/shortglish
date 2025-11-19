import { cn } from '@/lib/utils'

export type SkeletonProps = {
  className?: string
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return <div className={cn('animate-pulse rounded-md bg-gray-200', className)} />
}
