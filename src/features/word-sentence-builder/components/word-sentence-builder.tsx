import { IconWand } from '@tabler/icons-react'
import { useEffect, useMemo, useState } from 'react'

import { MotionButton } from '@/components/ui/motion-button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { extractWords, parseWordsWithPunctuation } from '@/utils/sentence'

import type { SelectedWordInfo } from '../types'
import { calculateAttempts } from '../utils/calculate-attempts'
import { createWordsWithId } from '../utils/create-word-with-id'
import { findCorrectWordForHint } from '../utils/find-correct-word'
import { WordButton } from './word-button'
import { WordSlots } from './word-slots'

const SHOW_HINT_TOOLTIP_COUNT = 2
const MAX_VISIBLE_WORDS = 7

type WordSentenceBuilderProps = {
  sentence: string
  isCompleted?: boolean
  translation: string
  onComplete: (selectedWords: SelectedWordInfo[]) => void
  onWrong: () => void
  onHint?: () => void
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
  onHint,
  isCompleted = false,
  completedWords,
}: WordSentenceBuilderProps) => {
  // 구두점 포함 파싱
  const wordsWithPunctuation = useMemo(() => parseWordsWithPunctuation(sentence), [sentence])

  // 순수 단어만 추출 (버튼용)
  const words = useMemo(() => extractWords(wordsWithPunctuation), [wordsWithPunctuation])

  // 각 단어에 원래 인덱스와 고유 ID 부여 (셔플 포함)
  const wordsWithIndices = useMemo(() => createWordsWithId(words), [words])

  // 선택된 단어 정보 (단어 + 시도 횟수)
  const [selectedWords, setSelectedWords] = useState<SelectedWordInfo[]>([])
  const [wrongWordIndices, setWrongWordIndices] = useState<Set<number>>(new Set())
  const [hintWordId, setHintWordId] = useState<number | null>(null)

  const currentPosition = selectedWords.length

  // 힌트 표시
  const showHint = () => {
    const expectedWord = words[currentPosition]
    if (!expectedWord) return

    const correctWord = findCorrectWordForHint({
      expectedWord,
      wordsWithIndices,
      selectedWords,
    })
    if (!correctWord) return

    setHintWordId(correctWord.id)
    // GA 이벤트 콜백 호출 (힌트 표시 여부와 무관하게 이벤트 발생)
    onHint?.()
  }

  // 힌트 애니메이션 완료
  const handleHintComplete = () => {
    setHintWordId(null)
  }

  const handleWordClick = (id: number) => {
    const clickedWord = wordsWithIndices.find(w => w.id === id)
    if (!clickedWord) return

    // 블러 처리된 버튼 클릭 방지 (이중 방어)
    const maxActiveWords = MAX_VISIBLE_WORDS + selectedWords.length
    if (clickedWord.originalIndex >= maxActiveWords) return

    const expectedWord = words[currentPosition]
    if (!expectedWord) return

    // 오답인 경우
    if (clickedWord.word !== expectedWord) {
      setWrongWordIndices(prev => new Set(prev).add(id))
      onWrong()
      return
    }

    // 정답인 경우
    const attempts = calculateAttempts({ wrongAttemptsCount: wrongWordIndices.size })
    const newSelectedWord: SelectedWordInfo = {
      word: clickedWord.word,
      attempts,
      id: clickedWord.id,
    }

    const updatedSelectedWords = [...selectedWords, newSelectedWord]
    setSelectedWords(updatedSelectedWords)

    // 정답을 맞추면 틀린 단어들의 취소선을 풀어줌 (다시 시도 가능)
    setWrongWordIndices(new Set())

    // 힌트 즉시 제거
    setHintWordId(null)

    // 마지막 단어를 맞췄을 때 바로 onComplete 호출
    if (updatedSelectedWords.length === words.length) {
      onComplete(updatedSelectedWords)
    }
  }

  // sentence가 바뀌면 게임 상태 리셋
  useEffect(() => {
    const shouldUseCompletedWords = isCompleted && completedWords
    setSelectedWords(shouldUseCompletedWords ? completedWords : [])
    setWrongWordIndices(new Set())
    setHintWordId(null)
  }, [sentence, completedWords, isCompleted])

  // 힌트 버튼 활성화 여부 (완성되지 않았고, 아직 선택할 단어가 남아있을 때)
  const canShowHint = !isCompleted && currentPosition < words.length

  const showHintTooltip = wrongWordIndices.size >= SHOW_HINT_TOOLTIP_COUNT

  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-500">
          <span className="font-semibold text-gray-900">1</span>
          <span>/</span>
          <span>10</span>
        </div>

        <Tooltip open={showHintTooltip}>
          <TooltipContent side="left">힌트를 사용해보세요.</TooltipContent>
          <TooltipTrigger>
            <MotionButton
              onClick={showHint}
              className={cn(
                'text-sm flex items-center font-semibold gap-1 border py-1 px-3 rounded-4xl text-yellow-600',
                !canShowHint && 'opacity-30 pointer-events-none',
              )}
            >
              <IconWand className="size-5" strokeWidth={1.5} />
            </MotionButton>
          </TooltipTrigger>
        </Tooltip>
      </div>
      {/* 단어 슬롯 영역 */}
      <div className="space-y-4 mb-8">
        <WordSlots wordsWithPunctuation={wordsWithPunctuation} selectedWords={selectedWords} />

        <span className="text-gray-600">{translation}</span>
      </div>

      {/* 단어 버튼 영역 - 완성되면 숨김 */}
      {!isCompleted && (
        <div className="flex flex-wrap gap-3">
          {wordsWithIndices.map(item => {
            const isWrong = wrongWordIndices.has(item.id)
            // 이미 선택한 버튼인지 확인
            const isSelected = selectedWords.some(sw => sw.id === item.id)
            const isHint = hintWordId === item.id

            const maxActiveWords = MAX_VISIBLE_WORDS + selectedWords.length
            const isBlur = item.originalIndex >= maxActiveWords

            return (
              <WordButton
                key={item.id}
                word={item.word}
                isWrong={isWrong}
                isSelected={isSelected}
                isHint={isHint}
                isBlur={isBlur}
                onClick={() => handleWordClick(item.id)}
                onHintComplete={handleHintComplete}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}
