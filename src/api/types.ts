/**
 * 백엔드 API 공통 응답 타입
 */

export type ApiSuccessResponse<T = unknown> = {
  success: true
  data: T
  message?: string
  meta?: {
    timestamp?: string
    [key: string]: unknown
  }
}

export type ApiErrorResponse = {
  success: false
  error: string
  message?: string
  meta?: {
    timestamp?: string
    [key: string]: unknown
  }
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse
