/**
 * 쉐도잉 텍스트 파싱 유틸리티
 * 
 * 약속:
 * - `-` = 띄어쓰기 구분자
 * - `{}` = 강조 표시
 * - `|` = 세그먼트 구분자 (끊어읽기)
 */

import type { ParsedShadowingText } from '../_types/shadowing'

/**
 * 쉐도잉 텍스트를 파싱하여 2차원 배열로 변환
 * 
 * @param text - 파싱할 텍스트 (예: "Thuh-{FIRST}-thing|I-{TRY}da-do")
 * @returns 파싱된 2차원 배열 [세그먼트][부분]
 * 
 * @example
 * parseShadowingText("Thuh-{FIRST}-thing|I-{TRY}da-do")
 * // [
 * //   [{ text: "Thuh", isStrong: false }, { text: "FIRST", isStrong: true }, { text: "thing", isStrong: false }],
 * //   [{ text: "I", isStrong: false }, { text: "TRY", isStrong: true }, { text: "da-do", isStrong: false }]
 * // ]
 */
export const parseShadowingText = (text: string): ParsedShadowingText => {
  return text.split('|').map(segment => {
    return segment.split('-').map(part => {
      const strongMatch = part.match(/\{([^}]+)\}/)
      if (strongMatch) {
        return { text: strongMatch[1], isStrong: true }
      }
      return { text: part, isStrong: false }
    })
  })
}

