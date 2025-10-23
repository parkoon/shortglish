import type { Subtitle } from '@/features/video/types'
import { useSubtitleCompletionStore } from '@/stores/subtitle-completion-store'

import { WordSentenceBuilder } from './word-sentence-builder'

type VideoSubtitlesProps = {
  data?: Subtitle
  videoId: string
  onComplete?: () => void
}

/**
 * 비디오 자막 표시 컴포넌트
 *
 * 책임:
 * - 단어 조합 게임 표시
 * - 완성 여부와 관계없이 채워진 단어 슬롯 유지
 */
export const VideoSubtitles = ({ data, videoId, onComplete }: VideoSubtitlesProps) => {
  const { isCompleted, markAsCompleted } = useSubtitleCompletionStore()

  if (!data) return null

  const completed = isCompleted(videoId, data.index)

  const handleComplete = () => {
    markAsCompleted(videoId, data.index)
    onComplete?.()
  }

  // 완성 여부와 관계없이 단어 조합 게임 UI를 유지 (완성 시 슬롯만 채워진 상태)
  // key를 사용해서 sentence가 바뀔 때마다 컴포넌트 완전히 리마운트
  return (
    <WordSentenceBuilder
      key={`${videoId}-${data.index}`}
      sentence={data.text}
      translation={data.translation}
      onComplete={handleComplete}
      isCompleted={completed}
    />
  )
}
