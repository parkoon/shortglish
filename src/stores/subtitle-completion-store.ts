import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CompletionState = {
  // videoId를 key로, 완성된 subtitle index 배열을 value로 저장
  completions: Record<string, number[]>
}

type CompletionActions = {
  markAsCompleted: (videoId: string, subtitleIndex: number) => void
  isCompleted: (videoId: string, subtitleIndex: number) => boolean
  clearVideo: (videoId: string) => void
}

type SubtitleCompletionStore = CompletionState & CompletionActions

export const useSubtitleCompletionStore = create<SubtitleCompletionStore>()(
  persist(
    (set, get) => ({
      completions: {},

      markAsCompleted: (videoId: string, subtitleIndex: number) => {
        set(state => {
          const videoCompletions = state.completions[videoId] || []

          // 이미 완성된 경우 중복 방지
          if (videoCompletions.includes(subtitleIndex)) {
            return state
          }

          return {
            completions: {
              ...state.completions,
              [videoId]: [...videoCompletions, subtitleIndex],
            },
          }
        })
      },

      isCompleted: (videoId: string, subtitleIndex: number) => {
        const state = get()
        const videoCompletions = state.completions[videoId]
        return videoCompletions ? videoCompletions.includes(subtitleIndex) : false
      },

      clearVideo: (videoId: string) => {
        set(state => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [videoId]: _, ...rest } = state.completions
          return { completions: rest }
        })
      },
    }),
    {
      name: 'subtitle-completion-storage',
    },
  ),
)
