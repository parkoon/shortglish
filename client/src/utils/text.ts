/**
 * 텍스트 파싱 유틸리티
 *
 * {단어} 패턴을 사용하여 빈칸과 일반 단어를 구분합니다.
 * Quiz와 Fill 페이지에서 공통으로 사용됩니다.
 */

export type ParsedWordItem = {
  type: 'word' | 'blank'
  text: string
  prefix?: string // 앞 구두점
  suffix?: string // 뒤 구두점
}

/**
 * 토큰에서 앞뒤 구두점을 분리
 *
 * @param token - 분리할 토큰 (예: "word,", "!hello", "...okay?")
 * @returns 분리된 prefix, word, suffix
 *
 * @example
 * separatePunctuation("word,")
 * // Returns: { prefix: '', word: 'word', suffix: ',' }
 *
 * @example
 * separatePunctuation("...okay?")
 * // Returns: { prefix: '...', word: 'okay', suffix: '?' }
 */
export const separatePunctuation = (
  token: string,
): { prefix: string; word: string; suffix: string } => {
  const punctuationPattern = /^([^a-zA-Z0-9]*)([a-zA-Z0-9']+)([^a-zA-Z0-9]*)$/
  const match = token.match(punctuationPattern)

  if (match) {
    const [, prefix, word, suffix] = match
    return { prefix, word, suffix }
  }

  // 구두점만 있는 경우나 매칭 실패시 전체를 word로
  return { prefix: '', word: token, suffix: '' }
}

/**
 * {단어} 패턴이 포함된 텍스트를 파싱하여 일반 단어와 빈칸 단어를 구분
 *
 * @param text - 파싱할 텍스트 (예: "Why don't you {give} {it} a {try}?")
 * @returns 파싱된 단어 배열
 *
 * @example
 * parseText("Why don't you {give} {it}?")
 * // Returns:
 * // [
 * //   { type: 'word', text: 'Why' },
 * //   { type: 'word', text: "don't" },
 * //   { type: 'word', text: 'you' },
 * //   { type: 'blank', text: 'give' },
 * //   { type: 'blank', text: 'it', suffix: '?' }
 * // ]
 */
export const parseText = (text: string): ParsedWordItem[] => {
  const result: ParsedWordItem[] = []

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
      const { prefix, word, suffix } = separatePunctuation(match)
      result.push({
        type: 'word',
        text: word,
        prefix: prefix || undefined,
        suffix: suffix || undefined,
      })
    }
  })

  return result
}

/**
 * {단어} 패턴에서 빈칸 단어만 추출
 *
 * @param text - 파싱할 텍스트 (예: "Why don't you {give} {it}?")
 * @returns 빈칸 단어 배열
 *
 * @example
 * extractBlankWords("Why don't you {give} {it}?")
 * // Returns: ["give", "it"]
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

/**
 * {단어} 패턴의 중괄호를 제거하여 완전한 문장으로 변환
 * TTS나 정답 표시 등에 사용
 *
 * @param text - 중괄호가 포함된 텍스트
 * @returns 중괄호가 제거된 텍스트
 *
 * @example
 * removeBraces("Why don't you {give} {it} a {try}?")
 * // Returns: "Why don't you give it a try?"
 */
export const removeBraces = (text: string): string => {
  return text.replace(/\{|\}/g, '')
}
