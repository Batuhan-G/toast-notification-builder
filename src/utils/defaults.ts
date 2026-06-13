import type { NotificationConfig, NotificationType } from '@/types/notification'

interface TypeDefault {
  backgroundColor: string
  textColor: string
  icon: string
}

export const TYPE_DEFAULTS = {
  success: { backgroundColor: '#22c55e', textColor: '#ffffff', icon: '✓' },
  error: { backgroundColor: '#ef4444', textColor: '#ffffff', icon: '✕' },
  warning: { backgroundColor: '#f59e0b', textColor: '#ffffff', icon: '⚠' },
  info: { backgroundColor: '#3b82f6', textColor: '#ffffff', icon: 'ℹ' },
} satisfies Record<NotificationType, TypeDefault>

export function createDefaultConfig(): Omit<NotificationConfig, 'id'> {
  const defaults = TYPE_DEFAULTS.success
  return {
    type: 'success',
    title: '',
    message: '',
    duration: 3000,
    position: 'top-right',
    backgroundColor: defaults.backgroundColor,
    textColor: defaults.textColor,
    showIcon: true,
    showCloseButton: true,
    animation: 'fade',
  }
}
