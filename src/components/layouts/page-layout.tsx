import { MAX_APP_SCREEN_WIDTH } from '@/config/app'

type PageLayoutProps = {
  children: React.ReactNode
}
export const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col mx-auto" style={{ maxWidth: MAX_APP_SCREEN_WIDTH }}>
      {/* <header
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
      </header> */}
      <div className="flex-1">{children}</div>
    </div>
  )
}
