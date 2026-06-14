export const NOTIFICATION_TYPES = ['success', 'error', 'warning', 'info'] as const
export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

export const TYPE_LABELS: Record<NotificationType, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
}

export const TYPE_COLORS: Record<NotificationType, string> = {
  success: '#22c55e',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
}
