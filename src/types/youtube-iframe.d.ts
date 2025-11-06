declare global {
  interface Window {
    YT: typeof YT
    onYouTubeIframeAPIReady?: () => void
  }
}

declare namespace YT {
  class Player {
    constructor(
      elementId: string,
      config: {
        videoId: string
        playerVars?: {
          autoplay?: 0 | 1
          controls?: 0 | 1
          modestbranding?: 0 | 1
          rel?: 0 | 1
          showinfo?: 0 | 1
          iv_load_policy?: 1 | 3
          autohide?: 0 | 1
          playsinline?: 0 | 1
          disablekb?: 0 | 1
          fs?: 0 | 1
        }
        events?: {
          onReady?: (event: YT.PlayerEvent) => void
          onStateChange?: (event: YT.OnStateChangeEvent) => void
          onError?: (event: YT.OnErrorEvent) => void
        }
      },
    )

    playVideo(): void
    pauseVideo(): void
    stopVideo(): void
    seekTo(seconds: number, allowSeekAhead?: boolean): void
    getPlayerState(): number
    getCurrentTime(): number
    getDuration(): number
    getPlayerState(): number
    getVideoLoadedFraction(): number
    mute(): void
    unMute(): void
    isMuted(): boolean
    setVolume(volume: number): void
    getVolume(): number
    destroy(): void
    setPlaybackRate(rate: number): void
  }

  const PlayerState: {
    UNSTARTED: -1
    ENDED: 0
    PLAYING: 1
    PAUSED: 2
    BUFFERING: 3
    CUED: 5
  }

  interface PlayerEvent {
    target: Player
  }

  interface OnStateChangeEvent {
    target: Player
    data: number
  }
}

export {}
