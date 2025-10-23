import type { Subtitle } from '@/features/video/types'

/**
 * Dynamically imports dialogue data for a specific video
 * This enables code splitting and reduces initial bundle size
 */
export const getDialogue = async (videoId: string): Promise<Subtitle[]> => {
  try {
    const module = await import(`@/features/video/constants/subtitles/${videoId}.json`)
    console.log('🚀 ~ getDialogue ~ module:', module)
    return module.dialogues
  } catch (error) {
    console.error(`Failed to load dialogue for video: ${videoId}`, error)
    return defaultSubtitles
  }
}

// 기본 자막 (비디오 ID가 없을 때)
export const defaultSubtitles: Subtitle[] = [
  {
    index: 1,
    startTime: 0,
    endTime: 0,
    text: 'No subtitles available',
  },
]
