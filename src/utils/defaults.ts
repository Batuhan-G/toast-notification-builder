import type { NotificationConfig, NotificationType } from '@/types/notification'

interface TypeDefault {
  backgroundColor: string
  textColor: string
}

export const TYPE_DEFAULTS: Record<NotificationType, TypeDefault> = {
  success: { backgroundColor: '#22c55f', textColor: '#ffffff' },
  error: { backgroundColor: '#ef2c2e', textColor: '#ffffff' },
  warning: { backgroundColor: '#f7aa43', textColor: '#1f2937' },
  info: { backgroundColor: '#2a7ff5', textColor: '#ffffff' },
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
