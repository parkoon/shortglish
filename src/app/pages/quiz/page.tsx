import { IconChevronRight } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'

import { PageLayout } from '@/components/layouts/page-layout'
import { paths } from '@/config/paths'

import { useTodayQuiz } from './_hooks/use-today-quiz'

const QuizPage = () => {
  const navigate = useNavigate()
  const todayQuiz = useTodayQuiz()

  const handleClick = () => {
    navigate(paths.quiz.detail.getHref(todayQuiz.data?.date ?? ''))
  }

  return (
    <PageLayout className="px-4">
      <motion.div
        role="button"
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
        className="shadow-xs border border-gray-200 px-4 py-3 bg-white rounded-lg"
      >
        <span className="inline-block px-2 py-1 text-xs font-semibold mb-2 bg-orange-600 text-white rounded-full">
          오늘의 표현
        </span>

        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="font-semibold">{todayQuiz.data?.pattern_korean}</p>
            <p className="text-gray-500">{todayQuiz.data?.pattern}</p>
          </div>
          <IconChevronRight className="text-gray-400" />
        </div>
      </motion.div>
    </PageLayout>
  )
}

export default QuizPage
