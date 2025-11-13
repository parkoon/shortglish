/**
 * 콘솔 로그 바텀시트
 * 시간대별로 로그를 표시하고 필터링할 수 있습니다.
 */

import { IconTrash } from '@tabler/icons-react'
import { useMemo, useState } from 'react'

import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Button } from '@/components/ui/button'
import { type LogLevel, useConsoleLogStore } from '@/stores/console-log-store'

type ConsoleLogBottomSheetProps = {
  open: boolean
  onClose: () => void
}

const LOG_LEVEL_COLORS: Record<LogLevel, string> = {
  log: 'text-gray-700',
  error: 'text-red-600',
  warn: 'text-yellow-600',
  info: 'text-blue-600',
  debug: 'text-gray-500',
}

const LOG_LEVEL_BG_COLORS: Record<LogLevel, string> = {
  log: 'bg-gray-100',
  error: 'bg-red-50',
  warn: 'bg-yellow-50',
  info: 'bg-blue-50',
  debug: 'bg-gray-50',
}

export const ConsoleLogBottomSheet = ({ open, onClose }: ConsoleLogBottomSheetProps) => {
  const { logs, clearLogs } = useConsoleLogStore()
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // 필터링된 로그
  const filteredLogs = useMemo(() => {
    const lowerSearchQuery = searchQuery.toLowerCase()

    return logs.filter(log => {
      const levelMatch = selectedLevel === 'all' || log.level === selectedLevel
      if (!levelMatch) {
        return false
      }

      if (searchQuery === '') {
        return true
      }

      const messageMatch = log.message.toLowerCase().includes(lowerSearchQuery)
      const argsMatch = log.args.some(arg => String(arg).toLowerCase().includes(lowerSearchQuery))

      return messageMatch || argsMatch
    })
  }, [logs, selectedLevel, searchQuery])

  // 시간대별로 그룹화
  const groupedLogs = useMemo(() => {
    const groups: Record<string, typeof filteredLogs> = {}

    filteredLogs.forEach(log => {
      const date = new Date(log.timestamp)
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const dateKey = `${year}-${month}-${day} ${hours}:${minutes}`

      if (!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(log)
    })

    return groups
  }, [filteredLogs])

  const handleClear = () => {
    if (!confirm('모든 로그를 삭제하시겠습니까?')) {
      return
    }
    clearLogs()
  }

  return (
    <BottomSheet
      title={
        <div className="flex items-center justify-between w-full">
          <span>콘솔 로그 ({filteredLogs.length})</span>
          <Button variant="ghost" size="icon-sm" onClick={handleClear} className="h-8 w-8">
            <IconTrash className="h-4 w-4" />
          </Button>
        </div>
      }
      open={open}
      onClose={onClose}
      height="80vh"
    >
      <div className="space-y-4">
        {/* 필터 및 검색 */}
        <div className="space-y-2">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'log', 'error', 'warn', 'info', 'debug'] as const).map(level => (
              <Button
                key={level}
                variant={selectedLevel === level ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLevel(level)}
                className="text-xs h-auto py-1 px-2"
              >
                {level === 'all' ? '전체' : level.toUpperCase()}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="text-xs h-auto py-1 px-2"
          >
            페이지 새로고침
          </Button>
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1 border rounded-lg text-sm"
          />
        </div>

        {/* 로그 목록 */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {Object.entries(groupedLogs).length === 0 && (
            <div className="text-center text-gray-500 py-8">로그가 없습니다.</div>
          )}
          {Object.entries(groupedLogs)
            .reverse()
            .map(([timeGroup, groupLogs]) => (
              <div key={timeGroup} className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 sticky top-0 bg-white py-1">
                  {timeGroup}
                </div>
                {groupLogs.reverse().map(log => (
                  <div
                    key={log.id}
                    className={`p-2 rounded text-xs ${LOG_LEVEL_BG_COLORS[log.level]}`}
                  >
                    <div className="flex items-start gap-2">
                      <span className={`font-mono font-semibold ${LOG_LEVEL_COLORS[log.level]}`}>
                        [{log.timeString}]
                      </span>
                      <span className={`font-semibold ${LOG_LEVEL_COLORS[log.level]}`}>
                        {log.level.toUpperCase()}
                      </span>
                    </div>
                    <div className={`mt-1 break-words ${LOG_LEVEL_COLORS[log.level]}`}>
                      {log.message}
                    </div>
                    {log.args.length > 0 && (
                      <details className="mt-1">
                        <summary className="cursor-pointer text-gray-600 text-xs">
                          추가 인자 보기 ({log.args.length})
                        </summary>
                        <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                          {JSON.stringify(log.args, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            ))}
        </div>
      </div>
    </BottomSheet>
  )
}
