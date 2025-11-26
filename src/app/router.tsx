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
    //       lazy: () => import('./pages/home/page').then(convert(queryClient)),
    //     },
    //     {
    //       path: paths.my.path,
    //       lazy: () => import('./pages/my/page').then(convert(queryClient)),
    //     },
    //   ],
    // },
    {
      path: paths.home.root.path,
      lazy: () => import('./pages/home/page').then(convert(queryClient)),
    },
    {
      path: paths.videos.root.path,
      lazy: () => import('./pages/videos/page').then(convert(queryClient)),
    },
    {
      path: paths.my.path,
      lazy: () => import('./pages/my/page').then(convert(queryClient)),
    },
    {
      path: paths.videos.entry.path,
      lazy: () => import('./pages/videos/[videoId]/entry/page').then(convert(queryClient)),
    },
    {
      path: paths.videos.build.path,
      lazy: () => import('./pages/videos/[videoId]/build/page').then(convert(queryClient)),
    },
    {
      path: paths.videos.fill.path,
      lazy: () => import('./pages/videos/[videoId]/fill/page').then(convert(queryClient)),
    },
    {
      path: paths.videos.review.path,
      lazy: () => import('./pages/videos/[videoId]/review/page').then(convert(queryClient)),
    },
    {
      path: paths.videos.listen.path,
      lazy: () => import('./pages/videos/[videoId]/listen/page').then(convert(queryClient)),
    },
    {
      path: paths.videos.shadowing.path,
      lazy: () => import('./pages/videos/[videoId]/shadowing/page').then(convert(queryClient)),
    },
    {
      path: paths.videos.speak.path,
      lazy: () => import('./pages/videos/[videoId]/speak/page').then(convert(queryClient)),
    },
    {
      path: paths.test.a.path,
      lazy: () => import('./pages/test/a/page').then(convert(queryClient)),
    },
    {
      path: paths.test.b.path,
      lazy: () => import('./pages/test/b/page').then(convert(queryClient)),
    },
    {
      path: paths.test.c.path,
      lazy: () => import('./pages/test/c/page').then(convert(queryClient)),
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
