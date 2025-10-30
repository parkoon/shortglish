/**
 * 단어와 구두점 정보
 */
export type WordWithPunctuation = {
  prefix: string // 앞 구두점
  word: string // 순수 단어
  suffix: string // 뒤 구두점
}

/**
 * 문장을 단어와 구두점으로 분리합니다.
 *
 * @param sentence - 분리할 문장
 * @returns 단어와 구두점 정보 배열
 *
 * @example
 * parseWordsWithPunctuation('"Hello, world!"')
 * // [{ prefix: '"', word: "Hello", suffix: "," }, { prefix: "", word: "world", suffix: '!"' }]
 *
 * parseWordsWithPunctuation('okay,hold')
 * // [{ prefix: '', word: 'okay', suffix: ',' }, { prefix: '', word: 'hold', suffix: '' }]
 */
export const parseWordsWithPunctuation = (sentence: string): WordWithPunctuation[] => {
  // 구두점 뒤에 알파벳이 바로 오는 경우 공백 추가 (예: "okay,hold" -> "okay, hold")
  const normalized = sentence.replace(/([,!?;:.~'"-])([a-zA-Z])/g, '$1 $2')

  const tokens = normalized.trim().split(/\s+/)

  return tokens.map(token => {
    // 앞뒤 구두점 추출
    const match = token.match(/^([,!?;:.~'"-]*)(.+?)([,!?;:.~'"-]*)$/)

    if (match) {
      return {
        prefix: match[1],
        word: match[2],
        suffix: match[3],
      }
    }

    return {
      prefix: '',
      word: token,
      suffix: '',
    }
  })
}

/**
 * WordWithPunctuation 배열에서 순수 단어만 추출
 *
 * @param wordsWithPunctuation - 단어와 구두점 정보 배열
 * @returns 순수 단어 배열
 *
 * @example
 * extractWords([{ word: "Hello", punctuation: "," }]) // ["Hello"]
 */
export const extractWords = (wordsWithPunctuation: WordWithPunctuation[]): string[] => {
  return wordsWithPunctuation.map(w => w.word)
}

/**
 * 문장을 단어 배열로 분리합니다.
 * 공백을 기준으로 분리하며, 구두점은 단어에 포함됩니다.
 *
 * @param sentence - 분리할 문장
 * @returns 단어 배열
 *
 * @example
 * splitSentenceToWords("Hello, world!") // ["Hello,", "world!"]
 */
export const splitSentenceToWords = (sentence: string): string[] => {
  return sentence.trim().split(/\s+/)
}

/**
 * Fisher-Yates 알고리즘을 사용하여 배열을 무작위로 섞습니다.
 * 원본 배열은 변경되지 않습니다.
 *
 * @param array - 섞을 배열
 * @returns 섞인 새로운 배열
 *
 * @example
 * shuffleArray([1, 2, 3, 4]) // [3, 1, 4, 2] (랜덤)
 */
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]]
  }

  return shuffled
}
