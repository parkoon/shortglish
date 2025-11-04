import { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react'

import { WordButton } from '@/features/video/components/word-button'
import { shuffleArray } from '@/utils/sentence'
import { extractBlankWords, parseText } from '@/utils/text'

import type { QuizExercise } from '@/api'
import { QuizSlots } from './quiz-slots'

type SelectedWordInfo = {
  word: string
  id: number
}

type QuizSentenceBuilderProps = {
  exercise: QuizExercise
  onComplete: () => void
  onWrong: () => void
  onAllFilled: () => void
}

export type QuizSentenceBuilderRef = {
  verify: () => void
  reset: () => void
}

/**
 * 퀴즈 문장 빈칸 채우기 컴포넌트
 *
 * 책임:
 * - {단어} 패턴을 빈칸으로 표시
 * - 선택지에서 단어 선택
 * - 정답/오답 검증
 * - 모든 빈칸이 채워지면 자동으로 완료 상태로 전환
 */
export const QuizSentenceBuilder = forwardRef<QuizSentenceBuilderRef, QuizSentenceBuilderProps>(
  ({ exercise, onComplete, onWrong, onAllFilled }, ref) => {
    // 문장 파싱
    const words = useMemo(() => parseText(exercise.text), [exercise.text])

    // 정답 단어들 추출
    const correctWords = useMemo(() => extractBlankWords(exercise.text), [exercise.text])

    // 선택지 단어들 (셔플)
    const optionWords = useMemo(() => {
      const wordsWithIds = exercise.options.map((word, index) => ({
        word,
        id: index,
      }))
      return shuffleArray(wordsWithIds)
    }, [exercise.options])

    // 선택된 단어들
    const [selectedWords, setSelectedWords] = useState<SelectedWordInfo[]>([])
    const [isVerified, setIsVerified] = useState(false)

    const currentPosition = selectedWords.length

    // 단어 선택 핸들러
    const handleWordClick = (id: number) => {
      if (isVerified) return // 이미 검증된 경우 클릭 불가

      const clickedWord = optionWords.find(w => w.id === id)
      if (!clickedWord) return

      // 이미 선택한 단어인지 확인
      const isAlreadySelected = selectedWords.some(sw => sw.id === id)
      if (isAlreadySelected) return

      // 빈칸이 모두 채워진 경우 클릭 불가
      if (currentPosition >= correctWords.length) return

      // 단어 선택
      setSelectedWords(prev => [
        ...prev,
        {
          word: clickedWord.word,
          id: clickedWord.id,
        },
      ])
    }

    // 모든 빈칸이 채워졌는지 확인
    useEffect(() => {
      if (selectedWords.length === correctWords.length && !isVerified) {
        // 모든 빈칸이 채워지면 onAllFilled 콜백 호출
        onAllFilled()
      }
    }, [selectedWords.length, correctWords.length, isVerified, onAllFilled])

    // 검증 함수 (외부에서 호출)
    const verify = () => {
      if (isVerified) return

      // 정답 여부 체크
      const isAllCorrect = selectedWords.every((selected, index) => {
        return selected.word === correctWords[index]
      })

      if (isAllCorrect) {
        // 모두 정답
        setIsVerified(true)
        onComplete()
      } else {
        // 하나라도 틀림
        setIsVerified(true)
        onWrong()
      }
    }

    // 상태 초기화 함수
    const reset = () => {
      setSelectedWords([])
      setIsVerified(false)
    }

    // exercise가 바뀌면 초기화
    useEffect(() => {
      reset()
    }, [exercise])

    // ref로 verify, reset 함수 노출
    useImperativeHandle(ref, () => ({
      verify,
      reset,
    }))

    return (
      <div className="space-y-8">
        {/* 문장 슬롯 영역 */}
        <div className="space-y-4">
          <QuizSlots words={words} selectedWords={selectedWords} />
          <p className="text-gray-600 text-lg">{exercise.translation}</p>
        </div>

        {/* 단어 버튼 영역 */}
        {!isVerified && (
          <div className="flex flex-wrap gap-3 justify-center">
            {optionWords.map(item => {
              const isSelected = selectedWords.some(sw => sw.id === item.id)

              return (
                <WordButton
                  key={item.id}
                  word={item.word}
                  isSelected={isSelected}
                  onClick={() => handleWordClick(item.id)}
                  onHintComplete={() => {}}
                />
              )
            })}
          </div>
        )}
      </div>
    )
  },
)

QuizSentenceBuilder.displayName = 'QuizSentenceBuilder'
