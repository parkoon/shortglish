import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'
import { useState } from 'react'

export const BookmarkButton = () => {
  const [isBookmarked, setIsBookmarked] = useState(false)

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  return (
    <button onClick={handleToggleBookmark}>
      {isBookmarked ? <IconBookmarkFilled /> : <IconBookmark />}
    </button>
  )
}
