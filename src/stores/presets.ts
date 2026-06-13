import { ref } from 'vue'
import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'
import type { NotificationConfig, Preset } from '@/types/notification'
import { loadPresets, savePresets } from '@/utils/storage'

export const usePresetsStore = defineStore('presets', () => {
  const presets = ref<Preset[]>(loadPresets())

  function savePreset(
    name: string,
    config: Omit<NotificationConfig, 'id'>,
  ): void {
    const trimmed = name.trim()
    if (trimmed === '') {
      throw new Error('Preset name cannot be empty')
    }
    const preset: Preset = {
      id: nanoid(),
      name: trimmed,
      config: structuredClone(config),
      createdAt: new Date().toISOString(),
    }
    presets.value.push(preset)
    savePresets(presets.value)
  }

  function deletePreset(id: string): void {
    presets.value = presets.value.filter((p) => p.id !== id)
    savePresets(presets.value)
  }

  return {
    presets,
    savePreset,
    deletePreset,
  }
})
