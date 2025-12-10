/**
 * Supabase Storage API
 * 비디오 콘텐츠 JSON 파일 관리
 */

import { env } from '@/config/env'
import { supabase } from '@/lib/supabase'

const STORAGE_BUCKET = 'contents'

/**
 * 비디오 콘텐츠 JSON 파일 업로드
 * @param videoId - 비디오 ID
 * @param content - JSON 콘텐츠 객체
 */
export const uploadVideoContent = async (videoId: string, content: unknown) => {
  const filePath = `${videoId}.json`
  const fileContent = JSON.stringify(content, null, 2)
  const blob = new Blob([fileContent], { type: 'application/json' })

  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(filePath, blob, {
    contentType: 'application/json',
    upsert: true, // 기존 파일이 있으면 덮어쓰기
  })

  if (error) {
    throw new Error(`Failed to upload video content: ${error.message}`)
  }

  return data
}

/**
 * 비디오 콘텐츠 JSON 파일 다운로드
 * @param videoId - 비디오 ID
 * @returns 비디오 콘텐츠 JSON 객체
 */
export const downloadVideoContent = async <T = unknown>(videoId: string): Promise<T> => {
  // Supabase URL에서 프로젝트 ID 추출
  const supabaseUrl = env.SUPABASE_URL
  const projectId = supabaseUrl.match(/https?:\/\/([^.]+)\.supabase\.co/)?.[1]

  if (!projectId) {
    throw new Error('유효하지 않은 Supabase URL입니다')
  }

  // 직접 공개 URL 구성
  const filePath = `${videoId}.json`
  const publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${STORAGE_BUCKET}/${filePath}`

  // fetch로 직접 다운로드
  const response = await fetch(publicUrl)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`파일을 찾을 수 없습니다: ${videoId}.json`)
    }
    throw new Error(`다운로드 실패: HTTP ${response.status} ${response.statusText}`)
  }

  const text = await response.text()

  try {
    return JSON.parse(text) as T
  } catch (parseError) {
    throw new Error(
      `JSON 파싱 실패: ${parseError instanceof Error ? parseError.message : '알 수 없는 오류'}`,
    )
  }
}

/**
 * 비디오 콘텐츠 JSON 파일의 공개 URL 가져오기
 * @param videoId - 비디오 ID
 * @returns 공개 URL
 */
export const getVideoContentUrl = (videoId: string): string => {
  const filePath = `${videoId}.json`
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filePath)
  return data.publicUrl
}
