export const paths = {
  home: {
    root: {
      path: '/',
      getHref: () => '/',
    },
  },
  quiz: {
    path: '/quiz',
    getHref: () => '/quiz',
    detail: {
      path: '/quiz/:date',
      getHref: (date: string) => `/quiz/${date}`,
    },
  },
  my: {
    path: '/my',
    getHref: () => '/my',
  },
  auth: {
    tossLogin: {
      path: '/auth/toss-login',
      getHref: (redirectTo?: string) => {
        const params = redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
        return `/auth/toss-login${params}`
      },
    },
  },
  videos: {
    entry: {
      path: '/videos/:videoId',
      getHref: (videoId: string) => `/videos/${videoId}`,
    },
    build: {
      path: '/videos/:videoId/build',
      getHref: (videoId: string) => `/videos/${videoId}/build`,
    },
    fill: {
      path: '/videos/:videoId/fill',
      getHref: (videoId: string) => `/videos/${videoId}/fill`,
    },
    review: {
      path: '/videos/:videoId/review',
      getHref: (videoId: string) => `/videos/${videoId}/review`,
    },
    shadowing: {
      path: '/videos/:videoId/shadowing',
      getHref: (videoId: string) => `/videos/${videoId}/shadowing`,
    },
  },
} as const
