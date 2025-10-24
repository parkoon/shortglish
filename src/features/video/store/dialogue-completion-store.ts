import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SelectedWordInfo = {
  word: string
  attempts: number
  id: number
}

type CompletionState = {
  // videoId → subtitleIndex → SelectedWordInfo[]
  completions: Record<string, Record<number, SelectedWordInfo[]>>
}

type CompletionActions = {
  markAsCompleted: (
    videoId: string,
    subtitleIndex: number,
    selectedWords: SelectedWordInfo[],
  ) => void
  isCompleted: (videoId: string, subtitleIndex: number) => boolean
  getCompletedWords: (videoId: string, subtitleIndex: number) => SelectedWordInfo[] | undefined
  clearVideo: (videoId: string) => void
}

type DialogueCompletionStore = CompletionState & CompletionActions

export const useDialogueCompletionStore = create<DialogueCompletionStore>()(
  persist(
    (set, get) => ({
      completions: {},

      markAsCompleted: (
        videoId: string,
        subtitleIndex: number,
        selectedWords: SelectedWordInfo[],
      ) => {
        set(state => {
          const videoCompletions = state.completions[videoId] || {}

          return {
            completions: {
              ...state.completions,
              [videoId]: {
                ...videoCompletions,
                [subtitleIndex]: selectedWords,
              },
            },
          }
        })
      },

      isCompleted: (videoId: string, subtitleIndex: number) => {
        const state = get()
        return !!state.completions[videoId]?.[subtitleIndex]
      },

      getCompletedWords: (videoId: string, subtitleIndex: number) => {
        const state = get()
        return state.completions[videoId]?.[subtitleIndex]
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
      name: 'shortglish.dialogue_completion',
    },
  ),
)
