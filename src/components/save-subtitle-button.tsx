import { IconShoppingCartStar } from '@tabler/icons-react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

type SaveSubtitleButtonProps = {
  onClick: () => void
  isSaved: boolean
  showTooltip: boolean
}

export type SaveSubtitleButtonRef = {
  animate: () => Promise<void>
}

export const SaveSubtitleButton = forwardRef<SaveSubtitleButtonRef, SaveSubtitleButtonProps>(
  ({ onClick, isSaved, showTooltip }, ref) => {
    const [isAnimatingRing, setIsAnimatingRing] = useState(false)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useImperativeHandle(ref, () => ({
      animate: async () => {
        setIsAnimatingRing(true)
        await new Promise(resolve => setTimeout(resolve, 800)) // 링 애니메이션 시간
        setIsAnimatingRing(false)
      },
    }))

    return (
      <div className="fixed bottom-[72px] left-1/2 -translate-x-1/2 z-40">
        <div className="relative">
          <Tooltip open={showTooltip}>
            <TooltipTrigger>
              <button
                ref={buttonRef}
                onClick={onClick}
                className={`relative p-3 rounded-full shadow-lg transition-all ${
                  isSaved
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-600 border border-gray-300'
                }`}
              >
                <IconShoppingCartStar className="relative z-10" />

                {/* 링 애니메이션 */}
                {isAnimatingRing && (
                  <svg
                    className="absolute pointer-events-none text-primary"
                    style={{
                      transform: 'rotate(-90deg)',
                      top: '-4px',
                      left: '-4px',
                      width: 'calc(100% + 8px)',
                      height: 'calc(100% + 8px)',
                    }}
                  >
                    <circle
                      cx="50%"
                      cy="50%"
                      r="calc(50% - 4px)"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      pathLength="100"
                      strokeDasharray="100"
                      strokeDashoffset="100"
                      className="animate-ring-progress"
                    />
                  </svg>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Nhấn nút để lưu câu vào thư viện nhé</p>
            </TooltipContent>
          </Tooltip>

          <style>{`
          @keyframes ring-progress {
            0% {
              stroke-dashoffset: 100;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }

          .animate-ring-progress {
            animation: ring-progress 0.8s ease-out forwards;
          }
        `}</style>
        </div>
      </div>
    )
  },
)

SaveSubtitleButton.displayName = 'SaveSubtitleButton'
