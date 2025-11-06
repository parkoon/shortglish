import { IconBackspace, IconCheck } from '@tabler/icons-react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'

import { MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { cn } from '@/lib/utils'

type EnglishKeyboardProps = {
  onKeyPress: (key: string) => void
  onBackspace: () => void
  onShowAnswer?: () => void
  onVoiceMode?: () => void
  onConfirm?: () => void
  bottomOffset?: number
}

export type EnglishKeyboardRef = {
  blinkKey: (letter: string) => void
  stopBlink: () => void
}

const KEYBOARD_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
] as const

export const EnglishKeyboard = forwardRef<EnglishKeyboardRef, EnglishKeyboardProps>(
  ({ onKeyPress, onBackspace, onShowAnswer, onVoiceMode, onConfirm, bottomOffset = 0 }, ref) => {
    const [pressedKey, setPressedKey] = useState<string | null>(null)
    const [blinkingKey, setBlinkingKey] = useState<string | null>(null)
    const blinkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // 깜빡임 중지
    const stopBlink = () => {
      setBlinkingKey(null)
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current)
        blinkIntervalRef.current = null
      }
    }

    // 특정 키 깜빡이기
    const blinkKey = (letter: string) => {
      const lowerLetter = letter.toLowerCase()
      setBlinkingKey(lowerLetter)

      // 깜빡임 중지
      if (blinkIntervalRef.current) {
        clearInterval(blinkIntervalRef.current)
      }

      // 깜빡임 애니메이션 (200ms마다 토글, 총 3번 깜빡임)
      let blinkCount = 0
      blinkIntervalRef.current = setInterval(() => {
        blinkCount++
        if (blinkCount >= 6) {
          // 3번 깜빡임 (켜짐/꺼짐 = 2번씩, 총 6번)
          setBlinkingKey(null)
          if (blinkIntervalRef.current) {
            clearInterval(blinkIntervalRef.current)
            blinkIntervalRef.current = null
          }
        } else {
          // 깜빡임 토글
          setBlinkingKey(prev => (prev === lowerLetter ? null : lowerLetter))
        }
      }, 200) // 200ms마다 토글
    }

    const handleKeyPress = (key: string) => {
      // 키 입력 시 깜빡임 중지
      stopBlink()
      setPressedKey(key)
      onKeyPress(key)
      // 눌림 효과를 위해 짧은 딜레이 후 해제
      setTimeout(() => setPressedKey(null), 150)
    }

    const handleBackspace = () => {
      setPressedKey('backspace')
      onBackspace()
      setTimeout(() => setPressedKey(null), 150)
    }

    // ref로 메서드 노출
    useImperativeHandle(ref, () => ({
      blinkKey,
      stopBlink,
    }))

    return (
      <div
        className="fixed left-0 right-0 z-50 bg-gray-100"
        style={{
          maxWidth: MAX_APP_SCREEN_WIDTH,
          margin: '0 auto',
          bottom: `${bottomOffset}px`,
        }}
      >
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
          {onShowAnswer && (
            <button
              type="button"
              onClick={onShowAnswer}
              className="text-primary text-sm font-medium"
            >
              힌트 보기
            </button>
          )}
          {onVoiceMode && (
            <button
              type="button"
              onClick={onVoiceMode}
              className="text-primary text-sm font-medium"
            >
              음성 듣기
            </button>
          )}
        </div>

        {/* 키보드 */}
        <div className="px-2 py-3 space-y-2 bg-gray-100">
          {/* 첫 번째 줄 */}
          <div className="flex gap-1 justify-center">
            {KEYBOARD_ROWS[0].map(key => (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyPress(key)}
                className={cn(
                  'flex-1 h-12 rounded-lg bg-white text-gray-900 font-medium text-base shadow-sm',
                  'active:bg-gray-100 active:scale-[0.98]',
                  'transition-all duration-100',
                  pressedKey === key && 'bg-gray-100 scale-[0.98]',
                  blinkingKey === key && 'bg-purple-400 text-white',
                )}
              >
                {key}
              </button>
            ))}
          </div>

          {/* 두 번째 줄 */}
          <div className="flex gap-1 justify-center pl-2">
            {KEYBOARD_ROWS[1].map(key => (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyPress(key)}
                className={cn(
                  'flex-1 h-12 rounded-lg bg-white text-gray-900 font-medium text-base shadow-sm',
                  'active:bg-gray-100 active:scale-[0.98]',
                  'transition-all duration-100',
                  pressedKey === key && 'bg-gray-100 scale-[0.98]',
                  blinkingKey === key && 'bg-purple-400 text-white',
                )}
              >
                {key}
              </button>
            ))}
          </div>

          {/* 세 번째 줄 */}
          <div className="flex gap-1 justify-center">
            {/* 빈 영역 (Shift 자리) */}
            <div className="w-12 h-12 rounded-lg bg-gray-300" />
            {KEYBOARD_ROWS[2].map(key => (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyPress(key)}
                className={cn(
                  'flex-1 h-12 rounded-lg bg-white text-gray-900 font-medium text-base shadow-sm',
                  'active:bg-gray-100 active:scale-[0.98]',
                  'transition-all duration-100',
                  pressedKey === key && 'bg-gray-100 scale-[0.98]',
                  blinkingKey === key && 'bg-purple-400 text-white',
                )}
              >
                {key}
              </button>
            ))}
            {/* Backspace 버튼 */}
            <button
              type="button"
              onClick={handleBackspace}
              className={cn(
                'w-16 h-12 rounded-lg bg-gray-300',
                'active:bg-gray-400 active:scale-[0.98]',
                'transition-all duration-100 flex items-center justify-center',
                pressedKey === 'backspace' && 'bg-gray-400 scale-[0.98]',
              )}
            >
              <IconBackspace strokeWidth={1.5} className="text-gray-700" />
            </button>
          </div>

          {/* 네 번째 줄 */}
          <div className="flex gap-1 justify-center">
            {/* 왼쪽 회색 영역 */}
            <div className="w-16 h-12 rounded-lg bg-gray-300" />
            {/* 스페이스바 영역 (회색으로 유지) */}
            <div className="flex-1 h-12 rounded-lg bg-gray-300" />
            {/* 확인 버튼 */}
            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                className={cn(
                  'w-20 h-12 rounded-lg bg-gray-300 flex items-center justify-center gap-1',
                  'active:bg-gray-400 active:scale-[0.98]',
                  'transition-all duration-100',
                )}
              >
                <IconCheck className="w-4 h-4 text-gray-700" />
                <span className="text-sm font-medium text-gray-700">확인</span>
              </button>
            )}
          </div>
        </div>
      </div>
    )
  },
)

EnglishKeyboard.displayName = 'EnglishKeyboard'
