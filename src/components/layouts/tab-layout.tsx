import { IconBrandYoutubeFilled, IconFilePencilFilled } from '@tabler/icons-react'
import { motion } from 'framer-motion'
import { type FC } from 'react'
import { NavLink, Outlet } from 'react-router'

import { MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { paths } from '@/config/paths'
import { cn } from '@/lib/utils'

type TabItem = {
  id: string
  label: string
  icon: FC<{ className?: string }>
  path: string
}

const TAB_ITEMS: TabItem[] = [
  {
    id: 'stats',
    label: '영상',
    icon: IconBrandYoutubeFilled,
    path: paths.home.root.getHref(),
  },
  {
    id: 'my',
    label: '복습',
    icon: IconFilePencilFilled,
    path: paths.my.getHref(),
  },
]

const TabLayout = () => {
  return (
    <div className="min-h-screen flex flex-col mx-auto" style={{ maxWidth: MAX_APP_SCREEN_WIDTH }}>
      <div className="flex-1 pb-[68px]">
        <Outlet />
      </div>
      <div
        className="fixed left-1/2 -translate-x-1/2 bottom-3 bg-white flex items-center px-6 rounded-full shadow-2xl gap-1"
        style={{ maxWidth: MAX_APP_SCREEN_WIDTH }}
      >
        {TAB_ITEMS.map(tab => (
          <NavLink
            replace
            key={tab.id}
            to={tab.path}
            className={({ isActive }) =>
              cn(
                `flex flex-col items-center justify-center h-full w-full transition-all flex-1 px-5 py-2`,
                isActive ? 'text-gray-900' : 'text-gray-400',
              )
            }
          >
            {({ isActive }) => (
              <>
                <motion.div
                  animate={
                    isActive
                      ? {
                          scale: [1, 1.1, 1],
                        }
                      : { scale: 1 }
                  }
                  transition={{
                    duration: 0.3,
                    ease: 'easeInOut',
                  }}
                >
                  <tab.icon />
                </motion.div>
                <span className="text-xs font-semibold">{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default TabLayout
