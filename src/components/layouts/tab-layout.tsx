import {
  IconBookmark,
  IconBookmarkFilled,
  IconBrandYoutube,
  IconBrandYoutubeFilled,
  IconShoppingCart,
} from '@tabler/icons-react'
import { type FC } from 'react'
import { NavLink, Outlet } from 'react-router'

import { APP_BAR_HEIGHT, MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { paths } from '@/config/paths'
import { cn } from '@/lib/utils'

type TabItem = {
  id: string
  label: string
  icon: FC<{ className?: string }>
  iconFilled: FC<{ className?: string }>
  path: string
}

const TAB_ITEMS: TabItem[] = [
  {
    id: 'stats',
    label: '영상',
    icon: IconBrandYoutube,
    iconFilled: IconBrandYoutubeFilled,
    path: paths.home.root.getHref(),
  },
  {
    id: 'bookmarks',
    label: '찜',
    icon: IconBookmark,
    iconFilled: IconBookmarkFilled,
    path: paths.home.bookmarks.getHref(),
  },
]

const TabLayout = ({ children }: { children: React.ReactNode }) => {
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
        <div className="h-full">
          <button className="h-full px-2">
            <IconShoppingCart />
          </button>
        </div>
      </header>
      <div className="flex-1 pb-20 tab-in">
        <Outlet />
      </div>
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 mx-auto"
        style={{ maxWidth: MAX_APP_SCREEN_WIDTH }}
      >
        <div className="flex justify-around items-center h-14 px-4">
          {TAB_ITEMS.map(tab => (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={({ isActive }) =>
                cn(
                  `flex flex-col items-center justify-center h-full w-full transition-all`,
                  isActive ? 'text-gray-900' : 'text-gray-600',
                )
              }
            >
              {({ isActive }) => {
                const Icon = isActive ? tab.iconFilled : tab.icon
                return (
                  <>
                    <Icon />
                    <span className="text-xs mt-1 font-semibold">{tab.label}</span>
                  </>
                )
              }}
            </NavLink>
          ))}
          {children}
        </div>
      </div>
    </div>
  )
}

export default TabLayout
