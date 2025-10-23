import { QueryClient, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { paths } from '@/config/paths'
import { convert } from '@/lib/route'

// eslint-disable-next-line react-refresh/only-export-components
export const createAppRouter = (queryClient: QueryClient) =>
  createBrowserRouter([
    // {
    //   path: paths.home.root.path,
    //   lazy: () => import('../components/layouts/tab-layout').then(convert(queryClient)),
    //   children: [
    //     {
    //       index: true,
    //       lazy: () => import('./pages/videos/page').then(convert(queryClient)),
    //     },
    //     {
    //       path: paths.home.bookmarks.path,
    //       lazy: () => import('./pages/home/bookmarks').then(convert(queryClient)),
    //     },
    //   ],
    // },
    {
      path: paths.home.root.path,
      lazy: () => import('./pages/videos/page').then(convert(queryClient)),
    },
    {
      path: paths.video.path,
      lazy: () => import('./pages/videos/video/page').then(convert(queryClient)),
    },
    {
      path: '*',
      lazy: () => import('./pages/not-found').then(convert(queryClient)),
    },
  ])

export const AppRouter = () => {
  const queryClient = useQueryClient()

  const router = useMemo(() => createAppRouter(queryClient), [queryClient])

  return <RouterProvider router={router} />
}
