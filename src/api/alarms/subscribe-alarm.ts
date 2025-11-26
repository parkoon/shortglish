/**
 * 알림 구독 API
 */

import { supabase } from '@/lib/supabase'

import type { Alarm, SubscribeAlarmParams } from './types'

/**
 * 알림 구독 (upsert)
 * 이미 존재하는 경우 updated_at만 업데이트, 없으면 새로 생성
 */
export const subscribeAlarm = async (params: SubscribeAlarmParams): Promise<Alarm> => {
  const { userId, phoneNumber, videoId, type, userName, notificationConsent = true } = params

  // upsert 사용: ON CONFLICT로 중복 처리
  // conflict_target은 복합 유니크 제약 (user_id, video_id, type)
  const { data, error } = await supabase
    .from('alarm')
    .upsert(
      {
        user_id: userId,
        phone_number: phoneNumber,
        video_id: videoId,
        type,
        user_name: userName,
        notification_consent: notificationConsent,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,video_id,type',
        ignoreDuplicates: false, // 중복 시 업데이트
      },
    )
    .select(
      'id, user_id, phone_number, video_id, type, user_name, notification_consent, created_at, updated_at',
    )
    .single()

  if (error || !data) {
    throw new Error(`Failed to subscribe alarm: ${error?.message ?? 'Unknown error'}`)
  }

  // snake_case → camelCase 변환
  return {
    id: data.id,
    userId: data.user_id,
    phoneNumber: data.phone_number ?? null,
    videoId: data.video_id,
    type: data.type as 'a' | 'b' | 'c',
    userName: data.user_name ?? null,
    notificationConsent: data.notification_consent ?? true,
    createdAt: data.created_at ?? '',
    updatedAt: data.updated_at ?? '',
  }
}
