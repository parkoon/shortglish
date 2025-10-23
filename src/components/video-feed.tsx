import type { Video } from '@/types/youtube'

import { VideoCard } from './video-card'

type VideoFeedProps = {
  videos: Video[]
}

export const VideoFeed = ({ videos }: VideoFeedProps) => {
  return (
    <div className="flex flex-col gap-8 pb-6">
      {videos.map(video => (
        <VideoCard key={video.videoId} video={video} />
      ))}
    </div>
  )
}
