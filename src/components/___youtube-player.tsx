import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

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

// Window 타입 확장
type YouTubePlayerProps = {
  videoId: string
  initialTime?: number
  autoPlay?: boolean
  enableKeyboard?: boolean
  onStateChange?: (state: number) => void
  onTimeUpdate?: (time: number) => void
  onError?: (error: Error) => void
  timeUpdateInterval?: number
}

export type YouTubePlayerRef = {
  play: () => void
  pause: () => void
  getCurrentTime: () => number
  getDuration: () => number
  getPlayerState: () => number
  seekTo: (seconds: number) => void
}

const loadYouTubeAPI = (): Promise<void> => {
  if (window.YT) return Promise.resolve()

  return new Promise((resolve, reject) => {
    // 이미 스크립트가 있는지 확인

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    tag.onerror = () => reject(new Error('Failed to load YouTube API'))

    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      resolve()
    }
  })
}

export const YouTubePlayer = forwardRef<YouTubePlayerRef, YouTubePlayerProps>(
  (
    {
      videoId,
      initialTime,
      autoPlay = false,
      onStateChange,
      onTimeUpdate,
      onError,
      timeUpdateInterval = 200,
    },
    ref,
  ) => {
    const [isLoading, setIsLoading] = useState(true)
    const [isPlayerReady, setIsPlayerReady] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const playerRef = useRef<YTPlayer | null>(null)
    const containerRef = useRef<HTMLDivElement>(null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    // 시간 추적 시작
    const startTimeTracking = useCallback(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }

      intervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const time = playerRef.current.getCurrentTime()
            onTimeUpdate?.(time)
          } catch (err) {
            console.error('Error getting current time:', err)
          }
        }
      }, timeUpdateInterval)
    }, [onTimeUpdate, timeUpdateInterval])

    // 시간 추적 중지
    const stopTimeTracking = useCallback(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }, [])

    // 플레이어 초기화
    const initPlayer = useCallback(async () => {
      if (!containerRef.current) return

      try {
        await loadYouTubeAPI()

        playerRef.current = new window.YT.Player(containerRef.current.id, {
          videoId,
          playerVars: {
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            autohide: 1,
            playsinline: 1,
            disablekb: 1,
            fs: 0,
            ...(initialTime && { start: Math.floor(initialTime) }),
          },
          events: {
            onReady: event => {
              setIsPlayerReady(true)
              setIsLoading(false)

              if (autoPlay) {
                event.target.playVideo()
              }
            },
            onStateChange: event => {
              // 재생 중일 때만 시간 추적
              if (event.data === window.YT.PlayerState.PLAYING) {
                startTimeTracking()
              } else {
                stopTimeTracking()
              }

              onStateChange?.(event.data)
            },
            onError: (event: { data: number }) => {
              const errorMessage = getErrorMessage(event.data)
              setError(errorMessage)
              onError?.(new Error(errorMessage))
            },
          },
        })
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to initialize player'
        setError(errorMessage)
        setIsLoading(false)
        onError?.(new Error(errorMessage))
      }
    }, [
      videoId,
      initialTime,
      autoPlay,
      onStateChange,
      onError,
      startTimeTracking,
      stopTimeTracking,
    ])

    // 에러 메시지 매핑
    const getErrorMessage = (errorCode: number): string => {
      const errorMessages: Record<number, string> = {
        2: '잘못된 매개변수입니다.',
        5: 'HTML5 플레이어 오류가 발생했습니다.',
        100: '요청한 비디오를 찾을 수 없습니다.',
        101: '비디오 소유자가 embedded 재생을 허용하지 않았습니다.',
        150: '비디오 소유자가 embedded 재생을 허용하지 않았습니다.',
      }
      return errorMessages[errorCode] || '알 수 없는 오류가 발생했습니다.'
    }

    // 초기 플레이어 설정
    useEffect(() => {
      initPlayer()

      return () => {
        stopTimeTracking()
        if (playerRef.current) {
          try {
            playerRef.current.destroy()
          } catch (err) {
            console.error('Error destroying player:', err)
          }
        }
        setIsPlayerReady(false)
        setIsLoading(true)
        setError(null)
      }
    }, []) // initPlayer는 의존성에서 제외 (최초 1회만 실행)

    // ref 노출 메서드들
    useImperativeHandle(ref, () => ({
      play: () => {
        if (!playerRef.current) {
          console.warn('Player not ready')
          return
        }

        playerRef.current.playVideo()
      },
      pause: () => {
        if (!playerRef.current) {
          console.warn('Player not ready')
          return
        }
        playerRef.current.pauseVideo()
      },
      getCurrentTime: () => {
        if (!playerRef.current) return 0
        try {
          return playerRef.current.getCurrentTime()
        } catch {
          return 0
        }
      },
      getDuration: () => {
        if (!playerRef.current) return 0
        try {
          return playerRef.current.getDuration()
        } catch {
          return 0
        }
      },
      getPlayerState: () => {
        if (!playerRef.current) return window.YT.PlayerState.UNSTARTED
        try {
          return playerRef.current.getPlayerState()
        } catch {
          return window.YT.PlayerState.UNSTARTED
        }
      },
      seekTo: (seconds: number) => {
        if (!playerRef.current) {
          console.warn('Player not ready')
          return
        }
        playerRef.current.seekTo(seconds, true)
      },
      isReady: () => isPlayerReady,
    }))

    return (
      <div
        className="relative w-full aspect-video bg-black"
        role="region"
        aria-label="YouTube 비디오 플레이어"
      >
        {/* 에러 상태 */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 max-w-sm">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          </div>
        )}

        {/* 로딩 상태 */}
        {!error && isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <div className="mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-white/20 border-t-white/70" />
            </div>
            <p className="text-white/70 text-sm text-center px-4">
              유튜브 콘텐츠 제작자를 위한
              <br />
              광고가 나올 수 있습니다.
            </p>
          </div>
        )}

        {/* YouTube 플레이어 컨테이너 */}
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            isPlayerReady && !error ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div id="youtube-player" ref={containerRef} className="w-full h-full" />
        </div>
      </div>
    )
  },
)
