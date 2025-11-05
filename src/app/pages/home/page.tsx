// import { closeView } from '@granite-js/react-native'

import { PageLayout } from '@/components/layouts/page-layout'
import { VideoFeeds } from '@/features/video/components/video-feeds'
import { useAppCloseConfirm } from '@/hooks/use-app-close-confirm'

const Home = () => {
  useAppCloseConfirm()
  return (
    <PageLayout>
      <VideoFeeds />
    </PageLayout>
  )
}

export default Home
