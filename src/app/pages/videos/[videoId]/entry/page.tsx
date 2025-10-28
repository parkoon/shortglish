import { IconBlockquote, IconEdit, IconPlayerPlay } from '@tabler/icons-react'
import { useNavigate, useParams } from 'react-router'

import { PageLayout } from '@/components/layouts/page-layout'
import { paths } from '@/config/paths'
import { useDialogueCompletionStore } from '@/features/video/store/dialogue-completion-store'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
import { useGlobalModal } from '@/stores/modal-store'

import { StepCard } from './_components/step-card'

const EntryPage = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const navigate = useNavigate()
  const modal = useGlobalModal()

  const { isStepCompleted, canAccessStep, resetStep } = useVideoProgressStore()
  const { clearVideo } = useDialogueCompletionStore()

  if (!videoId) {
    return (
      <PageLayout title="학습하기">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">비디오를 찾을 수 없습니다.</p>
        </div>
      </PageLayout>
    )
  }

  const buildCompleted = isStepCompleted(videoId, 'build')
  const fillCompleted = isStepCompleted(videoId, 'fill')
  const reviewCompleted = isStepCompleted(videoId, 'review')

  const canAccessBuild = canAccessStep(videoId, 'build')
  const canAccessFill = canAccessStep(videoId, 'fill')
  const canAccessReview = canAccessStep(videoId, 'review')

  const getBuildStatus = () => {
    if (!canAccessBuild) return 'locked'
    if (buildCompleted) return 'completed'
    return 'available'
  }

  const getFillStatus = () => {
    if (!canAccessFill) return 'locked'
    if (fillCompleted) return 'completed'
    return 'available'
  }

  const getReviewStatus = () => {
    if (!canAccessReview) return 'locked'
    if (reviewCompleted) return 'completed'
    return 'available'
  }

  const handleBuildStart = () => {
    navigate(paths.videos.build.getHref(videoId))
  }

  const handleFillStart = () => {
    navigate(paths.videos.fill.getHref(videoId))
  }

  const handleReviewStart = () => {
    navigate(paths.videos.review.getHref(videoId))
  }

  const handleBuildReset = () => {
    modal.open({
      title: '처음부터 다시하기',
      description: '단어 조합 게임의 모든 진행 상황이 초기화됩니다.\n계속하시겠습니까?',
      okText: '계속',
      cancelText: '취소',
      onOk: () => {
        // build 단계 초기화
        resetStep(videoId, 'build')
        // dialogue completion 초기화
        clearVideo(videoId)
        // build 페이지로 이동
        navigate(paths.videos.build.getHref(videoId))
      },
    })
  }

  const handleFillReset = () => {
    modal.open({
      title: '처음부터 다시하기',
      description: '빈칸 채우기의 모든 진행 상황이 초기화됩니다.\n계속하시겠습니까?',
      okText: '계속',
      cancelText: '취소',
      onOk: () => {
        // fill 단계 초기화
        resetStep(videoId, 'fill')
        // fill 페이지로 이동
        navigate(paths.videos.fill.getHref(videoId))
      },
    })
  }

  const handleReviewReset = () => {
    modal.open({
      title: '처음부터 다시하기',
      description: '전체 복습을 다시 시작합니다.\n계속하시겠습니까?',
      okText: '계속',
      cancelText: '취소',
      onOk: () => {
        // review 단계 초기화
        resetStep(videoId, 'review')
        // review 페이지로 이동
        navigate(paths.videos.review.getHref(videoId))
      },
    })
  }

  return (
    <PageLayout title="학습 단계">
      <div className="px-4 py-6">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">영어 학습 시작하기</h1>
          <p className="text-gray-600">3단계로 구성된 학습을 순서대로 완료하세요</p>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Step 1: Build */}
          <StepCard
            icon={<IconBlockquote />}
            title="1. 단어 조합 게임"
            description="영상의 문장을 단어로 조합하며 학습해요"
            status={getBuildStatus()}
            onStart={handleBuildStart}
            onReset={buildCompleted ? handleBuildReset : undefined}
          />

          {/* Connecting Line */}
          <div className="flex justify-center">
            <div className="w-0.5 h-8 bg-gray-300" />
          </div>

          {/* Step 2: Fill */}
          <StepCard
            icon={<IconEdit />}
            title="2. 빈칸 채우기"
            description="문장의 빈칸을 채우며 스펠링을 익혀요"
            status={getFillStatus()}
            onStart={handleFillStart}
            onReset={fillCompleted ? handleFillReset : undefined}
          />

          {/* Connecting Line */}
          <div className="flex justify-center">
            <div className="w-0.5 h-8 bg-gray-300" />
          </div>

          {/* Step 3: Review */}
          <StepCard
            icon={<IconPlayerPlay />}
            title="3. 전체 복습"
            description="배운 내용을 토대로 전체 영상을 복습해요"
            status={getReviewStatus()}
            onStart={handleReviewStart}
            onReset={reviewCompleted ? handleReviewReset : undefined}
          />
        </div>
      </div>
    </PageLayout>
  )
}

export default EntryPage
