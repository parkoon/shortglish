# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드 작업 시 참고하는 가이드입니다.

## 프로젝트 개요

**Shortglish**는 YouTube 쇼츠를 활용한 영어 학습 플랫폼입니다. 사용자는 짧은 영상의 자막을 보며 영어를 학습하고, 다양한 학습 모드(단어 조합, 빈칸 채우기, 쉐도잉 등)를 통해 영어 실력을 향상시킵니다.

### 모노레포 구조

이 프로젝트는 **Yarn Workspaces**를 사용한 모노레포로 구성되어 있습니다:

- **client** (`@shortglish/client`): React 기반 모바일 웹 애플리케이션
- **server** (`@shortglish/server`): Express 기반 OAuth2 프록시 서버

**공통 사양**:
- **패키지 매니저**: Yarn 1.22.22
- **Node 버전**: v22 (`.nvmrc` 참고)
- **TypeScript**: 5.8.3

---

## 명령어

### 루트 레벨 명령어

```bash
# 개발 서버
yarn dev              # client 개발 서버 실행
yarn dev:client       # client 개발 서버 실행 (명시적)
yarn dev:server       # server 개발 서버 실행

# 빌드
yarn build            # client와 server 모두 빌드
yarn build:client     # client만 빌드
yarn build:server     # server만 빌드

# 코드 품질
yarn lint             # client와 server 모두 린트
yarn format           # 전체 프로젝트 포맷팅 (Prettier)
```

### Client 전용 명령어

```bash
cd client
yarn dev              # Granite 개발 서버 (localhost:5173)
yarn build            # 프로덕션 빌드 (granite build)
yarn preview          # 빌드 결과물 미리보기
yarn lint             # ESLint 실행
yarn deploy           # Granite 배포 (ait deploy)
yarn db:types         # Supabase 타입 생성
```

### Server 전용 명령어

```bash
cd server
yarn dev              # 개발 서버 (tsx watch, 포트 4000)
yarn build            # TypeScript 컴파일 (tsc)
yarn start            # 프로덕션 서버 실행
yarn lint             # ESLint 실행
yarn format           # Prettier 포맷팅
```

---

## 기술 스택

### Client (Frontend)

#### 핵심 라이브러리
| 영역 | 라이브러리 | 버전 |
|------|-----------|------|
| **프레임워크** | @apps-in-toss/web-framework | 1.4.2 |
| **UI 프레임워크** | React | 19.1.0 |
| **라우팅** | React Router | 7.6.2 |
| **상태 관리 (로컬)** | Zustand | 5.0.8 |
| **상태 관리 (서버)** | TanStack React Query | 5.81.2 |
| **백엔드** | Supabase | 2.78.0 |
| **스타일링** | TailwindCSS | 4.1.10 |
| **UI 컴포넌트** | Radix UI | - |
| **애니메이션** | Framer Motion | 12.19.1 |
| **아이콘** | Tabler Icons | 3.35.0 |
| **알림** | Sonner | 2.0.7 |
| **Bottom Sheet** | Vaul | 1.1.2 |
| **마크다운** | React Markdown + Remark GFM | 10.1.0 |
| **분석** | PostHog | 1.268.8 |
| **에러 처리** | React Error Boundary | 6.0.0 |
| **SEO** | React Helmet Async | 2.0.5 |
| **Intersection Observer** | react-intersection-observer | 10.0.0 |

#### 개발 도구
- **TypeScript** 5.8.3
- **Vite** 6.3.5
- **ESLint** 9.29.0 (React Hooks, import sorting)
- **Prettier** 3.6.1

### Server (Backend)

#### 런타임 의존성
| 라이브러리 | 버전 | 용도 |
|-----------|------|------|
| **express** | 4.18.2 | 웹 프레임워크 |
| **cors** | 2.8.5 | CORS 미들웨어 |
| **express-rate-limit** | 7.1.5 | Rate limiting |
| **zod** | 3.25.67 | 스키마 검증 |
| **dotenv** | 16.3.1 | 환경변수 로드 |

#### 개발 도구
- **TypeScript** 5.8.3
- **tsx** 4.7.0 (개발 서버)
- **ESLint** 9.29.0
- **Prettier** 3.6.1

---

## Client 아키텍처

Vite, TypeScript, TailwindCSS로 구축된 React SPA이며, Granite 프레임워크를 사용합니다. 모바일 우선 접근 방식을 따릅니다.

### 디렉토리 구조

