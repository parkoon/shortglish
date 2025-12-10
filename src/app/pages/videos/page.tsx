// import { closeView } from '@granite-js/react-native'

import { PageLayout } from '@/components/layouts/page-layout'
import { VideoCategory } from '@/features/video/components/video-category'
import { VideoFeeds } from '@/features/video/components/video-feeds'

// import { useAppCloseConfirm } from '@/hooks/use-app-close-confirm'
import { ClassEntryPoint } from './_components/class-entry-point'
import { FloatingKeyWithBottomSheet } from './_components/floating-key-with-bottom-sheet'

const Home = () => {
  // useAppCloseConfirm()
  return (
    <PageLayout className="bg-white">
      <div className="px-4 mb-2 mt-4">
        <ClassEntryPoint />
      </div>
      <VideoCategory />

      <div className="px-4">
        <VideoFeeds />
      </div>

      <FloatingKeyWithBottomSheet />
    </PageLayout>
  )
}

export default Home
