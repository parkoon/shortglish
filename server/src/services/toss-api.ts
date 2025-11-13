/**
 * 토스 API 클라이언트 서비스
 * 클라이언트 인증서를 포함한 HTTP 클라이언트
 */

import * as https from 'https'
import * as http from 'http'

import { env } from '../config/env'
import { loadClientCert } from '../config/cert'
import type {
  GenerateTokenErrorResponse,
  GenerateTokenRequest,
  GenerateTokenResponse,
  LoginMeErrorResponse,
  LoginMeResponse,
  RefreshTokenErrorResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  UnlinkByUserKeyRequest,
  UnlinkResponse,
} from '../types/toss'

/**
 * 클라이언트 인증서를 포함한 HTTPS 요청 옵션 생성
 */
function createHttpsOptions(): https.RequestOptions {
  const certConfig = loadClientCert()

  if (!certConfig) {
    throw new Error('클라이언트 인증서를 로드할 수 없습니다.')
  }

  return {
    cert: certConfig.cert,
    key: certConfig.key,
  }
}

/**
 * HTTP 요청 헬퍼 함수
 */
async function request<T>(
  url: string,
  options: {
    method?: string
    headers?: Record<string, string>
    body?: unknown
    useHttps?: boolean
  } = {},
): Promise<T> {
  const { method = 'GET', headers = {}, body, useHttps = true } = options

  return new Promise((resolve, reject) => {
    const urlObj = new URL(url)
    const requestOptions: https.RequestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (useHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    }

    // HTTPS이고 클라이언트 인증서가 필요한 경우
    if (useHttps && urlObj.protocol === 'https:') {
      try {
        const certOptions = createHttpsOptions()
        Object.assign(requestOptions, certOptions)
      } catch (error) {
        reject(error)
        return
      }
    }

    const req = (useHttps ? https : http).request(requestOptions, res => {
      let data = ''

      res.on('data', chunk => {
        data += chunk
      })

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data) as T)
          } catch (error) {
            reject(new Error(`Failed to parse response: ${data}`))
          }
        } else {
          try {
            const errorData = JSON.parse(data)
            reject(new Error(`API Error: ${JSON.stringify(errorData)}`))
          } catch {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`))
          }
        }
      })
    })

    req.on('error', reject)

    if (body) {
      req.write(JSON.stringify(body))
    }

    req.end()
  })
}

/**
 * 인가 코드로 AccessToken 발급
 */
export async function generateToken(
  request: GenerateTokenRequest,
): Promise<GenerateTokenResponse['success']> {
  const url = `${env.TOSS_API_BASE_URL}/api-partner/v1/apps-in-toss/user/oauth2/generate-token`

  try {
    const data = await request<GenerateTokenResponse>(url, {
      method: 'POST',
      body: request,
    })

    if (data.resultType !== 'SUCCESS') {
      throw new Error('Failed to generate token: Invalid response')
    }

    return data.success
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to generate token')
  }
}

/**
 * RefreshToken으로 AccessToken 재발급
 */
export async function refreshToken(
  request: RefreshTokenRequest,
): Promise<RefreshTokenResponse['success']> {
  const url = `${env.TOSS_API_BASE_URL}/api-partner/v1/apps-in-toss/user/oauth2/refresh-token`

  try {
    const data = await request<RefreshTokenResponse>(url, {
      method: 'POST',
      body: request,
    })

    if (data.resultType !== 'SUCCESS') {
      throw new Error('Failed to refresh token: Invalid response')
    }

    return data.success
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to refresh token')
  }
}

/**
 * AccessToken으로 사용자 정보 조회
 */
export async function loginMe(accessToken: string): Promise<LoginMeResponse['success']> {
  const url = `${env.TOSS_API_BASE_URL}/api-partner/v1/apps-in-toss/user/oauth2/login-me`

  try {
    const data = await request<LoginMeResponse>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (data.resultType !== 'SUCCESS') {
      throw new Error('Failed to get user info: Invalid response')
    }

    return data.success
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to get user info')
  }
}

/**
 * AccessToken으로 로그인 연결 끊기
 */
export async function unlinkByAccessToken(accessToken: string): Promise<void> {
  const url = `${env.TOSS_API_BASE_URL}/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-access-token`

  try {
    await request<void>(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to unlink')
  }
}

/**
 * userKey로 로그인 연결 끊기
 */
export async function unlinkByUserKey(
  accessToken: string,
  request: UnlinkByUserKeyRequest,
): Promise<UnlinkResponse['success']> {
  const url = `${env.TOSS_API_BASE_URL}/api-partner/v1/apps-in-toss/user/oauth2/access/remove-by-user-key`

  try {
    const data = await request<UnlinkResponse>(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: request,
    })

    if (data.resultType !== 'SUCCESS') {
      throw new Error('Failed to unlink: Invalid response')
    }

    return data.success
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Failed to unlink')
  }
}

