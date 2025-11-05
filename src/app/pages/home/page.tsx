// import { closeView } from '@granite-js/react-native'

import { PageLayout } from '@/components/layouts/page-layout'
import { VideoFeeds } from '@/features/video/components/video-feeds'
import { useAppCloseConfirm } from '@/hooks/use-app-close-confirm'

import { FloatingKeyWithBottomSheet } from './_components/floating-key-with-bottom-sheet'

const Home = () => {
  useAppCloseConfirm()
  return (
    <PageLayout>
      <VideoFeeds />
      <FloatingKeyWithBottomSheet />
    </PageLayout>
  )
}

export default Home
