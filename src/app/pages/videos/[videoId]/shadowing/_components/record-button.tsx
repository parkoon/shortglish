/**
 * 녹음 버튼 컴포넌트
 */

import { IconMicrophone } from '@tabler/icons-react'
import { useState } from 'react'

import { cn } from '@/lib/utils'

type RecordButtonProps = {
  onRecordStart?: () => void
  onRecordStop?: () => void
  onRecordComplete?: () => void
}

export const RecordButton = ({
  onRecordStart,
  onRecordStop,
  onRecordComplete,
}: RecordButtonProps) => {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)

  const handleToggle = () => {
    if (!isRecording) {
      setIsRecording(true)
      onRecordStart?.()
    } else {
      setIsRecording(false)
      setHasRecorded(true)
      onRecordStop?.()
      onRecordComplete?.()
    }
  }

  return (
    <div className="pt-3 border-t border-gray-200 text-center">
      <button
        onClick={handleToggle}
        className={cn(
          'w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center transition-all',
          isRecording
            ? 'bg-red-500 border-2 border-red-500 animate-pulse'
            : 'bg-white border-2 border-gray-200 hover:border-blue-500',
        )}
      >
        <IconMicrophone
          size={20}
          className={cn(isRecording ? 'text-white' : 'text-gray-400')}
        />
      </button>
      <div
        className={cn(
          'text-xs',
          hasRecorded && !isRecording
            ? 'text-green-500'
            : isRecording
              ? 'text-gray-600'
              : 'text-gray-400',
        )}
      >
        {isRecording
          ? '녹음 중... (다시 탭하여 중지)'
          : hasRecorded
            ? '녹음 완료 ✓'
            : '최종 확인을 위해 녹음해보세요'}
      </div>
    </div>
  )
}

