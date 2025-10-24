import { create } from 'zustand'

import type { Button } from '@/components/ui/button'

type ButtonProps = React.ComponentProps<typeof Button>
export type ModalConfig = {
  title?: string
  description?: string | React.ReactNode
  okText?: string
  cancelText?: string
  okButtonProps?: ButtonProps
  cancelButtonProps?: ButtonProps
  hideCancelButton?: boolean
  classNames?: {
    title?: string
    description?: string
  }
  onOk?: () => void | Promise<void>
  onCancel?: () => void
}

type ModalState = {
  isOpen: boolean
  config: ModalConfig
}

type ModalActions = {
  open: (config: ModalConfig) => void
  close: () => void
}

type ModalStore = ModalState & ModalActions

const initialConfig: ModalConfig = {
  title: '',
  description: '',
  okText: '확인',
  cancelText: '취소',
  hideCancelButton: false,
}

/**
 * 전역 모달 상태를 관리하는 Zustand 스토어
 *
 * @example
 * ```tsx
 * import { useModalStore } from '@/stores/modal-store'
 *
 * const { open } = useModalStore()
 *
 * const handleDelete = () => {
 *   open({
 *     title: '삭제 확인',
 *     description: '정말로 삭제하시겠습니까?',
 *     okText: '삭제',
 *     onOk: () => {
 *       // 삭제 로직
 *       console.log('삭제됨!')
 *     }
 *   })
 * }
 * ```
 */
export const useModalStore = create<ModalStore>((set, get) => ({
  isOpen: false,
  config: initialConfig,

  open: (config: ModalConfig) => {
    set({
      isOpen: true,
      config: {
        ...initialConfig,
        ...config,
      },
    })
  },

  close: () => {
    set({
      isOpen: false,
      config: initialConfig,
    })
  },
}))

/**
 * 전역 모달을 쉽게 사용할 수 있는 헬퍼 훅
 *
 * @example
 * ```tsx
 * const { openModal, closeModal } = useGlobalModal()
 *
 * const showConfirm = () => {
 *   openModal({
 *     title: '확인',
 *     description: '계속하시겠습니까?',
 *     onOk: () => console.log('확인됨!')
 *   })
 * }
 * ```
 */
export const useGlobalModal = () => {
  const { open, close } = useModalStore()

  return {
    open,
    close,
  }
}
