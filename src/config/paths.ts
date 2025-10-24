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
    build: {
      path: '/videos/:videoId/build',
      getHref: (videoId: string) => `/videos/${videoId}/build`,
    },
    review: {
      path: '/videos/:videoId/review',
      getHref: (videoId: string) => `/videos/${videoId}/review`,
    },
  },
} as const
