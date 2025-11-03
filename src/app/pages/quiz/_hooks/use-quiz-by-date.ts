import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/lib/query-keys'

import { fetchQuizByDate } from '../_api/quiz-api'

/**
 * 특정 날짜의 퀴즈 조회 hook
 */
export const useQuizByDate = (date: string) => {
  return useQuery({
    queryKey: queryKeys.quiz.byDate(date),
    queryFn: () => fetchQuizByDate(date),
  })
}

