import type { Preset } from '@/types/notification'

export const STORAGE_KEY = 'toast-notification-presets'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isPreset(value: unknown): value is Preset {
  if (!isRecord(value)) return false
  if (typeof value.id !== 'string') return false
  if (typeof value.name !== 'string') return false
  if (typeof value.createdAt !== 'string') return false

  const config = value.config
  if (!isRecord(config)) return false
  if (typeof config.type !== 'string') return false
  if (typeof config.title !== 'string') return false
  if (typeof config.message !== 'string') return false
  if (typeof config.duration !== 'number') return false
  if (typeof config.position !== 'string') return false
  if (typeof config.backgroundColor !== 'string') return false
  if (typeof config.textColor !== 'string') return false
  if (typeof config.showIcon !== 'boolean') return false
  if (typeof config.showCloseButton !== 'boolean') return false
  if (typeof config.animation !== 'string') return false

  return true
}

export function loadPresets(): Preset[] {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '')
    if (!Array.isArray(raw)) return []
    return raw.filter((item: unknown): item is Preset => isPreset(item))
  } catch {
    return []
  }
}

export function savePresets(presets: Preset[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets))
  } catch {
    // Silently tolerate quota errors or unavailable storage
  }
}
