/**
 * Google Analytics 이벤트 추적 유틸리티
 * 모든 GA 이벤트를 타입 안전하게 관리합니다.
 */

// GA gtag 함수 타입 정의
declare global {
  interface Window {
    gtag?: (
      command: 'event',
      eventName: string,
      eventParams?: Record<string, string | number | boolean>,
    ) => void
  }
}

// 이벤트 파라미터 타입 정의
type VideoEventParams = {
  video_id: string
  video_title?: string
  category?: string
}

type LearningEventParams = VideoEventParams & {
  subtitle_index?: number
  attempts?: number
  step_type?: 'build' | 'fill' | 'review'
}

type InteractionEventParams = {
  action: string
  label?: string
  value?: number
}

/**
 * GA 이벤트를 전송하는 헬퍼 함수
 */
const trackEvent = (eventName: string, eventParams?: Record<string, string | number | boolean>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams)

    // 개발 환경에서 콘솔에 로그 출력
    if (import.meta.env.DEV) {
      console.log('📊 [GA Event]', eventName, eventParams)
    }
  }
}

/**
 * Analytics 이벤트 추적 함수들
 */
export const analytics = {
  // ==================== 비디오 목록 & 네비게이션 ====================

  /**
   * 비디오 카드 클릭 (비디오 선택)
   */
  videoClick: (params: VideoEventParams) => {
    trackEvent('video_click', {
      video_id: params.video_id,
      video_title: params.video_title || '',
      category: params.category || '',
    })
  },

  /**
   * 카테고리 필터 변경
   */
  categoryFilter: (categoryId: string, categoryLabel: string) => {
    trackEvent('category_filter', {
      category_id: categoryId,
      category_label: categoryLabel,
    })
  },

  // ==================== 학습 단계 진입 ====================

  /**
   * Entry 페이지 진입 (비디오 상세 뷰)
   */
  viewVideoEntry: (params: VideoEventParams) => {
    trackEvent('view_video_entry', {
      video_id: params.video_id,
      video_title: params.video_title || '',
    })
  },

  /**
   * 학습 단계 시작
   */
  startLearningStep: (params: LearningEventParams) => {
    trackEvent('start_learning_step', {
      video_id: params.video_id,
      step_type: params.step_type || '',
      video_title: params.video_title || '',
    })
  },

  /**
   * 학습 재시작
   */
  restartLearning: (params: VideoEventParams) => {
    trackEvent('restart_learning', {
      video_id: params.video_id,
      video_title: params.video_title || '',
    })
  },

  // ==================== Build 모드 (단어 조합) ====================

  /**
   * 자막 문장 완성 (성공)
   */
  subtitleCompleted: (params: LearningEventParams) => {
    trackEvent('subtitle_completed', {
      video_id: params.video_id,
      subtitle_index: params.subtitle_index || 0,
      attempts: params.attempts || 1,
      step_type: 'build',
    })
  },

  /**
   * 단어 선택 오류
   */
  wordSelectionError: (params: LearningEventParams) => {
    trackEvent('word_selection_error', {
      video_id: params.video_id,
      subtitle_index: params.subtitle_index || 0,
      attempts: params.attempts || 0,
    })
  },

  /**
   * 힌트 사용
   */
  useHint: (params: LearningEventParams) => {
    trackEvent('use_hint', {
      video_id: params.video_id,
      subtitle_index: params.subtitle_index || 0,
      step_type: params.step_type || 'build',
    })
  },

  /**
   * Build 모드 전체 완료
   */
  completeBuildMode: (params: VideoEventParams & { total_subtitles: number }) => {
    trackEvent('complete_build_mode', {
      video_id: params.video_id,
      total_subtitles: params.total_subtitles,
    })
  },

  // ==================== Fill 모드 (빈칸 채우기) ====================

  /**
   * 빈칸 채우기 정답 체크
   */
  fillCheckAnswer: (
    params: LearningEventParams & { is_correct: boolean; question_number: number },
  ) => {
    trackEvent('fill_check_answer', {
      video_id: params.video_id,
      subtitle_index: params.subtitle_index || 0,
      question_number: params.question_number,
      is_correct: params.is_correct,
    })
  },

  /**
   * 빈칸 채우기 재시도
   */
  fillRetry: (params: LearningEventParams & { question_number: number }) => {
    trackEvent('fill_retry', {
      video_id: params.video_id,
      subtitle_index: params.subtitle_index || 0,
      question_number: params.question_number,
    })
  },

  /**
   * Fill 모드 전체 완료
   */
  completeFillMode: (params: VideoEventParams & { total_questions: number }) => {
    trackEvent('complete_fill_mode', {
      video_id: params.video_id,
      total_questions: params.total_questions,
    })
  },

  // ==================== Review 모드 (복습) ====================

  /**
   * Review 모드 진입
   */
  startReview: (params: VideoEventParams) => {
    trackEvent('start_review', {
      video_id: params.video_id,
      video_title: params.video_title || '',
    })
  },

  /**
   * 자막 반복 재생
   */
  repeatSubtitle: (params: LearningEventParams) => {
    trackEvent('repeat_subtitle', {
      video_id: params.video_id,
      subtitle_index: params.subtitle_index || 0,
      step_type: params.step_type || 'review',
    })
  },

  /**
   * Review 모드 완료
   */
  completeReview: (params: VideoEventParams) => {
    trackEvent('complete_review', {
      video_id: params.video_id,
    })
  },

  /**
   * Review 모드 다시보기
   */
  reviewRewatch: (params: VideoEventParams) => {
    trackEvent('review_rewatch', {
      video_id: params.video_id,
    })
  },

  // ==================== 비디오 컨트롤러 ====================

  /**
   * 반복 버튼 클릭
   */
  clickRepeat: (params: LearningEventParams) => {
    trackEvent('click_repeat', {
      video_id: params.video_id,
      subtitle_index: params.subtitle_index || 0,
      step_type: params.step_type || '',
    })
  },

  /**
   * 이전 버튼 클릭
   */
  clickPrevious: (params: LearningEventParams) => {
    trackEvent('click_previous', {
      video_id: params.video_id,
      subtitle_index: params.subtitle_index || 0,
      step_type: params.step_type || '',
    })
  },

  /**
   * 다음 버튼 클릭
   */
  clickNext: (params: LearningEventParams) => {
    trackEvent('click_next', {
      video_id: params.video_id,
      subtitle_index: params.subtitle_index || 0,
      step_type: params.step_type || '',
    })
  },

  // ==================== TTS (Text-to-Speech) ====================

  /**
   * TTS 사용
   */
  useTTS: (params: LearningEventParams & { text_length: number }) => {
    trackEvent('use_tts', {
      video_id: params.video_id,
      subtitle_index: params.subtitle_index || 0,
      step_type: params.step_type || '',
      text_length: params.text_length,
    })
  },

  // ==================== 북마크 ====================

  /**
   * 북마크 추가
   */
  addBookmark: (params: LearningEventParams) => {
    trackEvent('add_bookmark', {
      video_id: params.video_id,
      subtitle_index: params.subtitle_index || 0,
    })
  },

  /**
   * 북마크 제거
   */
  removeBookmark: (params: LearningEventParams) => {
    trackEvent('remove_bookmark', {
      video_id: params.video_id,
      subtitle_index: params.subtitle_index || 0,
    })
  },

  // ==================== 알림 ====================

  /**
   * 알림 구독 요청
   */
  subscribeNotification: (params?: { video_id?: string; source?: string }) => {
    trackEvent('subscribe_notification', {
      video_id: params?.video_id || '',
      source: params?.source || '',
    })
  },

  // ==================== 기타 ====================

  /**
   * 일반 상호작용 이벤트
   */
  interaction: (params: InteractionEventParams) => {
    trackEvent('user_interaction', {
      action: params.action,
      label: params.label || '',
      value: params.value || 0,
    })
  },
}
