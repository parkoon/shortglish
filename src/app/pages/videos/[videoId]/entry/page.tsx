import type { Icon } from '@tabler/icons-react'
import { IconCheck, IconLock, IconPencil, IconPlayerPlay, IconPuzzle } from '@tabler/icons-react'
import { useNavigate, useParams } from 'react-router'

import { PageLayout } from '@/components/layouts/page-layout'
import { Button } from '@/components/ui/button'
import { MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { paths } from '@/config/paths'
import { useVideoDetail } from '@/features/video/hooks/use-video-detail'
import { useDialogueCompletionStore } from '@/features/video/store/dialogue-completion-store'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
import { cn } from '@/lib/utils'
import { useGlobalModal } from '@/stores/modal-store'

type StepInfo = {
  number: number
  label: string
  type: 'build' | 'fill' | 'review'
  icon: Icon
}

const STEPS: StepInfo[] = [
  { number: 1, label: '문장 완성하기', type: 'build', icon: IconPuzzle },
  { number: 2, label: '빈칸 채우기', type: 'fill', icon: IconPencil },
  { number: 3, label: '전체 영상 보기', type: 'review', icon: IconPlayerPlay },
]

const EntryPage = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const navigate = useNavigate()
  const modal = useGlobalModal()

  const { data: videoDetail, isLoading } = useVideoDetail(videoId)

  const { isStepCompleted, canAccessStep, resetVideoProgress } = useVideoProgressStore()
  const { clearVideo } = useDialogueCompletionStore()

  if (!videoId) {
    return (
      <PageLayout title="">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">비디오를 찾을 수 없습니다.</p>
        </div>
      </PageLayout>
    )
  }

  if (isLoading) {
    return (
      <PageLayout title="">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </PageLayout>
    )
  }

  // 다음 실행 가능한 스텝 찾기
  const getNextStep = () => {
    const buildCompleted = isStepCompleted(videoId, 'build')
    const fillCompleted = isStepCompleted(videoId, 'fill')
    const reviewCompleted = isStepCompleted(videoId, 'review')

    if (!buildCompleted && canAccessStep(videoId, 'build')) {
      return { type: 'build' as const, label: '문장 완성하기' }
    }
    if (!fillCompleted && canAccessStep(videoId, 'fill')) {
      return { type: 'fill' as const, label: '빈칸 채우기' }
    }
    if (!reviewCompleted && canAccessStep(videoId, 'review')) {
      return { type: 'review' as const, label: '전체 복습' }
    }
    return { type: 'completed' as const, label: '다시 학습하기' }
  }

  const nextStep = getNextStep()

  const handleRestartLearning = () => {
    if (!videoId) return

    modal.open({
      title: '학습을 다시 시작할까요?',
      description: '모든 학습 진행 상황이 초기화됩니다.\n처음부터 다시 시작하시겠어요?',
      okText: '다시 시작',
      cancelText: '취소',
      onOk: () => {
        // 모든 진행 상황 초기화
        resetVideoProgress(videoId)
        clearVideo(videoId)
      },
    })
  }

  const handleButtonClick = () => {
    if (nextStep.type === 'completed') {
      handleRestartLearning()
      return
    }

    const pathMap = {
      build: paths.videos.build,
      fill: paths.videos.fill,
      review: paths.videos.review,
    }

    navigate(pathMap[nextStep.type].getHref(videoId))
  }

  return (
    <PageLayout title="">
      {/* 썸네일 */}
      <div className="relative">
        <img
          src={videoDetail?.thumbnail}
          alt={videoDetail?.title}
          className="w-full aspect-video object-cover"
        />
      </div>

      {/* 제목 */}
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold text-gray-900 leading-tight">{videoDetail?.title}</h1>
        <p className="text-sm text-gray-500 leading-tight">{videoDetail?.description}</p>
      </div>

      <div className="pb-32 px-4">
        <div className="bg-gray-100 rounded-2xl p-4">
          <div className="space-y-4">
            {STEPS.map(step => {
              const isCompleted = isStepCompleted(videoId, step.type)
              const canAccess = canAccessStep(videoId, step.type)

              const StepIcon = step.icon

              return (
                <div key={step.number} className="flex items-center gap-2 transition-all">
                  {/* 아이콘 원형 뱃지 */}
                  <div className={cn(!isCompleted && !canAccess && ' text-gray-500')}>
                    {isCompleted ? (
                      <IconCheck size={20} />
                    ) : !canAccess ? (
                      <IconLock size={20} />
                    ) : (
                      <StepIcon size={20} />
                    )}
                  </div>

                  {/* 단계 레이블 */}
                  <span
                    className={cn(
                      'font-medium flex-1',
                      isCompleted && 'line-through text-gray-400',
                      !isCompleted && canAccess && 'text-gray-900',
                      !isCompleted && !canAccess && 'text-gray-400',
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 하단 고정 버튼 */}
      <div
        style={{ maxWidth: MAX_APP_SCREEN_WIDTH }}
        className="fixed bottom-0 left-0 right-0 mx-auto bg-white border-t-1 border-gray-200 p-4"
      >
        <Button variant="default" onClick={handleButtonClick} className={cn('w-full')}>
          {nextStep.label}
        </Button>
      </div>
    </PageLayout>
  )
}

export default EntryPage
