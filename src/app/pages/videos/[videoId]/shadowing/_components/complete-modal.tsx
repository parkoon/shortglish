/**
 * 완료 모달 컴포넌트
 */

import { Button } from '@/components/ui/button'

type CompleteModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const CompleteModal = ({ isOpen, onClose, onConfirm }: CompleteModalProps) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-8 mx-5 max-w-sm w-full text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 text-3xl">
          ✨
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">연습 완료!</h2>
        <p className="text-base text-gray-500 mb-6">3단계 쉐도잉 연습을 모두 완료했어요</p>
        <Button onClick={handleConfirm} className="w-full">
          확인
        </Button>
      </div>
    </div>
  )
}
