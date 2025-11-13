/**
 * 토스 API 서비스
 * 비즈니스 로직 처리
 */

import { env } from '../config/env'
import { httpRequest } from '../utils/http-client'
import type {
  GenerateTokenRequest,
  GenerateTokenResponse,
  LoginMeResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UnlinkByUserKeyRequest,
  UnlinkResponse,
} from '../types/toss'

/**
 * 인가 코드로 AccessToken 발급
 */
export async function generateToken(
  requestData: GenerateTokenRequest
): Promise<GenerateTokenResponse['success']> {
  const url = `${env.TOSS_API_BASE_URL}/api-partner/v1/apps-in-toss/user/oauth2/generate-token`

  const data = await httpRequest<GenerateTokenResponse>(url, {
    method: 'POST',
    body: requestData,
  })

  if (data.resultType !== 'SUCCESS') {
    throw new Error('Failed to generate token: Invalid response')
  }

  return data.success
}

/**
 * RefreshToken으로 AccessToken 재발급
 */
export async function refreshToken(
  requestData: RefreshTokenRequest
): Promise<RefreshTokenResponse['success']> {
  const url = `${env.TOSS_API_BASE_URL}/api-partner/v1/apps-in-toss/user/oauth2/refresh-token`

  const data = await httpRequest<RefreshTokenResponse>(url, {
    method: 'POST',
    body: requestData,
  })

  if (data.resultType !== 'SUCCESS') {
    throw new Error('Failed to refresh token: Invalid response')
  }

  return data.success
}

/**
 * AccessToken으로 사용자 정보 조회
 */
export async function getUserInfo(accessToken: string): Promise<LoginMeResponse['success']> {
  const url = `${env.TOSS_API_BASE_URL}/api-partner/v1/apps-in-toss/user/oauth2/login-me`

  const data = await httpRequest<LoginMeResponse>(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (data.resultType !== 'SUCCESS') {
    throw new Error('Failed to get user info: Invalid response')
  }

  return data.success
}

/**
 * AccessToken으로 로그인 연결 끊기
 */
export async function unlinkByAccessToken(accessToken: string): Promise<void> {
  const url = `${env.TOSS_API_BASE_URL}/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-access-token`

  await httpRequest<void>(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

/**
 * userKey로 로그인 연결 끊기
 */
export async function unlinkByUserKey(
  accessToken: string,
  requestData: UnlinkByUserKeyRequest
): Promise<UnlinkResponse['success']> {
  const url = `${env.TOSS_API_BASE_URL}/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key`

  const data = await httpRequest<UnlinkResponse>(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: requestData,
  })

  if (data.resultType !== 'SUCCESS') {
    throw new Error('Failed to unlink: Invalid response')
  }

  return data.success
}

