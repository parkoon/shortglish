import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

type WordSlotsProps = {
  words: string[]
  selectedWords: string[]
  wordAttempts: number[] // 각 위치별 시도 횟수
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
export const WordSlots = ({ words, selectedWords, wordAttempts }: WordSlotsProps) => {
  return (
    <div className="flex flex-wrap gap-2 min-h-[100px] items-start">
      {words.map((word, index) => {
        const isSelected = index < selectedWords.length
        const selectedWord = selectedWords[index]
        const attempts = wordAttempts[index]

        // 시도 횟수에 따른 색상
        const textColor = isSelected
          ? attempts === 1
            ? 'text-green-600' // 한 번에 맞춤
            : 'text-red-500' // 틀렸다가 맞춤
          : 'text-transparent'

        return (
          <div key={`slot-${index}`} className="flex items-center">
            <motion.span
              initial={isSelected ? { opacity: 0, y: -10 } : false}
              animate={isSelected ? { opacity: 1, y: 0 } : {}}
              className={cn(
                'text-2xl font-medium px-1 border-b-2 inline-block text-center',
                textColor,
                isSelected
                  ? attempts === 1
                    ? 'border-green-600'
                    : 'border-red-500'
                  : 'border-gray-400',
              )}
              style={{
                width: `${Math.max(word.length * 0.65, 2.5)}rem`,
              }}
            >
              {isSelected ? selectedWord : '\u00A0'}
            </motion.span>
          </div>
        )
      })}
    </div>
  )
}
