import { IconRepeat } from '@tabler/icons-react'

type VideoRepeatOverlayProps = {
  onRepeat: () => void
}
export const VideoRepeatOverlay = ({ onRepeat }: VideoRepeatOverlayProps) => (
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="absolute inset-0 bg-gray-900 z-10 opacity-80" />
    <div className="absolute inset-0 flex items-center justify-center z-20">
      <button
        onClick={onRepeat}
        className="flex flex-col items-center justify-center gap-2 text-white p-5"
      >
        <IconRepeat className="w-8 h-8" />
        <p className="font-semibold">다시듣기</p>
      </button>
    </div>
  </div>
)
