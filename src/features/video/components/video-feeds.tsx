import { useMemo } from 'react'
import { useNavigate } from 'react-router'

import { useVideosQuery, type Video } from '@/api'
import { paths } from '@/config/paths'
import { analytics } from '@/lib/analytics'
import { formatDuration } from '@/lib/utils'
import { getYouTubeThumbnailUrl } from '@/utils/thumbnail'

import { DEFAULT_VIDEO_CATEGORY, useVideoCategoryFilter } from '../hooks/use-video-category-filter'

export const VideoFeeds = () => {
  const { data: videos = [], isLoading } = useVideosQuery()
  const { currentCategory } = useVideoCategoryFilter()

  // category 필터링 (현재 Video 타입에 categories 필드가 없어서 일단 전체 표시)
  // TODO: Video 타입에 categories 필드 추가 후 필터링 로직 활성화
  const filteredVideos = useMemo(() => {
    if (currentCategory === DEFAULT_VIDEO_CATEGORY) {
      return videos
    }

    // Video 타입에 categories 필드가 추가되면 아래 주석 해제
    // return videos.filter(video => video.categories?.includes(currentCategory))
    return videos
  }, [videos, currentCategory])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">비디오를 불러오는 중...</p>
      </div>
    )
  }

  if (filteredVideos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">비디오가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 pb-6">
      {filteredVideos.map(video => (
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
    // GA 이벤트: 비디오 클릭
    analytics.videoClick({
      video_id: video.id,
      video_title: video.title,
    })

    navigate(paths.videos.entry.getHref(video.id))
  }

  return (
    <div className="flex flex-col" onClick={handleClick}>
      <div className="relative">
        <img
          src={getYouTubeThumbnailUrl(video.id)}
          alt={video.title}
          className="w-full aspect-video object-cover"
          onError={e => {
            e.currentTarget.src = video.thumbnail
          }}
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
          {formatDuration(video.duration)}
        </div>
        {/* TODO. 나중에 키 작업할 때 살리기 */}
        {/* <div className="flex items-center gap-1 absolute top-2 left-2 bg-gray-100 text-xs px-2 py-0.5 rounded  text-gray-900">
          <IconKeyFilled size={14} className="text-yellow-500" />
          <span className="text-sm font-bold">1</span>
        </div> */}
      </div>

      <div className="mt-3 flex flex-col gap-1 px-4">
        <h3 className="line-clamp-2 leading-5 font-semibold">{video.title}</h3>
        <div className="flex items-center text-sm text-gray-600">{video.description}</div>
      </div>
    </div>
  )
}
