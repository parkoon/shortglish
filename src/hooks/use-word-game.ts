import { useEffect, useState } from 'react'

import { shuffleArray, splitSentenceToWords } from '@/utils/sentence'

type UseWordGameProps = {
  sentence: string
  onComplete?: () => void
  onWrong?: () => void
  isCompleted?: boolean
}

type WordWithIndex = {
  word: string
  originalIndex: number
  id: number // 버튼의 고유 식별자
}

type SelectedWordInfo = {
  word: string
  attempts: number // 1 = 한번에 맞춤, 2+ = 틀림
  id: number // 어떤 버튼을 선택했는지 추적
}

type UseWordGameReturn = {
  words: string[]
  selectedWords: SelectedWordInfo[]
  wrongWordIndices: Set<number>
  availableWords: WordWithIndex[]
  isCompleted: boolean
  handleWordClick: (id: number) => void
}

/**
 * 단어 조합 게임의 비즈니스 로직을 관리하는 커스텀 훅
 *
 * 책임:
 * - 문장을 단어로 분리하고 셔플
 * - 단어 선택 로직 처리 (정답/오답)
 * - 게임 완성 상태 감지
 * - 중복 단어 처리 (인덱스 기반)
 */
export const useWordGame = ({
  sentence,
  onComplete,
  onWrong,
  isCompleted = false,
}: UseWordGameProps): UseWordGameReturn => {
  const [words] = useState(() => splitSentenceToWords(sentence))

  // 각 단어에 원래 인덱스와 고유 ID 부여
  const [wordsWithIndices] = useState(() => {
    const wordObjs = words.map((word, index) => ({
      word,
      originalIndex: index,
      id: index,
    }))
    const shuffled = shuffleArray(wordObjs)
    // 셔플 후 새로운 고유 ID 부여
    return shuffled.map((obj, idx) => ({ ...obj, id: idx }))
  })

  // 선택된 단어 정보 (단어 + 시도 횟수)
  const [selectedWords, setSelectedWords] = useState<SelectedWordInfo[]>(() =>
    isCompleted
      ? words.map((word, idx) => ({
          word,
          attempts: 1,
          id: wordsWithIndices.find(w => w.originalIndex === idx)?.id ?? idx,
        }))
      : [],
  )
  const [wrongWordIndices, setWrongWordIndices] = useState<Set<number>>(new Set())

  const currentPosition = selectedWords.length
  const isGameCompleted = selectedWords.length === words.length

  // 모든 단어를 그대로 유지 (선택된 단어는 회색 영역으로 표시)
  const availableWords = wordsWithIndices

  const handleWordClick = (id: number) => {
    const clickedWord = wordsWithIndices.find(w => w.id === id)
    if (!clickedWord) return

    const expectedIndex = currentPosition
    const expectedWord = words[expectedIndex]

    // 정답인 경우
    if (clickedWord.word === expectedWord) {
      // 틀린 적이 있으면 시도 횟수 증가, 없으면 1로 설정
      const attempts = wrongWordIndices.size > 0 ? wrongWordIndices.size + 1 : 1

      setSelectedWords(prev => [
        ...prev,
        {
          word: clickedWord.word,
          attempts,
          id: clickedWord.id,
        },
      ])

      // 정답을 맞추면 틀린 단어들의 취소선을 풀어줌 (다시 시도 가능)
      setWrongWordIndices(new Set())
      return
    }

    // 오답인 경우
    setWrongWordIndices(prev => new Set(prev).add(id))

    // 오답 콜백 호출
    if (onWrong) {
      onWrong()
    }
  }

  // 완성 시 콜백 호출 (이미 완성된 상태로 시작한 경우는 제외)
  useEffect(() => {
    if (isGameCompleted && onComplete && !isCompleted) {
      onComplete()
    }
  }, [isGameCompleted, onComplete, isCompleted])

  return {
    words,
    selectedWords,
    wrongWordIndices,
    availableWords,
    isCompleted: isGameCompleted,
    handleWordClick,
  }
}