```
client/
├── .granite/                         # Granite 프레임워크 설정
├── src/
│   ├── app/                          # 애플리케이션 진입점
│   │   ├── index.tsx                 # App 컴포넌트
│   │   ├── provider.tsx              # 전역 프로바이더
│   │   ├── router.tsx                # 라우팅 설정
│   │   └── pages/                    # 페이지 컴포넌트 (lazy loaded)
│   │       ├── home/                 # 홈 페이지
│   │       ├── quiz/                 # 퀴즈 페이지
│   │       ├── videos/               # 비디오 학습 페이지
│   │       │   └── [videoId]/
│   │       │       ├── entry/        # 학습 시작
│   │       │       ├── build/        # 단어 조합
│   │       │       ├── fill/         # 빈칸 채우기
│   │       │       ├── review/       # 복습
│   │       │       └── shadowing/    # 쉐도잉
│   │       ├── auth/                 # 인증 페이지
│   │       └── not-found.tsx
│   │
│   ├── api/                          # API 레이어 (중앙 집중형)
│   │   ├── endpoints.ts              # API 엔드포인트 함수들
│   │   ├── queries.ts                # React Query 훅들
│   │   ├── mutations.ts              # React Query Mutation 훅들
│   │   ├── query-keys.ts             # Query Key 팩토리
│   │   ├── types.ts                  # API 타입 정의
│   │   ├── utils.ts                  # snake_case → camelCase 변환
│   │   └── index.ts                  # 진입점
│   │
│   ├── features/                     # 기능별 모듈 (자체 완결형)
│   │   ├── video/
│   │   │   ├── components/           # 비디오 관련 컴포넌트
│   │   │   │   ├── video-feeds.tsx   # 무한 스크롤 비디오 목록
│   │   │   │   ├── video-category.tsx
│   │   │   │   ├── youtube-player.tsx
│   │   │   │   ├── video-controller.tsx
│   │   │   │   ├── word-sentence-builder.tsx
│   │   │   │   ├── word-slots.tsx
│   │   │   │   ├── word-button.tsx
│   │   │   │   └── letter-inputs.tsx
│   │   │   ├── hooks/
│   │   │   │   └── use-video-category-filter.ts
│   │   │   ├── store/
│   │   │   │   ├── dialogue-completion-store.ts
│   │   │   │   └── video-progress-store.ts
│   │   │   └── utils/
│   │   │       └── difficulty.ts
│   │   └── quiz/
│   │       └── store/
│   │           └── quiz-completion-store.ts
│   │
│   ├── components/                   # 재사용 가능한 컴포넌트
│   │   ├── ui/                       # shadcn/ui 기반 기본 컴포넌트
│   │   │   ├── button.tsx
│   │   │   ├── bottom-sheet.tsx
│   │   │   ├── accordion.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── stepper.tsx
│   │   │   ├── english-keyboard.tsx
│   │   │   ├── highlighted-text.tsx
│   │   │   └── ...
│   │   ├── layouts/                  # 레이아웃 컴포넌트
│   │   │   ├── page-layout.tsx
│   │   │   ├── tab-layout.tsx
│   │   │   ├── cta-layout.tsx
│   │   │   └── interactive-cta-layout.tsx
│   │   ├── debug/                    # 디버그 유틸리티
│   │   │   ├── debug-floating-button.tsx
│   │   │   ├── debug-activation-area.tsx
│   │   │   └── console-log-bottom-sheet.tsx
│   │   └── modal.tsx                 # 전역 모달
│   │
│   ├── stores/                       # 전역 Zustand 상태 관리
│   │   ├── auth-store.ts             # 인증 상태
│   │   ├── modal-store.ts            # 모달 상태
│   │   └── console-log-store.ts      # 콘솔 로그 (디버그)
│   │
│   ├── hooks/                        # 전역 커스텀 훅
│   │   ├── use-app-close-confirm.tsx
│   │   ├── use-primary-color.ts
│   │   └── use-query-param.ts
│   │
│   ├── lib/                          # 유틸리티 라이브러리
│   │   ├── utils.ts                  # cn(), formatDuration()
│   │   ├── react-query.ts            # React Query 설정
│   │   ├── route.ts                  # 라우터 헬퍼
│   │   ├── auth.tsx                  # 인증 유틸리티
│   │   ├── supabase.ts               # Supabase 클라이언트
│   │   ├── analytics.ts              # PostHog 분석
│   │   ├── granite.ts                # Granite 통합
│   │   ├── toss-auth.ts              # Toss 인증
│   │   └── toss.ts                   # Toss 통합
│   │
│   ├── config/                       # 설정 파일
│   │   ├── paths.ts                  # 라우트 경로 정의
│   │   ├── env.ts                    # 환경변수 검증 (Zod)
│   │   └── app.ts                    # 앱 상수
│   │
│   ├── utils/                        # 유틸리티 함수
│   │   ├── sentence.ts               # 문장 처리
│   │   ├── text.ts                   # 텍스트 처리
│   │   ├── thumbnail.ts              # 썸네일 URL 생성
│   │   ├── fill.ts                   # 빈칸 채우기 유틸리티
│   │   ├── logging.ts                # 로깅 유틸리티
│   │   └── toss-decrypt.ts           # Toss 복호화
│   │
│   ├── types/                        # 전역 타입 정의
│   │   ├── database.ts               # Supabase 자동 생성 타입
│   │   ├── subtitle.ts
│   │   └── youtube-iframe.d.ts
│   │
│   ├── assets/                       # 정적 리소스
│   ├── index.css                     # 전역 스타일
│   └── main.tsx                      # 애플리케이션 진입점
│
├── public/                           # 정적 파일
├── index.html
├── vite.config.ts
├── granite.config.ts
├── tsconfig.app.json
├── eslint.config.js
├── components.json
└── package.json
```

