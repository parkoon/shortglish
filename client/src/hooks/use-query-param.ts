import { useCallback } from 'react'
import { useSearchParams } from 'react-router'

type UseQueryParamOptions<T> = {
  key: string
  defaultValue: T
  serialize?: (value: T) => string
  deserialize?: (value: string) => T
  removeOnDefault?: boolean // 기본값일 때 쿼리 파라미터 제거 여부
}

/**
 * URL 쿼리 파라미터를 관리하는 재사용 가능한 훅
 *
 * @example
 * ```ts
 * // 문자열 파라미터
 * const { value, setValue, isActive } = useQueryParam({
 *   key: 'category',
 *   defaultValue: 'all',
 * })
 *
 * // 숫자 파라미터
 * const { value: page, setValue: setPage } = useQueryParam({
 *   key: 'page',
 *   defaultValue: 1,
 *   serialize: (v) => String(v),
 *   deserialize: (v) => Number(v),
 * })
 * ```
 */
export const useQueryParam = <T extends string | number | boolean>({
  key,
  defaultValue,
  serialize = v => String(v),
  deserialize = v => v as T,
  removeOnDefault = true,
}: UseQueryParamOptions<T>) => {
  const [searchParams, setSearchParams] = useSearchParams()

  const value = searchParams.get(key) ? deserialize(searchParams.get(key)!) : defaultValue

  const setValue = useCallback(
    (newValue: T) => {
      const newParams = new URLSearchParams(searchParams)

      if (removeOnDefault && newValue === defaultValue) {
        newParams.delete(key)
      } else {
        newParams.set(key, serialize(newValue))
      }

      setSearchParams(newParams, { replace: true })
    },
    [key, defaultValue, removeOnDefault, searchParams, setSearchParams, serialize],
  )

  const isActive = useCallback(
    (compareValue: T | string) => {
      // 문자열 비교를 위해 둘 다 문자열로 변환
      return String(value) === String(compareValue)
    },
    [value],
  )

  return {
    value,
    setValue,
    isActive,
  }
}
