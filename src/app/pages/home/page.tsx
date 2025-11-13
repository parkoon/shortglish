// import { closeView } from '@granite-js/react-native'

import { useNavigate } from 'react-router'

import { PageLayout } from '@/components/layouts/page-layout'
import { Button } from '@/components/ui/button'
import { paths } from '@/config/paths'
import { VideoCategory } from '@/features/video/components/video-category'
import { VideoFeeds } from '@/features/video/components/video-feeds'

import { FloatingKeyWithBottomSheet } from './_components/floating-key-with-bottom-sheet'

const Home = () => {
  const navigate = useNavigate()
  return (
    <PageLayout>
      <Button onClick={() => navigate(paths.auth.tossLogin.getHref('/'))}>로그인페이지로</Button>
      <VideoCategory />
      <VideoFeeds />
      <FloatingKeyWithBottomSheet />
    </PageLayout>
  )
}

export default Home
