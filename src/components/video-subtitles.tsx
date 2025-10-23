import type { Subtitle } from '@/features/video/types'

import { CommentaryMarkdown } from './commentary-markdown'

type VideoSubtitlesProps = {
  data?: Subtitle
}
export const VideoSubtitles = ({ data }: VideoSubtitlesProps) => {
  if (!data) return null

  return (
    <div className="px-4">
      <div className="">
        <CommentaryMarkdown content={data.text} />
        {/* {data.commentary && (
          <div className="mt-4">
            <CommentaryMarkdown content={data.commentary} />
          </div>
        )} */}
      </div>
    </div>
  )
}
