import type {
  NotificationType,
  Position,
  AnimationStyle,
} from '@/constants'

export type { NotificationType, Position, AnimationStyle }

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
