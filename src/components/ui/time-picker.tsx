import type { EmblaCarouselType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import React, { useCallback, useEffect, useMemo, useRef } from 'react'

const CIRCLE_DEGREES = 360
const WHEEL_ITEM_SIZE = 32
const WHEEL_ITEM_COUNT = 18
const WHEEL_ITEMS_IN_VIEW = 4

const WHEEL_ITEM_RADIUS = CIRCLE_DEGREES / WHEEL_ITEM_COUNT
const IN_VIEW_DEGREES = WHEEL_ITEM_RADIUS * WHEEL_ITEMS_IN_VIEW
const WHEEL_RADIUS = Math.round(WHEEL_ITEM_SIZE / 2 / Math.tan(Math.PI / WHEEL_ITEM_COUNT))

// 스타일 상수
const PERSPECTIVE_OFFSET = 130 // px
const TRANSFORM_OFFSET = 27 // px
const LABEL_OFFSET = 55 // px

// 값 검증 유틸리티
const clampValue = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value))
}

type TimePickerProps = {
  initialMinutes?: number
  initialSeconds?: number
  onMinutesChange?: (value: number) => void
  onSecondsChange?: (value: number) => void
}

export const TimePicker = ({
  initialMinutes = 0,
  initialSeconds = 30,
  onMinutesChange,
  onSecondsChange,
}: TimePickerProps) => {
  // 초기값 검증 (0-59 범위)
  const validatedMinutes = clampValue(initialMinutes, 0, 59)
  const validatedSeconds = clampValue(initialSeconds, 0, 59)

  return (
    <div className="relative flex w-full h-[30vh]  mx-auto">
      {/* 상단 그라데이션 오버레이 */}
      <div
        className="absolute left-0 right-0 pointer-events-none z-10"
        style={{
          top: '-0.5px',
          height: 'calc(50% - 16px)',
          borderBottom: '0.5px solid rgba(0, 0, 0, 0.3)',
          background:
            'linear-gradient(to top, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 1) 100%)',
        }}
      />

      {/* 하단 그라데이션 오버레이 */}
      <div
        className="absolute left-0 right-0 pointer-events-none z-10"
        style={{
          bottom: '-0.5px',
          height: 'calc(50% - 16px)',
          borderTop: '0.5px solid rgba(0, 0, 0, 0.3)',
          background:
            'linear-gradient(to bottom, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 1) 100%)',
        }}
      />

      <IosPickerItem
        slideCount={60}
        perspective="left"
        loop={false}
        label="분"
        initialValue={validatedMinutes}
        onValueChange={onMinutesChange}
      />
      <IosPickerItem
        slideCount={60}
        perspective="right"
        loop={false}
        label="초"
        initialValue={validatedSeconds}
        onValueChange={onSecondsChange}
      />
    </div>
  )
}

const isInView = (wheelLocation: number, slidePosition: number): boolean =>
  Math.abs(wheelLocation - slidePosition) < IN_VIEW_DEGREES

const setSlideStyles = (
  emblaApi: EmblaCarouselType,
  index: number,
  loop: boolean,
  slideCount: number,
  totalRadius: number,
): void => {
  const slideNode = emblaApi.slideNodes()[index]
  if (!slideNode) return // null 체크 추가

  const wheelLocation = emblaApi.scrollProgress() * totalRadius
  const positionDefault = emblaApi.scrollSnapList()[index] * totalRadius
  const positionLoopStart = positionDefault + totalRadius
  const positionLoopEnd = positionDefault - totalRadius

  let inView = false
  let angle = index * -WHEEL_ITEM_RADIUS

  if (isInView(wheelLocation, positionDefault)) {
    inView = true
  }

  if (loop && isInView(wheelLocation, positionLoopEnd)) {
    inView = true
    angle = -CIRCLE_DEGREES + (slideCount - index) * WHEEL_ITEM_RADIUS
  }

  if (loop && isInView(wheelLocation, positionLoopStart)) {
    inView = true
    angle = -(totalRadius % CIRCLE_DEGREES) - index * WHEEL_ITEM_RADIUS
  }

  if (inView) {
    slideNode.style.opacity = '1'
    slideNode.style.transform = `translateY(-${
      index * 100
    }%) rotateX(${angle}deg) translateZ(${WHEEL_RADIUS}px)`
  } else {
    slideNode.style.opacity = '0'
    slideNode.style.transform = 'none'
  }
}

const setContainerStyles = (emblaApi: EmblaCarouselType, wheelRotation: number): void => {
  emblaApi.containerNode().style.transform = `translateZ(${WHEEL_RADIUS}px) rotateX(${wheelRotation}deg)`
}

type IosPickerItemProps = {
  loop?: boolean
  label: string
  slideCount: number
  perspective: 'left' | 'right'
  onValueChange?: (value: number) => void
  initialValue?: number
}

