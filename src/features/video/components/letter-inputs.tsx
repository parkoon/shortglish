import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

import { cn } from '@/lib/utils'

type LetterInputsProps = {
  word: string
  value: string
  onChange: (value: string) => void
  onWordComplete?: () => void
  onMoveToPrevWord?: () => void
  isWrong?: boolean
}

export type LetterInputsRef = {
  focus: () => void
  focusLast: () => void
}

/**
 * 각 글자별 input box 렌더링 컴포넌트
 *
 * 책임:
 * - 단어의 각 글자를 개별 input으로 표시
 * - 자동 포커싱 (한 글자 입력 시 다음 칸으로)
 * - Backspace 시 이전 칸으로 이동
 */
export const LetterInputs = forwardRef<LetterInputsRef, LetterInputsProps>(
  ({ word, value, onChange, onWordComplete, onMoveToPrevWord, isWrong = false }, ref) => {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])
    const wordLength = word.length

    // input refs 배열 초기화
    useEffect(() => {
      inputRefs.current = inputRefs.current.slice(0, wordLength)
    }, [wordLength])

    // ref로 focus 메서드 노출
    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRefs.current[0]?.focus()
      },
      focusLast: () => {
        inputRefs.current[wordLength - 1]?.focus()
      },
    }))

    const handleInputChange = (index: number, inputValue: string) => {
      // 한 글자만 입력 가능
      const char = inputValue.slice(-1).toLowerCase()

      if (char && !/^[a-z]$/.test(char)) {
        return
      }

      const newValue = value.split('')
      newValue[index] = char
      const updatedValue = newValue.join('')

      onChange(updatedValue)

      // 다음 input으로 자동 포커싱
      if (char && index < wordLength - 1) {
        inputRefs.current[index + 1]?.focus()
      }

      // 마지막 글자 입력 완료
      if (char && index === wordLength - 1) {
        onWordComplete?.()
      }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        const currentValue = value[index]

        // 현재 칸이 비어있으면
        if (!currentValue) {
          e.preventDefault()

          // 첫 번째 칸이면 이전 단어로
          if (index === 0) {
            onMoveToPrevWord?.()
          } else {
            // 같은 단어의 이전 칸으로 이동하고 그 칸의 값 삭제
            const newValue = value.split('')
            newValue[index - 1] = ''
            onChange(newValue.join(''))
            inputRefs.current[index - 1]?.focus()
          }
        }
      }
    }

    return (
      <div className="flex gap-1 justify-center">
        {Array.from({ length: wordLength }).map((_, index) => {
          const letterValue = value[index] || ''

          return (
            <input
              key={index}
              ref={el => {
                inputRefs.current[index] = el
              }}
              type="text"
              maxLength={1}
              value={letterValue}
              onChange={e => handleInputChange(index, e.target.value)}
              onKeyDown={e => handleKeyDown(index, e)}
              className={cn(
                'w-5 h-8 text-center text-xl font-bold border-b-2 bg-transparent',
                'focus:outline-none focus:border-blue-500 transition-colors',
                isWrong && 'border-red-500 text-red-500',
                !isWrong && 'border-gray-300 text-gray-900',
              )}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />
          )
        })}
      </div>
    )
  },
)
