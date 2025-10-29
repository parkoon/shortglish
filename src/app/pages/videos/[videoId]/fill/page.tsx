import { IconBulb, IconVolume } from '@tabler/icons-react'
import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import { SubtitleProgressBar } from '@/app/pages/videos/[videoId]/_components/subtitle-progress-bar'
import { PageLayout } from '@/components/layouts/page-layout'
import { Button } from '@/components/ui/button'
import { MAX_APP_SCREEN_WIDTH } from '@/config/app'
import { paths } from '@/config/paths'
import type { LetterInputsRef } from '@/features/video/components/letter-inputs'
import { LetterInputs } from '@/features/video/components/letter-inputs'
import { useSubtitles } from '@/features/video/hooks/use-subtitles'
import { useVideoProgressStore } from '@/features/video/store/video-progress-store'
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
  const [showHint, setShowHint] = useState(false)
  const [resultState, setResultState] = useState<'none' | 'success' | 'error'>('none')

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
    setUserInputs(prev => ({ ...prev, [position]: value }))
    setResultState('none')
    setShowHint(false)
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

    if (isCorrect) {
      setResultState('success')
    } else {
      setResultState('error')
    }
  }

  const handleContinue = () => {
    if (currentIndex < subtitles.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setUserInputs({})
      setShowHint(false)
      setResultState('none')
    } else {
      // 모든 문제 완료
      if (videoId) {
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

  const handleHint = () => {
    setShowHint(true)
  }

  const handleSpeak = () => {
    speakText(currentSubtitle.text)
  }

  return (
    <PageLayout>
      {/* Progress Bar */}
      <SubtitleProgressBar current={currentIndex + 1} total={subtitles.length} />

      <div className="px-4 mt-5 mb-8">
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
                    isWrong={resultState === 'error'}
                    showHint={showHint}
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

      {/* 하단 고정 메시지 박스 (듀오링고 스타일) */}
      <div
        style={{ maxWidth: MAX_APP_SCREEN_WIDTH }}
        className="fixed bottom-0 left-0 right-0 mx-auto bg-white border-t-1 border-gray-200 z-50 p-4"
      >
        <div className="">
          {/* 결과 없을 때 - 힌트/TTS 버튼 */}
          {resultState === 'none' && (
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2">
                <Button
                  className="w-12 h-12"
                  onClick={handleHint}
                  disabled={showHint}
                  variant="outline"
                >
                  <IconBulb />
                </Button>
                <Button className="w-12 h-12" onClick={handleSpeak} variant="outline">
                  <IconVolume />
                </Button>
              </div>

              {/* CHECK 버튼 */}
              <Button className="flex-1" onClick={handleCheck}>
                확인
              </Button>
            </div>
          )}

          {/* 성공 */}
          {resultState === 'success' && (
            <Button className="w-full bg-green-600" onClick={handleContinue}>
              {currentIndex < subtitles.length - 1 ? '이어서 풀기' : '학습 완료'}
            </Button>
          )}

          {/* 실패 */}
          {resultState === 'error' && (
            <Button className="w-full" onClick={() => setResultState('none')} variant="destructive">
              다시 시도
            </Button>
          )}
        </div>
      </div>
    </PageLayout>
  )
}

export default FillPage
