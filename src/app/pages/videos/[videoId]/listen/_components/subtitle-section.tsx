import { IconLanguage } from '@tabler/icons-react'
import { useState } from 'react'

import type { Subtitle } from '@/api'
import { cn } from '@/lib/utils'

type SubtitleSectionProps = {
  currentSubtitle: Subtitle | null
  totalSubtitles: number
}

export const SubtitleSection = ({ currentSubtitle, totalSubtitles }: SubtitleSectionProps) => {
  const [showTranslation, setShowTranslation] = useState(true)

  if (!currentSubtitle) {
    return (
      <section className="bg-white px-4 py-6">
        <div className="text-center text-gray-400">자막이 없습니다.</div>
      </section>
    )
  }

  const currentIndex = currentSubtitle.index + 1

  return (
    <section className="bg-white px-4 pt-3 pb-6 border-b border-gray-200 shadow-xs">
      {/* 현재 자막/전체 자막 */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500">
          <span className="font-semibold text-gray-700">{currentIndex}</span> / {totalSubtitles}
        </span>

        {/* 번역 토글 버튼 */}
        <button
          className={cn(
            'border py-1 px-3 rounded-4xl border-gray-500 text-gray-500',
            showTranslation && 'text-yellow-500 border-yellow-500',
          )}
          onClick={() => setShowTranslation(prev => !prev)}
        >
          <IconLanguage stroke={1.5} />
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-lg font-medium text-gray-900 leading-relaxed">
          {currentSubtitle.originText}
        </p>
        <p
          className={cn(
            'text-gray-600 leading-relaxed transition-all duration-200',
            !showTranslation && 'text-white',
          )}
        >
          {currentSubtitle.translation}
        </p>
      </div>
    </section>
  )
}
