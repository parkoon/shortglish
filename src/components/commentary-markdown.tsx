import type { Components } from 'react-markdown'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type CommentaryMarkdown = {
  content: string
  className?: string
}

export const CommentaryMarkdown = ({ content, className = '' }: CommentaryMarkdown) => {
  // react-markdown 커스텀 컴포넌트
  const components: Components = {
    h3: ({ children }) => {
      return <h3 className="font-semibold mb-1">{children}</h3>
    },
    ul: ({ children }) => <div className="space-y-1 mb-4">{children}</div>,
    li: ({ children }) => {
      // 일반 텍스트
      return <div className="text-gray-700 leading-relaxed text-sm">- {children}</div>
    },
    p: ({ children }) => {
      // 문단 사이 여백 처리
      return <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    },
  }

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  )
}
