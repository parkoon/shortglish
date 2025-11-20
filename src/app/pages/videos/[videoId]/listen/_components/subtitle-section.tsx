import { IconLanguage } from '@tabler/icons-react'
import { useState } from 'react'

import type { Subtitle } from '@/api'
import { cn } from '@/lib/utils'

type SubtitleSectionProps = {
  currentSubtitle: Subtitle
  totalSubtitles: number
}

export const SubtitleSection = ({ currentSubtitle }: SubtitleSectionProps) => {
  const [showTranslation, setShowTranslation] = useState(true)

  return (
    <section className="bg-white px-4 pt-3 pb-6 border-b border-gray-200 shadow-xs">
      {/* 현재 자막/전체 자막 */}
      <div className="flex items-center justify-end mb-4">
        {/* 번역 토글 버튼 */}
        <button
          className={cn(
            'border py-0.5 px-2.5 rounded-4xl border-gray-500 text-gray-500',
            showTranslation && 'text-yellow-500 border-yellow-500',
          )}
          onClick={() => setShowTranslation(prev => !prev)}
        >
          <IconLanguage stroke={1.5} />
        </button>
      </div>

      <div className="space-y-2">
        <p className="text-lg font-medium text-gray-900 leading-relaxed">
          {currentSubtitle.originText === '' ? (
            <span className="text-gray-500 italic">자막이 없는 구간이에요.</span>
          ) : (
            currentSubtitle.originText
          )}
        </p>

        {currentSubtitle.translation && (
          <p
            className={cn(
              'text-gray-600 leading-relaxed transition-all duration-200',
              !showTranslation && 'text-white',
            )}
          >
            {currentSubtitle.translation}
          </p>
        )}
      </div>
    </section>
  )
}
