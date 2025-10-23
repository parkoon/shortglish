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
