/**
 * 쉐도잉 연습 페이지
 */

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router'

import type { Subtitle } from '@/api'
import { useSubtitlesQuery } from '@/api'
import { PageLayout } from '@/components/layouts/page-layout'
import { Button } from '@/components/ui/button'
import {
  YOUTUBE_PLAYER_STATE,
  YouTubePlayer,
  type YouTubePlayerRef,
} from '@/features/video/components/youtube-player'
import { cn } from '@/lib/utils'

import { SubtitleProgressBar } from '../_components/subtitle-progress-bar'
import { CompleteModal } from './_components/complete-modal'
import { ShadowingAccordion } from './_components/shadowing-accordion'
import { Step1Content } from './_components/step-1-content'
import { Step2Content } from './_components/step-2-content'
import { Step3Content } from './_components/step-3-content'

const ShadowingPage = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const { data: subtitles = [], isLoading: isLoadingDialogues } = useSubtitlesQuery(videoId)

  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [hasRecorded, setHasRecorded] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [currentDialogue, setCurrentDialogue] = useState<Subtitle | null>(null)

  const playerRef = useRef<YouTubePlayerRef>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const currentDialogueRef = useRef(currentDialogue)

  const totalSteps = 3

  useEffect(() => {
    currentDialogueRef.current = currentDialogue
  }, [currentDialogue])

  // Cleanup: 컴포넌트 unmount 시 interval 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const getCurrentDialogue = (time: number): Subtitle | null => {
    return subtitles.find(d => time >= d.startTime && time < d.endTime) ?? null
  }

  const startTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      if (!playerRef.current) return

      const time = playerRef.current.getCurrentTime()
      const foundDialogue = getCurrentDialogue(time)

      if (foundDialogue && foundDialogue.index !== currentDialogueRef.current?.index) {
        setCurrentDialogue(foundDialogue)
      }
    }, 100)
  }

  const stopTimeTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const handleStateChange = (state: number) => {
    if (state === YOUTUBE_PLAYER_STATE.PLAYING) {
      startTimeTracking()
      return
    }

    stopTimeTracking()
  }

  const handleNext = () => {
    // 3단계에서 다음 버튼 클릭 시
    if (currentStep === 3) {
      if (!hasRecorded) {
        // 녹음 안내 (간단한 알림으로 처리)
        alert('먼저 녹음을 완료해주세요')
        return
      }
      setShowCompleteModal(true)
      return
    }

    // 다음 단계로 이동
    const nextStep = currentStep + 1
    if (nextStep <= totalSteps) {
      setCompletedSteps(prev => [...prev, currentStep])
      setCurrentStep(nextStep)
    }
  }

  const handlePrevious = () => {
    const prevStep = currentStep - 1
    if (prevStep >= 1) {
      setCurrentStep(prevStep)
      setCompletedSteps(prev => prev.filter(s => s !== prevStep))
    }
  }

  const handleRecordComplete = () => {
    setHasRecorded(true)
  }

  const handleComplete = () => {
    // 완료 처리 (나중에 API 호출 등)
    setCurrentStep(1)
    setCompletedSteps([])
    setHasRecorded(false)
  }

  const steps = [
    {
      step: 1,
      title: '강세 단어만 강조하기',
      subtitle: '리듬의 뼈대를 만들어요',
      content: <Step1Content isActive={currentStep === 1} />,
      isCompleted: completedSteps.includes(1),
    },
    {
      step: 2,
      title: '약한 단어 자연스럽게 연결',
      subtitle: '강세 사이를 부드럽게 채워요',
      content: <Step2Content />,
      isCompleted: completedSteps.includes(2),
    },
    {
      step: 3,
      title: '한 호흡으로 완성하기',
      subtitle: '자연스러운 리듬으로 말해요',
      content: <Step3Content onRecordComplete={handleRecordComplete} />,
      isCompleted: completedSteps.includes(3),
    },
  ]

  if (!videoId) {
    return (
      <PageLayout>
        <div className="p-4">비디오를 찾을 수 없습니다.</div>
      </PageLayout>
    )
  }

  if (isLoadingDialogues) {
    return (
      <PageLayout>
        <div className="p-4">비디오를 불러오는 중입니다.</div>
      </PageLayout>
    )
  }

  // 현재 자막 문장 (없으면 첫 번째 자막 사용)
  const currentSentence = currentDialogue?.originText || subtitles[0]?.originText || ''

  return (
    <PageLayout className="pb-20">
      {/* 헤더 - 유튜브 영상 및 자막 */}
      <div className="sticky top-0 z-10 bg-white">
        <section className="aspect-video bg-gray-800 flex items-center justify-center text-white text-2xl font-bold">
          비디오 영역
        </section>
        <div className="bg-white border-b border-gray-200 px-4 py-2 text-gray-600">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi in, quam cum iusto
          assumenda vero ipsum, est,
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="px-3 py-2 overflow-y-auto">
        <ShadowingAccordion steps={steps} currentStep={currentStep} />
      </div>

      {/* 하단 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 p-3">
        <div className="max-w-[430px] mx-auto flex gap-2">
          <Button
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex-1"
          >
            이전
          </Button>
          <Button
            onClick={handleNext}
            className={cn(
              'flex-1',
              currentStep === 3 && hasRecorded && 'bg-green-500 hover:bg-green-600',
            )}
          >
            {currentStep === 3 ? '완료' : '다음'}
          </Button>
        </div>
      </div>

      {/* 완료 모달 */}
      <CompleteModal
        isOpen={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onConfirm={handleComplete}
      />
    </PageLayout>
  )
}

export default ShadowingPage
