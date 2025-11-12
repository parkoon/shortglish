import { useQueryParam } from '@/hooks/use-query-param'

export const VIDEO_CATEGORY_QUERY_KEY = 'category'
export const DEFAULT_VIDEO_CATEGORY = 'all'

export const useVideoCategoryFilter = () => {
  const {
    value: currentCategory,
    setValue: setCategory,
    isActive: isActiveCategory,
  } = useQueryParam<string>({
    key: VIDEO_CATEGORY_QUERY_KEY,
    defaultValue: DEFAULT_VIDEO_CATEGORY,
  })

  return {
    currentCategory,
    setCategory,
    isActiveCategory,
  }
}
