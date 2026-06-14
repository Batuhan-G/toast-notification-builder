import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import { POSITIONS } from '@/constants'
import type {
  ActiveNotification,
  NotificationConfig,
  Position,
} from '@/types/notification'

const timers = new Map<string, number>()

export const useNotificationsStore = defineStore('notifications', () => {
  const toasts = ref<ActiveNotification[]>([])

  const byPosition = computed<Record<Position, ActiveNotification[]>>(() => {
    const grouped = {} as Record<Position, ActiveNotification[]>
    for (const pos of POSITIONS) {
      grouped[pos] = []
    }
    for (const toast of toasts.value) {
      grouped[toast.position].push(toast)
    }
    return grouped
  })

  function show(config: Omit<NotificationConfig, 'id'>): void {
    const id = nanoid()
    const notification: ActiveNotification = {
      ...config,
      id,
      createdAt: Date.now(),
    }
    toasts.value.push(notification)

    if (config.duration > 0) {
      const handle = window.setTimeout(() => {
        dismiss(id)
      }, config.duration)
      timers.set(id, handle)
    }
  }

  function dismiss(id: string): void {
    const handle = timers.get(id)
    if (handle !== undefined) {
      clearTimeout(handle)
      timers.delete(id)
    }
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  function clearAll(): void {
    for (const handle of timers.values()) {
      clearTimeout(handle)
    }
    timers.clear()
    toasts.value = []
  }

  return {
    toasts,
    byPosition,
    show,
    dismiss,
    clearAll,
  }
})
