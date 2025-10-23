import { useState } from 'react'

export type Category = {
  id: string
  label: string
  active?: boolean
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'all', label: 'Tất cả', active: true },
  { id: 'k-pop', label: 'K-pop' },
] as const

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)

  const updateCategoryActive = (data: Category) => {
    setCategories(prev =>
      prev.map(category => ({
        ...category,
        active: category.id === data.id,
      })),
    )
  }

  return {
    categories,
    updateCategoryActive,
  }
}
