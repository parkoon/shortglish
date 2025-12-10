import { PageLayout } from '@/components/layouts/page-layout'

import { ClassFeeds } from './_components/class-feeds'
import { ClassInfoSection } from './_components/class-info-section'

const ClassDetailPage = () => {
  return (
    <PageLayout className="bg-white">
      <div className="flex flex-col min-h-screen">
        <ClassInfoSection />

        <div className="flex-1 pt-6">
          <ClassFeeds />
        </div>
      </div>
    </PageLayout>
  )
}

export default ClassDetailPage