### 주요 아키텍처 결정 사항

1. **모노레포 구조**: Yarn Workspaces로 client와 server를 분리하여 관리합니다.

2. **중앙 집중식 API 레이어**:
   - 기존 feature별 API를 `src/api/`로 통합
   - `endpoints.ts`: 모든 API 호출 함수
   - `queries.ts`: React Query 훅
   - `query-keys.ts`: Query Key 팩토리
   - `utils.ts`: snake_case → camelCase 자동 변환

3. **Supabase 백엔드**:
   - 데이터베이스: Supabase PostgreSQL
   - 인증: Supabase Auth
   - 타입 안전성: 자동 생성된 타입 (`types/database.ts`)

4. **Feature-Based 구조**:
   - `src/features/`에 기능 모듈 구성
   - 각 feature는 자체 컴포넌트, 훅, 스토어를 포함

5. **컴포넌트 라이브러리**:
   - Radix UI primitives 기반 shadcn/ui 패턴
   - CVA(Class Variance Authority)로 variant 관리

6. **라우팅**:
   - React Router v7 + lazy loading
   - `paths.ts`에 타입 안전한 경로 정의
   - 코드 스플리팅으로 최적화

7. **상태 관리**:
   - **로컬 상태**: Zustand (UI, 모달, 인증)
   - **서버 상태**: TanStack React Query
   - **지속 상태**: Zustand persist middleware
   - **컴포넌트 상태**: React hooks

8. **프로바이더 구조** (`app/provider.tsx`):
   - QueryClientProvider (React Query)
   - ErrorBoundary (에러 처리)
   - HelmetProvider (SEO)
   - Toaster (Sonner - 알림)
   - Radix Tooltip Provider

9. **모바일 우선 디자인**:
   - 최대 화면 너비: 640px (`MAX_APP_SCREEN_WIDTH`)
   - 앱 바 높이: 52px (`APP_BAR_HEIGHT`)

### 라우팅 구조

**활성 라우트** (`client/src/config/paths.ts`):

```typescript
export const paths = {
  home: {
    root: { path: '/', getHref: () => '/' },
  },
  quiz: {
    root: { path: '/quiz', getHref: () => '/quiz' },
    date: {
      path: '/quiz/:date',
      getHref: (date: string) => `/quiz/${date}`
    },
  },
  videos: {
    entry: {
      path: '/videos/:videoId',
      getHref: (videoId: string) => `/videos/${videoId}`
    },
    build: {
      path: '/videos/:videoId/build',
      getHref: (videoId: string) => `/videos/${videoId}/build`
    },
    fill: {
      path: '/videos/:videoId/fill',
      getHref: (videoId: string) => `/videos/${videoId}/fill`
    },
    review: {
      path: '/videos/:videoId/review',
      getHref: (videoId: string) => `/videos/${videoId}/review`
    },
    shadowing: {
      path: '/videos/:videoId/shadowing',
      getHref: (videoId: string) => `/videos/${videoId}/shadowing`
    },
  },
  auth: {
    tossLogin: { path: '/auth/toss-login', getHref: () => '/auth/toss-login' },
  },
}
```

**학습 플로우**:
1. **Entry**: 비디오 소개 및 학습 시작
2. **Build**: 단어를 조합하여 문장 만들기
3. **Fill**: 빈칸에 알맞은 단어 입력하기
4. **Shadowing**: 음성 녹음 및 쉐도잉 연습
5. **Review**: 전체 대화 복습

**퀴즈 플로우**:
- `/quiz`: 오늘의 패턴 학습
- `/quiz/:date`: 특정 날짜의 패턴 학습

### 상태 관리 상세

#### Zustand Stores

**전역 Store** (`src/stores/`):

1. **auth-store.ts**: 인증 상태 관리
   ```typescript
   {
     user: User | null
     isLoading: boolean
     isInitialized: boolean
     setUser: (user: User | null) => void
     initialize: () => Promise<void>
     signOut: () => Promise<void>
   }
   ```

