/**
 * 선택된 단어 정보
 * - word: 단어 텍스트
 * - attempts: 시도 횟수 (1 이상)
 * - id: 단어의 고유 식별자 (셔플 후 할당된 ID)
 */
export type SelectedWordInfo = {
  word: string
  attempts: number
  id: number
}

