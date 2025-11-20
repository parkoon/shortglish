type VideoProgressBarProps = {
  startTime: number
  endTime: number
  currentTime: number
}

export const VideoProgressBar = ({ startTime, endTime, currentTime }: VideoProgressBarProps) => {
  const duration = endTime - startTime
  const elapsed = Math.max(0, Math.min(currentTime - startTime, duration))
  const progress = duration > 0 ? (elapsed / duration) * 100 : 0

  return (
    <div className="relative h-1 w-full bg-gray-200">
      <div
        className="absolute top-0 left-0 h-full bg-gray-800 transition-all duration-100 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
