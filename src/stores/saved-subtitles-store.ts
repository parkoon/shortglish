import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { Dialogue } from '@/types/youtube'

export type SavedSubtitle = {
  id: string
  videoId: string
  videoTitle?: string
  subtitle: Dialogue
  savedAt: number
}

type SavedSubtitlesStore = {
  savedSubtitles: SavedSubtitle[]
  addSubtitle: (videoId: string, subtitle: Dialogue, videoTitle?: string) => void
  removeSubtitle: (id: string) => void
  isSubtitleSaved: (videoId: string, subtitleId: string) => boolean
  getSavedSubtitle: (videoId: string, subtitleId: string) => SavedSubtitle | undefined
  clearAll: () => void
}

export const useSavedSubtitlesStore = create<SavedSubtitlesStore>()(
  persist(
    (set, get) => ({
      savedSubtitles: [],

      addSubtitle: (videoId, subtitle, videoTitle) => {
        const id = `${videoId}-${subtitle.id}-${Date.now()}`
        const newSaved: SavedSubtitle = {
          id,
          videoId,
          videoTitle,
          subtitle,
          savedAt: Date.now(),
        }
        set(state => ({
          savedSubtitles: [...state.savedSubtitles, newSaved],
        }))
      },

      removeSubtitle: id => {
        set(state => ({
          savedSubtitles: state.savedSubtitles.filter(s => s.id !== id),
        }))
      },

      isSubtitleSaved: (videoId, subtitleId) => {
        return get().savedSubtitles.some(s => s.videoId === videoId && s.subtitle.id === subtitleId)
      },

      getSavedSubtitle: (videoId, subtitleId) => {
        return get().savedSubtitles.find(s => s.videoId === videoId && s.subtitle.id === subtitleId)
      },

      clearAll: () => {
        set({ savedSubtitles: [] })
      },
    }),
    {
      name: 'saved-subtitles',
    },
  ),
)
