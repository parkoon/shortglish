export const paths = {
  home: {
    root: {
      path: '/',
      getHref: () => '/',
    },
  },
  onboarding: {
    path: '/onboarding',
    getHref: () => '/onboarding',
  },
  my: {
    path: '/my',
    getHref: () => '/my',
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
    listen: {
      path: '/videos/:videoId/listen',
      getHref: (videoId: string) => `/videos/${videoId}/listen`,
    },
    shadowing: {
      path: '/videos/:videoId/shadowing',
      getHref: (videoId: string) => `/videos/${videoId}/shadowing`,
    },
  },
} as const
