import { useEffect, useMemo, useRef } from 'react'

import { useVideoCategoriesQuery } from '@/api'
import { MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { analytics } from '@/lib/analytics'
import { cn } from '@/lib/utils'

import { DEFAULT_VIDEO_CATEGORY, useVideoCategoryFilter } from '../hooks/use-video-category-filter'

export const VideoCategory = () => {
  const { data: dbCategories = [], isLoading } = useVideoCategoriesQuery()
  const { setCategory, isActiveCategory, currentCategory } = useVideoCategoryFilter()
  const activeButtonRef = useRef<HTMLButtonElement>(null)

  // "전체" 카테고리를 맨 앞에 추가하고, DB에서 가져온 카테고리들을 뒤에 배치
  const categories = useMemo(() => {
    const allCategory = { id: DEFAULT_VIDEO_CATEGORY, name: '전체' }
    return [allCategory, ...dbCategories]
  }, [dbCategories])

  const handleCategoryClick = (categoryId: string, categoryName: string) => {
    // GA 이벤트: 카테고리 필터 변경
    analytics.categoryFilter(categoryId, categoryName)
    setCategory(categoryId)
  }

  useEffect(() => {
    if (activeButtonRef.current) {
      activeButtonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [currentCategory])

  // 로딩 중이거나 카테고리가 없을 때는 빈 화면 표시 (또는 스켈레톤 UI)
  if (isLoading) {
    return (
      <div
        className="sticky bg-white z-40 scrollbar-hide"
        style={{
          maxWidth: MAX_APP_SCREEN_WIDTH,
          margin: '0 auto',
          top: 0,
          left: 0,
          right: 0,
          height: 56,
        }}
      >
        <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide">
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div
      className="sticky bg-white z-40 scrollbar-hide"
      style={{
        maxWidth: MAX_APP_SCREEN_WIDTH,
        margin: '0 auto',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
      }}
    >
      <div className="flex gap-3 px-4 py-3 overflow-x-auto scrollbar-hide">
        {categories.map(category => {
          const isActive = isActiveCategory(category.id)

          return (
            <button
              key={category.id}
              ref={isActive ? activeButtonRef : null}
              onClick={() => handleCategoryClick(category.id, category.name)}
              className={cn(
                'px-3 py-1.5 rounded text-sm font-semibold whitespace-nowrap transition-colors',
                isActive ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700',
              )}
              aria-pressed={isActive}
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
