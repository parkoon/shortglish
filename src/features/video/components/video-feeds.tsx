import { useNavigate } from 'react-router'

import { paths } from '@/config/paths'
import { formatDuration } from '@/lib/utils'
import { getYouTubeThumbnailUrl } from '@/utils/thumbnail'

import { videos } from '../constants/videos'
import type { Video } from '../types'

export const VideoFeeds = () => {
  return (
    <div className="flex flex-col gap-8 pb-6">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}

type VideoCardProps = {
  video: Video
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(paths.video.getHref(video.id))
  }

  return (
    <div className="flex flex-col" onClick={handleClick}>
      <div className="relative">
        <img
          src={getYouTubeThumbnailUrl(video.id)}
          alt={video.title}
          className="w-full aspect-video object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
          {formatDuration(video.duration)}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 px-4">
        <img src={video.channel_thumbnail} alt={video.channel} className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <h3 className="line-clamp-2 leading-5 mb-1.5 font-semibold">{video.title}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-600">{video.channel}</div>
        </div>
      </div>
    </div>
  )
}
