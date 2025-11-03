/**
 * Quiz 텍스트 파싱 유틸리티
 */

export type QuizWordItem = {
  type: 'word' | 'blank'
  text: string
  prefix?: string // 앞 구두점
  suffix?: string // 뒤 구두점
}

/**
 * 퀴즈 텍스트를 파싱하여 일반 단어와 빈칸 단어를 구분
 * 예: "Why don't you {give} {it} {a} {try}?" 
 * → [
 *     { type: 'word', text: 'Why' },
 *     { type: 'word', text: "don't" },
 *     { type: 'word', text: 'you' },
 *     { type: 'blank', text: 'give' },
 *     { type: 'blank', text: 'it' },
 *     { type: 'blank', text: 'a' },
 *     { type: 'blank', text: 'try', suffix: '?' }
 *   ]
 */
export const parseQuizText = (text: string): QuizWordItem[] => {
  const result: QuizWordItem[] = []
  
  // {단어}와 일반 단어를 구분하는 정규식
  const pattern = /(\{[^}]+\}|[^\s{]+)/g
  const matches = text.match(pattern)
  
  if (!matches) return []
  
  matches.forEach(match => {
    // {단어} 형태인 경우
    if (match.startsWith('{') && match.endsWith('}')) {
      const word = match.slice(1, -1) // { } 제거
      result.push({
        type: 'blank',
        text: word,
      })
    } else {
      // 일반 단어: 구두점 분리
      const punctuationPattern = /^([^a-zA-Z0-9]*)([a-zA-Z0-9']+)([^a-zA-Z0-9]*)$/
      const punctMatch = match.match(punctuationPattern)
      
      if (punctMatch) {
        const [, prefix, word, suffix] = punctMatch
        result.push({
          type: 'word',
          text: word,
          prefix: prefix || undefined,
          suffix: suffix || undefined,
        })
      } else {
        // 구두점만 있는 경우
        result.push({
          type: 'word',
          text: match,
        })
      }
    }
  })
  
  return result
}

/**
 * 빈칸 단어만 추출
 * 예: "Why don't you {give} {it}?" → ["give", "it"]
 */
export const extractBlankWords = (text: string): string[] => {
  const pattern = /\{([^}]+)\}/g
  const blanks: string[] = []
  let match
  
  while ((match = pattern.exec(text)) !== null) {
    blanks.push(match[1])
  }
  
  return blanks
}

