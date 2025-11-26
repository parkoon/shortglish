/**
 * 쉐도잉 연습 아코디언 컴포넌트
 * shadcn/ui Accordion을 사용합니다.
 */

import { IconCheck } from '@tabler/icons-react'
import { useEffect, useRef } from 'react'

import { Accordion, AccordionContent, AccordionItem } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

type StepData = {
  step: number
  title: string
  subtitle: string
  content: React.ReactNode
  isCompleted: boolean
}

type ShadowingAccordionProps = {
  steps: StepData[]
  currentStep: number
}

export const ShadowingAccordion = ({ steps, currentStep }: ShadowingAccordionProps) => {
  const currentValue = `step-${currentStep}`
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  // currentStep이 변경될 때 해당 섹션으로 스크롤
  useEffect(() => {
    const currentItemRef = itemRefs.current.get(currentStep)
    if (currentItemRef) {
      // 약간의 딜레이를 주어 아코디언이 열린 후 스크롤
      setTimeout(() => {
        currentItemRef.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      }, 100)
    }
  }, [currentStep])

  const setItemRef = (step: number, element: HTMLDivElement | null) => {
    if (element) {
      itemRefs.current.set(step, element)
    } else {
      itemRefs.current.delete(step)
    }
  }

  return (
    <Accordion
      type="single"
      collapsible
      value={currentValue}
      // onValueChange 제거 - 버튼으로만 제어
      className="flex flex-col gap-2"
    >
      {steps.map(step => {
        const stepValue = `step-${step.step}`
        const isActive = currentStep === step.step
        const isCompleted = step.isCompleted

        return (
          <AccordionItem
            key={step.step}
            value={stepValue}
            className="bg-white  overflow-hidden transition-all border-b-0"
          >
            {/* 헤더 (AccordionTrigger 대신 일반 div 사용) */}
            <div
              ref={el => setItemRef(step.step, el)}
              className="p-3 flex items-center gap-3 relative bg-white"
            >
              {/* 단계 원 */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0 transition-all',
                  isCompleted
                    ? 'bg-green-500 text-white'
                    : isActive
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-400',
                )}
              >
                {isCompleted ? <IconCheck size={16} /> : step.step}
              </div>

              {/* 정보 */}
              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    'text-base font-bold mb-0.5 truncate',
                    isCompleted ? 'text-gray-500' : 'text-gray-900',
                  )}
                >
                  {step.title}
                </div>
                <div className="text-sm text-gray-400 truncate">{step.subtitle}</div>
              </div>
            </div>
            <AccordionContent className="px-3 pb-4 bg-white">{step.content}</AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
