/**
 * 토스 로그인을 통한 사용자 인증 처리
 */

import { generateToken } from '@/api/toss'
import { getCurrentUser } from '@/api/users'
import type { User } from '@/api/users/types'
import { requestTossLogin } from '@/lib/toss'
import { saveTokens } from '@/lib/toss/toss-token'

/**
 * 토스 로그인 플로우를 실행하고 사용자 정보를 조회합니다.
 * @returns 사용자 정보
 * @throws 로그인 실패 시 에러 발생
 */
export async function signInWithToss(): Promise<{ user: User; tossUserKey: number }> {
  // 1. 토스 SDK를 통해 인가 코드 받기
  const { authorizationCode, referrer } = await requestTossLogin()

  // 2. 인가 코드로 AccessToken 발급
  const tokenData = await generateToken({
    authorizationCode,
    referrer,
  })

  // 3. 토큰 저장
  saveTokens({
    accessToken: tokenData.accessToken,
    refreshToken: tokenData.refreshToken,
    expiresIn: tokenData.expiresIn,
  })

  // 4. 백엔드 API로 사용자 정보 조회 (자동 생성/업데이트)
  const user = await getCurrentUser()

  // 토스 userKey 추출 (externalUserId에서)
  const tossUserKey = parseInt(user.externalUserId, 10)

  return { user, tossUserKey }
}
