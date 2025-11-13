# Shortglish

숏폼으로 배우는 영어 학습 앱

## 시작하기

### 의존성 설치

```bash
yarn install
```

### 개발 서버 실행

```bash
yarn dev
```

또는 웹 전용으로 실행:

```bash
yarn dev:web
```

### 빌드

```bash
yarn build
```

## 환경 변수 설정

`.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
VITE_APP_POSTHOG_KEY=your_posthog_key
VITE_APP_POSTHOG_HOST=your_posthog_host
VITE_APP_SUPABASE_URL=your_supabase_url
VITE_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_API_BASE_URL=http://localhost:4000
VITE_APP_TOSS_DECRYPT_KEY=your_decrypt_key
VITE_APP_TOSS_AAD=TOSS
```

## 주요 기능

- 토스 로그인 연동
- 영어 학습 콘텐츠
- 퀴즈 및 학습 진도 관리
- 비디오 기반 학습

## 기술 스택

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- React Query
- Tailwind CSS
