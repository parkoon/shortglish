import { useNavigate, useParams } from 'react-router'

import { type ClassFeed, useClassDetailQuery } from '@/api'
import { paths } from '@/config/paths'
import { formatDuration } from '@/lib/utils'
import { getYouTubeThumbnailUrl } from '@/utils/thumbnail'

export const ClassFeeds = () => {
  const { classId } = useParams<{ classId: string }>()
  const { data: classDetail, isLoading: isClassLoading } = useClassDetailQuery(classId)

  const isLoading = isClassLoading

  // 초기 로딩 - 스켈레톤 UI
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        {Array.from({ length: 3 }).map((_, index) => (
          <ClassFeedCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 px-4">
      {classDetail?.feeds.map(feed => (
        <ClassFeedCard key={feed.id} feed={feed} />
      ))}
    </div>
  )
}

export const ClassFeedCard = ({ feed }: { feed: ClassFeed }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(paths.videos.watch.getHref(feed.id))
  }

  return (
    <div className="flex flex-col" onClick={handleClick}>
      <div className="relative">
        <img
          src={getYouTubeThumbnailUrl(feed.id)}
          alt={feed.title}
          className="w-full aspect-video object-cover rounded-xl"
          onError={e => {
            e.currentTarget.src = getYouTubeThumbnailUrl(feed.id)
          }}
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
          {formatDuration(feed.duration)}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1 px-1">
        <h3 className="line-clamp-2 leading-5 font-semibold">{feed.title}</h3>
        <div className="flex items-center text-sm text-gray-600">{feed.description}</div>
      </div>
    </div>
  )
}

// 스켈레톤 UI 컴포넌트
const ClassFeedCardSkeleton = () => {
  return (
    <div className="flex flex-col animate-pulse">
      {/* 썸네일 스켈레톤 */}
      <div className="w-full aspect-video bg-gray-200 rounded" />

      {/* 제목 및 설명 스켈레톤 */}
      <div className="mt-3 flex flex-col gap-2 px-4">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  )
}
