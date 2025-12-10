import type { Class } from '@/api'

import { ClassCard } from './class-card'

type ClassGridProps = {
  classes: Class[]
}

export const ClassGrid = ({ classes }: ClassGridProps) => {
  if (classes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-gray-600 font-medium mb-1">클래스가 없습니다</p>
        <p className="text-gray-400 text-sm text-center">
          아직 등록된 클래스가 없습니다.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 px-4 pb-4">
      {classes.map(classItem => (
        <ClassCard key={classItem.id} class={classItem} />
      ))}
    </div>
  )
}

