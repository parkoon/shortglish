import { type ComponentProps, type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { cn } from '@/lib/utils'

const SINGLE_CTA_HEIGHT = 88

type CTALayoutProps = {
  children: ReactNode
  primaryButtonProps: ComponentProps<typeof Button>
  classNames?: {
    content?: string
    bottom?: string
  }
}

/**
 * 하단 고정 CTA 버튼이 있는 페이지 레이아웃
 * PageLayout 대신 사용하며, 컨텐츠 영역에 자동으로 하단 패딩을 추가합니다.
 * CTA 영역에는 항상 Button 컴포넌트가 고정으로 들어갑니다.
 *
 * @example
 * <CtaLayout
 *   ctaProps={{
 *     onClick: handleNext,
 *     children: '다음',
 *     size: 'lg',
 *   }}
 * >
 *   <div>페이지 컨텐츠</div>
 * </CtaLayout>
 */
export const CTALayout = ({
  children,
  primaryButtonProps: ctaProps,
  classNames,
}: CTALayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col mx-auto" style={{ maxWidth: MAX_APP_SCREEN_WIDTH }}>
      {/* 컨텐츠 영역 - 자동으로 하단 패딩 적용 */}
      <div
        style={{ paddingBottom: SINGLE_CTA_HEIGHT + 32 }}
        className={cn('flex-1', classNames?.content)}
      >
        {children}
      </div>

      {/* 하단 고정 CTA */}
      <div
        style={{ maxWidth: MAX_APP_SCREEN_WIDTH, height: SINGLE_CTA_HEIGHT }}
        className={cn('fixed bottom-0 left-0 right-0 mx-auto bg-white p-4 ', classNames?.bottom)}
      >
        <Button
          {...ctaProps}
          className={cn('w-full', ctaProps.className)}
          size={ctaProps.size || 'lg'}
        />
      </div>
    </div>
  )
}
