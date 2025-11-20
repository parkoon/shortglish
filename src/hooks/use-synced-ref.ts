import { useEffect, useRef } from 'react'

/**
 * state 값을 ref에 동기화하는 훅
 * 콜백 함수나 클로저에서 최신 state 값을 참조할 때 사용
 *
 * @param value - 동기화할 값
 * @returns 최신 값을 담고 있는 ref 객체
 *
 * @example
 * ```tsx
 * const [count, setCount] = useState(0)
 * const countRef = useSyncedRef(count)
 *
 * useEffect(() => {
 *   const timer = setInterval(() => {
 *     // countRef.current는 항상 최신 count 값을 가짐
 *     console.log(countRef.current)
 *   }, 1000)
 *   return () => clearInterval(timer)
 * }, [])
 * ```
 */
export const useSyncedRef = <T>(value: T): React.MutableRefObject<T> => {
  const ref = useRef(value)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref
}

