import { IconRepeat } from '@tabler/icons-react'
import { motion } from 'framer-motion'

import type { Subtitle } from '@/features/video/types'
import { cn } from '@/lib/utils'

type FullDialogueProps = {
  dialogues: Subtitle[]
  currentDialogue?: Subtitle | null
  onRepeat?: (dialogue: Subtitle) => void
}

export const FullDialogue = ({ dialogues, currentDialogue, onRepeat }: FullDialogueProps) => {
  const handleRepeat = (dialogue: Subtitle) => {
    if (onRepeat) {
      onRepeat(dialogue)
    }
  }

  return (
    <div className="pb-5">
      {dialogues.map((dialogue, index) => {
        const isActive = currentDialogue?.index === dialogue.index
        const isEmpty = dialogue.text === ''

        return (
          <motion.div
            key={dialogue.index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.03, duration: 0.3 }}
            className={cn(
              'relative transition-all duration-200',
              'border-b-1 border-gray-200',
              isActive ? 'bg-primary/5 border-primary shadow-md' : 'bg-white',
              isEmpty && 'opacity-50',
            )}
          >
            <div className="px-4 py-5">
              <div className="flex items-start gap-4">
                <div className="flex-1 min-w-0 space-y-1">
                  {isEmpty ? (
                    <div className="text-gray-400 italic">문장이 없습니다.</div>
                  ) : (
                    <>
                      {/* 영어 문장 */}
                      <p
                        className={cn(
                          'text-base font-medium leading-relaxed',
                          isActive ? 'text-gray-900' : 'text-gray-800',
                        )}
                      >
                        {dialogue.text}
                      </p>

                      {/* 한글 번역 */}
                      {dialogue.translation && (
                        <p className="text-sm text-gray-500 leading-relaxed">
                          {dialogue.translation}
                        </p>
                      )}
                    </>
                  )}
                </div>

                {/* Repeat 버튼 */}
                {!isEmpty && (
                  <button
                    onClick={() => handleRepeat(dialogue)}
                    className={cn(
                      'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
                      'transition-all duration-200',
                      isActive ? 'bg-primary text-white shadow-md' : 'bg-gray-100 text-gray-60',
                    )}
                  >
                    <IconRepeat size={20} />
                  </button>
                )}
              </div>

              {/* 재생 중 표시 */}
              {isActive && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  className="absolute bottom-0 left-0 h-[2px] bg-primary rounded-b-xl"
                />
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