2. **modal-store.ts**: 전역 모달 상태
   ```typescript
   {
     isOpen: boolean
     config: ModalConfig
     open: (config: ModalConfig) => void
     close: () => void
   }
   ```

3. **console-log-store.ts**: 디버그 콘솔 로그 추적

**Feature Store** (`src/features/*/store/`):

1. **dialogue-completion-store.ts**: 대화 완성 상태 (localStorage 지속)
   ```typescript
   {
     completions: Record<videoId, Record<subtitleIndex, SelectedWordInfo[]>>
     markAsCompleted: (videoId, subtitleIndex, words) => void
     isCompleted: (videoId, subtitleIndex) => boolean
     getCompletedWords: (videoId, subtitleIndex) => SelectedWordInfo[]
     clearVideo: (videoId) => void
   }
   ```

2. **video-progress-store.ts**: 비디오 재생 상태

3. **quiz-completion-store.ts**: 퀴즈 완성 상태

#### React Query 설정

```typescript
// src/lib/react-query.ts
queryConfig = {
  queries: {
    refetchOnWindowFocus: false,  // 윈도우 포커스 시 리페칭 안 함
    retry: false,                  // 재시도 안 함
    staleTime: 1000 * 60,          // 1분 캐시
  }
}
```

#### Query Keys 팩토리 (`src/api/query-keys.ts`)

Query Key를 중앙에서 관리하는 팩토리 패턴:

```typescript
export const queryKeys = {
  videos: {
    all: ['videos'] as const,
    infinite: (categoryId?: string) =>
      ['videos', 'infinite', { categoryId }] as const,
    detail: (videoId: string) =>
      ['videos', 'detail', videoId] as const,
  },
  subtitles: {
    all: ['subtitles'] as const,
    byVideo: (videoId: string) =>
      ['subtitles', videoId] as const,
  },
  categories: {
    all: ['categories'] as const,
  },
  quiz: {
    today: ['quiz', 'today'] as const,
    byDate: (date: string) =>
      ['quiz', 'date', date] as const,
  },
}
```

#### API 레이어 (`src/api/`)

**endpoints.ts**: API 호출 함수들
- `fetchVideos()`: 커서 기반 무한 스크롤 (Supabase)
- `fetchVideoById()`: 비디오 상세 정보
- `fetchSubtitles()`: 자막 데이터
- `fetchVideoCategories()`: 카테고리 목록
- `fetchTodayQuiz()` / `fetchQuizByDate()`: 퀴즈 데이터

**queries.ts**: React Query 훅들
- `useInfiniteVideosQuery()`: 무한 스크롤 비디오 목록
- `useVideoDetailQuery()`: 비디오 상세
- `useSubtitlesQuery()`: 자막
- `useVideoCategoriesQuery()`: 카테고리
- `useTodayQuizQuery()` / `useQuizByDateQuery()`: 퀴즈

**utils.ts**: 유틸리티
- `snakeToCamel()`: snake_case → camelCase 변환
- `objectToCamel()`: 객체 키 변환
- `arrayToCamel()`: 배열 변환

### 핵심 기능

#### 1. 비디오 재생 및 자막 동기화

**주요 파일**:
- `features/video/components/youtube-player.tsx` - YouTube iframe API 래퍼
- `features/video/components/video-controller.tsx` - 재생 컨트롤

**동작 흐름**:
1. YouTube Player 로드 (iframe API)
2. 비디오 재생 상태 감지
3. 현재 시간에 맞는 자막 자동 감지 및 표시
4. 이전/반복/다음 버튼으로 자막 내비게이션

#### 2. 단어 조합 학습 (Build)

**주요 파일**:
- `features/video/components/word-sentence-builder.tsx`
- `features/video/components/word-slots.tsx`
- `features/video/components/word-button.tsx`

**학습 로직**:
1. 문장을 단어로 분리 (`utils/sentence.ts`)
2. Fisher-Yates 알고리즘으로 셔플
3. 사용자가 순서대로 단어 선택
4. 오답 시 취소선 표시
5. 완료 시 `dialogue-completion-store`에 저장

#### 3. 빈칸 채우기 학습 (Fill)

**주요 파일**:
- `features/video/components/letter-inputs.tsx`
- `utils/fill.ts`

**학습 로직**:
1. 특정 단어를 빈칸으로 표시
2. 사용자가 각 글자 입력
3. 자동 포커싱 (한 글자 입력 → 다음 칸)
4. Backspace → 이전 칸
5. Web Speech API로 TTS 지원

#### 4. 쉐도잉 학습 (Shadowing)

**주요 파일**:
- `app/pages/videos/[videoId]/shadowing/page.tsx`
- `app/pages/videos/[videoId]/shadowing/_components/`

