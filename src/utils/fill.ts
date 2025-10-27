/**
 * 대소문자 무시 및 구두점 제거하여 정규화
 */
export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[,!?;:.~'"()-]/g, '')
    .trim()
}

/**
 * 빈칸이 있는 문장 생성
 * @param text 원본 문장
 * @param blankedWords 빈칸으로 만들 단어들
 * @returns 빈칸 처리된 단어 배열과 위치 정보
 */
export const extractBlankedSentence = (
  text: string,
  blankedWords: string[],
): {
  displayWords: Array<{ word: string; isBlank: boolean }>
  blankedPositions: number[]
} => {
  const words = text.split(' ')
  const displayWords: Array<{ word: string; isBlank: boolean }> = []
  const blankedPositions: number[] = []

  words.forEach((word, index) => {
    // 구두점 제거하고 단어만 추출
    const normalizedWord = normalizeText(word)
    const isBlanked = blankedWords.some(blankWord => normalizeText(blankWord) === normalizedWord)

    if (isBlanked) {
      blankedPositions.push(index)
      displayWords.push({ word, isBlank: true })
    } else {
      displayWords.push({ word, isBlank: false })
    }
  })

  return { displayWords, blankedPositions }
}

/**
 * Web Speech API를 사용한 TTS
 */
export const speakText = (text: string) => {
  if (!window.speechSynthesis) {
    console.warn('TTS not supported in this browser')
    return
  }

  // 기존 말하기 중단
  window.speechSynthesis.cancel()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = 0.9 // 속도 (0.1 ~ 10)
  utterance.pitch = 1 // 음높이 (0 ~ 2)

  window.speechSynthesis.speak(utterance)
}
