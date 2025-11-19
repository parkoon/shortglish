type CalculateAttemptsParams = {
  wrongAttemptsCount: number
}

/**
 * 시도 횟수를 계산합니다.
 * 틀린 적이 있으면 틀린 횟수 + 1, 없으면 1로 설정합니다.
 *
 * @param params - 계산 파라미터
 * @param params.wrongAttemptsCount - 틀린 시도 횟수
 * @returns 총 시도 횟수
 */
export const calculateAttempts = ({ wrongAttemptsCount }: CalculateAttemptsParams): number => {
  return wrongAttemptsCount > 0 ? wrongAttemptsCount + 1 : 1
}

