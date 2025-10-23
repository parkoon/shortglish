import { useModalStore } from '@/stores/modal-store'

import { Modal } from './ui/modal'

/**
 * 전역 모달 컴포넌트
 *
 * 앱의 최상위에서 렌더링되며 Zustand 스토어의 상태를 구독합니다.
 * 어디서든 useGlobalModal 훅을 사용해서 이 모달을 제어할 수 있습니다.
 */
export const GlobalModal = () => {
  const { isOpen, config, close } = useModalStore()

  const handleOk = async () => {
    if (config.onOk) {
      try {
        await config.onOk()
      } catch (error) {
        console.error('Modal onOk error:', error)
        // 에러가 발생해도 모달은 닫지 않음 (사용자가 직접 처리하도록)
        return
      }
    }
    close()
  }

  const handleCancel = () => {
    if (config.onCancel) {
      config.onCancel()
    }
    close()
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      close()
    }
  }

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleOpenChange}
      onOk={handleOk}
      onCancel={handleCancel}
      title={config.title}
      description={config.description}
      okText={config.okText}
      cancelText={config.cancelText}
      okButtonProps={config.okButtonProps}
      cancelButtonProps={config.cancelButtonProps}
      hideCancelButton={config.hideCancelButton}
      classNames={config.classNames}
    />
  )
}
