import { BottomSheet } from '@/components/ui/bottom-sheet'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { cn } from '@/lib/utils'

const SPEED_OPTIONS = [0.5, 0.75, 1.0, 1.25, 1.5] as const

type VideoSpeedBottomSheetProps = {
  open: boolean
  currentSpeed: number
  onClose: () => void
  onSelect: (speed: number) => void
}

export const VideoSpeedBottomSheet = ({
  open,
  currentSpeed,
  onClose,
  onSelect,
}: VideoSpeedBottomSheetProps) => {
  const handleValueChange = (value: string) => {
    const speed = parseFloat(value)
    onSelect(speed)
    onClose()
  }

  return (
    <BottomSheet title="재생 속도" open={open} onClose={onClose}>
      <RadioGroup
        value={currentSpeed.toString()}
        onValueChange={handleValueChange}
        className="flex flex-col gap-2"
      >
        {SPEED_OPTIONS.map(speed => (
          <label key={speed} className={cn('flex items-center gap-3 py-2')}>
            <RadioGroupItem value={speed.toString()} id={`speed-${speed}`} />
            <Label htmlFor={`speed-${speed}`} className="flex-1 font-medium text-base">
              {speed}x
            </Label>
          </label>
        ))}
      </RadioGroup>
    </BottomSheet>
  )
}