**학습 로직**:
1. Step 1: 원어민 대화 듣기
2. Step 2: 문장 따라 읽으며 녹음
3. Step 3: 녹음 재생 및 비교
4. 진행 상황 표시 (ProgressIndicator)
5. 완료 시 모달 표시

#### 5. 패턴 학습 (Quiz)

**주요 파일**:
- `app/pages/quiz/page.tsx` (오늘의 퀴즈)
- `app/pages/quiz/[date]/page.tsx` (특정 날짜)
- `app/pages/quiz/_components/quiz-sentence-builder.tsx`

**데이터 구조**:
```typescript
{
  date: "2025-11-05"
  day: 1
  pattern: "I'm thinking about ~"
  pattern_korean: "나는 ~를 생각하고 있어"
  exercises: QuizExercise[]
}
```

#### 6. 카테고리 필터 & 무한 스크롤

**주요 파일**:
- `features/video/components/video-feeds.tsx`
- `features/video/components/video-category.tsx`
- `features/video/hooks/use-video-category-filter.ts`

**기능**:
- 카테고리별 비디오 필터링
- 무한 스크롤 (React Query Infinite Query + Intersection Observer)
- 커서 기반 페이지네이션 (created_at + id)

---

## Server 아키텍처

Express 기반 OAuth2 프록시 서버로, Toss Login API와 클라이언트 사이의 중개 역할을 합니다.

### 디렉토리 구조

```
server/
├── src/
│   ├── app.ts                        # Express 앱 설정 및 라우팅
│   ├── config/
│   │   ├── env.ts                    # 환경변수 검증 (Zod)
│   │   └── cert.ts                   # 클라이언트 인증서 로드
│   ├── middleware/
│   │   ├── cors.ts                   # CORS 설정
│   │   ├── error-handler.ts          # 에러 핸들러
│   │   └── rate-limit.ts             # Rate limiting
│   ├── routes/
│   │   └── toss/
│   │       ├── generate-token.ts     # POST: 토큰 생성
│   │       ├── refresh-token.ts      # POST: 토큰 갱신
│   │       ├── login-me.ts           # GET: 사용자 정보
│   │       └── unlink.ts             # POST: 연동 해제
│   ├── services/
│   │   └── toss-api.ts               # Toss API HTTP 클라이언트
│   └── types/
│       └── toss.ts                   # Toss API 타입 정의
├── certs/                            # 클라이언트 인증서 (로컬)
├── .env.example
├── package.json
├── tsconfig.json
├── README.md
├── DEPLOYMENT.md                     # Railway 배포 가이드
└── railway.json
```

### 주요 기능

#### 1. OAuth2 프록시
- 클라이언트가 직접 Toss API를 호출하지 않고 서버를 통해 호출
- mTLS(Mutual TLS) 인증서 관리
- API 키 및 시크릿 보호

#### 2. Rate Limiting
- 일반 API: 100 req/15분
- Toss API: 50 req/15분 (더 엄격)

#### 3. CORS 관리
- 허용된 origin만 접근 가능 (`ALLOWED_ORIGINS`)
- Credentials 지원

#### 4. 에러 처리
- 전역 에러 핸들러
- Zod 검증 에러 포맷팅
- 개발 모드에서 스택 트레이스 포함

### API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/health` | 헬스 체크 |
| POST | `/api/toss/generate-token` | OAuth2 토큰 생성 |
| POST | `/api/toss/refresh-token` | 토큰 갱신 |
| GET | `/api/toss/login-me` | 사용자 정보 조회 |
| POST | `/api/toss/unlink/access-token` | Access Token으로 연동 해제 |
| POST | `/api/toss/unlink/user-key` | User Key로 연동 해제 |

### mTLS 인증

**두 가지 로딩 방식**:

1. **Base64 환경변수** (프로덕션 - Railway):
   ```
   TOSS_CLIENT_CERT_BASE64=<base64-encoded-cert>
   TOSS_CLIENT_KEY_BASE64=<base64-encoded-key>
   ```

2. **파일 시스템** (로컬 개발):
   ```
   certs/client-cert.pem
   certs/client-key.pem
   ```

**구현** (`config/cert.ts`):
```typescript
export function loadClientCert(): ClientCertConfig | null {
  // Base64 환경변수 우선
  if (env.TOSS_CLIENT_CERT_BASE64 && env.TOSS_CLIENT_KEY_BASE64) {
    return {
      cert: Buffer.from(env.TOSS_CLIENT_CERT_BASE64, 'base64'),
      key: Buffer.from(env.TOSS_CLIENT_KEY_BASE64, 'base64')
    }
  }

  // 파일 시스템 폴백
  // ...
}
```

