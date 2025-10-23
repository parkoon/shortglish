import { IconChevronDown, IconChevronUp, IconTrash } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

import type { SavedSubtitle } from '@/stores/saved-subtitles-store'
import { useSavedSubtitlesStore } from '@/stores/saved-subtitles-store'

import { CommentaryMarkdown } from './commentary-markdown'
import { UnderlinedText } from './ui/underlined-text'

type SavedSubtitleCardProps = {
  savedSubtitle: SavedSubtitle
}

export const SavedSubtitleCard = ({ savedSubtitle }: SavedSubtitleCardProps) => {
  const [isCommentaryOpen, setIsCommentaryOpen] = useState(false)
  const { removeSubtitle } = useSavedSubtitlesStore()
  // const navigate = useNavigate()

  const { subtitle } = savedSubtitle

  // const handleGoToVideo = () => {
  //   navigate(paths.watch.getHref(videoId))
  //   // 비디오 페이지로 이동 후 해당 시간으로 seek하기 위해 쿼리 파라미터 추가
  //   const url = `${paths.watch.getHref(videoId)}?t=${subtitle.startTime}`
  //   navigate(url)
  // }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    removeSubtitle(savedSubtitle.id)
  }

  const handleUnderlineClick = () => {
    // commentary 토글
    setIsCommentaryOpen(!isCommentaryOpen)
  }

  return (
    <div className="bg-white rounded p-4 border border-gray-100">
      <div className="flex items-center mb-2">
        <div className="flex-1">
          <UnderlinedText
            lang="ko"
            text={subtitle.text}
            className="font-semibold text-gray-900 mb-1"
          />
          <p className="text-sm text-gray-600 leading-relaxed">{subtitle.translation}</p>
        </div>

        {subtitle.commentary && (
          <button onClick={handleUnderlineClick}>
            {isCommentaryOpen ? <IconChevronUp /> : <IconChevronDown />}
          </button>
        )}
      </div>

      {/* Commentary 아코디언 - UnderlinedText 클릭으로 토글됨 */}
      {subtitle.commentary && (
        <AnimatePresence>
          {isCommentaryOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                duration: 0.4,
                ease: 'easeInOut',
              }}
              className="overflow-hidden mb-4"
            >
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                exit={{ y: -10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <CommentaryMarkdown content={subtitle.commentary} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {/* 액션 버튼들 */}
      <div className="flex justify-center gap-2 pt-3 border-t border-gray-100">
        {/* <button
          onClick={e => {
            e.stopPropagation()
            handleGoToVideo()
          }}
          className="flex items-center gap-2 px-3 py-2 "
        >
          <Play className="w-4 h-4" />
        </button> */}
        <button
          onClick={e => {
            e.stopPropagation()
            handleDelete(e)
          }}
          className="flex items-center gap-2 text-sm "
        >
          <IconTrash />
        </button>
      </div>
    </div>
  )
}
