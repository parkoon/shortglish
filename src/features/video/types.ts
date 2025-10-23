export type Video = {
  id: string
  title: string
  thumbnail: string
  description: string
  channel_id: string
  channel_url: string
  channel_thumbnail: string
  duration: number
  view_count: number
  webpage_url: string
  categories: string[]
  tags: string[]
  media_type: string
  comment_count: number
  like_count: number
  channel: string
  uploader_id: string
  channel_follower_count: number
  uploader_url: string
  upload_date: string
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
}
