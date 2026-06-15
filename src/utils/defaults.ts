import type { NotificationConfig } from '@/types/notification'
import { TYPE_DEFAULTS } from '@/constants'

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
