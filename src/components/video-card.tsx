import { useNavigate } from 'react-router'

import { paths } from '@/config/paths'
import type { Level, Video } from '@/types/youtube'
import { getYouTubeThumbnailUrl } from '@/utils/thumbnail'
import { secondsToTimeString, timeStringToSeconds } from '@/utils/time'

type VideoCardProps = {
  video: Video
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(paths.watch.getHref(video.videoId))
  }

  return (
    <div className="flex flex-col" onClick={handleClick}>
      <div className="relative">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover"
          onError={e => {
            // Fallback to YouTube thumbnail if local image not found
            const img = e.currentTarget
            img.src = getYouTubeThumbnailUrl(video.videoId)
          }}
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
          {secondsToTimeString(
            timeStringToSeconds(video.endTime) - timeStringToSeconds(video.startTime),
          )}
        </div>
      </div>
      <div className="flex-1 mt-3 px-3">
        <h3 className="line-clamp-2 leading-5 mb-1 font-semibold">{video.title}</h3>
        <p className="text-sm text-gray-600 mb-1">{video.description}</p>
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <DifficultyLevel level={video.level as keyof typeof DIFFICULTY_LEVEL} />
          <span>•</span>
          <span>{video.dialogueCount}câu</span>
        </div>
      </div>
    </div>
  )
}

const DIFFICULTY_LEVEL: Record<Level, { label: string; color: string }> = {
  easy: {
    label: 'Dễ',
    color: '#008000',
  },
  normal: {
    label: 'Trung bình',
    color: '#FFA500',
  },
  hard: {
    label: 'Khó',
    color: '#FF0000',
  },
}

type DifficultyLevelProps = {
  level: keyof typeof DIFFICULTY_LEVEL
}
const DifficultyLevel = ({ level }: DifficultyLevelProps) => {
  return (
    <div className="flex items-center gap-1">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: DIFFICULTY_LEVEL[level].color }}
      />
      <span>{DIFFICULTY_LEVEL[level].label}</span>
    </div>
  )
}
