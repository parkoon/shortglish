import type { Subtitle } from '@/features/video/types'

type VideoSubtitlesProps = {
  data?: Subtitle
}
export const VideoSubtitles = ({ data }: VideoSubtitlesProps) => {
  if (!data) return null

  return (
    <div className="flex flex-col gap-2">
      <span className="text-gray-900 text-2xl">{data.text}</span>
      <span className="text-gray-600">{data.translation}</span>
    </div>
  )
}
