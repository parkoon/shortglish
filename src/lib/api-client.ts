/**
 * 공통 API 클라이언트 (Axios)
 * 에러 처리 및 응답 변환을 중앙화합니다.
 */

import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig } from 'axios'

import type { ApiErrorResponse, ApiSuccessResponse } from '@/api/types'
import { env } from '@/config/env'

/**
 * API 클라이언트 인스턴스 생성
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * 요청 인터셉터: Authorization 헤더 자동 추가 등
 */
apiClient.interceptors.request.use(
  async config => {
    // 토스 AccessToken이 있으면 자동으로 추가
    const { getAccessToken, hasValidToken } = await import('./toss/toss-token')

    if (hasValidToken()) {
      const token = getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }

    return config
  },
  error => {
    return Promise.reject(error)
  },
)

/**
 * 응답 인터셉터: 에러 처리 및 응답 변환
 */
apiClient.interceptors.response.use(
  response => {
    // 성공 응답: ApiSuccessResponse 형식으로 변환
    const responseData = response.data as ApiSuccessResponse<unknown>

    if (!responseData.success) {
      // success가 false인 경우 에러로 처리
      const errorMessage =
        (responseData as unknown as ApiErrorResponse).error ||
        responseData.message ||
        '요청 처리 중 오류가 발생했습니다.'
      throw new Error(errorMessage)
    }

    // data만 반환하도록 변환
    return {
      ...response,
      data: responseData.data,
    }
  },
  (error: AxiosError<ApiErrorResponse | unknown>) => {
    // 에러 응답 처리
    if (error.response) {
      const errorData = error.response.data

      // ApiErrorResponse 형식인지 확인
      if (
        errorData &&
        typeof errorData === 'object' &&
        'error' in errorData &&
        'success' in errorData &&
        !(errorData as ApiErrorResponse).success
      ) {
        const apiError = errorData as ApiErrorResponse
        const errorMessage = apiError.error || apiError.message || error.message
        throw new Error(errorMessage)
      }

      // 일반 객체 형태의 에러 메시지가 있는 경우
      if (errorData && typeof errorData === 'object' && 'message' in errorData) {
        const errorMessage =
          (errorData as { message?: string }).message ||
          error.message ||
          '요청 처리 중 오류가 발생했습니다.'
        throw new Error(errorMessage)
      }

      // 백엔드 에러 형식이 아닌 경우
      throw new Error(error.message || '요청 처리 중 오류가 발생했습니다.')
    }

    // 네트워크 에러 등
    throw new Error(error.message || '네트워크 오류가 발생했습니다.')
  },
)

/**
 * 타입 안전한 API 요청 헬퍼
 */
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  const response = await apiClient.request<T>(config)
  return response.data
}
