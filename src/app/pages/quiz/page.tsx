import { IconChevronRight } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'

import { useTodayQuizQuery } from '@/api'
import { PageLayout } from '@/components/layouts/page-layout'
import { paths } from '@/config/paths'
import { useQuizCompletionStore } from '@/features/quiz/store/quiz-completion-store'
import { cn } from '@/lib/utils'

const QuizPage = () => {
  const navigate = useNavigate()
  const todayQuiz = useTodayQuizQuery()
  const { isQuizCompleted } = useQuizCompletionStore()

  // 오늘 날짜 (YYYY-MM-DD 형식)
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const todayDate = `${year}-${month}-${day}`

  const isCompleted = isQuizCompleted(todayDate)

  const handleClick = () => {
    if (isCompleted) return // 완료된 퀴즈는 진입 불가
    navigate(paths.quiz.detail.getHref(todayDate))
  }

  return (
    <PageLayout className="px-4">
      <motion.div
        role="button"
        onClick={handleClick}
        whileTap={isCompleted ? undefined : { scale: 0.98 }}
        className={cn(
          'shadow-xs border px-4 py-3 rounded-lg',
          isCompleted
            ? 'bg-gray-50 border-gray-300 cursor-not-allowed'
            : 'bg-white border-gray-200',
        )}
      >
        <span
          className={cn(
            'inline-block px-2 py-1 text-xs font-semibold mb-2 text-white rounded-full',
            isCompleted ? 'bg-green-500' : 'bg-orange-600',
          )}
        >
          {isCompleted ? '완료' : '오늘의 표현'}
        </span>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={cn('font-semibold', isCompleted && 'text-gray-500')}>
              {todayQuiz.data?.pattern_korean}
            </p>
            <p className={cn('text-gray-500', isCompleted && 'text-gray-400')}>
              {todayQuiz.data?.pattern}
            </p>
          </div>
          {!isCompleted && <IconChevronRight className="text-gray-400" />}
        </div>
      </motion.div>
    </PageLayout>
  )
}

export default QuizPage
