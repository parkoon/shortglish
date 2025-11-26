/**
 * Step 2: 약한 단어 자연스럽게 연결 컴포넌트
 */

import { STEP_2_CONTENT } from '../_constants/shadowing-content'
import { parseShadowingText } from '../_utils/parse-shadowing-text'

/**
 * Step 2 콘텐츠 컴포넌트
 *
 * 파싱된 텍스트를 세그먼트별로 렌더링하고,
 * 강조된 단어와 일반 단어를 시각적으로 구분합니다.
 */
export const Step2Content = () => {
  const parsedSegments = parseShadowingText(STEP_2_CONTENT.text)

  return (
    <>
      <div className="mb-3">
        {parsedSegments.map((segment, segmentIndex) => (
          <span key={segmentIndex} className="inline-flex items-center">
            <div className="flex items-center gap-1">
              {segment.map((part, partIndex) => (
                <span
                  key={partIndex}
                  className={
                    part.isStrong ? 'font-bold text-blue-500 text-lg' : 'text-gray-700 text-sm'
                  }
                >
                  {part.text}
                </span>
              ))}
            </div>
            {segmentIndex < parsedSegments.length - 1 && (
              <span className="inline-block w-0.5 h-4 bg-red-400 mx-3 rotate-12" />
            )}
          </span>
        ))}
      </div>
      <div className="bg-gray-50  rounded-xl p-3">
        <div className="inline-block bg-blue-50 text-blue-500 px-2 py-0.5 rounded-md text-xs font-semibold mb-1.5">
          연결 포인트
        </div>
        <div className="text-sm text-gray-500 leading-relaxed">
          • 빨간 세로선(|) 단위로 끊어서 리듬감 훈련하세요
          <br />• "try to" → "TRYda"로 자연스럽게 (flap t)
          <br />• "every" → "EVry"로 약화
          <br />• 강세는 여전히 강하게, 약한 부분은 빠르게
        </div>
      </div>
    </>
  )
}
