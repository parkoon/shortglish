import { useEffect, useState } from 'react'

import { BottomSheet } from './ui/bottom-sheet'
import { Button } from './ui/button'
import { TimePicker } from './ui/time-picker'

type TimePickerBottomSheetProps = {
  open: boolean
  onClose: () => void
  onConfirm: (minutes: number, seconds: number) => void
  initialMinutes?: number
  initialSeconds?: number
}

export const TimePickerBottomSheet = ({
  open,
  onClose,
  onConfirm,
  initialMinutes = 0,
  initialSeconds = 30,
}: TimePickerBottomSheetProps) => {
  const [selectedMinutes, setSelectedMinutes] = useState(initialMinutes)
  const [selectedSeconds, setSelectedSeconds] = useState(initialSeconds)

  // 바텀시트가 열릴 때마다 초기값으로 리셋
  useEffect(() => {
    if (open) {
      setSelectedMinutes(initialMinutes)
      setSelectedSeconds(initialSeconds)
    }
  }, [open, initialMinutes, initialSeconds])

  const handleMinutesChange = (value: number) => {
    setSelectedMinutes(value)
  }

  const handleSecondsChange = (value: number) => {
    setSelectedSeconds(value)
  }

  const handleConfirm = () => {
    const totalSeconds = selectedMinutes * 60 + selectedSeconds
    if (totalSeconds === 0) {
      alert('시간을 설정해주세요!')
      return
    }

    onConfirm(selectedMinutes, selectedSeconds)
  }

  return (
    <BottomSheet open={open} onClose={onClose} title="타이머 설정" dismissible={false}>
      <TimePicker
        initialMinutes={selectedMinutes}
        initialSeconds={selectedSeconds}
        onMinutesChange={handleMinutesChange}
        onSecondsChange={handleSecondsChange}
      />

      <div className="mt-8 flex gap-2">
        <Button onClick={handleConfirm} className="flex-1">
          시작
        </Button>
      </div>
    </BottomSheet>
  )
}
