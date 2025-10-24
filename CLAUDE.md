# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소의 코드 작업 시 참고하는 가이드입니다.

## 프로젝트 개요

**Shortglish**는 YouTube 쇼츠를 활용한 영어 학습 플랫폼입니다. 사용자는 짧은 영상의 자막을 보며 영어를 학습하고, 단어 조합 게임을 통해 문장을 완성하는 방식으로 학습합니다.

- **빌드 도구**: Vite 6.3.5
- **패키지 매니저**: Yarn 1.22.22
- **Node 버전**: v22 (`.nvmrc` 참고)

---

## 명령어

### 개발
```bash
yarn dev          # Vite 개발 서버 시작
yarn build        # 타입 체크 및 프로덕션 빌드
yarn preview      # 빌드된 결과물을 로컬에서 미리보기
yarn lint         # ESLint 실행
yarn format       # Prettier로 코드 포맷팅
```

### 테스팅
테스트 명령어는 아직 설정되지 않았습니다. 테스트를 구현할 때 테스트 러너 설정을 추가하고 이 섹션을 업데이트하세요.

---

## 기술 스택

### 핵심 라이브러리
| 영역 | 라이브러리 | 버전 |
|------|-----------|------|
| **UI 프레임워크** | React | 19.1.0 |
| **라우팅** | React Router | 7.6.2 |
| **상태 관리 (로컬)** | Zustand | 5.0.8 |
| **상태 관리 (서버)** | TanStack React Query | 5.81.2 |
| **스타일링** | TailwindCSS | 4.1.10 |
| **UI 컴포넌트** | Radix UI | - |
| **애니메이션** | Framer Motion | 12.19.1 |
| **아이콘** | Tabler Icons | 3.35.0 |
| **알림** | Sonner | 2.0.7 |
| **캐러셀** | Embla Carousel | 8.6.0 |

### 개발 도구
- **TypeScript** 5.8.3
- **ESLint** 9.29.0 (React Hooks, import sorting)
- **Prettier** 3.6.1

---

## 아키텍처

Vite, TypeScript, TailwindCSS로 구축된 React SPA이며, 모바일 우선 접근 방식을 따릅니다.

### 디렉토리 구조

```
src/
├── app/                          # 애플리케이션 진입점
│   ├── index.tsx                 # App 컴포넌트
│   ├── provider.tsx              # 전역 프로바이더
│   ├── router.tsx                # 라우팅 설정
│   └── pages/                    # 페이지 컴포넌트 (lazy loaded)
│       ├── home/
│       ├── videos/
│       │   ├── page.tsx           # 비디오 목록
│       │   └── [videoId]/
│       │       ├── page.tsx       # 학습 페이지
│       │       └── review/
│       │           └── page.tsx   # 복습 페이지
│       └── not-found.tsx
│
├── features/                     # 기능별 모듈 (자체 완결형)
│   └── video/
│       ├── components/           # 비디오 관련 컴포넌트
│       ├── hooks/                # 비디오 관련 훅
│       ├── constants/            # 비디오 데이터 및 카테고리
│       └── types.ts              # 타입 정의
│
├── components/                   # 재사용 가능한 컴포넌트
│   ├── ui/                       # shadcn/ui 기반 기본 컴포넌트
│   ├── layouts/                  # 레이아웃 컴포넌트
│   ├── word-game/                # 단어 게임 컴포넌트
│   └── ...
│
├── stores/                       # Zustand 상태 관리
│   ├── modal-store.ts
│   ├── subtitle-completion-store.ts
│   └── ...
│
├── hooks/                        # 전역 커스텀 훅
│   └── use-word-game.ts          # 단어 게임 로직
│
├── lib/                          # 유틸리티 라이브러리
│   ├── utils.ts                  # cn(), formatDuration()
│   ├── react-query.ts            # React Query 설정
│   └── route.ts                  # 라우터 헬퍼
│
├── config/                       # 설정 파일
│   ├── paths.ts                  # 라우트 경로 정의
│   ├── env.ts                    # 환경변수 검증
│   └── app.ts                    # 앱 상수
│
├── utils/                        # 유틸리티 함수
│   ├── sentence.ts               # 문장 처리
│   └── thumbnail.ts              # 썸네일 URL 생성
│
└── types/                        # 전역 타입 정의
```

### 주요 아키텍처 결정 사항

1. **Feature-Based 구조**: `src/features/` 디렉토리를 사용하여 기능 모듈을 구성합니다. 각 기능은 자체 컴포넌트, 훅, 로직을 포함하여 자체 완결적이어야 합니다.

