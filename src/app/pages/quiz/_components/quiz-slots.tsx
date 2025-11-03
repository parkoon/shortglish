import { cn } from '@/lib/utils'
import type { QuizWordItem } from '@/utils/quiz'

type SelectedWordInfo = {
  word: string
}

type QuizSlotsProps = {
  words: QuizWordItem[]
  selectedWords: SelectedWordInfo[]
}

/**
 * 퀴즈 문장의 슬롯을 표시하는 컴포넌트
 *
 * 책임:
 * - 일반 단어는 그대로 표시
 * - 빈칸 위치에만 슬롯 표시
 * - 선택된 단어는 색상으로 정답/오답 구분
 */
export const QuizSlots = ({ words, selectedWords }: QuizSlotsProps) => {
  let blankIndex = 0

  return (
    <div className="flex flex-wrap gap-2 items-baseline">
      {words.map((wordInfo, index) => {
        // 일반 단어인 경우
        if (wordInfo.type === 'word') {
          return (
            <div key={`word-${index}`} className="inline-flex items-baseline">
              {wordInfo.prefix && <span className="text-2xl text-gray-700">{wordInfo.prefix}</span>}
              <span className="text-2xl text-gray-700">{wordInfo.text}</span>
              {wordInfo.suffix && <span className="text-2xl text-gray-700">{wordInfo.suffix}</span>}
            </div>
          )
        }

        // 빈칸인 경우
        const currentBlankIndex = blankIndex
        blankIndex++

        const selectedWordInfo = selectedWords[currentBlankIndex]
        const isSelected = !!selectedWordInfo

        return (
          <div key={`blank-${index}`} className="inline-flex items-baseline">
            {wordInfo.prefix && <span className="text-2xl text-gray-700">{wordInfo.prefix}</span>}

            {/* 빈칸 슬롯 */}
            <span
              className={cn(
                'text-2xl border-b-2 leading-tight px-1 min-w-[60px] text-center',
                isSelected ? 'text-gray-900 border-gray-900' : 'text-transparent border-gray-400',
              )}
            >
              {isSelected ? selectedWordInfo.word : wordInfo.text}
            </span>

            {wordInfo.suffix && <span className="text-2xl text-gray-700">{wordInfo.suffix}</span>}
          </div>
        )
      })}
    </div>
  )
}
