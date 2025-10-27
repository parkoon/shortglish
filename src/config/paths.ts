export const paths = {
  home: {
    root: {
      path: '/',
      getHref: () => '/',
    },
    bookmarks: {
      path: '/bookmarks',
      getHref: () => '/bookmarks',
    },
  },

  videos: {
    root: {
      path: '/videos',
      getHref: () => '/videos',
    },
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
  },
} as const