const IosPickerItem: React.FC<IosPickerItemProps> = props => {
  const { slideCount, perspective, label, loop = false, onValueChange, initialValue = 0 } = props

  // 초기값 검증
  const validatedInitialValue = clampValue(initialValue, 0, slideCount - 1)

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop,
    axis: 'y',
    dragFree: true,
    containScroll: false,
    watchSlides: false,
    startIndex: validatedInitialValue,
  })

  const totalRadius = slideCount * WHEEL_ITEM_RADIUS
  const rotationOffset = loop ? 0 : WHEEL_ITEM_RADIUS

  // slides 배열 메모이제이션으로 불필요한 재생성 방지
  const slides = useMemo(() => Array.from(Array(slideCount).keys()), [slideCount])

  // onValueChange를 ref로 관리하여 stale closure 방지
  const onValueChangeRef = useRef(onValueChange)
  useEffect(() => {
    onValueChangeRef.current = onValueChange
  }, [onValueChange])

  const inactivateEmblaTransform = useCallback((emblaApi: EmblaCarouselType) => {
    if (!emblaApi) return
    const { translate, slideLooper } = emblaApi.internalEngine()
    translate.clear()
    translate.toggleActive(false)
    slideLooper.loopPoints.forEach(({ translate }) => {
      translate.clear()
      translate.toggleActive(false)
    })
  }, [])

  const rotateWheel = useCallback(
    (emblaApi: EmblaCarouselType) => {
      const rotation = slideCount * WHEEL_ITEM_RADIUS - rotationOffset
      const wheelRotation = rotation * emblaApi.scrollProgress()
      setContainerStyles(emblaApi, wheelRotation)
      emblaApi.slideNodes().forEach((_, index) => {
        setSlideStyles(emblaApi, index, loop, slideCount, totalRadius)
      })
    },
    [slideCount, rotationOffset, totalRadius, loop],
  )

  const handleSelect = useCallback(() => {
    if (!emblaApi) return
    const selectedIndex = emblaApi.selectedScrollSnap()
    onValueChangeRef.current?.(selectedIndex)
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const handlePointerUp = (api: EmblaCarouselType) => {
      const { scrollTo, target, location } = api.internalEngine()
      const diffToTarget = target.get() - location.get()
      const factor = Math.abs(diffToTarget) < WHEEL_ITEM_SIZE / 2.5 ? 10 : 0.1
      const distance = diffToTarget * factor
      scrollTo.distance(distance, true)

      // 스냅 애니메이션 완료 후 값 업데이트 (약 300ms)
      setTimeout(() => {
        handleSelect()
      }, 300)
    }

    const handleReInit = (api: EmblaCarouselType) => {
      inactivateEmblaTransform(api)
      rotateWheel(api)
    }

    // 이벤트 리스너 등록
    emblaApi.on('pointerUp', handlePointerUp)
    emblaApi.on('scroll', rotateWheel)
    emblaApi.on('reInit', handleReInit)

    // 초기 설정
    inactivateEmblaTransform(emblaApi)
    rotateWheel(emblaApi)
    handleSelect()

    // 클린업: 메모리 누수 방지
    return () => {
      emblaApi.off('pointerUp', handlePointerUp)
      emblaApi.off('scroll', rotateWheel)
      emblaApi.off('reInit', handleReInit)
    }
  }, [emblaApi, inactivateEmblaTransform, rotateWheel, handleSelect])

  return (
    <div className="h-full flex items-center min-w-[50%] justify-center leading-none">
      <div className="min-w-full h-full overflow-hidden flex items-center touch-pan-x">
        <div
          className="h-8 w-full select-none"
          style={{
            perspective: '1000px',
            perspectiveOrigin:
              perspective === 'left'
                ? `calc(50% + ${PERSPECTIVE_OFFSET}px) 50%`
                : `calc(50% - ${PERSPECTIVE_OFFSET}px) 50%`,
            transform:
              perspective === 'left'
                ? `translateX(${TRANSFORM_OFFSET}px)`
                : `translateX(-${TRANSFORM_OFFSET}px)`,
            WebkitUserSelect: 'none',
            WebkitTouchCallout: 'none',
            WebkitTapHighlightColor: 'transparent',
          }}
          ref={emblaRef}
        >
          <div
            className="h-full w-full"
            style={{
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
          >
            {slides.map((_, index) => (
              <div
                className="w-full h-full text-lg tabular-nums text-center flex items-center justify-center opacity-0"
                style={{
                  backfaceVisibility: 'hidden',
                }}
                key={index}
              >
                {String(index).padStart(2, '0')}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className="font-semibold text-sm text-gray-600 pointer-events-none"
        style={{ transform: `translateX(-${LABEL_OFFSET}px)` }}
      >
        {label}
      </div>
    </div>
  )
}
