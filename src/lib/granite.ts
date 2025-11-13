/**
 * Granite 프레임워크 관련 유틸리티
 * 웹 환경에서는 Granite 프레임워크가 없을 수 있으므로 안전하게 처리합니다.
 */

type GraniteFramework = typeof import('@apps-in-toss/web-framework')

type GraniteModule = {
  closeView: () => void
  graniteEvent: Awaited<GraniteFramework>['graniteEvent']
}

let graniteModule: GraniteModule | null = null

/**
 * Granite 모듈을 동적으로 로드합니다.
 * 웹 환경에서는 모듈이 없을 수 있으므로 null을 반환합니다.
 */
export const loadGraniteModule = async (): Promise<GraniteModule | null> => {
  if (graniteModule !== null) {
    return graniteModule
  }

  try {
    const module = await import('@apps-in-toss/web-framework')
    graniteModule = {
      closeView: module.closeView,
      graniteEvent: module.graniteEvent,
    }
    return graniteModule
  } catch {
    // 웹 환경에서는 모듈이 없을 수 있음
    return null
  }
}

/**
 * Granite 모듈이 사용 가능한지 확인합니다.
 */
export const isGraniteAvailable = async (): Promise<boolean> => {
  const module = await loadGraniteModule()
  return module !== null
}
