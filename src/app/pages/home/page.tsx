// import { closeView } from '@granite-js/react-native'

import { PageLayout } from '@/components/layouts/page-layout'
import { VideoFeeds } from '@/features/video/components/video-feeds'
import { useAppCloseConfirm } from '@/hooks/use-app-close-confirm'

import { FloatingKey } from './_components/floating-key'

const Home = () => {
  useAppCloseConfirm()
  return (
    <PageLayout>
      <VideoFeeds />
      <FloatingKey />
    </PageLayout>
  )
}

export default Home
