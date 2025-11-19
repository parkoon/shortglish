import type { SelectedWordInfo } from '../types'

type WordWithId = {
  word: string
  id: number
}

type FindCorrectWordParams = {
  expectedWord: string
  wordsWithIndices: WordWithId[]
  selectedWords: SelectedWordInfo[]
}

/**
 * 힌트를 위해 다음에 선택해야 할 정답 단어를 찾습니다.
 *
 * @param params - 찾기 파라미터
 * @param params.expectedWord - 예상되는 정답 단어
 * @param params.wordsWithIndices - 셔플된 단어 배열
 * @param params.selectedWords - 이미 선택된 단어 배열
 * @returns 정답 단어 객체 또는 null
 */
export const findCorrectWordForHint = ({
  expectedWord,
  wordsWithIndices,
  selectedWords,
}: FindCorrectWordParams): WordWithId | null => {
  return (
    wordsWithIndices.find(
      w => w.word === expectedWord && !selectedWords.some(sw => sw.id === w.id),
    ) || null
  )
}

