export const paths = {
  home: {
    root: {
      path: '/',
      getHref: () => '/',
    },
  },
  my: {
    path: '/my',
    getHref: () => '/my',
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
    listen: {
      path: '/videos/:videoId/listen',
      getHref: (videoId: string) => `/videos/${videoId}/listen`,
    },
    shadowing: {
      path: '/videos/:videoId/shadowing',
      getHref: (videoId: string) => `/videos/${videoId}/shadowing`,
    },
    speak: {
      path: '/videos/:videoId/speak',
      getHref: (videoId: string) => `/videos/${videoId}/speak`,
    },
  },
  test: {
    a: {
      path: '/test/a',
      getHref: () => '/test/a',
    },
    b: {
      path: '/test/b',
      getHref: () => '/test/b',
    },
    c: {
      path: '/test/c',
      getHref: () => '/test/c',
    },
  },
} as const
