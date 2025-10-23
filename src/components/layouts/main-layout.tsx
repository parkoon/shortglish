import { IconShoppingCart } from '@tabler/icons-react'

import { APP_BAR_HEIGHT, MAX_APP_SCREEN_WIDTH } from '@/config/app'

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col mx-auto" style={{ maxWidth: MAX_APP_SCREEN_WIDTH }}>
      <header
        className="sticky top-0 z-40 bg-white w-full pl-4 pr-2 flex items-center justify-between border-b border-gray-200"
        style={{ maxWidth: MAX_APP_SCREEN_WIDTH, margin: '0 auto', height: APP_BAR_HEIGHT }}
      >
        <div className="text-xl font-extrabold">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">SHORTGLISH</h2>
            <div className="flex flex-col justify-center gap-0.5 h-4">
              <div className="h-0.5 w-3 bg-red-400 rounded-full" />
              <div className="h-0.5 w-4 bg-orange-400 rounded-full" />
              <div className="h-0.5 w-2.5 bg-yellow-500 rounded-full" />
            </div>
          </div>
        </div>
        {/* <div className="h-full">
          <button className="h-full px-2">
            <IconShoppingCart />
          </button>
        </div> */}
      </header>
      <div className="flex-1">{children}</div>
    </div>
  )
}
