type SlotColorParams = {
  attempts: number
  isSelected: boolean
}

/**
 * 슬롯의 텍스트 색상을 결정합니다.
 *
 * @param params - 색상 계산 파라미터
 * @param params.attempts - 시도 횟수
 * @param params.isSelected - 선택 여부
 * @returns Tailwind CSS 색상 클래스
 */
export const getSlotTextColor = ({ attempts, isSelected }: SlotColorParams): string => {
  if (!isSelected) {
    return 'text-transparent'
  }
  return attempts === 1 ? 'text-green-600' : 'text-red-500'
}

/**
 * 슬롯의 테두리 색상을 결정합니다.
 *
 * @param params - 색상 계산 파라미터
 * @param params.attempts - 시도 횟수
 * @param params.isSelected - 선택 여부
 * @returns Tailwind CSS 색상 클래스
 */
export const getSlotBorderColor = ({ attempts, isSelected }: SlotColorParams): string => {
  if (!isSelected) {
    return 'border-gray-400'
  }
  return attempts === 1 ? 'border-green-600' : 'border-red-500'
}

