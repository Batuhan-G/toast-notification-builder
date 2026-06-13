export const NOTIFICATION_TYPES = ['success', 'error', 'warning', 'info'] as const
export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

export const POSITIONS = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
] as const
export type Position = (typeof POSITIONS)[number]

export const ANIMATIONS = ['fade', 'slide', 'bounce'] as const
export type AnimationStyle = (typeof ANIMATIONS)[number]

export interface NotificationConfig {
  id: string
  type: NotificationType
  title: string
  message: string
  duration: number
  position: Position
  backgroundColor: string
  textColor: string
  showIcon: boolean
  showCloseButton: boolean
  animation: AnimationStyle
  customIcon: string | null
}

export interface Preset {
  id: string
  name: string
  config: Omit<NotificationConfig, 'id'>
  createdAt: string
}

export interface ActiveNotification extends NotificationConfig {
  createdAt: number
}

export type Theme = 'light' | 'dark'
