import * as ModalPrimitive from '@radix-ui/react-alert-dialog'

import { MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { cn } from '@/lib/utils'
import { useModalStore } from '@/stores/modal-store'

import { Button } from './ui/button'

/**
 * 전역 모달 컴포넌트
 *
 * 앱의 최상위에서 렌더링되며 Zustand 스토어의 상태를 구독합니다.
 * 어디서든 useGlobalModal 훅을 사용해서 이 모달을 제어할 수 있습니다.
 */
export const Modal = () => {
  const { isOpen, config, close } = useModalStore()

  const { className: cancelButtonClassName, ...restCancelButtonProps } =
    config.cancelButtonProps ?? {}
  const { className: okButtonClassName, ...restOkButtonProps } = config.okButtonProps ?? {}

  const handleOk = async () => {
    await config?.onOk?.()
    close()
  }

  const handleCancel = () => {
    config?.onCancel?.()
    close()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close()
    }
  }

  return (
    <ModalPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
      <ModalPrimitive.Portal>
        <ModalPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <ModalPrimitive.Content
          style={{
            width: 'calc(100% - 32px)',
            maxWidth: MAX_APP_SCREEN_WIDTH - 32,
          }}
          className="fixed left-[50%] top-[50%] z-50 w-full translate-x-[-50%] translate-y-[-80%] rounded-xl bg-white p-5 shadow-lg duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
        >
          {config.title && (
            <ModalPrimitive.Title
              className={cn('mb-4 text-xl font-semibold text-gray-800', config.classNames?.title)}
            >
              {config.title}
            </ModalPrimitive.Title>
          )}
          {config.description && (
            <ModalPrimitive.Description
              className={cn(
                'mb-6 whitespace-pre-line text-gray-600',
                config.classNames?.description,
              )}
            >
              {config.description}
            </ModalPrimitive.Description>
          )}

          <div className="flex gap-2">
            {!config.hideCancelButton && (
              <Button
                className={cn('flex-1 font-semibold', cancelButtonClassName)}
                variant="secondary"
                onClick={handleCancel}
                {...restCancelButtonProps}
              >
                {config.cancelText}
              </Button>
            )}

            <Button
              className={cn('flex-1 font-semibold', okButtonClassName)}
              onClick={handleOk}
              {...restOkButtonProps}
            >
              {config.okText}
            </Button>
          </div>
        </ModalPrimitive.Content>
      </ModalPrimitive.Portal>
    </ModalPrimitive.Root>
  )
}