### 타입 정의 (`types/toss.ts`)

```typescript
// 토큰 생성
interface GenerateTokenRequest {
  authorizationCode: string
  referrer: string
}

interface GenerateTokenResponse {
  resultType: 'SUCCESS'
  success: {
    tokenType: string
    accessToken: string
    refreshToken: string
    expiresIn: number
    scope: string
  }
}

// 사용자 정보
interface LoginMeResponse {
  resultType: 'SUCCESS'
  success: {
    userKey: number
    scope: string
    agreedTerms: string[]
    name: string | null
    phone: string | null
    // ...
  }
}
```

---

## 환경변수

### Client (`client/.env`)

```typescript
// 필수
VITE_APP_POSTHOG_KEY          // PostHog 분석 키
VITE_APP_POSTHOG_HOST         // PostHog 호스트
VITE_APP_SUPABASE_URL         // Supabase 프로젝트 URL
VITE_APP_SUPABASE_ANON_KEY    // Supabase 익명 키

// 선택 (Toss 로그인)
VITE_APP_API_BASE_URL         // 백엔드 서버 URL (기본: http://localhost:4000)
VITE_APP_TOSS_DECRYPT_KEY     // Toss 복호화 키
VITE_APP_TOSS_AAD             // Toss AAD (기본: TOSS)
```

**검증**: `client/src/config/env.ts`에서 Zod로 검증

### Server (`server/.env`)

```typescript
// 필수
NODE_ENV                      // development | production | test
ALLOWED_ORIGINS               // CORS 허용 origin (쉼표 구분)
TOSS_API_BASE_URL             // Toss API URL (기본: https://apps-in-toss-api.toss.im)

// 인증서 (둘 중 하나 필수)
TOSS_CLIENT_CERT_BASE64       // 클라이언트 인증서 (Base64)
TOSS_CLIENT_KEY_BASE64        // 클라이언트 키 (Base64)
// 또는
TOSS_CLIENT_CERT_PATH         // 인증서 파일 경로
TOSS_CLIENT_KEY_PATH          // 키 파일 경로

// 선택
PORT                          // 포트 (기본: 4000)
TOSS_DECRYPT_KEY              // Toss 복호화 키
TOSS_AAD                      // Toss AAD (기본: TOSS)
```

**검증**: `server/src/config/env.ts`에서 Zod로 검증

---

## 코드 스타일

### 공통

- **ESLint**: TypeScript 규칙, import 정렬
- **Prettier**:
  - 단일 인용부호 (single quotes)
  - 세미콜론 없음 (no semicolons)
  - 라인 폭: 100자
  - trailing commas

### Client

- **경로 별칭**: `@/*` → `src/*`
- **Import 정렬**: ESLint (simple-import-sort)
- **파일명**: kebab-case (예: `video-card.tsx`)
- **타입**: `type` 키워드를 `interface`보다 선호
- **스타일링**: `cn()` 유틸리티로 Tailwind 클래스 결합

### Server

- **경로 별칭**: `@/*` → `src/*`
- **파일명**: kebab-case (예: `error-handler.ts`)
- **타입**: `type` 키워드 사용

---

## 중요한 패턴

### API 호출 패턴

```typescript
// 1. endpoints.ts - API 함수 정의
export async function fetchVideos(params: FetchVideosParams) {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return arrayToCamel(data)  // snake_case → camelCase
}

// 2. query-keys.ts - Query Key 정의
export const queryKeys = {
  videos: {
    infinite: (categoryId?: string) =>
      ['videos', 'infinite', { categoryId }] as const,
  },
}

// 3. queries.ts - React Query 훅
export function useInfiniteVideosQuery(categoryId?: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.videos.infinite(categoryId),
    queryFn: ({ pageParam }) => fetchVideos({ cursor: pageParam, categoryId }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })
}

// 4. 컴포넌트에서 사용
function VideoFeeds() {
  const { data, fetchNextPage, hasNextPage } = useInfiniteVideosQuery(categoryId)
  // ...
}
```

### 상태 관리 패턴

```typescript
// Zustand Store with Persist
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CompletionStore = {
  completions: Record<string, Record<number, SelectedWordInfo[]>>
  markAsCompleted: (videoId: string, index: number, words: SelectedWordInfo[]) => void
}

export const useDialogueCompletionStore = create<CompletionStore>()(
  persist(
    (set) => ({
      completions: {},
      markAsCompleted: (videoId, index, words) =>
        set((state) => ({
          completions: {
            ...state.completions,
            [videoId]: {
              ...state.completions[videoId],
              [index]: words,
            },
          },
        })),
    }),
    { name: 'shortglish.dialogue_completion' }
  )
)
```

### 컴포넌트 패턴