2. **컴포넌트 라이브러리**: Radix UI primitives를 기반으로 한 shadcn/ui 컴포넌트를 사용합니다 (`src/components/ui/`). 컴포넌트는 variant 관리를 위해 CVA를 사용합니다. 새로운 기본 컴포넌트를 추가할 때는 shadcn/ui 패턴을 따르세요.

3. **라우팅**: React Router를 사용하며 lazy loading을 적용합니다. 라우트는 `src/config/paths.ts`에 정의되고 `src/app/router.tsx`에서 로드됩니다. 모든 라우트는 동적 import를 통한 코드 스플리팅을 사용합니다.

4. **상태 관리**:
   - **로컬 상태**: Zustand (UI 상태, 모달, 온보딩 등)
   - **서버 상태**: TanStack React Query (1분 stale time, 재시도 없음, 윈도우 포커스 리페칭 없음)
   - **컴포넌트 상태**: React hooks

5. **프로바이더 구조**: 전역 프로바이더는 `src/app/provider.tsx`에 구성되어 있습니다:
   - QueryClientProvider (React Query)
   - ErrorBoundary (에러 처리)
   - HelmetProvider (SEO)
   - Toaster (Sonner를 통한 알림)

6. **모바일 우선 디자인**: 모든 콘텐츠는 `MobileOnlyLayout`으로 래핑됩니다. 이 애플리케이션은 설계상 모바일 전용입니다.
   - 최대 화면 너비: 640px (`MAX_APP_SCREEN_WIDTH`)

### 라우팅 구조

**활성 라우트**:
- `/` → 비디오 목록 페이지
- `/videos/:videoId` → 학습 페이지 (자막 + 단어 게임)
- `/videos/:videoId/review` → 복습 페이지

**라우트 정의** (`src/config/paths.ts`):
```typescript
export const paths = {
  home: {
    root: { path: '/', getHref: () => '/' },
  },
  videos: {
    root: { path: '/videos', getHref: () => '/videos' },
    detail: { path: '/videos/:videoId', getHref: (videoId) => `/videos/${videoId}` },
    review: { path: '/videos/:videoId/review', getHref: (videoId) => `/videos/${videoId}/review` },
  },
}
```

### 상태 관리 상세

#### Zustand Stores

1. **modal-store.ts**: 전역 모달 상태 관리
   - `isOpen`, `config`, `open()`, `close()` 제공
   - `GlobalModal` 컴포넌트가 구독

2. **subtitle-completion-store.ts**: 자막 완성 상태 추적
   - 각 비디오의 완성된 자막 인덱스를 Set으로 관리
   - 다음 자막으로 이동 가능 여부 결정

3. **onboarding-store.ts**: 온보딩 상태 (localStorage 지속)
   - zustand persist middleware 사용

4. **video-current-time-store.ts**: 현재 재생 시간 추적

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

---

## 핵심 기능

### 1. 비디오 재생 및 자막 동기화

**주요 파일**:
- `src/features/video/components/youtube-player.tsx` - YouTube iframe API 래퍼
- `src/app/pages/videos/[videoId]/page.tsx` - 학습 페이지 로직

**동작 흐름**:
1. YouTube Player 로드 (iframe API)
2. 비디오 재생 상태 감지
3. 100ms 간격으로 현재 시간 추적
4. 시간에 맞는 자막 자동 감지
5. 자막 끝 시 자동 일시정지 및 처음으로 되감기

**자막 데이터**:
- `/public/subtitles/{videoId}.json` 파일에서 로드
- `Subtitle[]` 타입 배열 (index, startTime, endTime, text, translation)

### 2. 단어 조합 게임

**주요 파일**:
- `src/hooks/use-word-game.ts` - 게임 비즈니스 로직
- `src/components/word-sentence-builder.tsx` - 게임 UI 컨테이너
- `src/components/word-game/` - 슬롯 및 버튼 컴포넌트

**게임 로직**:
1. 문장을 단어로 분리 (`splitSentenceToWords()`)
2. 단어를 셔플 (Fisher-Yates 알고리즘)
3. 사용자가 단어를 클릭하여 순서대로 선택
4. 오답 시 취소선 표시
5. 모든 단어를 올바르게 선택하면 완료

**상태 관리**:
- `selectedWords`: 선택된 단어 배열 + 시도 횟수
- `wrongWordIndices`: 틀린 단어 인덱스 Set
- 중복 단어는 `originalIndex`로 구분

### 3. 비디오 컨트롤러

**파일**: `src/components/video-controller.tsx`

- **이전**: 이전 자막으로 이동
- **반복**: 현재 자막 시작점부터 재생
- **다음**: 다음 자막으로 이동 (현재 자막 완료 필수)
  - Framer Motion 깜빡임 애니메이션으로 활성화 표시

