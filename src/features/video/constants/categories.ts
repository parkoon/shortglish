export type VideoCategory = {
  id: string
  label: string
}

export const VIDEO_CATEGORIES: VideoCategory[] = [
  { id: 'all', label: '전체' },
  { id: 'kpop', label: 'K-POP' },
  { id: 'jpop', label: 'J-POP' },
  { id: 'cooking', label: '요리' },
  { id: 'travel', label: '여행' },
  { id: 'tech', label: '테크' },
] as const

export const DEFAULT_VIDEO_CATEGORY = VIDEO_CATEGORIES[0].id
