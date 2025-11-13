/**
 * HTTP 클라이언트 유틸리티
 * 클라이언트 인증서를 포함한 HTTPS 요청 헬퍼
 */

import * as https from 'https'
import * as http from 'http'

import { loadClientCert } from '../config/cert'

export interface HttpClientOptions {
  method?: string
  headers?: Record<string, string>
  body?: unknown
  useHttps?: boolean
}

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
 * @param url 요청 URL
 * @param options 요청 옵션
 * @returns 응답 데이터
 */
export async function httpRequest<T>(
  url: string,
  options: HttpClientOptions = {}
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

