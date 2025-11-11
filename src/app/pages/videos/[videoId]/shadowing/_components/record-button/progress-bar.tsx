/**
 * 진행 바 컴포넌트
 *
 * 녹음 후 웨이브폼 영역에 표시되는 고정된 진행 바입니다.
 */

interface ProgressBarProps {
  /**
   * 전체 길이 대비 진행률 (0 ~ 1)
   */
  progress: number
}

/**
 * 진행 바 컴포넌트
 *
 * 녹음된 시간만큼 빨간색 바를 표시합니다.
 * 재생 중에는 부드럽게 채워나가는 애니메이션을 제공합니다.
 */
export const ProgressBar = ({ progress }: ProgressBarProps) => {
  const widthPercent = Math.max(0, Math.min(100, progress * 100))

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden relative">
      <div
        className="h-full bg-red-500 rounded-full transition-all duration-100 ease-linear"
        style={{ width: `${widthPercent}%` }}
      />
    </div>
  )
}
