import { useEffect, useRef } from 'react'

import { APP_BAR_HEIGHT, MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { cn } from '@/lib/utils'

import { VIDEO_CATEGORIES } from '../constants/categories'
import { useVideoCategoryFilter } from '../hooks/use-video-category-filter'

export const VideoCategory = () => {
  const { setCategory, isActiveCategory, currentCategory } = useVideoCategoryFilter()
  const activeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (activeButtonRef.current) {
      activeButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [currentCategory])

  return (
    <div
      className="sticky bg-white z-40 scrollbar-hide"
      style={{
        maxWidth: MAX_APP_SCREEN_WIDTH,
        margin: '0 auto',
        top: APP_BAR_HEIGHT,
        left: 0,
        right: 0,
        height: 56,
      }}
    >
      <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide">
        {VIDEO_CATEGORIES.map(category => {
          const isActive = isActiveCategory(category.id)

          return (
            <button
              key={category.id}
              ref={isActive ? activeButtonRef : null}
              onClick={() => setCategory(category.id)}
              className={cn(
                'px-3 py-1.5 rounded text-sm whitespace-nowrap transition-colors',
                isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700',
              )}
              aria-pressed={isActive}
            >
              {category.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
