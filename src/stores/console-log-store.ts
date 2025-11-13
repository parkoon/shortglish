/**
 * 콘솔 로그 스토어
 * 웹뷰 디버깅을 위한 콘솔 로그를 저장하고 관리합니다.
 */

import { create } from 'zustand'

export type LogLevel = 'log' | 'error' | 'warn' | 'info' | 'debug'

export interface ConsoleLog {
  id: string
  level: LogLevel
  message: string
  args: unknown[]
  timestamp: number
  timeString: string
}

type ConsoleLogState = {
  logs: ConsoleLog[]
  isEnabled: boolean
  maxLogs: number
}

type ConsoleLogActions = {
  addLog: (level: LogLevel, message: string, ...args: unknown[]) => void
  clearLogs: () => void
  setEnabled: (enabled: boolean) => void
}

type ConsoleLogStore = ConsoleLogState & ConsoleLogActions

/**
 * 콘솔 로그를 관리하는 Zustand 스토어
 */
export const useConsoleLogStore = create<ConsoleLogStore>(set => ({
  logs: [],
  isEnabled: false,
  maxLogs: 1000, // 최대 1000개의 로그만 저장

  addLog: (level, message, ...args) => {
    const now = Date.now()
    const date = new Date(now)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const milliseconds = date.getMilliseconds().toString().padStart(3, '0')
    const timeString = `${hours}:${minutes}:${seconds}.${milliseconds}`

    const log: ConsoleLog = {
      id: `${now}-${Math.random().toString(36).substr(2, 9)}`,
      level,
      message,
      args,
      timestamp: now,
      timeString,
    }

    set(state => {
      const newLogs = [...state.logs, log]
      if (newLogs.length <= state.maxLogs) {
        return { logs: newLogs }
      }
      // 최대 개수 제한
      return {
        logs: newLogs.slice(-state.maxLogs),
      }
    })
  },

  clearLogs: () => {
    set({ logs: [] })
  },

  setEnabled: (enabled: boolean) => {
    set({ isEnabled: enabled })
  },
}))

