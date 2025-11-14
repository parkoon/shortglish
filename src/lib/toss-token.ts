/**
 * 토스 토큰 저장 및 관리 유틸리티
 */

const ACCESS_TOKEN_KEY = 'toss_access_token'
const REFRESH_TOKEN_KEY = 'toss_refresh_token'
const TOKEN_EXPIRES_AT_KEY = 'toss_token_expires_at'

export interface TokenData {
  accessToken: string
  refreshToken: string
  expiresIn: number // 초 단위
}

/**
 * 토큰 저장
 */
export function saveTokens(tokenData: TokenData): void {
  const expiresAt = Date.now() + tokenData.expiresIn * 1000

  localStorage.setItem(ACCESS_TOKEN_KEY, tokenData.accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokenData.refreshToken)
  localStorage.setItem(TOKEN_EXPIRES_AT_KEY, expiresAt.toString())
}

/**
 * AccessToken 조회
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

/**
 * RefreshToken 조회
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

/**
 * 토큰 만료 시간 조회
 */
export function getTokenExpiresAt(): number | null {
  const expiresAt = localStorage.getItem(TOKEN_EXPIRES_AT_KEY)
  return expiresAt ? parseInt(expiresAt, 10) : null
}

/**
 * 토큰이 만료되었는지 확인
 * @param bufferSeconds 만료 전 버퍼 시간 (초 단위, 기본값: 60초)
 */
export function isTokenExpired(bufferSeconds = 60): boolean {
  const expiresAt = getTokenExpiresAt()
  if (!expiresAt) {
    return true
  }

  const now = Date.now()
  const buffer = bufferSeconds * 1000

  return now >= expiresAt - buffer
}

/**
 * 토큰이 유효한지 확인 (만료되지 않았고 존재하는지)
 */
export function hasValidToken(): boolean {
  const accessToken = getAccessToken()
  if (!accessToken) {
    return false
  }

  return !isTokenExpired()
}

/**
 * 모든 토큰 제거
 */
export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(TOKEN_EXPIRES_AT_KEY)
}

