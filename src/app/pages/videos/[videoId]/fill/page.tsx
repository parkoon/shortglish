import { IconCheck, IconVolume, IconX } from '@tabler/icons-react'
import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import type { CTAStatus } from '@/components/layouts/interactive-cta-layout'
import { InteractiveCTALayout } from '@/components/layouts/interactive-cta-layout'
import { PageLayout } from '@/components/layouts/page-layout'
import { paths } from '@/config/paths'
import type { LetterInputsRef } from '@/features/video/components/letter-inputs'
import { LetterInputs } from '@/features/video/components/letter-inputs'
import { useSubtitles } from '@/features/video/hooks/use-subtitles'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
import { analytics } from '@/lib/analytics'
import { useGlobalModal } from '@/stores/modal-store'
import { extractBlankedSentence, normalizeText, speakText } from '@/utils/fill'

const FillPage = () => {
  const { videoId } = useParams<{ videoId: string }>()
  const navigate = useNavigate()
  const modal = useGlobalModal()
  const { markStepAsCompleted } = useVideoProgressStore()

  const { data: allSubtitles, isLoading } = useSubtitles(videoId)

  // blankedWords가 있는 것만 필터링
  const subtitles = useMemo(
    () => (allSubtitles || []).filter(sub => sub.blankedWords && sub.blankedWords.length > 0),
    [allSubtitles],
  )

  const [currentIndex, setCurrentIndex] = useState(0)
  const [userInputs, setUserInputs] = useState<Record<number, string>>({})
  const [ctaStatus, setCtaStatus] = useState<CTAStatus>('disabled')

  // 각 빈칸 단어의 ref
  const blankInputRefs = useRef<Record<number, LetterInputsRef | null>>({})

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">문제를 불러오는 중...</p>
        </div>
      </PageLayout>
    )
  }

  if (!videoId || subtitles.length === 0) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">문제가 없습니다.</p>
        </div>
      </PageLayout>
    )
  }

  const currentSubtitle = subtitles[currentIndex]
  const { displayWords, blankedPositions } = extractBlankedSentence(
    currentSubtitle.text,
    currentSubtitle.blankedWords || [],
  )

  const handleInputChange = (position: number, value: string) => {
    setUserInputs(prev => {
      const newInputs = { ...prev, [position]: value }

      // 모든 빈칸이 채워졌는지 확인
      const allFilled = blankedPositions.every(pos => {
        const input = newInputs[pos] || ''
        return input.length === displayWords[pos].word.length
      })

      setCtaStatus(allFilled ? 'ready' : 'disabled')

      // 모든 빈칸이 채워지면 키보드 닫기
      if (allFilled) {
        ;(document.activeElement as HTMLElement)?.blur()
      }

      return newInputs
    })
  }

  const handleWordComplete = (currentPosition: number) => {
    // 다음 빈칸 위치 찾기
    const currentBlankIndex = blankedPositions.indexOf(currentPosition)
    if (currentBlankIndex !== -1 && currentBlankIndex < blankedPositions.length - 1) {
      const nextBlankPosition = blankedPositions[currentBlankIndex + 1]
      // 다음 빈칸으로 포커싱
      setTimeout(() => {
        blankInputRefs.current[nextBlankPosition]?.focus()
      }, 50)
    }
  }

  const handleMoveToPrevWord = (currentPosition: number) => {
    // 이전 빈칸 위치 찾기
    const currentBlankIndex = blankedPositions.indexOf(currentPosition)
    if (currentBlankIndex > 0) {
      const prevBlankPosition = blankedPositions[currentBlankIndex - 1]
      // 이전 빈칸의 마지막 칸으로 포커싱
      blankInputRefs.current[prevBlankPosition]?.focusLast()
    }
  }

  const handleCheck = () => {
    const allFilled = blankedPositions.every(pos => {
      const input = userInputs[pos] || ''
      return input.length === displayWords[pos].word.length
    })

    if (!allFilled) {
      return
    }

    // 정답 체크
    const isCorrect = blankedPositions.every(pos => {
      const userInput = normalizeText(userInputs[pos] || '')
      const correctWord = normalizeText(displayWords[pos].word)
      return userInput === correctWord
    })

    // GA 이벤트: 빈칸 채우기 정답 체크
    if (videoId) {
      analytics.fillCheckAnswer({
        video_id: videoId,
        subtitle_index: currentSubtitle.index,
        question_number: currentIndex + 1,
        is_correct: isCorrect,
      })
    }

    if (isCorrect) {
      setCtaStatus('success')
    } else {
      setCtaStatus('error')
    }
  }

  const handleContinue = () => {
    if (currentIndex < subtitles.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setUserInputs({})
      setCtaStatus('disabled')
    } else {
      // GA 이벤트: Fill 모드 전체 완료
      if (videoId) {
        analytics.completeFillMode({
          video_id: videoId,
          total_questions: subtitles.length,
        })

        markStepAsCompleted(videoId, 'fill')
      }

      modal.open({
        title: '빈칸 채우기 완료',
        description: '모든 빈칸을 채웠어요!\n마지막 단계인 전체 복습으로 이어서 학습할까요?',
        okText: '다음 단계로',
        cancelText: '나중에',
        onOk: () => {
          navigate(paths.videos.review.getHref(videoId ?? ''))
        },
        onCancel: () => {
          navigate(paths.videos.entry.getHref(videoId ?? ''))
        },
      })
    }
  }

  const handleRetry = () => {
    // GA 이벤트: 빈칸 채우기 재시도
    if (videoId) {
      analytics.fillRetry({
        video_id: videoId,
        subtitle_index: currentSubtitle.index,
        question_number: currentIndex + 1,
      })
    }

    // 틀린 답 초기화
    setUserInputs({})
    setCtaStatus('disabled')
    // 첫 번째 빈칸으로 포커스
    if (blankedPositions.length > 0) {
      setTimeout(() => {
        blankInputRefs.current[blankedPositions[0]]?.focus()
      }, 100)
    }
  }

  const handleSpeak = () => {
    // GA 이벤트: TTS 사용
    if (videoId) {
      analytics.useTTS({
        video_id: videoId,
        subtitle_index: currentSubtitle.index,
        step_type: 'fill',
        text_length: currentSubtitle.text.length,
      })
    }

    speakText(currentSubtitle.text)
  }

  // 현재 문장의 정답
  const correctAnswer = currentSubtitle.text

  // CTA 상태별 config
  const getCtaConfig = () => {
    switch (ctaStatus) {
      case 'disabled':
        return {
          label: '확인',
        }
      case 'ready':
        return {
          label: '확인',
          onClick: handleCheck,
        }
      case 'success':
        return {
          overlayContent: (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                <IconCheck className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-green-900 text-lg mb-1">정답이에요!</h3>
                  <button className="p-2 text-green-900" onClick={handleSpeak}>
                    <IconVolume />
                  </button>
                </div>
                <p className="text-green-800">{correctAnswer}</p>
              </div>
            </div>
          ),
          buttonLabel: currentIndex < subtitles.length - 1 ? '계속' : '완료',
          onNext: handleContinue,
        }
      case 'error':
        return {
          overlayContent: (
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <IconX className="text-white" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 text-lg mb-1">아쉬워요!</h3>
                <div>
                  <span className="text-sm text-red-700 font-semibold">정답:</span>
                  <p className="text-red-800">{correctAnswer}</p>
                </div>
              </div>
            </div>
          ),
          buttonLabel: '다시 시도',
          onRetry: handleRetry,
        }
    }
  }

  return (
    <InteractiveCTALayout status={ctaStatus} config={getCtaConfig()}>
      <div className="px-4 mt-5 mb-8">
        <span className="text-gray-500">
          <span className="font-semibold">{currentIndex + 1}</span> / {subtitles.length}
        </span>
        <h2 className="text-xl font-bold text-gray-900 leading-relaxed">
          {currentSubtitle.translation}
        </h2>
      </div>

      {/* 빈칸 입력 영역 */}
      <div className="px-4">
        <div className="flex flex-wrap gap-1 justify-start items-baseline">
          {displayWords.map((item, index) => {
            if (item.isBlank) {
              return (
                <div key={index} className="inline-flex">
                  <LetterInputs
                    ref={el => {
                      blankInputRefs.current[index] = el
                    }}
                    word={item.word}
                    value={userInputs[index] || ''}
                    onChange={value => handleInputChange(index, value)}
                    onWordComplete={() => handleWordComplete(index)}
                    onMoveToPrevWord={() => handleMoveToPrevWord(index)}
                    isWrong={ctaStatus === 'error'}
                  />
                </div>
              )
            } else {
              return (
                <span key={index} className="text-xl text-gray-700 leading-relaxed">
                  {item.word}
                </span>
              )
            }
          })}
        </div>
      </div>
    </InteractiveCTALayout>
  )
}

export default FillPage
