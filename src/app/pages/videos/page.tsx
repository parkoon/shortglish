import { MainLayout } from '@/components/layouts/main-layout'
import { VideoCategory } from '@/features/video/components/video-category'
import { VideoFeeds } from '@/features/video/components/video-feeds'

const Home = () => {
  return (
    <MainLayout>
      <VideoCategory />
      <VideoFeeds />
    </MainLayout>
  )
}

export default Home
