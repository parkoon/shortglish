import { useEffect } from 'react'

/**
 * 키보드를 이용해서 페이지를 새로고침하는 훅
 * shift + R 키 조합으로 새로고침
 */
export const useKeyboardRefresh = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.shiftKey && event.key === 'S') {
        event.preventDefault()
        window.location.reload()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
}
