import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  AnimationStyle,
  NotificationConfig,
  NotificationType,
  Position,
  Preset,
} from '@/types/notification'
import { TYPE_DEFAULTS } from '@/constants'
import { createDefaultConfig } from '@/utils/defaults'

export const useBuilderStore = defineStore('builder', () => {
  const config = ref<Omit<NotificationConfig, 'id'>>(createDefaultConfig())
  const colorsCustomized = ref(false)
  const previousDuration = ref(config.value.duration)

  function setType(type: NotificationType): void {
    config.value.type = type
    const defaults = TYPE_DEFAULTS[type]
    config.value.backgroundColor = defaults.backgroundColor
    config.value.textColor = defaults.textColor
    colorsCustomized.value = false
  }

  function setTitle(title: string): void {
    config.value.title = title
  }

  function setMessage(message: string): void {
    config.value.message = message
  }

  function setDuration(duration: number): void {
    const clamped = Math.max(0, duration)
    config.value.duration = clamped
    if (clamped > 0) {
      previousDuration.value = clamped
    }
  }

  function setPersistent(persistent: boolean): void {
    config.value.duration = persistent ? 0 : previousDuration.value
  }

  function setPosition(position: Position): void {
    config.value.position = position
  }

  function setBackgroundColor(color: string): void {
    config.value.backgroundColor = color
    colorsCustomized.value = true
  }

  function setTextColor(color: string): void {
    config.value.textColor = color
    colorsCustomized.value = true
  }

  function toggleIcon(): void {
    config.value.showIcon = !config.value.showIcon
  }

  function toggleCloseButton(): void {
    config.value.showCloseButton = !config.value.showCloseButton
  }

  function setAnimation(animation: AnimationStyle): void {
    config.value.animation = animation
  }

  function setCustomIcon(dataUrl: string | null): void {
    config.value.customIcon = dataUrl
  }

  function applyPreset(preset: Preset): void {
    config.value = { ...preset.config }
    colorsCustomized.value = true
    if (preset.config.duration > 0) {
      previousDuration.value = preset.config.duration
    }
  }

  return {
    config,
    colorsCustomized,
    setType,
    setTitle,
    setMessage,
    setDuration,
    setPersistent,
    setPosition,
    setBackgroundColor,
    setTextColor,
    toggleIcon,
    toggleCloseButton,
    setAnimation,
    setCustomIcon,
    applyPreset,
  }
})
