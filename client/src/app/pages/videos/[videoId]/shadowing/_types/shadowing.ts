/**
 * 쉐도잉 연습 관련 타입 정의
 */

export type ShadowingPart = {
  text: string
  isStrong: boolean
}

export type ShadowingSegment = ShadowingPart[]

export type ParsedShadowingText = ShadowingSegment[]

