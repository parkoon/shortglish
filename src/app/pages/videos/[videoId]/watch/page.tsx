import { useParams } from 'react-router'

import { useVideoContentQuery, type VideoContent } from '@/api'
import { PageLayout } from '@/components/layouts/page-layout'
import { Spinner } from '@/components/ui/spinner'

import { VideoContent as VideoContentComponent } from './_components/video-content'

const WatchPage = () => {
  const { videoId } = useParams<{ videoId: string }>()

  const {
    data: videoContent,
    isLoading,
    isError,
    error,
  } = useVideoContentQuery<VideoContent>(videoId)

  if (!videoId) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-gray-500 text-lg">비디오 ID가 필요합니다.</p>
          <p className="text-gray-400 text-sm">URL을 확인해주세요.</p>
        </div>
      </PageLayout>
    )
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Spinner size="lg" />
          <p className="text-gray-500">콘텐츠를 불러오는 중...</p>
        </div>
      </PageLayout>
    )
  }

  if (isError || !videoContent) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="text-gray-700 text-lg font-medium">콘텐츠를 불러올 수 없습니다</p>
          <p className="text-gray-500 text-sm text-center max-w-md">
            {error instanceof Error
              ? error.message
              : '비디오 콘텐츠를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
          </p>
        </div>
      </PageLayout>
    )
  }

  // 데이터 유효성 검증
  if (!videoContent.subtitles || videoContent.subtitles.length === 0) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="text-yellow-500 text-4xl mb-2">📝</div>
          <p className="text-gray-700 text-lg font-medium">자막 데이터가 없습니다</p>
          <p className="text-gray-500 text-sm">이 비디오에는 자막이 포함되어 있지 않습니다.</p>
        </div>
      </PageLayout>
    )
  }

  return <VideoContentComponent content={videoContent} />
}

export default WatchPage
