import type { Icon } from '@tabler/icons-react'
import { IconCheck, IconLock, IconPencil, IconPlayerPlay, IconPuzzle } from '@tabler/icons-react'
import { useNavigate, useParams } from 'react-router'

import { CTALayout } from '@/components/layouts/cta-layout'
import { PageLayout } from '@/components/layouts/page-layout'
import { Button } from '@/components/ui/button'
import { TossStepper } from '@/components/ui/stepper'
import { paths } from '@/config/paths'
import { useVideoDetail } from '@/features/video/hooks/use-video-detail'
import { useDialogueCompletionStore } from '@/features/video/store/dialogue-completion-store'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
import { useGlobalModal } from '@/stores/modal-store'

type StepInfo = {
  label: string
  type: 'build' | 'fill' | 'review'
  icon: Icon
  description: string
}

const STEPS: StepInfo[] = [
  {
    label: '문장 완성하기',
    type: 'build',
    icon: IconPuzzle,
    description: '단어 카드를 조합해 올바른 문장을 만들어요',
  },
  {
    label: '빈칸 채우기',
    type: 'fill',
    icon: IconPencil,
    description: '문장 속 빈칸을 채우며 단어를 완벽하게 익혀요',
  },
  {
    label: '복습하기',
    type: 'review',
    icon: IconPlayerPlay,
    description: '학습한 문장을 복습하며 얼마나 들리는지 확인해요',
  },
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
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">비디오를 찾을 수 없습니다.</p>
        </div>
      </PageLayout>
    )
  }

  if (isLoading) {
    return (
      <PageLayout>
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

  const isAllCompleted = nextStep.type === 'completed'

  const content = (
    <>
      {/* 썸네일 */}
      <div className="relative">
        <img
          src={videoDetail?.thumbnail}
          alt={videoDetail?.title}
          className="w-full aspect-video object-cover"
        />
      </div>

      {/* 제목 */}
      <div className="px-4 py-6 mb-4">
        <h1 className="text-xl font-bold text-gray-900 leading-tight">{videoDetail?.title}</h1>
        <p className="text-sm text-gray-500 leading-tight">{videoDetail?.description}</p>
      </div>

      <div className="px-4">
        <TossStepper
          items={STEPS.map((step, index) => {
            const isCompleted = isStepCompleted(videoId, step.type)
            const canAccess = canAccessStep(videoId, step.type)
            const isInProgress = nextStep.type === step.type && !isCompleted

            // 진행 상태에 따른 아이콘 결정
            let rightIcon = null
            if (isCompleted) {
              rightIcon = <IconCheck className="text-green-600" />
            } else if (isInProgress) {
              rightIcon = (
                <Button size="xs" onClick={handleButtonClick}>
                  시작하기
                </Button>
              )
            } else if (!canAccess) {
              rightIcon = <IconLock className="text-gray-400" />
            }

            return {
              number: String(index + 1),
              title: step.label,
              right: rightIcon,
              description: step.description,
            }
          })}
        />
      </div>
    </>
  )

  if (isAllCompleted) {
    return (
      <CTALayout
        primaryButtonProps={{
          onClick: handleButtonClick,
          children: '다시 학습하기',
        }}
        ctaDescription="모든 학습을 완료했어요!"
        ctaShowDelay={0.3}
      >
        {content}
      </CTALayout>
    )
  }

  return <PageLayout>{content}</PageLayout>
}

export default EntryPage
