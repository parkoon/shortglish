import type { TodayQuiz } from '../_types/quiz'

/**
 * 특정 날짜의 퀴즈 조회
 */
export const fetchQuizByDate = async (date: string): Promise<TodayQuiz> => {
  const response = await fetch(`/quiz/${date}.json`)

  if (!response.ok) {
    throw new Error(`Failed to fetch quiz for ${date}: ${response.statusText}`)
  }

  return response.json()
}

/**
 * 오늘의 퀴즈 조회
 */
export const fetchTodayQuiz = async (): Promise<TodayQuiz> => {
  // 현재 날짜를 YYYY-MM-DD 형식으로 포맷
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  const dateString = `${year}-${month}-${day}`

  return fetchQuizByDate(dateString)
}

