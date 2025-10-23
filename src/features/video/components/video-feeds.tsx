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

      <div className="mt-3 flex flex-col gap-1 px-4">
        <h3 className="line-clamp-2 leading-5 font-semibold">{video.title}</h3>
        <div className="flex items-center text-sm text-gray-600">{video.description}</div>
      </div>
    </div>
  )
}
