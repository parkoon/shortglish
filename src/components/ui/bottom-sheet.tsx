'use client'

import { IconX } from '@tabler/icons-react'
import React from 'react'
import { Drawer } from 'vaul'

import { MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { cn } from '@/lib/utils'

type BottomSheetProps = {
  title?: React.ReactNode
  className?: string
  children?: React.ReactNode
  open?: boolean
  maskClosable?: boolean
  hideCloseButton?: boolean
  dismissible?: boolean
  height?: number | string
  onClose?(): void
}

export const BottomSheet = ({
  title,
  open,
  className,
  children,
  onClose,
  height = 'fit-content',
  hideCloseButton = false,
  maskClosable = true,
  dismissible = true,
}: BottomSheetProps) => {
  const showHeader = title || !hideCloseButton
  return (
    <Drawer.Root open={open} onClose={onClose} noBodyStyles dismissible={dismissible}>
      <Drawer.Portal>
        <Drawer.Overlay
          className="fixed inset-0 z-50 bg-black/10"
          onClick={maskClosable ? onClose : () => {}}
        />
        <Drawer.Content
          className={cn(
            'scrollbar-hide nb-shadow fixed inset-x-0 z-50 mx-auto mt-24 h-[50%] overflow-hidden rounded-t-2xl  bg-white p-4 outline-none',
            className,
          )}
          style={{
            height,
            maxWidth: MAX_APP_SCREEN_WIDTH,
            bottom: 0,
          }}
        >
          {showHeader && (
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{title}</h2>
              {!hideCloseButton && (
                <button onClick={onClose}>
                  <IconX className="w-5 h-5" />
                </button>
              )}
            </div>
          )}

          <div className={cn('mx-auto w-full overflow-scroll', showHeader && 'mt-6')}>
            {children}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}
