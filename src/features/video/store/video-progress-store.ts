import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type StepType = 'build' | 'fill' | 'review'

type StepProgress = {
  isCompleted: boolean
}

type VideoProgress = {
  build: StepProgress
  fill: StepProgress
  review: StepProgress
}

type ProgressState = {
  progress: Record<string, VideoProgress>
}

type ProgressActions = {
  markStepAsCompleted: (videoId: string, step: StepType) => void
  isStepCompleted: (videoId: string, step: StepType) => boolean
  canAccessStep: (videoId: string, step: StepType) => boolean
  resetVideoProgress: (videoId: string) => void
  resetStep: (videoId: string, step: StepType) => void
  getVideoProgress: (videoId: string) => VideoProgress
}

type VideoProgressStore = ProgressState & ProgressActions

const initialStepProgress: StepProgress = {
  isCompleted: false,
}

const initialVideoProgress: VideoProgress = {
  build: { ...initialStepProgress },
  fill: { ...initialStepProgress },
  review: { ...initialStepProgress },
}

export const useVideoProgressStore = create<VideoProgressStore>()(
  persist(
    (set, get) => ({
      progress: {},

      markStepAsCompleted: (videoId: string, step: StepType) => {
        set(state => {
          const videoProgress = state.progress[videoId] || { ...initialVideoProgress }

          return {
            progress: {
              ...state.progress,
              [videoId]: {
                ...videoProgress,
                [step]: { isCompleted: true },
              },
            },
          }
        })
      },

      isStepCompleted: (videoId: string, step: StepType) => {
        const state = get()
        return state.progress[videoId]?.[step]?.isCompleted ?? false
      },

      canAccessStep: (videoId: string, step: StepType) => {
        const state = get()
        const videoProgress = state.progress[videoId]

        // build는 항상 접근 가능
        if (step === 'build') return true

        // fill은 build 완료 시 접근 가능
        if (step === 'fill') {
          return videoProgress?.build?.isCompleted ?? false
        }

        // review는 build와 fill 모두 완료 시 접근 가능
        if (step === 'review') {
          return (
            (videoProgress?.build?.isCompleted ?? false) &&
            (videoProgress?.fill?.isCompleted ?? false)
          )
        }

        return false
      },

      resetVideoProgress: (videoId: string) => {
        set(state => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [videoId]: _, ...rest } = state.progress
          return { progress: rest }
        })
      },

      resetStep: (videoId: string, step: StepType) => {
        set(state => {
          const videoProgress = state.progress[videoId] || { ...initialVideoProgress }

          return {
            progress: {
              ...state.progress,
              [videoId]: {
                ...videoProgress,
                [step]: { isCompleted: false },
              },
            },
          }
        })
      },

      getVideoProgress: (videoId: string) => {
        const state = get()
        return state.progress[videoId] || { ...initialVideoProgress }
      },
    }),
    {
      name: 'shortglish.video_progress',
    },
  ),
)
