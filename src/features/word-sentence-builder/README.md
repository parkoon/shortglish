# Word Sentence Builder

문장을 단어 단위로 분리하고, 사용자가 단어를 선택하여 문장을 완성하는 게임 컴포넌트입니다.

## 기능

- 문장을 단어로 분리하고 무작위로 셔플
- 사용자가 단어를 선택하여 문장 완성
- 정답/오답 처리 및 시도 횟수 추적
- 힌트 기능 (다음에 선택해야 할 단어 표시)
- 완성 상태 저장 및 복원

## 컴포넌트 구조

```
word-sentence-builder/
├── components/
│   ├── word-sentence-builder.tsx  # 메인 컨테이너 컴포넌트
│   ├── word-slots.tsx              # 단어 슬롯 표시 (정답 표시 영역)
│   └── word-button.tsx             # 개별 단어 버튼
├── utils/
│   ├── calculate-attempts.ts       # 시도 횟수 계산
│   ├── find-correct-word.ts        # 힌트용 정답 단어 찾기
│   ├── get-slot-color.ts           # 슬롯 색상 계산
│   └── create-word-with-id.ts      # 단어 객체 생성 및 셔플
├── types.ts                        # 공통 타입 정의
└── index.ts                        # Export
```

## Props

### WordSentenceBuilder

```typescript
type WordSentenceBuilderProps = {
  sentence: string // 원본 문장
  translation: string // 번역 텍스트
  isCompleted?: boolean // 완성 여부
  onComplete: (selectedWords: SelectedWordInfo[]) => void // 완성 시 콜백
  onWrong: () => void // 오답 시 콜백
  onHint?: () => void // 힌트 사용 시 콜백 (GA 이벤트용)
  completedWords?: SelectedWordInfo[] // 완성된 단어 정보 (복원용)
}
```

### SelectedWordInfo

```typescript
type SelectedWordInfo = {
  word: string // 단어 텍스트
  attempts: number // 시도 횟수 (1 이상)
  id: number // 단어의 고유 식별자 (셔플 후 할당된 ID)
}
```

## 사용 예시

```tsx
import { WordSentenceBuilder, type SelectedWordInfo } from '@/features/word-sentence-builder'

function MyComponent() {
  const handleComplete = (selectedWords: SelectedWordInfo[]) => {
    console.log('완성된 단어들:', selectedWords)
  }

  const handleWrong = () => {
    console.log('오답입니다!')
  }

  const handleHint = () => {
    // GA 이벤트 추적
    analytics.useHint({ ... })
  }

  return (
    <WordSentenceBuilder
      sentence="Hello, world!"
      translation="안녕, 세상아!"
      onComplete={handleComplete}
      onWrong={handleWrong}
      onHint={handleHint}
      isCompleted={false}
    />
  )
}
```

## 주요 로직

### 1. 단어 셔플 및 ID 할당

- 문장을 단어로 분리 후 무작위로 셔플
- 각 단어에 `originalIndex`(원래 위치)와 `id`(셔플 후 고유 ID) 부여
- `id`는 선택된 단어를 추적하는 데 사용

### 2. 정답/오답 처리

- **정답**: 선택된 단어를 `selectedWords`에 추가하고, 틀린 단어 표시 초기화
- **오답**: 해당 단어에 취소선 표시 및 진동 애니메이션
- 시도 횟수는 틀린 횟수 + 1로 계산

### 3. 힌트 기능

- 다음에 선택해야 할 정답 단어를 찾아 애니메이션으로 표시
- 이미 선택된 단어는 제외하고 찾음
- 힌트 사용 시 `onHint` 콜백 호출 (GA 이벤트 추적용)

### 4. 완성 상태

- 모든 단어를 선택하면 `onComplete` 콜백 호출
- `completedWords` prop으로 완성 상태 복원 가능
- 완성된 상태에서는 단어 버튼이 숨겨짐

## 색상 시스템

### 슬롯 색상

- **초록색** (`text-green-600`, `border-green-600`): 한 번에 맞춘 경우 (attempts === 1)
- **빨간색** (`text-red-500`, `border-red-500`): 틀렸다가 맞춘 경우 (attempts > 1)
- **회색** (`border-gray-400`): 아직 선택되지 않은 슬롯

### 버튼 상태

- **정상**: 흰색 배경, 회색 테두리
- **선택됨**: 회색 배경, 투명 텍스트 (레이아웃 유지)
- **오답**: 취소선, 투명도 50%, 진동 애니메이션
- **힌트**: 위아래로 튀는 애니메이션 (5회 반복)

## 유틸 함수

### calculateAttempts(params: { wrongAttemptsCount: number }): number

시도 횟수를 계산합니다. 틀린 적이 있으면 틀린 횟수 + 1, 없으면 1로 설정합니다.

```typescript
const attempts = calculateAttempts({ wrongAttemptsCount: 2 }) // 3
```

### findCorrectWordForHint(params: { expectedWord: string, wordsWithIndices: WordWithId[], selectedWords: SelectedWordInfo[] }): WordWithId | null

힌트를 위해 다음에 선택해야 할 정답 단어를 찾습니다.

```typescript
const correctWord = findCorrectWordForHint({
  expectedWord: 'Hello',
  wordsWithIndices: [...],
  selectedWords: [...],
})
```

### getSlotTextColor(params: { attempts: number, isSelected: boolean }): string

슬롯의 텍스트 색상을 결정합니다.

```typescript
const color = getSlotTextColor({ attempts: 1, isSelected: true }) // 'text-green-600'
```

### getSlotBorderColor(params: { attempts: number, isSelected: boolean }): string

슬롯의 테두리 색상을 결정합니다.

```typescript
const borderColor = getSlotBorderColor({ attempts: 2, isSelected: true }) // 'border-red-500'
```

### createWordsWithId(words: string[]): WordWithId[]

단어 배열을 셔플하고 고유 ID를 부여합니다.

## 주의사항

1. `sentence` prop이 변경되면 게임 상태가 자동으로 리셋됩니다.
2. `completedWords`는 `isCompleted`가 `true`일 때만 사용됩니다.
3. 힌트 기능은 완성되지 않았고 아직 선택할 단어가 남아있을 때만 표시됩니다.
4. 단어 ID는 셔플 후 할당되므로, 같은 문장이라도 매번 다른 ID를 가질 수 있습니다.
