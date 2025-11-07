import type { Icon } from '@tabler/icons-react'
import {
  IconCheck,
  IconLock,
  IconPencil,
  IconPlayerPlay,
  IconPlayerPlayFilled,
  IconPuzzle,
} from '@tabler/icons-react'
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router'

import { useVideoDetailQuery } from '@/api'
import { CTALayout } from '@/components/layouts/cta-layout'
import { PageLayout } from '@/components/layouts/page-layout'
import { MotionButton } from '@/components/ui/motion-button'
import { Stepper } from '@/components/ui/stepper'
import { paths } from '@/config/paths'
import { useDialogueCompletionStore } from '@/features/video/store/dialogue-completion-store'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
import { analytics } from '@/lib/analytics'
import { useModal } from '@/stores/modal-store'

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
  const modal = useModal()

  const { data: videoDetail, isLoading, isError } = useVideoDetailQuery(videoId)

  const { isStepCompleted, canAccessStep, resetVideoProgress } = useVideoProgressStore()
  const { clearVideo } = useDialogueCompletionStore()

  // GA 이벤트: Entry 페이지 진입
  useEffect(() => {
    if (videoId && videoDetail) {
      analytics.viewVideoEntry({
        video_id: videoId,
        video_title: videoDetail.title,
      })
    }
  }, [videoId, videoDetail])

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

  // 에러 처리: draft 비디오나 존재하지 않는 비디오 접근 시
  if (isError || !videoDetail) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">비디오를 찾을 수 없습니다.</p>
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
  const currentStepInfo = STEPS.find(step => step.type === nextStep.type)
  const currentStepIndex = STEPS.findIndex(step => step.type === nextStep.type)

  const handleRestartLearning = () => {
    if (!videoId) return

    modal.open({
      title: '학습을 다시 시작할까요?',
      description: '모든 학습 진행 상황이 초기화됩니다.\n처음부터 다시 시작하시겠어요?',
      okText: '다시 시작',
      cancelText: '취소',
      onOk: () => {
        // GA 이벤트: 학습 재시작
        analytics.restartLearning({
          video_id: videoId,
          video_title: videoDetail?.title,
        })

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

    // GA 이벤트: 학습 단계 시작
    analytics.startLearningStep({
      video_id: videoId,
      step_type: nextStep.type,
      video_title: videoDetail?.title,
    })

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
        {/* TODO. 나중에 키 작업할 때 살리기 */}
        {/* <div className="flex items-center gap-1 absolute top-2 left-2 bg-gray-100 text-xs px-2 py-0.5 rounded  text-gray-900">
          <IconKeyFilled size={14} className="text-yellow-500" />
          <span className="text-sm font-bold">1</span>
        </div> */}

        {currentStepInfo && !isAllCompleted && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
            <MotionButton
              onClick={handleButtonClick}
              className="bg-primary/80 text-white px-5 py-2 rounded-3xl flex items-center gap-2 font-semibold border border-white"
            >
              <IconPlayerPlayFilled size={16} />
              {currentStepIndex + 1}단계 {nextStep.label}
            </MotionButton>
          </div>
        )}
      </div>

      {/* 제목 */}
      <div className="px-4 py-6 mb-4">
        <h1 className="text-xl font-bold text-gray-900 leading-tight">{videoDetail?.title}</h1>
        <p className="text-sm text-gray-500 leading-tight">{videoDetail?.description}</p>
      </div>

      <div className="px-4">
        <Stepper
          items={STEPS.map(step => {
            const isCompleted = isStepCompleted(videoId, step.type)
            const canAccess = canAccessStep(videoId, step.type)
            const isInProgress = nextStep.type === step.type && !isCompleted

            // 진행 상태에 따른 아이콘 결정
            let icon = null
            if (isCompleted) {
              icon = <IconCheck className="text-green-600" size={18} />
            } else if (isInProgress) {
              icon = <>{currentStepIndex + 1}</>
            } else if (!canAccess) {
              icon = <IconLock className="text-gray-400" size={18} />
            }

            return {
              icon,
              title: step.label,
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
