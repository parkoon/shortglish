/**
 * Video Difficulty 유틸리티
 * 난이도에 따른 색상 및 레이블 정보를 반환
 */

export type DifficultyInfo = {
  label: string
  color: string
}

/**
 * 난이도에 따른 정보 반환
 * @param difficulty - 난이도 (1~5)
 * @returns 난이도 정보 또는 null
 */
export const getDifficultyInfo = (difficulty: number | null): DifficultyInfo | null => {
  if (!difficulty) return null

  const configs: Record<number, DifficultyInfo> = {
    1: { label: '초급', color: 'bg-green-500' },
    2: { label: '초중급', color: 'bg-blue-500' },
    3: { label: '중급', color: 'bg-yellow-500' },
    4: { label: '중고급', color: 'bg-orange-500' },
    5: { label: '고급', color: 'bg-red-500' },
  }

  return configs[difficulty] || null
}
