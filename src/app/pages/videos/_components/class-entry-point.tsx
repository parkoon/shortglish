import { useNavigate } from 'react-router'

import { paths } from '@/config/paths'

const HARD_CODED_CLASS_ID = '550e8400-e29b-41d4-a716-446655440000'

export const ClassEntryPoint = () => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(paths.class.detail.getHref(HARD_CODED_CLASS_ID))
  }

  return (
    <div onClick={handleClick} className="relative rounded-xl px-4 py-5 bg-gray-100">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-lg mb-1 font-semibold">페파 피그와 함께 영어 배우기</h2>
          <p className="text-sm">아이들이 좋아하는 애니메이션으로 자연스럽게 영어를 배워보세요</p>
        </div>

        <img src="/images/peppa-pig.png" width={120} alt="peppy-pig" className="shrink-0" />
      </div>
    </div>
  )
}
