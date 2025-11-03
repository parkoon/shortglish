import { useParams } from 'react-router'

import { PageLayout } from '@/components/layouts/page-layout'

import { useQuizByDate } from '../_hooks/use-quiz-by-date'

const QuizDetailPage = () => {
  const { date } = useParams<{ date: string }>()

  const { data: quiz, isLoading, error } = useQuizByDate(date!)

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

  return <PageLayout className="px-4">!!</PageLayout>
}

export default QuizDetailPage
