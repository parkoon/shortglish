/**
 * Step 3: 한 호흡으로 완성하기 컴포넌트
 */

import { RecordButton } from './record-button'

interface Step3ContentProps {
  /**
   * 녹음 완료 시 호출되는 콜백
   */
  onRecordComplete: () => void
}

/**
 * Step 3 콘텐츠 컴포넌트
 * 
 * 쉐도잉 버전 텍스트와 원문을 표시하고,
 * 녹음 기능을 제공합니다.
 */
export const Step3Content = ({ onRecordComplete }: Step3ContentProps) => {
  return (
    <>
      {/* 쉐도잉 버전 */}
      <div className="bg-gray-50 rounded-xl p-4 mb-3 min-h-[80px] flex items-center justify-center">
        <div className="text-base leading-relaxed text-center text-gray-700 px-2">
          <span className="text-gray-400 text-sm">Thuh</span>{' '}
          <span className="font-bold text-blue-500 text-lg">FIRST</span>{' '}
          <span className="text-gray-400 text-sm">thing</span>{' '}
          <span className="text-blue-400 text-lg">♪</span>{' '}
          <span className="text-gray-400 text-sm">I</span>{' '}
          <span className="font-bold text-blue-500 text-lg">TRY</span>
          <span className="text-gray-400 text-sm">da do</span>{' '}
          <span className="text-blue-400 text-lg">♪</span>{' '}
          <span className="text-gray-400 text-sm">EVry</span>{' '}
          <span className="font-bold text-blue-500 text-lg">MORN</span>
          <span className="text-gray-400 text-sm">in</span>{' '}
          <span className="text-blue-400 text-lg">♪</span>{' '}
          <span className="text-gray-400 text-sm">iz</span>{' '}
          <span className="font-bold text-blue-500 text-lg">MED</span>
          <span className="text-gray-400 text-sm">'tate</span>.
        </div>
      </div>

      {/* 원문 */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 mb-3">
        <div className="text-sm text-gray-500 mb-2">원문</div>
        <div className="text-base leading-relaxed text-gray-700">
          The <span className="font-semibold text-gray-900">first</span> thing I{' '}
          <span className="font-semibold text-gray-900">try</span> to do{' '}
          <span className="font-semibold text-gray-900">every morning</span> is{' '}
          <span className="font-semibold text-gray-900">meditate</span>.
        </div>
      </div>

      {/* 최종 체크포인트 */}
      <div className="bg-white border border-gray-200 rounded-xl p-3 mb-3">
        <div className="inline-block bg-blue-50 text-blue-500 px-2 py-0.5 rounded-md text-xs font-semibold mb-1.5">
          최종 체크포인트
        </div>
        <div className="text-xs text-gray-500 leading-relaxed">
          ✓ 강세 리듬이 살아있나요?
          <br />
          ✓ 연음이 자연스러운가요?
          <br />✓ 한 호흡에 편하게 말할 수 있나요?
        </div>
      </div>
      <RecordButton onRecordComplete={onRecordComplete} />
    </>
  )
}

