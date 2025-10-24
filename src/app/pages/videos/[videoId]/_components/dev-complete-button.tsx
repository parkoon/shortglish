import type { Subtitle } from '@/features/video/types'
import { useSubtitleCompletionStore } from '@/stores/subtitle-completion-store'
import { splitSentenceToWords } from '@/utils/sentence'

interface DevCompleteButtonProps {
  videoId: string
  currentDialogue: Subtitle | null
  isCompleted: boolean
  onComplete: () => void
}

export const DevCompleteButton = ({
  videoId,
  currentDialogue,
  isCompleted,
  onComplete,
}: DevCompleteButtonProps) => {
  const { markAsCompleted } = useSubtitleCompletionStore()

  // 프로덕션 환경에서는 아예 렌더링하지 않음
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  // 현재 자막이 없으면 버튼 숨김
  if (!currentDialogue) {
    return null
  }

  const handleDevComplete = () => {
    if (!videoId || !currentDialogue) {
      return
    }

    // 더미 완성 데이터 생성 (모든 단어를 1번에 맞춘 것으로)
    const words = splitSentenceToWords(currentDialogue.text)
    const dummyWords = words.map((word, idx) => ({
      word,
      attempts: 1,
      id: idx,
    }))

    markAsCompleted(videoId, currentDialogue.index, dummyWords)
    onComplete()
  }

  return (
    <div className="px-4 pb-2">
      <button
        onClick={handleDevComplete}
        className="w-full rounded-lg bg-purple-500 px-4 py-2 text-sm font-medium text-white hover:bg-purple-600 disabled:opacity-50"
        disabled={isCompleted}
      >
        🛠️ [DEV] 자막 완성 처리
      </button>
    </div>
  )
}
