import { useState } from 'react'

import type { Subtitle, VideoContentSubtitle } from '@/api'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

type SubtitleDisplayProps = {
  currentSubtitle: Subtitle | null
  currentSubtitleData: VideoContentSubtitle | null
  currentIndex: number
  totalSubtitles: number
  isPracticeActive: boolean
  onPracticeToggle: () => void
  onPrevious: () => void
  onNext: () => void
  canPrevious: boolean
  canNext: boolean
}

export const SubtitleDisplay = ({
  currentSubtitle,
  currentSubtitleData,
  currentIndex,
  totalSubtitles,
  isPracticeActive,
  onPracticeToggle,
}: SubtitleDisplayProps) => {
  const [isRevealing, setIsRevealing] = useState(false)

  const handleTouchStart = () => {
    if (isPracticeActive) {
      setIsRevealing(true)
    }
  }

  const handleTouchEnd = () => {
    if (isPracticeActive) {
      setIsRevealing(false)
    }
  }

  const shouldShowContent = !isPracticeActive || isRevealing

  // 학습 정보가 있는지 확인
  const hasLearningData =
    currentSubtitleData &&
    (currentSubtitleData.vocabulary?.length ||
      currentSubtitleData.grammar?.length ||
      currentSubtitleData.pronunciation?.length ||
      currentSubtitleData.nativeComments?.length)

  return (
    <div className="px-2 pt-2 pb-4">
      <div
        className={cn(
          'relative bg-white rounded-lg  border-1 border-gray-200 min-h-[320px] flex flex-col',
          isPracticeActive && 'border-primary',
        )}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 pt-2">
          <div className="text-sm text-gray-500">
            {currentIndex + 1} / {totalSubtitles}
          </div>
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <Label htmlFor="practice-mode" className="text-sm text-gray-700 cursor-pointer">
              연습 모드
            </Label>
            <Switch
              id="practice-mode"
              checked={isPracticeActive}
              onCheckedChange={onPracticeToggle}
            />
          </div>
        </div>

        {/* 자막 내용 */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col">
          {shouldShowContent && currentSubtitle ? (
            <div className="space-y-4">
              {/* 원문 */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {currentSubtitle.originText}
                </h3>
              </div>

              {/* 번역 */}
              <div>
                <p className="text-base text-gray-600">{currentSubtitle.translation}</p>
              </div>

              {/* 학습 정보 섹션 */}
              {hasLearningData && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Accordion type="multiple" className="w-full">
                    {/* 어휘 (Vocabulary) */}
                    {currentSubtitleData?.vocabulary &&
                      currentSubtitleData.vocabulary.length > 0 && (
                        <AccordionItem value="vocabulary">
                          <AccordionTrigger className="text-sm font-medium text-gray-900 py-2">
                            어휘 ({currentSubtitleData.vocabulary.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="flex flex-wrap gap-2 pt-1">
                              {currentSubtitleData.vocabulary.map((vocab, idx) => (
                                <div
                                  key={idx}
                                  className="bg-gray-50 rounded-md px-2.5 py-1.5 border border-gray-200"
                                >
                                  <div className="font-medium text-gray-900 text-sm">
                                    {vocab.word}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-0.5">
                                    {vocab.meaning}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}

                    {/* 문법 (Grammar) */}
                    {currentSubtitleData?.grammar && currentSubtitleData.grammar.length > 0 && (
                      <AccordionItem value="grammar">
                        <AccordionTrigger className="text-sm font-medium text-gray-900 py-2">
                          문법 ({currentSubtitleData.grammar.length})
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2.5 pt-1">
                            {currentSubtitleData.grammar.map((grammar, idx) => (
                              <div
                                key={idx}
                                className="border-b border-gray-100 pb-2.5 last:border-0 last:pb-0"
                              >
                                <div className="font-medium text-gray-900 text-sm mb-1">
                                  {grammar.pattern}
                                </div>
                                <div className="text-xs text-gray-600 leading-relaxed">
                                  {grammar.explanation}
                                </div>
                                {grammar.example && (
                                  <div className="text-xs text-gray-500 mt-1.5 italic">
                                    예: {grammar.example}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}

                    {/* 발음 (Pronunciation) */}
                    {currentSubtitleData?.pronunciation &&
                      currentSubtitleData.pronunciation.length > 0 && (
                        <AccordionItem value="pronunciation">
                          <AccordionTrigger className="text-sm font-medium text-gray-900 py-2">
                            발음 가이드 ({currentSubtitleData.pronunciation.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-1.5 pt-1">
                              {currentSubtitleData.pronunciation.map((pronunciation, idx) => (
                                <div key={idx} className="text-sm text-gray-600 leading-relaxed">
                                  {pronunciation}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}

                    {/* 원어민 코멘트 (Native Comments) */}
                    {currentSubtitleData?.nativeComments &&
                      currentSubtitleData.nativeComments.length > 0 && (
                        <AccordionItem value="comments">
                          <AccordionTrigger className="text-sm font-medium text-gray-900 py-2">
                            원어민 팁 ({currentSubtitleData.nativeComments.length})
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-1.5 pt-1">
                              {currentSubtitleData.nativeComments.map((comment, idx) => (
                                <div key={idx} className="text-sm text-gray-600 leading-relaxed">
                                  {comment}
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      )}
                  </Accordion>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 min-h-full">
              <img
                src="/images/click.png"
                alt="눌러서 자막 보기"
                width={52}
                height={52}
                className="mb-3 opacity-60"
              />
              <p className="text-gray-800 text-center font-semibold opacity-60">눌러서 자막 보기</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
