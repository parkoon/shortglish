import { useEffect } from 'react'

import { isGraniteAvailable, loadGraniteModule } from '@/lib/granite'
import { useModal } from '@/stores/modal-store'

export const useAppCloseConfirm = () => {
  const modal = useModal()

  useEffect(() => {
    let unsubscription: (() => void) | null = null

    const setupBackEvent = async () => {
      // Granite 모듈이 사용 가능한지 확인
      const available = await isGraniteAvailable()
      if (!available) {
        return
      }

      const granite = await loadGraniteModule()
      if (!granite) {
        return
      }

      // backEvent 리스너 등록
      unsubscription = granite.graniteEvent.addEventListener('backEvent', {
        onEvent: () => {
          modal.open({
            title: '숏글리시를 종료할까요?',
            okText: '종료하기',
            cancelText: '취소',
            onOk: () => {
              granite.closeView()
            },
          })
        },
        onError: error => {
          alert(`에러가 발생했어요: ${error}`)
        },
      })
    }

    setupBackEvent()

    return () => {
      if (unsubscription) {
        unsubscription()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
