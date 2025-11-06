# 앱인토스 토스 로그인 구현 계획

## 개요

앱인토스 환경에서 토스 로그인을 구현하여 사용자가 토스 계정으로 간편하게 로그인할 수 있도록 합니다. `@apps-in-toss/web-framework`의 토스 로그인 API를 사용하고, 복호화된 userKey를 Supabase에 저장하여 사용자를 식별합니다.

## 참고 문서

- [토스 로그인 이해하기](https://developers-apps-in-toss.toss.im/login/intro.html)
- [토스 로그인 콘솔 가이드](https://developers-apps-in-toss.toss.im/login/console.html)
- [토스 로그인 개발하기](https://developers-apps-in-toss.toss.im/login/develop.html)
- [토스 로그인 QA 진행하기](https://developers-apps-in-toss.toss.im/login/qa.html)
- [API 레퍼런스](https://developers-apps-in-toss.toss.im/api/overview.html)

## 토스 로그인 개요

### 토스 로그인이란?
- **토스 계정**으로 빠르고 안전하게 로그인할 수 있는 기능
- 로그인 시 사용자에게 표시될 **동의 항목을 설정** 가능
- 앱인토스 서비스 운영을 위한 **약관/동의문**과 **연결 끊기 콜백 정보** 등록 가능

### 토스 로그인의 장점
- 별도 폼 작성 없이 바로 가입·로그인되어 매끄러운 회원가입 경험
- 토스에서 직접 제공하는 신뢰도 높은 사용자 정보 제공
- 재방문 시 자동/원클릭 로그인 가능
- 앱 재설치나 기기 변경에도 같은 사용자로 매칭되어 CS 부담 감소

### 필수 연동 기능
아래 기능을 사용하기 위해서는 **토스 로그인을 필수로 연동**해야 합니다:
- 기능성 푸시, 알림
- 프로모션 (토스 로그인)
- 토스페이

## 구현 계획

### 1. 토스 로그인 API 래퍼 생성

**파일**: `src/lib/toss-login.ts` (신규)

- `@apps-in-toss/web-framework`의 토스 로그인 API 사용
- `startLogin()` 호출 및 응답 처리
- 복호화 로직 구현 (복호화 키는 환경변수로 관리)
- userKey 추출 및 반환

**주요 함수**:
```typescript
// 토스 로그인 시작
startTossLogin(): Promise<string> // userKey 반환

// 복호화 함수
decryptTossResponse(encryptedData: string): string // userKey 반환
```

### 2. 인증 상태 관리 Store

**파일**: `src/stores/auth-store.ts` (신규)

- Zustand store로 로그인 상태 관리
- userKey 저장
- 로그인/로그아웃 액션
- persist middleware로 로그인 상태 유지

**Store 구조**:
```typescript
type AuthState = {
  isLoggedIn: boolean
  userKey: string | null
  login: (userKey: string) => void
  logout: () => void
}
```

### 3. ProtectedRoute 업데이트

**파일**: `src/lib/auth.tsx` (수정)

- `auth-store`의 로그인 상태 확인
- 미로그인 시 로그인 페이지로 리다이렉트
- 리다이렉트 후 원래 페이지로 돌아올 수 있도록 처리

### 4. 로그인 페이지 생성

**파일**: `src/app/pages/auth/login/page.tsx` (신규)

- 토스 로그인 버튼 UI
- 토스 로그인 API 호출
- 로그인 성공 후 리다이렉트 처리
- 로딩 상태 표시

### 5. 사용자 API 함수 추가

**파일**: `src/api/endpoints.ts` (수정)

- `createOrGetUser(userKey: string)` - Supabase에 사용자 생성/조회
- userKey를 기반으로 사용자 식별

**파일**: `src/api/mutations.ts` (수정)

- 사용자 생성/조회 mutation 추가

### 6. 환경변수 설정

**파일**: `src/config/env.ts` (수정)

- `TOSS_DECRYPT_KEY` 환경변수 추가 (복호화 키)
- Zod 스키마에 추가

### 7. 라우팅 설정

**파일**: `src/config/paths.ts` (수정)

- 로그인 페이지 경로 추가:
  ```typescript
  auth: {
    login: {
      path: '/auth/login',
      getHref: (redirectTo?: string) => `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`
    }
  }
  ```

**파일**: `src/app/router.tsx` (수정)

- 로그인 페이지 라우트 추가
- ProtectedRoute 적용 (필요한 페이지에)

### 8. Supabase 스키마

**데이터베이스 마이그레이션 필요**:

`user` 테이블 생성:
```sql
CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  toss_user_key TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_toss_user_key ON "user"(toss_user_key);
```

## 구현 플로우

### 로그인 플로우

1. 사용자가 "토스로 로그인" 버튼 클릭
2. `startTossLogin()` 호출
3. `@apps-in-toss/web-framework`의 `startLogin()` API 호출
4. 토스 앱에서 로그인 진행 (사용자 동의)
5. 암호화된 응답 데이터 수신
6. 복호화 키로 복호화하여 userKey 추출
7. Supabase에 userKey로 사용자 생성/조회 (`createOrGetUser`)
8. `auth-store`에 로그인 상태 저장 (`login(userKey)`)
9. 리다이렉트 처리 (원래 페이지 또는 홈)

### 로그아웃 플로우

1. 사용자가 로그아웃 버튼 클릭
2. `auth-store`의 `logout()` 호출
3. 로그인 페이지로 리다이렉트

### 연결 끊기 플로우 (선택사항)

1. 사용자가 토스 앱에서 연결 끊기
2. 콜백 URL로 요청 수신
3. 해당 userKey의 사용자 상태 업데이트 또는 삭제

## 보안 고려사항

1. **복호화 키 관리**
   - 복호화 키는 절대 코드에 하드코딩하지 않음
   - 환경변수로 관리 (`VITE_APP_TOSS_DECRYPT_KEY`)
   - 안전한 내부 비밀 저장소에 보관 (Secret Manager 등)

2. **userKey 저장**
   - userKey는 민감한 정보이므로 안전하게 저장
   - localStorage 또는 Zustand persist로 저장 (암호화 고려)

3. **콜백 URL 보안**
   - 연결 끊기 콜백 URL은 인증된 요청만 처리
   - 토스에서 보내는 요청인지 검증 필요

## 확인 필요 사항

### 1. @apps-in-toss/web-framework API 확인

다음 사항들을 확인해야 합니다:
- 토스 로그인 API 메서드 이름 (`startLogin` 또는 다른 이름?)
- API 호출 방법 및 파라미터
- 응답 데이터 구조 (암호화된 데이터 형식)
- 에러 처리 방법

**확인 방법**:
```typescript
// @apps-in-toss/web-framework에서 제공하는 API 확인
import { startLogin } from '@apps-in-toss/web-framework'
// 또는
import { tossLogin } from '@apps-in-toss/web-framework'
```

### 2. 복호화 키 관리

- 콘솔에서 발급받은 복호화 키를 어디에 저장할지 결정
- 환경변수로 관리할지, 별도 설정 파일인지
- 개발/프로덕션 환경별로 다른 키 사용

### 3. 기존 서비스 연동

- 기존 토스 로그인 서비스가 있는지 확인
- 있다면 userKey 매핑 설정 필요
- 콘솔에서 서비스 등록 상태 확인

### 4. 보호할 페이지 결정

현재는 모든 페이지가 공개되어 있습니다. 다음 중 선택:
- 모든 페이지 보호 (로그인 필수)
- 특정 페이지만 보호 (예: my 페이지, 학습 진행 데이터)
- 선택적으로 보호 (로그인 시 추가 기능 제공)

## 구현 순서

1. **토스 로그인 API 확인** - `@apps-in-toss/web-framework` 문서 및 타입 확인
2. **환경변수 설정** - 복호화 키 환경변수 추가
3. **Auth Store 생성** - Zustand store로 로그인 상태 관리
4. **토스 로그인 라이브러리** - API 래퍼 및 복호화 로직 구현
5. **Supabase 스키마** - user 테이블 생성
6. **사용자 API** - createOrGetUser 함수 구현
7. **로그인 페이지** - UI 및 로그인 플로우 구현
8. **ProtectedRoute** - 인증 체크 및 리다이렉트 구현
9. **라우팅 설정** - 로그인 페이지 라우트 추가
10. **테스트** - 로그인/로그아웃 플로우 테스트

## 참고사항

- 토스 로그인은 앱인토스 환경에서만 동작합니다 (웹에서는 테스트 불가)
- 샌드박스 환경에서 먼저 테스트 후 프로덕션 적용
- 콘솔에서 동의 항목, 약관, 콜백 URL 등을 미리 설정해야 합니다
- 복호화 키는 재발급이 어려우므로 안전하게 보관해야 합니다

