import { shuffleArray } from '@/utils/sentence'

type WordWithId = {
  word: string
  originalIndex: number
  id: number
}

/**
 * 단어 배열을 셔플하고 고유 ID를 부여합니다.
 *
 * @param words - 순수 단어 배열
 * @returns 셔플된 단어 배열 (각 단어에 originalIndex와 id 포함)
 */
export const createWordsWithId = (words: string[]): WordWithId[] => {
  const wordObjs = words.map((word, index) => ({
    word,
    originalIndex: index,
    id: index,
  }))

  const shuffled = shuffleArray(wordObjs)

  // 셔플 후 새로운 고유 ID 부여
  return shuffled.map((obj, idx) => ({ ...obj, id: idx }))
}

