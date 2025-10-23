import { useEffect, useState } from 'react'

export const usePrimaryColor = () => {
  const [primaryColor, setPrimaryColor] = useState('#000')

  useEffect(() => {
    // :root의 --primary CSS 변수 값 가져오기
    const rootStyles = getComputedStyle(document.documentElement)
    const primary = rootStyles.getPropertyValue('--primary').trim()
    if (primary) {
      setPrimaryColor(primary)
    }
  }, [])

  return primaryColor
}
