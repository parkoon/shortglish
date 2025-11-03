import { PageLayout } from '@/components/layouts/page-layout'
import { VideoFeeds } from '@/features/video/components/video-feeds'

const Home = () => {
  return (
    <PageLayout>
      {/* <VideoCategory /> */}
      <VideoFeeds />
    </PageLayout>
  )
}

export default Home