```typescript
// shadcn/ui 스타일 컴포넌트
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white',
        outline: 'border border-gray-300',
      },
      size: {
        sm: 'h-9 px-3',
        md: 'h-10 px-4',
        lg: 'h-11 px-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
```

### 라우팅 패턴

```typescript
// paths.ts - 타입 안전한 경로 정의
export const paths = {
  videos: {
    entry: {
      path: '/videos/:videoId',
      getHref: (videoId: string) => `/videos/${videoId}`,
    },
  },
}

// 컴포넌트에서 사용
import { paths } from '@/config/paths'

function VideoCard({ videoId }: { videoId: string }) {
  const navigate = useNavigate()

  return (
    <div onClick={() => navigate(paths.videos.entry.getHref(videoId))}>
      {/* ... */}
    </div>
  )
}
```

---

## 유틸리티 함수

### 문자열 처리 (`client/src/utils/sentence.ts`)

```typescript
// 문장을 단어로 분리
splitSentenceToWords(sentence: string): string[]

// Fisher-Yates 셔플
shuffleArray<T>(array: T[]): T[]
```

### 텍스트 정규화 (`client/src/utils/text.ts`)

```typescript
// 대소문자 무시, 구두점 제거
normalizeText(text: string): string
```

### 빈칸 채우기 (`client/src/utils/fill.ts`)

```typescript
// 빈칸이 있는 문장 생성
extractBlankedSentence(text: string, blankedWords: string[]): {
  displayWords: Array<{ word: string; isBlank: boolean }>
  blankedPositions: number[]
}

// Web Speech API TTS
speakText(text: string): void
```

### 포맷팅 (`client/src/lib/utils.ts`)

```typescript
// clsx + tailwind-merge
cn(...inputs): string

// "MM:SS" 또는 "HH:MM:SS"
formatDuration(seconds: number): string
```

### API 유틸리티 (`client/src/api/utils.ts`)

```typescript
// snake_case → camelCase
snakeToCamel(str: string): string
objectToCamel<T>(obj: T): CamelCaseKeys<T>
arrayToCamel<T>(arr: T[]): CamelCaseKeys<T>[]
```

---

## 타입 정의

### Client 타입 (`client/src/api/types.ts`)

```typescript
// 비디오
type Video = {
  id: string
  title: string
  thumbnail: string
  description: string
  duration: number
  difficulty: number
  categoryId: string
  createdAt: string
}

// 자막
type Subtitle = {
  index: number
  startTime: number
  endTime: number
  originText: string
  blankedText: string
  translation: string
}

// 카테고리
type VideoCategory = {
  id: string
  name: string
  order: number
}

// 퀴즈
type TodayQuiz = {
  date: string
  day: number
  pattern: string
  pattern_korean: string
  exercises: QuizExercise[]
}
```

### Server 타입 (`server/src/types/toss.ts`)

```typescript
// OAuth2 토큰
interface GenerateTokenResponse {
  resultType: 'SUCCESS'
  success: {
    tokenType: string
    accessToken: string
    refreshToken: string
    expiresIn: number
    scope: string
  }
}

// 사용자 정보
interface LoginMeResponse {
  resultType: 'SUCCESS'
  success: {
    userKey: number
    scope: string
    agreedTerms: string[]
    name: string | null
    phone: string | null
    // ...
  }
}
```

---

## 현재 상태

### 완료된 기능 ✅

**Client**:
- YouTube 플레이어 통합
- 자막 동기화 및 자동 추적
- 단어 조합 학습 (Build)
- 빈칸 채우기 학습 (Fill)
- 쉐도잉 학습 (Shadowing)
- 패턴 학습 (Quiz)
- TTS (Text-to-Speech) 지원
- 전역 모달 시스템
- 대화 완성 상태 추적 (localStorage)
- React Query 기반 데이터 페칭
- Query Keys 팩토리 패턴
- 카테고리 필터링
- 무한 스크롤
- Supabase 통합
- 인증 시스템 (Auth Store)
- Toss Login 통합
- 복습 페이지

**Server**:
- Express 프록시 서버
- Toss OAuth2 통합
- mTLS 인증
- Rate limiting
- CORS 미들웨어
- 에러 핸들러
- Railway 배포 설정

### 데이터 소스

- **비디오/자막/카테고리**: Supabase PostgreSQL
- **퀴즈 데이터**: 로컬 JSON 파일 (`client/public/quiz/`)
- **OAuth2**: Toss Login API (서버 프록시 경유)

---

## 개발 가이드라인

### 1. 새 기능 추가 시

