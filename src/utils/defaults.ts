import type { NotificationConfig, NotificationType } from '@/types/notification'

interface TypeDefault {
  backgroundColor: string
  textColor: string
}

export const TYPE_DEFAULTS: Record<NotificationType, TypeDefault> = {
  success: { backgroundColor: '#22c55e', textColor: '#ffffff' },
  error: { backgroundColor: '#ef4444', textColor: '#ffffff' },
  warning: { backgroundColor: '#f59e0b', textColor: '#1f2937' },
  info: { backgroundColor: '#3b82f6', textColor: '#ffffff' },
}

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
    customIcon: null,
  }
}
