import { IconAd, IconBrandYoutubeFilled, IconKeyFilled } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import { Stepper } from '@/components/ui/stepper'

import { FloatingKey } from './floating-key'

const useTimeUntilMidnight = () => {
  const [timeLeft, setTimeLeft] = useState('00:00:00')

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(24, 0, 0, 0) // 다음 자정 설정

      const diff = midnight.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft('00:00:00')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      )
    }

    // 즉시 한 번 실행
    updateTime()

    // 1초마다 업데이트
    const interval = setInterval(updateTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return timeLeft
}

const MAX_KEY_AMOUNT = 5

export const FloatingKeyWithBottomSheet = () => {
  const [isOpen, setIsOpen] = useState(false)
  const timeUntilMidnight = useTimeUntilMidnight()

  const amount = 1

  return (
    <>
      <FloatingKey amount={amount} onClick={() => setIsOpen(true)} />
      <BottomSheet
        title={
          <>
            내 열쇠{' '}
            <span className="text-base text-gray-600">
              {amount}/{MAX_KEY_AMOUNT}
            </span>
          </>
        }
        open={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <Stepper
          animationDelay={0.25}
          className="mb-6"
          items={[
            {
              icon: <IconBrandYoutubeFilled size={18} color="#FF0000" />,
              title: '열쇠를 소모해서 영상을 시청해요.',
            },
            {
              icon: <IconAd size={18} />,
              title: '광고를 시청하면 열쇠를 3개 얻어요.',
            },
            {
              icon: <IconKeyFilled size={18} className="text-yellow-500" />,
              title: '매일 열쇠를 1개 드려요.',
            },
          ]}
        />

        <Button className="w-full" disabled>
          <b className="font-semibold">{timeUntilMidnight}</b>
          후에 열쇠를 받을 수 있어요.
        </Button>
      </BottomSheet>
    </>
  )
}
