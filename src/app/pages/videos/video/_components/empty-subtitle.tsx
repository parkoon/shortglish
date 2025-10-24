import { IconMessage2Off } from '@tabler/icons-react'

export const EmptySubtitle = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4 mt-8 text-center text-gray-500">
      <IconMessage2Off className="w-8 h-8 mb-4" />
      <p>문장이 없는 구간입니다.</p>
      <p>아래 다음 버튼을 눌러 다음 문장으로 이동해주세요.</p>
    </div>
  )
}
