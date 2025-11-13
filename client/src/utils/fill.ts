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
