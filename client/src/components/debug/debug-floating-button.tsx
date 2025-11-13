/**
 * 디버그 플로팅 버튼
 * 디버그 모드가 활성화되면 표시되는 플로팅 버튼입니다.
 */

import { IconBug } from '@tabler/icons-react'
import { useState } from 'react'

import { useConsoleLogStore } from '@/stores/console-log-store'

import { ConsoleLogBottomSheet } from './console-log-bottom-sheet'

export const DebugFloatingButton = () => {
  const { isEnabled, logs } = useConsoleLogStore()
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false)

  // 에러 로그 개수
  const errorCount = logs.filter(log => log.level === 'error').length

  if (!isEnabled) {
    return null
  }

  return (
    <>
      <button
        onClick={() => setIsBottomSheetOpen(true)}
        className="fixed bottom-0 right-0 z-50 flex items-center justify-center w-8 h-8 bg-gray-900 text-white  shadow-lg hover:bg-gray-800 transition-colors"
      >
        <IconBug className="w-5 h-5" />
        {errorCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
            {errorCount > 99 ? '99+' : errorCount}
          </span>
        )}
      </button>
      <ConsoleLogBottomSheet open={isBottomSheetOpen} onClose={() => setIsBottomSheetOpen(false)} />
    </>
  )
}
