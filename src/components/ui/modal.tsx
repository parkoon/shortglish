import * as ModalPrimitive from '@radix-ui/react-alert-dialog'
import React from 'react'

import { MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { cn } from '@/lib/utils'

import { Button, type ButtonProps } from './button'

type ModalProps = {
  title?: string
  description?: string | React.ReactNode
  open?: boolean
  onOk?(): void
  onCancel?(): void
  onOpenChange?(open: boolean): void
  okText?: string
  cancelText?: string
  okButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
  hideCancelButton?: boolean
  classNames?: {
    title?: string
    description?: string
  }
}

export const Modal = ({
  title,
  description,
  open,
  onOk,
  onCancel,
  onOpenChange,
  classNames,
  okButtonProps,
  cancelButtonProps,
  hideCancelButton = false,
  okText = 'Xác nhận',
  cancelText = 'Hủy',
}: ModalProps) => {
  return (
    <ModalPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <ModalPrimitive.Portal>
        <ModalPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <ModalPrimitive.Content
          style={{
            width: 'calc(100% - 32px)',
            maxWidth: MAX_APP_SCREEN_WIDTH - 32,
          }}
          className="fixed left-[50%] top-[50%] z-50 w-full translate-x-[-50%] translate-y-[-50%] rounded bg-white p-5 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom"
        >
          {title && (
            <ModalPrimitive.Title
              className={cn('mb-2 text-center text-lg font-bold', classNames?.title)}
            >
              {title}
            </ModalPrimitive.Title>
          )}
          {description && (
            <ModalPrimitive.Description
              className={cn('mb-5 text-center text-gray-600', classNames?.description)}
            >
              {description}
            </ModalPrimitive.Description>
          )}

          <div className="flex gap-2">
            {!hideCancelButton && (
              <Button variant="outlined" block onClick={onCancel} {...cancelButtonProps}>
                {cancelText}
              </Button>
            )}

            <Button variant="primary" block onClick={onOk} {...okButtonProps}>
              {okText}
            </Button>
          </div>
        </ModalPrimitive.Content>
      </ModalPrimitive.Portal>
    </ModalPrimitive.Root>
  )
}
