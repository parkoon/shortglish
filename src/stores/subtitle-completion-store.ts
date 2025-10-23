import { create } from 'zustand'

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

export const useSubtitleCompletionStore = create<SubtitleCompletionStore>((set, get) => ({
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [videoId]: _, ...rest } = state.completions
      return { completions: rest }
    })
  },
}))
