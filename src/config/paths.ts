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
    complete_sentence: {
      path: '/videos/:videoId/complete-sentence',
      getHref: (videoId: string) => `/videos/${videoId}/complete-sentence`,
    },
    review: {
      path: '/videos/:videoId/review',
      getHref: (videoId: string) => `/videos/${videoId}/review`,
    },
  },
} as const
