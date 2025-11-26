/**
 * 녹음 시간 표시 컴포넌트
 * 
 * 녹음된 시간을 mm:ss:ms 형식으로 표시합니다.
 */

interface DurationDisplayProps {
  /**
   * 녹음 시간 (밀리초)
   */
  durationMs: number
}

/**
 * 밀리초를 mm:ss:ms 형식으로 변환
 */
const formatDuration = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  const milliseconds = Math.floor((ms % 1000) / 10) // 100ms 단위로 표시

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`
}

/**
 * 녹음 시간 표시 컴포넌트
 * 
 * 녹음된 시간을 00:04:69 형식으로 표시합니다.
 */
export const DurationDisplay = ({ durationMs }: DurationDisplayProps) => {
  return (
    <div className="text-center text-gray-600 text-sm font-mono">
      {formatDuration(durationMs)}
    </div>
  )
}

