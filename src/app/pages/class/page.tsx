import { useClassesQuery } from '@/api'
import { PageLayout } from '@/components/layouts/page-layout'
import { Spinner } from '@/components/ui/spinner'

import { ClassGrid } from './_components/class-grid'

const ClassListPage = () => {
  const { data: classes = [], isLoading, isError } = useClassesQuery()

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      </PageLayout>
    )
  }

  if (isError) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">클래스를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="py-4">
        <ClassGrid classes={classes} />
      </div>
    </PageLayout>
  )
}

export default ClassListPage
