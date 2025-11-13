/**
 * 쉐도잉 연습 페이지
 */

import { useState } from 'react'

import { PageLayout } from '@/components/layouts/page-layout'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { CompleteModal } from './_components/complete-modal'
import { ShadowingAccordion } from './_components/shadowing-accordion'
import { Step1Content } from './_components/step-1-content'
import { Step2Content } from './_components/step-2-content'
import { Step3Content } from './_components/step-3-content'

const ShadowingPage = () => {
  // const { videoId } = useParams<{ videoId: string }>()

  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [hasRecorded, setHasRecorded] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  const totalSteps = 3

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

  // 현재 자막 문장 (없으면 첫 번째 자막 사용)
  // const currentSentence = currentDialogue?.originText || subtitles[0]?.originText || ''

  return (
    <PageLayout className="pb-20">
      {/* 헤더 - 유튜브 영상 및 자막 */}
      <section className="aspect-video bg-gray-800 flex items-center justify-center text-white text-xl font-semibold">
        비디오 영역
      </section>
      <section className="h-[56px] bg-gray-600 flex items-center justify-center text-white text-xl font-semibold">
        컨트롤러 영역
      </section>
      <div className="bg-white border-b border-gray-200 px-4 py-2 text-gray-600 mb-2">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nisi in, quam cum iusto assumenda
        vero ipsum, est,
      </div>
      <ShadowingAccordion steps={steps} currentStep={currentStep} />

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
