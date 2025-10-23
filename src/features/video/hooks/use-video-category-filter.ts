import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

import { DEFAULT_VIDEO_CATEGORY } from '../constants/categories'

const VIDEO_CATEGORY_QUERY_KEY = 'category'

export const useVideoCategoryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const currentCategory = searchParams.get(VIDEO_CATEGORY_QUERY_KEY) || DEFAULT_VIDEO_CATEGORY

  const setCategory = useCallback(
    (category: string) => {
      const newParams = new URLSearchParams(searchParams)

      if (category === DEFAULT_VIDEO_CATEGORY) {
        newParams.delete(VIDEO_CATEGORY_QUERY_KEY)
      } else {
        newParams.set(VIDEO_CATEGORY_QUERY_KEY, category)
      }

      setSearchParams(newParams, { replace: true })
    },
    [searchParams, setSearchParams],
  )

  const isActiveCategory = useCallback(
    (category: string) => currentCategory === category,
    [currentCategory],
  )

  return {
    currentCategory,
    setCategory,
    isActiveCategory,
  }
}
