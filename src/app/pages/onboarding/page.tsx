import { IconDeviceTvOldFilled, IconMoodBoy, IconSunset2Filled } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { CTALayout } from '@/components/layouts/cta-layout'
import { Stepper } from '@/components/ui/stepper'
import { signInWithToss } from '@/lib/toss/toss-auth'
import { useAuthStore } from '@/stores/auth-store'

const OnboardingPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const setUser = useAuthStore(state => state.setUser)

  const handleTossLogin = async () => {
    try {
      setIsLoading(true)

      const { user } = await signInWithToss()

      setUser(user)

      navigate('/', { replace: true })
    } catch (err) {
      console.error('토스 로그인 실패:', err)
      setIsLoading(false)
    }
  }
  return (
    <CTALayout
      primaryButtonProps={{ onClick: handleTossLogin, children: '시작하기', loading: isLoading }}
      classNames={{ content: 'bg-white' }}
    >
      <h1 className="text-2xl font-bold py-6 px-4">
        하루 3분 3개월이면, 나도 제니처럼 말할 수 있어요.
      </h1>
      <img src="/images/onboarding.png" alt="onboarding-1" className="w-full h-full" />

      <div className="px-4 py-6">
        <Stepper
          items={[
            {
              icon: <IconDeviceTvOldFilled />,
              title: '지루했던 영어공부, 숏폼으로 재밌게!',
            },
            {
              icon: <IconSunset2Filled />,
              title: '안들리는 원어민 발음, 듣는 방법이 있어요.',
            },
            {
              icon: <IconMoodBoy />,
              title: '실제로 영어로 말하게 되요.',
            },
          ]}
        />
      </div>
    </CTALayout>
  )
}

export default OnboardingPage
