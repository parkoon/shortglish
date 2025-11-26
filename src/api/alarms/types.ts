/**
 * 알림 구독 타입 정의
 */
export type AlarmType = 'a' | 'b' | 'c'

export interface Alarm {
  id: string
  userId: string
  phoneNumber?: string | null
  videoId: string
  type: AlarmType
  userName?: string | null
  notificationConsent: boolean
  createdAt: string
  updatedAt: string
}

export type SubscribeAlarmParams = {
  userId: string
  phoneNumber?: string | null
  videoId: string
  type: AlarmType
  userName?: string | null
  notificationConsent?: boolean
}

