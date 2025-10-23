import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CompletionState = {
  // videoId를 key로, 완성된 subtitle index 배열을 value로 저장
  completions: Record<string, Set<number>>
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
          const videoCompletions = state.completions[videoId] || new Set<number>()
          const updatedCompletions = new Set(videoCompletions)
          updatedCompletions.add(subtitleIndex)

          return {
            completions: {
              ...state.completions,
              [videoId]: updatedCompletions,
            },
          }
        })
      },

      isCompleted: (videoId: string, subtitleIndex: number) => {
        const state = get()
        const videoCompletions = state.completions[videoId]
        return videoCompletions ? videoCompletions.has(subtitleIndex) : false
      },

      clearVideo: (videoId: string) => {
        set(state => {
          const { [videoId]: _, ...rest } = state.completions
          return { completions: rest }
        })
      },
    }),
    {
      name: 'subtitle-completion-storage',
      // Set을 직렬화/역직렬화하기 위한 처리
      storage: {
        getItem: name => {
          const str = localStorage.getItem(name)
          if (!str) return null

          const { state } = JSON.parse(str)
          // Array를 Set으로 변환
          const completions: Record<string, Set<number>> = {}
          for (const [videoId, indices] of Object.entries(state.completions)) {
            completions[videoId] = new Set(indices as number[])
          }

          return {
            state: {
              completions,
            },
          }
        },
        setItem: (name, value) => {
          // Set을 Array로 변환
          const completions: Record<string, number[]> = {}
          for (const [videoId, indices] of Object.entries(value.state.completions)) {
            completions[videoId] = Array.from(indices as Set<number>)
          }

          const str = JSON.stringify({
            state: {
              completions,
            },
          })
          localStorage.setItem(name, str)
        },
        removeItem: name => localStorage.removeItem(name),
      },
    },
  ),
)
