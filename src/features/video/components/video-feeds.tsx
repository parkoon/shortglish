import { useEffect, useMemo } from 'react'
import { useInView } from 'react-intersection-observer'
import { useNavigate } from 'react-router'

import { useInfiniteVideosQuery, useVideoCategoriesQuery, type Video } from '@/api'
import { Spinner } from '@/components/ui/spinner'
import { paths } from '@/config/paths'
import { analytics } from '@/lib/analytics'
import { formatDuration } from '@/lib/utils'
import { getYouTubeThumbnailUrl } from '@/utils/thumbnail'

import { DEFAULT_VIDEO_CATEGORY, useVideoCategoryFilter } from '../hooks/use-video-category-filter'
import { getDifficultyInfo } from '../utils/difficulty'

export const VideoFeeds = () => {
  const { currentCategory } = useVideoCategoryFilter()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useInfiniteVideosQuery(currentCategory === DEFAULT_VIDEO_CATEGORY ? undefined : currentCategory)

  // 모든 페이지의 비디오를 평탄화
  const videos = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? []
  }, [data])

  // 하단 감지용 sentinel 요소
  const { ref, inView } = useInView({
    threshold: 0.1, // 화면의 10% 지점에서 로드
    triggerOnce: false, // 여러 번 트리거 가능하도록
  })

  // 하단에 도달하면 다음 페이지 로드
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  // 초기 로딩
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">비디오를 불러오는 중...</p>
      </div>
    )
  }

  // 에러 상태
  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">비디오를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    )
  }

  // 데이터가 없을 때
  if (videos.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">비디오가 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {videos.map(video => (
        <VideoCard key={video.id} video={video} />
      ))}

      {/* 하단 감지용 sentinel 요소 */}
      <div ref={ref} className="flex items-center justify-center py-4">
        {isFetchingNextPage && <Spinner size="sm" />}
      </div>
    </div>
  )
}

type VideoCardProps = {
  video: Video
}

export const VideoCard = ({ video }: VideoCardProps) => {
  const navigate = useNavigate()
  const { data: categories = [] } = useVideoCategoriesQuery()

  const handleClick = () => {
    // GA 이벤트: 비디오 클릭
    analytics.videoClick({
      video_id: video.id,
      video_title: video.title,
    })

    navigate(paths.videos.entry.getHref(video.id))
  }

  const difficultyInfo = getDifficultyInfo(video.difficulty)

  // 카테고리 정보 매칭
  const category = video.categoryId
    ? categories.find(cat => Number(cat.id) === video.categoryId)
    : null

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
        {/* Difficulty & Category 배지 - 좌측 상단 가로 정렬 */}
        {(difficultyInfo || category) && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5">
            {difficultyInfo && (
              <div
                className={`${difficultyInfo.color} text-white text-xs font-semibold px-2 py-1 rounded border border-white`}
              >
                {difficultyInfo.label}
              </div>
            )}
            {category && (
              <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded font-semibold border border-white">
                {category.name}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1 px-4">
        <h3 className="line-clamp-2 leading-5 font-semibold">{video.title}</h3>
        <div className="flex items-center text-sm text-gray-600">{video.description}</div>
      </div>
    </div>
  )
}
