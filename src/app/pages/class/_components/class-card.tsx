import { useNavigate } from 'react-router'

import type { Class } from '@/api'
import { paths } from '@/config/paths'
import { getDifficultyInfo } from '@/features/video/utils/difficulty'
import { cn } from '@/lib/utils'

type ClassCardProps = {
  class: Class
}

export const ClassCard = ({ class: classData }: ClassCardProps) => {
  const navigate = useNavigate()
  const difficultyInfo = getDifficultyInfo(classData.difficulty)

  const handleClick = () => {
    navigate(paths.class.detail.getHref(classData.id))
  }

  return (
    <div
      onClick={handleClick}
      className="flex flex-col bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* 썸네일 */}
      <div className="relative">
        <img
          src={classData.thumbnail}
          alt={classData.title}
          className="w-full aspect-video object-cover"
        />
      </div>

      {/* 정보 */}
      <div className="p-4 flex flex-col gap-2">
        {/* 난이도 */}
        <div className="flex items-center gap-2">
          {difficultyInfo && (
            <span
              className={cn(
                'text-xs font-semibold px-2 py-0.5 rounded text-white',
                difficultyInfo.color,
              )}
            >
              {difficultyInfo.label}
            </span>
          )}
        </div>

        {/* 제목 */}
        <h3 className="font-semibold text-gray-900 line-clamp-2">{classData.title}</h3>

        {/* 설명 */}
        {classData.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{classData.description}</p>
        )}
      </div>
    </div>
  )
}
