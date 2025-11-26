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
      <div className="text-base leading-relaxed text-gray-700">
        The <span className="text-gray-900">first</span> thing I{' '}
        <span className="text-gray-900">try</span> to do{' '}
        <span className="text-gray-900">every morning</span> is{' '}
        <span className="text-gray-900">meditate</span>.
      </div>

      <RecordButton onRecordComplete={onRecordComplete} />
    </>
  )
}
