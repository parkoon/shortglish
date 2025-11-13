/**
 * 토스 로그인을 통한 Supabase 인증 처리
 */

import { generateToken, loginMe } from '@/api/toss'
import type { DecryptedUserInfo } from '@/api/toss/types'
import { supabase } from '@/lib/supabase'
import { requestTossLogin } from '@/lib/toss'
import { decryptTossUserFields } from '@/utils/toss-decrypt'

/**
 * 토스 로그인 플로우를 실행하고 Supabase에 사용자를 생성/로그인합니다.
 * @returns Supabase User 객체
 * @throws 로그인 실패 시 에러 발생
 */
export async function signInWithToss(): Promise<{ user: any; tossUserKey: number }> {
  // 1. 토스 SDK를 통해 인가 코드 받기
  const { authorizationCode, referrer } = await requestTossLogin()

  // 2. 인가 코드로 AccessToken 발급
  const tokenData = await generateToken({
    authorizationCode,
    referrer,
  })
  console.log('🚀 ~ signInWithToss ~ tokenData:', tokenData)

  // 3. AccessToken으로 사용자 정보 조회
  const userInfo = await loginMe(tokenData.accessToken)

  // 4. 사용자 정보 복호화
  const decryptedInfo = await decryptTossUserFields({
    name: userInfo.name,
    phone: userInfo.phone,
    birthday: userInfo.birthday,
    ci: userInfo.ci,
    gender: userInfo.gender,
    nationality: userInfo.nationality,
    email: userInfo.email,
  })

  const decryptedUserInfo: DecryptedUserInfo = {
    userKey: userInfo.userKey,
    name: decryptedInfo.name,
    phone: decryptedInfo.phone,
    birthday: decryptedInfo.birthday,
    ci: decryptedInfo.ci,
    gender: decryptedInfo.gender as 'MALE' | 'FEMALE' | null,
    nationality: decryptedInfo.nationality as 'LOCAL' | 'FOREIGNER' | null,
    email: decryptedInfo.email,
  }

  // 5. Supabase에 사용자 생성 또는 로그인
  // 토스 userKey를 기반으로 사용자를 식별
  // 토스 userKey를 이메일 형식으로 변환하여 사용 (Supabase Auth는 이메일 기반)
  const email = `toss_${decryptedUserInfo.userKey}@toss.local`
  const password = `toss_${decryptedUserInfo.userKey}_${decryptedUserInfo.ci || 'default'}`

  // 기존 사용자 확인 (토스 userKey로 찾기)
  const { data: currentSession } = await supabase.auth.getSession()
  let existingUser = currentSession?.user

  // 토스 userKey로 기존 사용자 찾기 시도
  if (!existingUser) {
    // 이메일로 로그인 시도
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!signInError && signInData.user) {
      existingUser = signInData.user
    }
  }

  // 사용자 메타데이터 준비
  const userMetadata = {
    tossUserKey: decryptedUserInfo.userKey,
    name: decryptedUserInfo.name,
    phone: decryptedUserInfo.phone,
    birthday: decryptedUserInfo.birthday,
    ci: decryptedUserInfo.ci,
    gender: decryptedUserInfo.gender,
    nationality: decryptedUserInfo.nationality,
    email: decryptedUserInfo.email,
  }

  if (existingUser) {
    // 기존 사용자 정보 업데이트
    const { error: updateError } = await supabase.auth.updateUser({
      data: userMetadata,
    })

    if (updateError) {
      console.error('Failed to update user metadata:', updateError)
    }

    return { user: existingUser, tossUserKey: decryptedUserInfo.userKey }
  } else {
    // 새 사용자 생성
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userMetadata,
      },
    })

    if (signUpError) {
      throw new Error(`Supabase 사용자 생성 실패: ${signUpError.message}`)
    }

    if (!signUpData.user) {
      throw new Error('Supabase 사용자 생성 실패: 사용자 데이터가 없습니다.')
    }

    return { user: signUpData.user, tossUserKey: decryptedUserInfo.userKey }
  }
}
