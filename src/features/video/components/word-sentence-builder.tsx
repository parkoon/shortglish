import { useEffect, useMemo, useState } from 'react'

import { extractWords, parseWordsWithPunctuation, shuffleArray } from '@/utils/sentence'

import { WordButton } from './word-button'
import { WordSlots } from './word-slots'

type SelectedWordInfo = {
  word: string
  attempts: number
  id: number
}

type WordSentenceBuilderProps = {
  sentence: string
  isCompleted?: boolean
  translation: string
  onComplete: (selectedWords: SelectedWordInfo[]) => void
  onWrong: () => void
  completedWords?: SelectedWordInfo[]
}

/**
 * 단어 조합 게임 컨테이너 컴포넌트
 *
 * 책임:
 * - 문장을 단어로 분리하고 셔플
 * - 단어 선택 로직 처리 (정답/오답)
 * - 게임 완성 상태 감지
 * - WordSlots와 WordButton 컴포넌트 조합
 * - 게임 레이아웃 구성
 */
export const WordSentenceBuilder = ({
  sentence,
  translation,
  onComplete,
  onWrong,
  isCompleted = false,
  completedWords,
}: WordSentenceBuilderProps) => {
  // 구두점 포함 파싱
  const wordsWithPunctuation = useMemo(() => parseWordsWithPunctuation(sentence), [sentence])

  // 순수 단어만 추출 (버튼용)
  const words = useMemo(() => extractWords(wordsWithPunctuation), [wordsWithPunctuation])

  // 각 단어에 원래 인덱스와 고유 ID 부여
  const wordsWithIndices = useMemo(() => {
    const wordObjs = words.map((word, index) => ({
      word,
      originalIndex: index,
      id: index,
    }))
    const shuffled = shuffleArray(wordObjs)
    // 셔플 후 새로운 고유 ID 부여
    return shuffled.map((obj, idx) => ({ ...obj, id: idx }))
  }, [words])

  // 선택된 단어 정보 (단어 + 시도 횟수)
  const [selectedWords, setSelectedWords] = useState<SelectedWordInfo[]>([])
  const [wrongWordIndices, setWrongWordIndices] = useState<Set<number>>(new Set())

  const currentPosition = selectedWords.length

  const handleWordClick = (id: number) => {
    const clickedWord = wordsWithIndices.find(w => w.id === id)
    if (!clickedWord) return

    const expectedWord = words[currentPosition]

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

      // 마지막 단어를 맞췄을 때 바로 onComplete 호출
      if (currentPosition + 1 === words.length) {
        const finalWords = [
          ...selectedWords,
          {
            word: clickedWord.word,
            attempts,
            id: clickedWord.id,
          },
        ]
        onComplete(finalWords)
      }

      return
    }

    // 오답인 경우
    setWrongWordIndices(prev => new Set(prev).add(id))

    // 오답 콜백 호출
    onWrong()
  }

  // sentence가 바뀌면 게임 상태 리셋
  useEffect(() => {
    setSelectedWords(completedWords && isCompleted ? completedWords : [])
    setWrongWordIndices(new Set())
  }, [sentence, completedWords, isCompleted])

  return (
    <div className="space-y-8">
      {/* 단어 슬롯 영역 */}
      <div className="space-y-4">
        <WordSlots wordsWithPunctuation={wordsWithPunctuation} selectedWords={selectedWords} />
        <span className="text-gray-600">{translation}</span>
      </div>

      {/* 단어 버튼 영역 - 완성되면 숨김 */}
      {!isCompleted && (
        <div className="flex flex-wrap gap-3 justify-center">
          {wordsWithIndices.map(item => {
            const isWrong = wrongWordIndices.has(item.id)
            // 이미 선택한 버튼인지 확인
            const isSelected = selectedWords.some(sw => sw.id === item.id)

            return (
              <WordButton
                key={item.id}
                word={item.word}
                isWrong={isWrong}
                isSelected={isSelected}
                onClick={() => handleWordClick(item.id)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
