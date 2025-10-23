import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'sonner'

import { GlobalModal } from '@/components/global-modal'
import { Spinner } from '@/components/ui/spinner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { queryConfig } from '@/lib/react-query'

type AppProviderProps = {
  children: React.ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: queryConfig,
      }),
  )

  return (
    <React.Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center">
          <Spinner size="xl" />
        </div>
      }
    >
      <ErrorBoundary FallbackComponent={() => <div>Root Error Fallback</div>}>
        <HelmetProvider>
          <QueryClientProvider client={queryClient}>
            {/* {import.meta.env.DEV && <ReactQueryDevtools />} */}
            <Toaster
              position="bottom-center"
              expand
              toastOptions={{
                style: {
                  borderRadius: '12px',
                  background: 'rgba(58, 64, 71, 0.85)',
                  backdropFilter: 'blur(2px)',
                  color: '#fff',
                  fontSize: '16px',
                  fontWeight: 500,
                },
              }}
            />
            {/* <PostHogProvider
              apiKey={env.POSTHOG_KEY}
              options={{
                api_host: env.POSTHOG_HOST,
                defaults: '2025-05-24',
              }}
            > */}
            <TooltipProvider>
              {children}
              <GlobalModal />
            </TooltipProvider>
            {/* </PostHogProvider> */}
          </QueryClientProvider>
        </HelmetProvider>
      </ErrorBoundary>
    </React.Suspense>
  )
}
