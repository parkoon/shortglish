/**
 * Get YouTube thumbnail URL as fallback
 * @param videoId - YouTube video ID
 * @param quality - Thumbnail quality (default, medium, high, standard, maxres)
 * @returns YouTube thumbnail URL
 */
type Quality = 'default' | 'medium' | 'high' | 'standard' | 'maxres'
export const getYouTubeThumbnailUrl = (videoId: string, quality: Quality = 'standard'): string => {
  const qualityMap = {
    default: 'default', // 120x90
    medium: 'mqdefault', // 320x180
    high: 'hqdefault', // 480x360
    standard: 'sddefault', // 640x480
    maxres: 'maxresdefault', // 1280x720
  }

  return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`
}
