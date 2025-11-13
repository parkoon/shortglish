/**
 * 토스 SDK 통합
 */

import type { TossAuthorizationResponse } from '@/api/toss/types'

type TossFramework = typeof import('@apps-in-toss/web-framework')

type TossModule = {
  appLogin: Awaited<TossFramework>['appLogin']
}

let tossModule: TossModule | null = null

/**
 * 토스 모듈을 동적으로 로드합니다.
 * 웹 환경에서는 모듈이 없을 수 있으므로 null을 반환합니다.
 */
export const loadTossModule = async (): Promise<TossModule | null> => {
  if (tossModule !== null) {
    return tossModule
  }

  try {
    const module = await import('@apps-in-toss/web-framework')
    tossModule = {
      appLogin: module.appLogin,
    }
    return tossModule
  } catch {
    // 웹 환경에서는 모듈이 없을 수 있음
    return null
  }
}

/**
 * 토스 모듈이 사용 가능한지 확인합니다.
 */
export const isTossAvailable = async (): Promise<boolean> => {
  const module = await loadTossModule()
  return module !== null
}

/**
 * 토스 로그인을 시작하고 인가 코드를 받습니다.
 * @returns 인가 코드와 referrer
 * @throws 토스 SDK가 사용 불가능하거나 로그인에 실패한 경우
 */
export const requestTossLogin = async (): Promise<TossAuthorizationResponse> => {
  const module = await loadTossModule()

  if (!module) {
    throw new Error('토스 SDK를 사용할 수 없습니다. 토스 앱 환경에서 실행해주세요.')
  }

  try {
    const result = await module.appLogin()
    return {
      authorizationCode: result.authorizationCode,
      referrer: result.referrer as 'sandbox' | 'DEFAULT',
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`토스 로그인 실패: ${error.message}`)
    }
    throw new Error('토스 로그인 중 알 수 없는 오류가 발생했습니다.')
  }
}
