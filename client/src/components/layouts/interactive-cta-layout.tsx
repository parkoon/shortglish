import { AnimatePresence, motion } from 'framer-motion'
import { type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { cn } from '@/lib/utils'

// 상태 타입 정의
export type CTAStatus = 'disabled' | 'ready' | 'success' | 'error'

// 각 상태별 설정 타입
export type StatusConfig = {
  disabled: {
    label: string
    description?: string
  }
  ready: {
    label: string
    description?: string
    onClick: () => void
  }
  success: {
    overlayContent: ReactNode
    buttonLabel: string
    onNext: () => void
  }
  error: {
    overlayContent: ReactNode
    buttonLabel: string
    onRetry: () => void
  }
}

type InteractiveCTALayoutProps<T extends CTAStatus> = {
  children: ReactNode
  status: T
  config: StatusConfig[T]
  classNames?: {
    content?: string
    bottom?: string
  }
}

export const InteractiveCTALayout = <T extends CTAStatus>({
  children,
  status,
  config,
  classNames,
}: InteractiveCTALayoutProps<T>) => {
  return (
    <div className="min-h-screen flex flex-col mx-auto" style={{ maxWidth: MAX_APP_SCREEN_WIDTH }}>
      {/* 컨텐츠 영역 */}
      <div className={cn('flex-1 pb-32', classNames?.content)}>{children}</div>

      {/* 하단 고정 영역 */}
      <div
        style={{ maxWidth: MAX_APP_SCREEN_WIDTH }}
        className={cn('fixed bottom-0 left-0 right-0 mx-auto', classNames?.bottom)}
      >
        {/* 배경 오버레이 - 버튼 뒤에서 슬라이드 */}
        <AnimatePresence>
          {status === 'success' && (
            <OverlayBackground key="success" type="success">
              {(config as StatusConfig['success']).overlayContent}
            </OverlayBackground>
          )}
          {status === 'error' && (
            <OverlayBackground key="error" type="error">
              {(config as StatusConfig['error']).overlayContent}
            </OverlayBackground>
          )}
        </AnimatePresence>

        {/* 버튼 - 항상 고정, 내용만 변경 */}
        <div className="relative bg-transparent p-4 ">{renderButton(status, config)}</div>
      </div>
    </div>
  )
}

// 버튼 렌더링 헬퍼
function renderButton<T extends CTAStatus>(status: T, config: StatusConfig[T]) {
  switch (status) {
    case 'disabled':
    case 'ready': {
      const cfg = config as StatusConfig['disabled'] | StatusConfig['ready']
      const isDisabled = status === 'disabled'
      const onClick = 'onClick' in cfg ? cfg.onClick : undefined

      return (
        <>
          {'description' in cfg && cfg.description && (
            <p className="text-center text-gray-500 text-sm mb-2">{cfg.description}</p>
          )}
          <Button size="lg" className="w-full" disabled={isDisabled} onClick={onClick}>
            {cfg.label}
          </Button>
        </>
      )
    }

    case 'success': {
      const cfg = config as StatusConfig['success']
      return (
        <Button size="lg" className="w-full bg-green-600 hover:bg-green-700" onClick={cfg.onNext}>
          {cfg.buttonLabel}
        </Button>
      )
    }

    case 'error': {
      const cfg = config as StatusConfig['error']
      return (
        <Button size="lg" variant="destructive" className="w-full" onClick={cfg.onRetry}>
          {cfg.buttonLabel}
        </Button>
      )
    }

    default:
      return null
  }
}

// 배경 오버레이 - 버튼 뒤에서 슬라이드
function OverlayBackground({ type, children }: { type: 'success' | 'error'; children: ReactNode }) {
  const isSuccess = type === 'success'

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ opacity: 0 }}
      transition={{
        y: { duration: 0.25, ease: 'easeOut' },
        opacity: { duration: 0 },
      }}
      className={cn(
        'absolute bottom-0 left-0 right-0 p-6 pb-24',
        isSuccess ? 'bg-green-50' : 'bg-red-50',
      )}
    >
      {children}
    </motion.div>
  )
}
