import { create } from 'zustand'

import type { YouTubePlayerRef } from '@/components/___youtube-player'
import type { Dialogue } from '@/types/youtube'
import { timeStringToSeconds } from '@/utils/time'

type SubtitleStore = {
  // 상태
  subtitles: Dialogue[]
  currentIndex: number
  isRepeatMode: boolean

  // 액션
  setSubtitles: (subtitles: Dialogue[]) => void
  syncWithTime: (time: number) => void
  nextSubtitle: (playerRef?: YouTubePlayerRef | null) => void
  prevSubtitle: (playerRef?: YouTubePlayerRef | null) => void
  toggleRepeatMode: () => void
}

export const useSubtitleStore = create<SubtitleStore>((set, get) => ({
  // 초기 상태
  subtitles: [],
  currentIndex: 0,
  isRepeatMode: false,

  // 액션 구현
  setSubtitles: subtitles => set({ subtitles }),

  syncWithTime: time => {
    const { subtitles, currentIndex, isRepeatMode } = get()

    const newIndex = subtitles.findIndex(subtitle => {
      return (
        time >= timeStringToSeconds(subtitle.startTime) &&
        time < timeStringToSeconds(subtitle.endTime)
      )
    })

    if (isRepeatMode) {
      set({ currentIndex })
      return
    }

    if (newIndex !== -1 && newIndex !== currentIndex) {
      set({ currentIndex: newIndex })
    }
  },

  nextSubtitle: playerRef => {
    const { currentIndex, subtitles } = get()
    const nextIndex = currentIndex + 1

    if (nextIndex < subtitles.length) {
      set({ currentIndex: nextIndex })
      if (playerRef) {
        playerRef.seekTo(timeStringToSeconds(subtitles[nextIndex].startTime))
      }
    }
  },

  prevSubtitle: playerRef => {
    const { currentIndex, subtitles } = get()
    const prevIndex = currentIndex - 1

    if (prevIndex >= 0) {
      set({ currentIndex: prevIndex })
      if (playerRef) {
        playerRef.seekTo(timeStringToSeconds(subtitles[prevIndex].startTime))
      }
    }
  },

  toggleRepeatMode: () => {
    set(state => ({ isRepeatMode: !state.isRepeatMode }))
  },
}))
