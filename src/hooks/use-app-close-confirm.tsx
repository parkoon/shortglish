import { closeView, graniteEvent } from '@apps-in-toss/web-framework'
import { useEffect } from 'react'

import { useModal } from '@/stores/modal-store'

export const useAppCloseConfirm = () => {
  const modal = useModal()

  useEffect(() => {
    const unsubscription = graniteEvent.addEventListener('backEvent', {
      onEvent: () => {
        modal.open({
          title: '숏글리시를 종료할까요?',
          okText: '종료하기',
          cancelText: '취소',
          onOk: () => {
            closeView()
          },
        })
      },
      onError: (err: Error) => {
        alert(`에러가 발생했어요: ${err}`)
      },
    })

    return unsubscription
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
