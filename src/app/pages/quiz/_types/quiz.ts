/**
 * Quiz Exercise
 * 개별 퀴즈 문항
 */
export type QuizExercise = {
  text: string
  translation: string
  options: string[]
}

/**
 * Today Quiz
 * 오늘의 퀴즈 데이터
 */
export type TodayQuiz = {
  date?: string
  day?: number
  pattern: string
  pattern_korean: string
  exercises: QuizExercise[]
}
