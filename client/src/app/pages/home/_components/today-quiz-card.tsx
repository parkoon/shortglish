import { motion } from 'framer-motion'
import { useNavigate } from 'react-router'

import { paths } from '@/config/paths'

export const TodayQuizCard = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(paths.quiz.getHref())
  }
  return (
    <motion.div
      role="button"
      onClick={handleClick}
      whileTap={{ scale: 0.98 }}
      className="shadow-xs border border-gray-200 p-4 bg-white rounded-lg"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="flex items-center justify-center w-5 h-5 bg-orange-600 rounded">
            <span className="font-extrabold text-white text-[14px]">Q</span>
          </div>
        </div>
        <h2 className="font-bold">오늘의 퀴즈보기</h2>
      </div>
    </motion.div>
  )
}
