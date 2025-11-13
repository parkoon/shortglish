# Shortglish

숏폼으로 배우는 영어 학습 앱

## 프로젝트 구조

이 프로젝트는 모노레포 구조로 구성되어 있습니다:

```
shortglish/
├── client/          # 프론트엔드 (React + Vite)
├── server/          # 백엔드 (Express + TypeScript)
└── shared/          # 공통 타입 및 유틸리티
```

## 시작하기

### 전체 의존성 설치

```bash
yarn install
```

### 개발 서버 실행

**프론트엔드:**

```bash
yarn dev:client
# 또는
yarn dev  # 기본값은 client
```

**백엔드:**

```bash
yarn dev:server
```

### 빌드

**전체 빌드:**

```bash
yarn build
```

**개별 빌드:**

```bash
yarn build:client
yarn build:server
```

## 환경 변수 설정

### 프론트엔드 (`client/.env`)

```env
VITE_APP_POSTHOG_KEY=your_posthog_key
VITE_APP_POSTHOG_HOST=your_posthog_host
VITE_APP_SUPABASE_URL=your_supabase_url
VITE_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_API_BASE_URL=http://localhost:4000
VITE_APP_TOSS_DECRYPT_KEY=your_decrypt_key
VITE_APP_TOSS_AAD=TOSS
```

### 백엔드 (`server/.env`)

```env
PORT=4000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
TOSS_API_BASE_URL=https://apps-in-toss-api.toss.im
TOSS_CLIENT_CERT_PATH=./certs/client-cert.pem
TOSS_CLIENT_KEY_PATH=./certs/client-key.pem
TOSS_DECRYPT_KEY=your_decrypt_key
TOSS_AAD=TOSS
```

## 주요 기능

- 토스 로그인 연동
- 영어 학습 콘텐츠
- 퀴즈 및 학습 진도 관리
- 비디오 기반 학습

## 기술 스택

### 프론트엔드

- React 19
- TypeScript
- Vite
- React Router
- Zustand
- React Query
- Tailwind CSS

### 백엔드

- Express
- TypeScript
- Zod

## 배포

자세한 배포 가이드는 각 디렉토리의 README를 참고하세요:

- [백엔드 배포 가이드](./server/DEPLOYMENT.md)
- [백엔드 설정 가이드](./BACKEND_SETUP.md)
