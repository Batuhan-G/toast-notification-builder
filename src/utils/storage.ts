import { ANIMATIONS, NOTIFICATION_TYPES, POSITIONS } from '@/types/notification'
import type { Preset, Theme } from '@/types/notification'

export const STORAGE_KEYS = {
  PRESETS: 'toast-builder:presets',
  THEME: 'toast-builder:theme',
} as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNotificationConfig(value: unknown): boolean {
  if (!isRecord(value)) return false
  if (typeof value.type !== 'string') return false
  if (!(NOTIFICATION_TYPES as readonly string[]).includes(value.type)) return false
  if (typeof value.title !== 'string') return false
  if (typeof value.message !== 'string') return false
  if (typeof value.duration !== 'number') return false
  if (typeof value.position !== 'string') return false
  if (!(POSITIONS as readonly string[]).includes(value.position)) return false
  if (typeof value.backgroundColor !== 'string') return false
  if (typeof value.textColor !== 'string') return false
  if (typeof value.showIcon !== 'boolean') return false
  if (typeof value.showCloseButton !== 'boolean') return false
  if (typeof value.animation !== 'string') return false
  if (!(ANIMATIONS as readonly string[]).includes(value.animation)) return false
  if (value.customIcon !== null && typeof value.customIcon !== 'string') return false
  return true
}

function isPreset(value: unknown): value is Preset {
  if (!isRecord(value)) return false
  if (typeof value.id !== 'string') return false
  if (typeof value.name !== 'string') return false
  if (typeof value.createdAt !== 'string') return false
  return isNotificationConfig(value.config)
}

export function loadPresets(): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRESETS)
    if (raw === null) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter((item: unknown): item is Preset => isPreset(item))
  } catch {
    return []
  }
}

export function savePresets(presets: Preset[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRESETS, JSON.stringify(presets))
  } catch {}
}

export function loadTheme(): Theme {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.THEME)
    if (raw === 'light' || raw === 'dark') return raw
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

export function saveTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
  } catch {}
}
