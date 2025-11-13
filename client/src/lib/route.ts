import type { QueryClient } from '@tanstack/react-query'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, clientAction, default: Component, ...rest } = m
  return {
    ...rest,
    loader: clientLoader?.(queryClient),
    action: clientAction?.(queryClient),
    Component,
  }
}