**Client**:
- API 함수는 `src/api/endpoints.ts`에 추가
- React Query 훅은 `src/api/queries.ts`에 추가
- Query Key는 `src/api/query-keys.ts`에 추가
- Feature 모듈은 `src/features/{feature}/`에 자체 완결형으로 구성
- 재사용 가능한 컴포넌트는 `src/components/`에 위치

**Server**:
- 새 라우트는 `src/routes/`에 추가
- 비즈니스 로직은 `src/services/`에 추가
- 타입은 `src/types/`에 추가

### 2. 상태 관리

- **전역 UI 상태** → `src/stores/` (Zustand)
- **Feature 상태** → `src/features/{feature}/store/` (Zustand)
- **서버 데이터** → React Query (`src/api/queries.ts`)
- **로컬 임시 상태** → React hooks
- **지속 상태** → Zustand persist middleware

### 3. 데이터 페칭

```typescript
// 1. API 함수 작성 (endpoints.ts)
export async function fetchNewData() {
  const { data, error } = await supabase.from('table').select('*')
  if (error) throw error
  return arrayToCamel(data)
}

// 2. Query Key 추가 (query-keys.ts)
export const queryKeys = {
  newData: {
    all: ['newData'] as const,
  },
}

// 3. React Query 훅 작성 (queries.ts)
export function useNewDataQuery() {
  return useQuery({
    queryKey: queryKeys.newData.all,
    queryFn: fetchNewData,
  })
}

// 4. 컴포넌트에서 사용
const { data, isLoading } = useNewDataQuery()
```

### 4. 라우팅

```typescript
// 1. paths.ts에 경로 추가
export const paths = {
  newFeature: {
    path: '/new-feature/:id',
    getHref: (id: string) => `/new-feature/${id}`,
  },
}

// 2. router.tsx에 lazy load 라우트 추가
{
  path: paths.newFeature.path,
  lazy: () => import('./pages/new-feature/page'),
}

// 3. 페이지 컴포넌트 작성
// app/pages/new-feature/page.tsx
export function Component() {
  return <div>New Feature</div>
}
```

### 5. 스타일링

- TailwindCSS 우선 사용
- shadcn/ui 패턴 준수
- `cn()` 유틸리티로 클래스 결합
- Framer Motion으로 애니메이션
- CVA로 variant 관리

### 6. 타입 안전성

- 명시적 타입 정의
- Zod로 런타임 검증 (환경변수, API 요청)
- `type` 키워드를 `interface`보다 선호
- Supabase 타입 자동 생성: `yarn db:types`

### 7. 컴포넌트 패턴

- forwardRef 사용 시 명시적 ref 타입 정의
- 복잡한 UI는 여러 작은 컴포넌트로 분리
- 페이지 전용 컴포넌트는 `_components/` 폴더에 배치
- 재사용 컴포넌트는 `src/components/`에 배치

### 8. 에러 처리

- Error Boundary로 에러 포착
- try-catch로 비동기 에러 처리
- 사용자 친화적 에러 메시지 표시 (Sonner toast)

### 9. 성능 최적화

- React Query로 중복 요청 방지
- 무한 스크롤로 초기 로딩 최적화
- Lazy loading으로 코드 스플리팅
- Intersection Observer로 스크롤 감지

### 10. 배포

**Client**:
```bash
cd client
yarn build
yarn deploy  # Granite AIT
```

**Server**:
```bash
cd server
yarn build
yarn start

# 또는 Railway에 자동 배포
```

---

## 트러블슈팅

### Client

**문제: Supabase 타입이 맞지 않음**
```bash
cd client
yarn db:types  # 타입 재생성
```

**문제: 환경변수가 로드되지 않음**
- `.env` 파일이 `client/` 디렉토리에 있는지 확인
- 모든 환경변수가 `VITE_APP_` 접두사를 가지는지 확인
- 개발 서버 재시작

**문제: API 호출이 실패함**
- `src/config/env.ts`에서 환경변수 확인
- Network 탭에서 요청 확인
- Supabase 대시보드에서 데이터 확인

### Server

**문제: mTLS 인증서 로드 실패**
- `certs/` 디렉토리에 인증서 파일이 있는지 확인
- 또는 Base64 환경변수 설정 확인
- 파일 권한 확인 (읽기 권한 필요)

**문제: CORS 에러**
- `ALLOWED_ORIGINS` 환경변수 확인
- 클라이언트 origin이 목록에 포함되어 있는지 확인

**문제: Rate limit 도달**
- 테스트 시 rate limit을 일시적으로 늘리거나
- IP 화이트리스트 추가 고려

---

## 참고 문서

- [Granite Framework](https://github.com/toss/apps-in-toss)
- [React Router v7](https://reactrouter.com/)
- [TanStack React Query](https://tanstack.com/query/latest)
- [Supabase](https://supabase.com/docs)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Toss Login API](https://docs.toss.im/)
