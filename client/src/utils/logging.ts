/**
 * 콘솔 로깅 래퍼
 * 모든 console 호출을 캡처하여 스토어에 저장합니다.
 */

import { useConsoleLogStore } from '@/stores/console-log-store'

// 원본 console 메서드 백업
const originalConsole = {
  log: console.log.bind(console),
  error: console.error.bind(console),
  warn: console.warn.bind(console),
  info: console.info.bind(console),
  debug: console.debug.bind(console),
}

let isWrapped = false

/**
 * 인자를 문자열로 변환합니다.
 */
function formatArg(arg: unknown): string {
  if (typeof arg === 'string') {
    return arg
  }

  if (arg instanceof Error) {
    return `${arg.name}: ${arg.message}\n${arg.stack || ''}`
  }

  try {
    return JSON.stringify(arg, null, 2)
  } catch {
    return String(arg)
  }
}

/**
 * 인자 배열을 메시지 문자열로 변환합니다.
 */
function formatMessage(args: unknown[]): string {
  return args.map(formatArg).join(' ')
}

/**
 * 콘솔 메서드를 래핑하는 헬퍼 함수
 */
function wrapConsoleMethod(
  level: 'log' | 'error' | 'warn' | 'info' | 'debug',
  originalMethod: typeof console.log,
) {
  return (...args: unknown[]) => {
    // 원본 콘솔은 항상 호출 (기존 동작 유지)
    originalMethod(...args)

    // 디버그 모드가 활성화되어 있을 때만 스토어에 저장
    const { isEnabled } = useConsoleLogStore.getState()
    if (!isEnabled) {
      return
    }

    const message = formatMessage(args)
    useConsoleLogStore.getState().addLog(level, message, ...args)
  }
}

/**
 * 콘솔 메서드를 래핑하여 로그를 캡처합니다.
 */
export function wrapConsole() {
  if (isWrapped) {
    return
  }

  console.log = wrapConsoleMethod('log', originalConsole.log)
  console.error = wrapConsoleMethod('error', originalConsole.error)
  console.warn = wrapConsoleMethod('warn', originalConsole.warn)
  console.info = wrapConsoleMethod('info', originalConsole.info)
  console.debug = wrapConsoleMethod('debug', originalConsole.debug)

  isWrapped = true
}

/**
 * 콘솔 래핑을 해제합니다.
 */
export function unwrapConsole() {
  if (!isWrapped) {
    return
  }

  console.log = originalConsole.log
  console.error = originalConsole.error
  console.warn = originalConsole.warn
  console.info = originalConsole.info
  console.debug = originalConsole.debug

  isWrapped = false
}
