/**
 * 토스 API 타입 정의
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
 * AccessToken 발급 실패 응답
 */
export interface GenerateTokenErrorResponse {
  error?: string | {
    errorCode: string
    reason: string
  }
  resultType?: 'FAIL'
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
 * RefreshToken 실패 응답
 */
export interface RefreshTokenErrorResponse {
  errorCode?: string
  reason?: string
  resultType?: 'FAIL'
  error?: {
    errorCode: string
    reason: string
  }
}

/**
 * 사용자 정보 조회 응답
 */
export interface LoginMeResponse {
  resultType: 'SUCCESS'
  success: {
    userKey: number
    scope: string
    agreedTerms: string[]
    name: string | null
    phone: string | null
    birthday: string | null
    ci: string | null
    di: null
    gender: string | null
    nationality: string | null
    email: string | null
  }
}

/**
 * 사용자 정보 조회 실패 응답
 */
export interface LoginMeErrorResponse {
  error?: string | {
    errorCode: string
    reason?: string
  }
  resultType?: 'FAIL'
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

