import { cn } from '@/lib/utils'
import type { WordWithPunctuation } from '@/utils/sentence'

type SelectedWordInfo = {
  word: string
  attempts: number
}

type WordSlotsProps = {
  wordsWithPunctuation: WordWithPunctuation[]
  selectedWords: SelectedWordInfo[]
}

/**
 * 문장의 단어 슬롯을 표시하는 컴포넌트
 *
 * 책임:
 * - 선택된 단어는 텍스트로 표시 (언더라인 유지)
 * - 빈 슬롯은 언더라인으로 표시
 * - 시도 횟수에 따른 색상 구분 (1번=초록, 2번이상=빨강)
 * - 구두점은 단어에 붙여서 표시 (언더라인 없음)
 */
export const WordSlots = ({ wordsWithPunctuation, selectedWords }: WordSlotsProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-baseline">
      {wordsWithPunctuation.map((wordInfo, index) => {
        const isSelected = index < selectedWords.length
        const selectedWordInfo = selectedWords[index]
        const attempts = selectedWordInfo?.attempts || 0

        // 시도 횟수에 따른 색상
        const textColor = isSelected
          ? attempts === 1
            ? 'text-green-600' // 한 번에 맞춤
            : 'text-red-500' // 틀렸다가 맞춤
          : 'text-transparent'

        return (
          <div key={`slot-${index}`} className="inline-flex items-baseline">
            {/* 앞 구두점 (항상 보임) */}
            {wordInfo.prefix && <span className="text-2xl text-gray-700">{wordInfo.prefix}</span>}

            {/* 단어 슬롯 */}
            <span
              className={cn(
                'text-2xl border-b-2 leading-tight px-1',
                textColor,
                isSelected
                  ? attempts === 1
                    ? 'border-green-600'
                    : 'border-red-500'
                  : 'border-gray-400',
              )}
            >
              {wordInfo.word}
            </span>

            {/* 뒤 구두점 (항상 보임) */}
            {wordInfo.suffix && <span className="text-2xl text-gray-700">{wordInfo.suffix}</span>}
          </div>
        )
      })}
    </div>
  )
}
