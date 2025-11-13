import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type CompletionState = {
  completedQuizzes: Record<string, boolean>
}

type CompletionActions = {
  markQuizAsCompleted: (date: string) => void
  isQuizCompleted: (date: string) => boolean
}

type QuizCompletionStore = CompletionState & CompletionActions

export const useQuizCompletionStore = create<QuizCompletionStore>()(
  persist(
    (set, get) => ({
      completedQuizzes: {},

      markQuizAsCompleted: (date: string) => {
        set(state => ({
          completedQuizzes: {
            ...state.completedQuizzes,
            [date]: true,
          },
        }))
      },

      isQuizCompleted: (date: string) => {
        const state = get()
        return state.completedQuizzes[date] ?? false
      },
    }),
    {
      name: 'shortglish.quiz_completion',
    },
  ),
)
