'use client'

import { IconX } from '@tabler/icons-react'
import React from 'react'
import { Drawer } from 'vaul'

import { MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { cn } from '@/lib/utils'

type BottomSheetProps = {
  title?: React.ReactNode
  description?: React.ReactNode
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
  description,
  height = 'fit-content',
  hideCloseButton = false,
  maskClosable = true,
  dismissible = true,
  onClose,
}: BottomSheetProps) => {
  const showHeader = title || description || !hideCloseButton
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
            <div className="flex flex-col gap-1 justify-between relative">
              <h2 className="text-lg font-bold">{title}</h2>
              <p className="text-sm text-gray-500">{description}</p>
              {!hideCloseButton && (
                <button onClick={onClose} className="absolute top-0 right-0">
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
