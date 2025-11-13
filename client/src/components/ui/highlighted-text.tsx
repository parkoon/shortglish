import type { ReactNode } from 'react'

type HighlightedTextProps = {
  text: string
  className?: string
  lang?: string
  onHighlightClick?: (word: string) => void
}

export const HighlightedText = ({
  text,
  className = '',
  lang,
  onHighlightClick,
}: HighlightedTextProps) => {
  // 중괄호로 감싸진 텍스트를 찾는 정규식
  const highlightRegex = /\{([^}]+)\}/g

  const renderHighlightedText = (text: string): ReactNode[] => {
    const parts: ReactNode[] = []
    let lastIndex = 0
    let match: RegExpExecArray | null

    while ((match = highlightRegex.exec(text)) !== null) {
      // 하이라이트 이전 텍스트 추가
      if (match.index > lastIndex) {
        parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex, match.index)}</span>)
      }

      // 하이라이트된 텍스트 추가 (중괄호 제거) - underline 스타일
      parts.push(
        <span
          key={`highlight-${match.index}`}
          className="underline decoration-2 decoration-blue-500 cursor-pointer hover:decoration-blue-700 hover:text-blue-700 transition-colors duration-200"
          onClick={() => {
            const word = match?.[1]
            if (word) {
              if (onHighlightClick) {
                onHighlightClick(word)
              } else {
                alert(`클릭한 단어: "${word}"`)
              }
            }
          }}
        >
          {match[1]}
        </span>,
      )

      lastIndex = match.index + match[0].length
    }

    // 마지막 남은 텍스트 추가
    if (lastIndex < text.length) {
      parts.push(<span key={`text-${lastIndex}`}>{text.slice(lastIndex)}</span>)
    }

    return parts
  }

  return <span className={className} lang={lang}>{renderHighlightedText(text)}</span>
}
