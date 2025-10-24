import { cn } from '@/lib/utils'

type SelectedWordInfo = {
  word: string
  attempts: number
}

type WordSlotsProps = {
  words: string[]
  selectedWords: SelectedWordInfo[]
}

/**
 * 문장의 단어 슬롯을 표시하는 컴포넌트
 *
 * 책임:
 * - 선택된 단어는 텍스트로 표시 (언더라인 유지)
 * - 빈 슬롯은 언더라인으로 표시
 * - 시도 횟수에 따른 색상 구분 (1번=초록, 2번이상=빨강)
 * - 띄어쓰기를 고려한 레이아웃
 */
export const WordSlots = ({ words, selectedWords }: WordSlotsProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-start">
      {words.map((word, index) => {
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
          <span
            key={`slot-${index}`}
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
            {word}
          </span>
        )
      })}
    </div>
  )
}
