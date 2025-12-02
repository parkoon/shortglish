import { IconPlayerPlayFilled } from '@tabler/icons-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'

import { subscribeAlarm } from '@/api/alarms'
import { PageLayout } from '@/components/layouts/page-layout'
import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import { MotionButton } from '@/components/ui/motion-button'
import { paths } from '@/config/paths'
import {
  YOUTUBE_PLAYER_STATE,
  YouTubePlayer,
  type YouTubePlayerRef,
} from '@/features/video/components/youtube-player'
import { useKeyboardRefresh } from '@/hooks/use-keyboard-refresh'
import { useAuthStore } from '@/stores/auth-store'

const VIDEO_ID = 'wlY5W5uILFY'

const TestBPage = () => {
  const [showOverlay, setShowOverlay] = useState(true)
  const [showBottomSheet, setShowBottomSheet] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)
  const playerRef = useRef<YouTubePlayerRef>(null)
  const user = useAuthStore(state => state.user)
  const navigate = useNavigate()

  useKeyboardRefresh()

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true)
      await subscribeAlarm({
        userId: user?.id ?? 'unknown',
        phoneNumber: user?.phone ?? 'unknown',
        videoId: VIDEO_ID,
        type: 'b',
        userName: user?.name ?? 'unknown',
        notificationConsent: true,
      })
      navigate(paths.videos.root.getHref(), { replace: true })
      setShowBottomSheet(false)
    } catch (error) {
      console.error('Failed to subscribe alarm:', error)
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleStateChange = (state: number) => {
    if (state === YOUTUBE_PLAYER_STATE.ENDED) {
      setShowBottomSheet(true)
      return
    }
  }
  const handleCloseBottomSheet = () => {
    navigate(paths.videos.root.getHref(), { replace: true })
    setShowBottomSheet(false)
  }
  const handlePlayVideo = () => {
    setShowOverlay(false)
    playerRef.current?.play()
  }

  return (
    <PageLayout>
      {showOverlay && (
        <div className="flex items-center justify-center fixed top-0 left-0 w-full h-full bg-black z-10">
          <MotionButton onClick={handlePlayVideo}>
            <IconPlayerPlayFilled className="text-white" size={40} />
          </MotionButton>
        </div>
      )}
      <YouTubePlayer
        videoId={VIDEO_ID}
        className="h-screen"
        ref={playerRef}
        onStateChange={handleStateChange}
      />

      <BottomSheet
        title="다음 문장 쉐도잉 알림받기"
        description="쉐도잉으로 내것으로 만들어요."
        open={showBottomSheet}
        onClose={handleCloseBottomSheet}
      >
        <div className="flex items-center justify-center mb-3">
          <img src="/images/test.png" width={210} />
        </div>

        <Button
          className="w-full"
          size="lg"
          loading={isSubscribing}
          onClick={handleSubscribe}
          disabled={isSubscribing}
        >
          알림받기
        </Button>
      </BottomSheet>
    </PageLayout>
  )
}

export default TestBPage
