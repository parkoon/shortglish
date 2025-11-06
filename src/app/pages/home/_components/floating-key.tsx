import { IconKeyFilled } from '@tabler/icons-react'
import { motion } from 'framer-motion'

import { cn } from '@/lib/utils'

type FloatingKeyProps = {
  amount: number
  onClick: () => void
}
export const FloatingKey = ({ amount, onClick }: FloatingKeyProps) => {
  // TODO. 나중에 키 작업할 때 살리기
  return null
  const disabled = amount <= 0
  return (
    <div className="fixed bottom-[68px] right-3">
      <motion.button
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative flex items-center justify-center  bg-gray-900 shadow-md text-white rounded-full p-3',
          disabled && 'bg-gray-300',
        )}
        onClick={onClick}
      >
        <IconKeyFilled size={28} />

        <div
          className={cn(
            'flex items-center justify-center font-bold absolute -top-0.5 -right-0.5 w-5 h-5 bg-yellow-500 rounded-full text-xs border border-white',
            disabled && 'bg-gray-300',
          )}
        >
          {amount}
        </div>
      </motion.button>
    </div>
  )
}
