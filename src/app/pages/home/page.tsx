import { PageLayout } from '@/components/layouts/page-layout'
import { VideoFeeds } from '@/features/video/components/video-feeds'

const Home = () => {
  return (
    <PageLayout>
      {/* <div className="px-4 mb-5">
        <TodayQuizCard />
      </div> */}
      {/* <VideoCategory /> */}
      <VideoFeeds />
    </PageLayout>
  )
}

export default Home
