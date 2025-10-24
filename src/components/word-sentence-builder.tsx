import { useWordGame } from '@/hooks/use-word-game'

import { WordButton } from './word-game/word-button'
import { WordSlots } from './word-game/word-slots'

type WordSentenceBuilderProps = {
  sentence: string
  isCompleted?: boolean
  translation: string
  onComplete?: () => void
  onWrong?: () => void
}

/**
 * 단어 조합 게임 컨테이너 컴포넌트
 *
 * 책임:
 * - WordSlots와 WordButton 컴포넌트 조합
 * - 게임 레이아웃 구성
 * - 완성 상태 관리 및 콜백 전달
 * - 완성된 경우 슬롯만 표시하고 버튼은 숨김
 */
export const WordSentenceBuilder = ({
  sentence,
  translation,
  onComplete,
  onWrong,
  isCompleted = false,
}: WordSentenceBuilderProps) => {
  const { words, selectedWords, wrongWordIndices, availableWords, handleWordClick } = useWordGame({
    sentence,
    onComplete,
    onWrong,
    isCompleted,
  })

  return (
    <div className="space-y-8">
      {/* 단어 슬롯 영역 */}
      <div className="space-y-4">
        <WordSlots words={words} selectedWords={selectedWords} />
        <span className="text-gray-600">{translation}</span>
      </div>

      {/* 단어 버튼 영역 - 완성되면 숨김 */}
      {!isCompleted && (
        <div className="flex flex-wrap gap-3 justify-center">
          {availableWords.map(item => {
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
