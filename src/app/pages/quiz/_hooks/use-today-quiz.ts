import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { fetchTodayQuiz } from '../_api/quiz-api'

/**
 * 오늘의 퀴즈 조회 hook
 */
export const useTodayQuiz = () => {
  return useQuery({
    queryKey: queryKeys.quiz.today,
    queryFn: fetchTodayQuiz,
  })
}
