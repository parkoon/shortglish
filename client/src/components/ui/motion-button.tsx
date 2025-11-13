import { motion, type MotionProps } from 'framer-motion'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

type MotionButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Omit<MotionProps, 'children'> & {
    children?: React.ReactNode
  }

/**
 * framer-motion을 활용한 애니메이션 버튼 컴포넌트
 *
 * 기본적으로 클릭 시 scale: 0.9 효과가 적용되며,
 * disabled 상태일 때는 자동으로 애니메이션이 비활성화됩니다.
 *
 * @example
 * <MotionButton onClick={handleClick} disabled={isDisabled}>
 *   Click me
 * </MotionButton>
 *
 * @example
 * // 커스텀 애니메이션
 * <MotionButton
 *   whileTap={{ scale: 0.95 }}
 *   whileHover={{ scale: 1.05 }}
 * >
 *   Custom animation
 * </MotionButton>
 */
export const MotionButton = forwardRef<HTMLButtonElement, MotionButtonProps>(
  ({ disabled, children, whileTap, transition, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        disabled={disabled}
        whileTap={disabled ? undefined : (whileTap ?? { scale: 0.9 })}
        transition={transition ?? { duration: 0.1 }}
        {...props}
      >
        {children}
      </motion.button>
    )
  },
)

MotionButton.displayName = 'MotionButton'
