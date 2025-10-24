import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

// YouTube iframe API 타입 정의
type YTPlayer = {
  playVideo(): void
  pauseVideo(): void
  stopVideo(): void
  seekTo(seconds: number, allowSeekAhead?: boolean): void
  getPlayerState(): number
  getCurrentTime(): number
  getDuration(): number
  getVideoLoadedFraction(): number
  mute(): void
  unMute(): void
  isMuted(): boolean
  setVolume(volume: number): void
  getVolume(): number
  destroy(): void
}

type YouTubePlayerProps = {
  videoId: string
  devMode?: boolean
  initialTime?: number
  autoPlay?: boolean
  disabled?: boolean
  onStateChange: (state: number) => void
}

export type YouTubePlayerRef = {
  play: () => void
  pause: () => void
  mute: () => void
  unMute: () => void
  getCurrentTime: () => number
  getDuration: () => number
  getPlayerState: () => number
  seekTo: (seconds: number) => void
}

export const YOUTUBE_PLAYER_STATE = {
  UNSTARTED: -1, // 시작되지 않음
  ENDED: 0, // 종료됨
  PLAYING: 1, // 재생 중
  PAUSED: 2, // 일시정지
  BUFFERING: 3, // 버퍼링 중
  CUED: 5, // 큐에 추가됨
} as const

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  (
    { videoId, initialTime, autoPlay = false, disabled = false, onStateChange, devMode = false },
    ref,
  ) => {
    const [showPlayer, setShowPlayer] = useState(false)
    const [isPlayerReady, setIsPlayerReady] = useState(false)
    const playerRef = useRef<YTPlayer | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // 플레이어가 준비되면 자동으로 표시
    useEffect(() => {
      if (isPlayerReady) {
        const timer = setTimeout(() => {
          setShowPlayer(true)
        }, 300) // 약간의 딜레이로 자연스러운 전환

        return () => clearTimeout(timer)
      }
    }, [isPlayerReady])

    // YouTube API 로드 및 플레이어 초기화 (즉시 시작)
    useEffect(() => {
      const loadYouTubeAPI = () => {
        const tag = document.createElement('script')
        tag.src = 'https://www.youtube.com/iframe_api'
        const firstScriptTag = document.getElementsByTagName('script')[0]
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
      }

      const initPlayer = () => {
        if (!containerRef.current) return

        const playerVars = devMode
          ? {}
          : ({
              controls: 0,
              disablekb: 1,
              fs: 0,
              iv_load_policy: 3,
              rel: 0,
              autoplay: 1,
              showinfo: 0,
              autohide: 1,
              modestbranding: 1,
              playsinline: 1,
            } as const)

        playerRef.current = new window.YT.Player(containerRef.current.id, {
          videoId,
          playerVars,
          events: {
            onReady: () => {
              // if (autoPlay) {
              // Chrome, Safari 등은 사용자 상호작용 없이 소리가 나는 동영상 자동재생을 차단
              // event.target.playVideo()
              // }
              setIsPlayerReady(true)
            },
            onStateChange: event => {
              onStateChange?.(event.data)
            },
          },
        })
      }

      if (!window.YT) {
        loadYouTubeAPI()
        window.onYouTubeIframeAPIReady = initPlayer
      } else {
        initPlayer()
      }

      return () => {
        // stopTimeTracking()
        playerRef.current?.destroy()
        setIsPlayerReady(false)
        setShowPlayer(false)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId, initialTime, autoPlay])

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current?.playVideo(),
      pause: () => playerRef.current?.pauseVideo(),
      getCurrentTime: () => playerRef.current?.getCurrentTime() || 0,
      getDuration: () => playerRef.current?.getDuration() || 0,
      getPlayerState: () => playerRef.current?.getPlayerState() || -1,
      seekTo: (seconds: number) => playerRef.current?.seekTo(seconds, true),
      mute: () => playerRef.current?.mute(),
      unMute: () => playerRef.current?.unMute(),
    }))

    return (
      <div
        className={`relative w-full aspect-video bg-black ${disabled ? 'pointer-events-none' : ''}`}
      >
        {/* 플레이어 로딩 오버레이 */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center`}>
          <p className="text-white/70 text-sm text-center px-4">
            유튜브 콘텐츠 제작자를 위한
            <br />
            광고가 나올 수 있습니다.
          </p>
        </div>

        {/* YouTube 플레이어 */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            showPlayer ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div id="youtube-player" ref={containerRef} className="w-full h-full" />
        </div>
      </div>
    )
  },
)