---

## 코드 스타일

- **ESLint**: React hooks 규칙 및 import 정렬
- **Prettier**:
  - 단일 인용부호 (single quotes)
  - 세미콜론 없음 (no semicolons)
  - 라인 폭: 100자
  - trailing commas
- **경로 별칭**: `@/*`는 `src/*`로 매핑
- **Import 정렬**: ESLint를 통한 자동 정렬

---

## 중요한 패턴

### 컴포넌트 작성

- `cn()` 유틸리티 (`src/lib/utils.ts`)를 사용하여 Tailwind 클래스 결합
- 컴포넌트 파일명은 kebab-case 사용 (예: `video-card.tsx`, `category-tabs.tsx`)
- `type`을 `interface`보다 선호

### 라우팅

- 모든 페이지 컴포넌트는 라우터에서 lazy load되어야 함
- 경로는 `paths` 객체를 통해 타입 안전하게 참조

### 스타일링

- TailwindCSS + CSS 변수를 사용한 테마 (`src/index.css`에 정의)
- shadcn/ui 패턴을 따라 새 컴포넌트 추가

### 에러 처리

- Error boundaries가 에러를 포착하고 커스텀 fallback UI 표시

---

## 유틸리티 함수

### 문자열 처리 (`src/utils/sentence.ts`)
```typescript
splitSentenceToWords(sentence: string): string[]
  // 정규식 /\s+/로 공백 기준 분리

shuffleArray<T>(array: T[]): T[]
  // Fisher-Yates 셔플
```

### 포맷팅 (`src/lib/utils.ts`)
```typescript
cn(...inputs): string
  // clsx + tailwind-merge (중복 클래스 제거)

formatDuration(seconds: number): string
  // "MM:SS" 또는 "HH:MM:SS" 형식
```

### 썸네일 (`src/utils/thumbnail.ts`)
```typescript
getYouTubeThumbnailUrl(videoId: string, quality: string)
  // YouTube 썸네일 URL 생성
  // quality: default, medium, high, standard, maxres
```

---

## 환경변수

**파일**: `src/config/env.ts`

```typescript
VITE_APP_POSTHOG_KEY     // PostHog 분석 키
VITE_APP_POSTHOG_HOST    // PostHog 호스트
```

Zod를 사용하여 빌드 시 필수 환경변수 검증

---

## 타입 정의

### 핵심 타입 (`src/features/video/types.ts`)

```typescript
type Video = {
  id: string
  title: string
  thumbnail: string
  channel: string
  duration: number
  categories: string[]
  // ...
}

type Subtitle = {
  index: number
  startTime: number
  endTime: number
  text: string
  translation: string
}

type Category = {
  id: string
  label: string
  active?: boolean
}
```

---

## 주요 설정 파일

### Vite (`vite.config.ts`)
- 플러그인: React, TailwindCSS, Visualizer
- 별칭: `@/` → `./src/`

### TypeScript (`tsconfig.app.json`)
- Target: ES2020
- Strict Mode 활성화
- Path Alias: `@/*` → `./src/*`

### ESLint (`eslint.config.js`)
- React Hooks 규칙
- Import 자동 정렬 (simple-import-sort)

---

## 현재 상태

### 완료된 기능
- ✅ YouTube 플레이어 통합
- ✅ 자막 동기화 및 자동 추적
- ✅ 단어 조합 게임 (정답/오답 판정)
- ✅ 다음/이전/반복 네비게이션
- ✅ 전역 모달 시스템
- ✅ 자막 완성 상태 추적

### 진행 중
- 🚧 북마크 기능 (UI 준비 완료, 로직 구현 필요)
- 🚧 복습 페이지 상세 기능
- 🚧 API 연동 (현재 로컬 JSON 사용)

---

## 개발 가이드라인

1. **새 기능 추가 시**:
   - `features/` 디렉토리에 자체 완결형 모듈로 구성
   - 재사용 가능한 컴포넌트는 `components/`에 위치

2. **상태 관리**:
   - UI 상태 → Zustand store
   - 서버 데이터 → React Query
   - 로컬 임시 상태 → React hooks

3. **라우팅**:
   - `paths.ts`에 경로 정의 추가
   - `router.tsx`에서 lazy load로 등록

4. **스타일링**:
   - TailwindCSS 우선 사용
   - shadcn/ui 패턴 준수
   - `cn()` 유틸리티로 클래스 결합

5. **타입 안전성**:
   - 명시적 타입 정의
   - Zod로 런타임 검증
   - `type` 키워드 선호