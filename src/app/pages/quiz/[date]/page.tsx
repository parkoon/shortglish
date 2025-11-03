import { IconCheck, IconVolume, IconX } from '@tabler/icons-react'
import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import type { CTAStatus } from '@/components/layouts/interactive-cta-layout'
import { InteractiveCTALayout } from '@/components/layouts/interactive-cta-layout'
import { PageLayout } from '@/components/layouts/page-layout'
import { paths } from '@/config/paths'
import { useQuizCompletionStore } from '@/features/quiz/store/quiz-completion-store'
import { speakText } from '@/utils/fill'
import { removeBraces } from '@/utils/text'

import {
  QuizSentenceBuilder,
  type QuizSentenceBuilderRef,
} from '../_components/quiz-sentence-builder'
import { useQuizByDate } from '../_hooks/use-quiz-by-date'

const QuizDetailPage = () => {
  const { date } = useParams<{ date: string }>()
  const navigate = useNavigate()
  const quizBuilderRef = useRef<QuizSentenceBuilderRef>(null)
  const { markQuizAsCompleted } = useQuizCompletionStore()

  const { data: quiz, isLoading, error } = useQuizByDate(date!)

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [ctaStatus, setCtaStatus] = useState<CTAStatus>('disabled')

  if (isLoading) {
    return (
      <PageLayout className="px-4">
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      </PageLayout>
    )
  }

  if (error || !quiz) {
    return (
      <PageLayout className="px-4">
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">퀴즈를 불러올 수 없습니다</p>
        </div>
      </PageLayout>
    )
  }

  const currentExercise = quiz.exercises[currentExerciseIndex]
  const isLastExercise = currentExerciseIndex === quiz.exercises.length - 1

  // 정답 문장 (중괄호 제거)
  const correctAnswer = removeBraces(currentExercise.text)

  // 모든 빈칸이 채워졌을 때
  const handleAllFilled = () => {
    setCtaStatus('ready')
  }

  // 정답일 때
  const handleComplete = () => {
    setCtaStatus('success')
  }

  // 오답일 때
  const handleWrong = () => {
    setCtaStatus('error')
  }

  // 확인 버튼 클릭
  const handleCheck = () => {
    // QuizSentenceBuilder의 verify 함수 호출
    quizBuilderRef.current?.verify()
  }

  // 다음 문제로
  const handleNext = () => {
    if (isLastExercise) {
      // 마지막 문제면 완료 처리 후 퀴즈 목록으로
      if (date) {
        markQuizAsCompleted(date)
      }
      navigate(paths.quiz.getHref())
    } else {
      // 다음 문제로
      setCurrentExerciseIndex(prev => prev + 1)
      setCtaStatus('disabled')
    }
  }

  // 다시 시도
  const handleRetry = () => {
    // 퀴즈 상태 초기화re
    quizBuilderRef.current?.reset()
    setCtaStatus('disabled')
  }

  // TTS 재생
  const handleSpeak = () => {
    speakText(correctAnswer)
  }

  // CTA 설정
  const getCtaConfig = () => {
    switch (ctaStatus) {
      case 'disabled':
        return {
          label: '확인',
          description: '빈칸을 모두 채워주세요',
        }
      case 'ready':
        return {
          label: '확인',
          onClick: handleCheck,
        }
      case 'success':
        return {
          overlayContent: (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <IconCheck className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-green-900 text-lg mb-1">정답이에요!</h3>
                  <button className="p-2 text-green-900" onClick={handleSpeak}>
                    <IconVolume />
                  </button>
                </div>
                <p className="text-green-800">{correctAnswer}</p>
                <p className="text-green-700 text-sm mt-1">{currentExercise.translation}</p>
              </div>
            </div>
          ),
          buttonLabel: isLastExercise ? '완료' : '다음 문제',
          onNext: handleNext,
        }
      case 'error':
        return {
          overlayContent: (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <IconX className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 text-lg mb-1">아쉬워요!</h3>
                <div>
                  <span className="text-sm text-red-700 font-semibold">정답:</span>
                  <p className="text-red-800">{correctAnswer}</p>
                </div>
              </div>
            </div>
          ),
          buttonLabel: '다시 시도',
          onRetry: handleRetry,
        }
    }
  }

  return (
    <InteractiveCTALayout
      status={ctaStatus}
      config={getCtaConfig()}
      classNames={{
        content: 'px-4 pt-6',
      }}
    >
      {/* 문제 번호 표시 */}
      <span className="text-sm font-semibold text-gray-500">
        {currentExerciseIndex + 1} / {quiz.exercises.length}
      </span>

      {/* 퀴즈 */}
      <QuizSentenceBuilder
        ref={quizBuilderRef}
        key={currentExerciseIndex}
        exercise={currentExercise}
        onComplete={handleComplete}
        onWrong={handleWrong}
        onAllFilled={handleAllFilled}
      />
    </InteractiveCTALayout>
  )
}

export default QuizDetailPage
