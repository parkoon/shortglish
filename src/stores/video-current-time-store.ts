import { create } from 'zustand'

type VideoCurrentTimeStore = {
  currentTime: number
  setCurrentTime: (time: number) => void
}

export const useVideoCurrentTimeStore = create<VideoCurrentTimeStore>(set => ({
  currentTime: 0,
  setCurrentTime: time => set({ currentTime: time }),
}))
