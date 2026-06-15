export const NOTIFICATION_TYPES = ['success', 'error', 'warning', 'info'] as const
export type NotificationType = (typeof NOTIFICATION_TYPES)[number]

export const TYPE_LABELS: Record<NotificationType, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
}
