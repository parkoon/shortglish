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
  video: {
    path: '/videos/:videoId',
    getHref: (videoId: string) => `/videos/${videoId}`,
  },
} as const
