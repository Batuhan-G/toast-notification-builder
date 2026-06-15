import type { TypeDefault } from '@/types/notification'

export const NOTIFICATION_TYPES = ['success', 'error', 'warning', 'info'] as const
export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

export const TYPE_LABELS: Record<NotificationType, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
}

export const TYPE_DEFAULTS: Record<NotificationType, TypeDefault> = {
  success: { backgroundColor: '#22c55f', textColor: '#ffffff' },
  error: { backgroundColor: '#ef2c2e', textColor: '#ffffff' },
  warning: { backgroundColor: '#f7aa43', textColor: '#1f2937' },
  info: { backgroundColor: '#2a7ff5', textColor: '#ffffff' },
}
