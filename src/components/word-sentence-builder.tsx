import { useWordGame } from '@/hooks/use-word-game'

import { WordButton } from './word-game/word-button'
import { WordSlots } from './word-game/word-slots'

type WordSentenceBuilderProps = {
  sentence: string
  onComplete?: () => void
  isCompleted?: boolean
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
  onComplete,
  isCompleted = false,
}: WordSentenceBuilderProps) => {
  const { words, selectedWords, wrongWordIndices, availableWords, wordAttempts, handleWordClick } =
    useWordGame({
      sentence,
      onComplete,
      isCompleted,
    })

  return (
    <div className="flex flex-col gap-8">
      {/* 단어 슬롯 영역 */}
      <div className="bg-gray-50 rounded-lg p-6">
        <WordSlots words={words} selectedWords={selectedWords} wordAttempts={wordAttempts} />
      </div>

      {/* 단어 버튼 영역 - 완성되면 숨김 */}
      {!isCompleted && (
        <div className="flex flex-wrap gap-3 justify-center">
          {availableWords.map(item => {
            const isWrong = wrongWordIndices.has(item.shuffledIndex)

            return (
              <WordButton
                key={item.shuffledIndex}
                word={item.word}
                isWrong={isWrong}
                onClick={() => handleWordClick(item.shuffledIndex)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
