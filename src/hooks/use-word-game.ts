import { useEffect, useState } from 'react'

import { shuffleArray, splitSentenceToWords } from '@/utils/sentence'

type UseWordGameProps = {
  sentence: string
  onComplete?: () => void
  isCompleted?: boolean
}

type WordWithIndex = {
  word: string
  originalIndex: number
  shuffledIndex: number
}

type UseWordGameReturn = {
  words: string[]
  selectedWords: string[]
  wrongWordIndices: Set<number>
  availableWords: WordWithIndex[]
  isCompleted: boolean
  wordAttempts: number[] // 각 위치별 시도 횟수
  handleWordClick: (shuffledIndex: number) => void
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
  isCompleted = false,
}: UseWordGameProps): UseWordGameReturn => {
  const [words] = useState(() => splitSentenceToWords(sentence))

  // 각 단어에 원래 인덱스 정보를 포함
  const [wordsWithIndices] = useState(() => {
    const wordObjs = words.map((word, index) => ({
      word,
      originalIndex: index,
      shuffledIndex: index,
    }))
    const shuffled = shuffleArray(wordObjs)
    // shuffledIndex 업데이트
    return shuffled.map((obj, idx) => ({ ...obj, shuffledIndex: idx }))
  })

  // 이미 완성된 자막이면 모든 단어를 선택된 상태로 초기화
  const [selectedIndices, setSelectedIndices] = useState<number[]>(() =>
    isCompleted ? words.map((_, idx) => idx) : [],
  )
  const [wrongWordIndices, setWrongWordIndices] = useState<Set<number>>(new Set())
  // 각 위치별 시도 횟수 추적 (0: 시도 전, 1: 한 번에 맞춤, 2+: 틀렸다가 맞춤)
  const [wordAttempts, setWordAttempts] = useState<number[]>(() =>
    isCompleted ? words.map(() => 1) : words.map(() => 0),
  )

  const currentPosition = selectedIndices.length
  const isGameCompleted = selectedIndices.length === words.length

  // 선택된 단어들을 순서대로
  const selectedWords = selectedIndices.map(idx => words[idx])

  // 아직 선택되지 않은 단어들 (틀린 단어는 화면에 남아있음)
  const availableWords = wordsWithIndices.filter(
    item => !selectedIndices.includes(item.originalIndex),
  )

  const handleWordClick = (shuffledIndex: number) => {
    const clickedWord = wordsWithIndices.find(w => w.shuffledIndex === shuffledIndex)
    if (!clickedWord) return

    const expectedIndex = currentPosition
    const expectedWord = words[expectedIndex]

    // 정답인 경우
    if (clickedWord.word === expectedWord && clickedWord.originalIndex === expectedIndex) {
      setSelectedIndices(prev => [...prev, clickedWord.originalIndex])

      // 시도 횟수 기록
      setWordAttempts(prev => {
        const newAttempts = [...prev]
        // 틀린 적이 있으면 시도 횟수 증가, 없으면 1로 설정
        const hadWrongAttempts = wrongWordIndices.size > 0
        newAttempts[expectedIndex] = hadWrongAttempts
          ? prev[expectedIndex] + wrongWordIndices.size + 1
          : 1
        return newAttempts
      })

      // 정답을 맞추면 틀린 단어들의 취소선을 풀어줌 (다시 시도 가능)
      setWrongWordIndices(new Set())
      return
    }

    // 오답인 경우
    setWrongWordIndices(prev => new Set(prev).add(shuffledIndex))
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
    wordAttempts,
    handleWordClick,
  }
}
