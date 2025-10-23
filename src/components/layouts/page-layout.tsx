import { IconArrowLeft } from '@tabler/icons-react'
import { useNavigate } from 'react-router'

import { APP_BAR_HEIGHT, MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { cn } from '@/lib/utils'

type PageLayoutProps = {
  title: string
  children: React.ReactNode
  right?: React.ReactNode
}
export const PageLayout = ({ title, children, right }: PageLayoutProps) => {
  const navigate = useNavigate()

  return (
    <div
      style={{ maxWidth: MAX_APP_SCREEN_WIDTH }}
      className="min-h-screen mx-auto flex flex-col items-stretch"
    >
      <header
        className={cn(
          'sticky w-full top-0 left-0 right-0 bg-white z-50 flex items-center justify-between',
          // className,
        )}
        style={{ maxWidth: MAX_APP_SCREEN_WIDTH, margin: '0 auto', height: APP_BAR_HEIGHT }}
      >
        <div className="flex items-center">
          <button className="mr-2 p-2" onClick={() => navigate(-1)}>
            <IconArrowLeft />
          </button>
          <h2 className="font-semibold">{title}</h2>
        </div>
        <div className="flex items-center">{right}</div>
      </header>

      {children}
    </div>
  )
}
