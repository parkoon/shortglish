/**
 * Step 1: 강세 단어만 강조하기 컴포넌트
 */

import { cn } from '@/lib/utils'

import { STEP_1_CONTENT } from '../_constants/shadowing-content'
import { useSequentialHighlight } from '../_hooks/use-sequential-highlight'

interface Step1ContentProps {
  /**
   * 애니메이션이 활성화되어야 하는지 여부
   */
  isActive: boolean
}

/**
 * Step 1 콘텐츠 컴포넌트
 *
 * 강세 단어들을 순차적으로 하이라이트하여 사용자의 주의를 끕니다.
 */
export const Step1Content = ({ isActive }: Step1ContentProps) => {
  const highlightedIndex = useSequentialHighlight({
    isActive,
    totalItems: STEP_1_CONTENT.stressWords.length,
    interval: 1000,
  })

  return (
    <>
      <div className="rounded-xl mb-2 py-4 flex items-center justify-center">
        <div className="flex items-center gap-2 flex-wrap">
          {STEP_1_CONTENT.stressWords.map((word, index) => {
            const isHighlighted = highlightedIndex === index
            return (
              <div key={index} className="flex items-center gap-2">
                <span
                  className={cn(
                    'text-lg font-bold transition-all duration-500',
                    isHighlighted ? 'scale-110 text-primary' : 'text-gray-400',
                  )}
                >
                  {word}
                </span>
                {index < STEP_1_CONTENT.stressWords.length - 1 && (
                  <span className="text-gray-300 font-normal text-sm">—</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <div className="bg-gray-50  rounded-xl p-3">
        <div className="inline-block bg-blue-50 text-blue-500 px-2 py-0.5 rounded-md text-xs font-semibold mb-1.5">
          TIP
        </div>
        <div className="text-sm text-gray-500 leading-relaxed">
          이 단어들만 크고 또렷하게 발음해보세요. 나머지는 잠시 잊어도 됩니다.
        </div>
      </div>
    </>
  )
}
