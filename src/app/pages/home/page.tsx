import { PageLayout } from '@/components/layouts/page-layout'
import { VideoFeeds } from '@/features/video/components/video-feeds'

import { TodayQuizCard } from './_components/today-quiz-card'

const Home = () => {
  return (
    <PageLayout>
      <div className="p-4">
        <TodayQuizCard />
      </div>
      {/* <VideoCategory /> */}
      <VideoFeeds />
    </PageLayout>
  )
}

export default Home
