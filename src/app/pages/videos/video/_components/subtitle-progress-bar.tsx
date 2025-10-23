type SubtitleProgressBarProps = {
  current: number
  total: number
}

export const SubtitleProgressBar = ({ current, total }: SubtitleProgressBarProps) => {
  const progress = total > 0 ? ((current + 1) / total) * 100 : 0

  return (
    <div className="relative h-1 w-full bg-gray-200">
      <div
        className="absolute top-0 left-0 h-full bg-gray-800 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
