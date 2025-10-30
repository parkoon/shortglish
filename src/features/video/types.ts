export type Video = {
  id: string
  title: string
  thumbnail: string
  description: string
  duration: number
}

export type Category = {
  id: string
  label: string
  active?: boolean
}

export type Subtitle = {
  index: number
  startTime: number
  endTime: number
  text: string
  translation: string
  blankedWords?: string[]
}

export type VideoDetail = {
  title: string
  description: string
  thumbnail: string
  subtitles: Subtitle[]
}
