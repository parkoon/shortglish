/**
 * 토스 로그인 API 타입 정의
 */

/**
 * 인가 코드 요청 응답
 */
export interface TossAuthorizationResponse {
  authorizationCode: string
  referrer: 'sandbox' | 'DEFAULT'
}

/**
 * AccessToken 발급 요청
 */
export interface GenerateTokenRequest {
  authorizationCode: string
  referrer: string
}

/**
 * AccessToken 발급 응답
 */
export interface GenerateTokenResponse {
  resultType: 'SUCCESS'
  success: {
    tokenType: string
    accessToken: string
    refreshToken: string
    expiresIn: number
    scope: string
  }
}

/**
 * RefreshToken 요청
 */
export interface RefreshTokenRequest {
  refreshToken: string
}

/**
 * RefreshToken 응답
 */
export interface RefreshTokenResponse {
  resultType: 'SUCCESS'
  success: {
    tokenType: string
    accessToken: string
    refreshToken: string
    expiresIn: number
    scope: string
  }
}

/**
 * 복호화된 사용자 정보 (서버에서 복호화하여 반환)
 */
export interface DecryptedUserInfo {
  userKey: number
  scope: string
  agreedTerms: string[]
  name?: string
  phone?: string
  birthday?: string // yyyyMMdd 형식
  ci?: string
  gender?: 'MALE' | 'FEMALE'
  nationality?: 'LOCAL' | 'FOREIGNER'
  email?: string | null
}

/**
 * 로그인 연결 끊기 요청 (userKey)
 */
export interface UnlinkByUserKeyRequest {
  userKey: number
}

/**
 * 로그인 연결 끊기 응답
 */
export interface UnlinkResponse {
  resultType: 'SUCCESS'
  success: {
    userKey: number
  }
}
