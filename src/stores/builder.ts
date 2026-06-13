import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  AnimationStyle,
  NotificationConfig,
  NotificationType,
  Position,
  Preset,
} from '@/types/notification'
import { createDefaultConfig, TYPE_DEFAULTS } from '@/utils/defaults'

export const useBuilderStore = defineStore('builder', () => {
  const config = ref<Omit<NotificationConfig, 'id'>>(createDefaultConfig())
  const colorsCustomized = ref(false)

  function setType(type: NotificationType): void {
    config.value.type = type
    if (!colorsCustomized.value) {
      const defaults = TYPE_DEFAULTS[type]
      config.value.backgroundColor = defaults.backgroundColor
      config.value.textColor = defaults.textColor
    }
  }

  function setTitle(title: string): void {
    config.value.title = title
  }

  function setMessage(message: string): void {
    config.value.message = message
  }

  function setDuration(duration: number): void {
    config.value.duration = Math.max(0, duration)
  }

  function setPersistent(persistent: boolean): void {
    config.value.duration = persistent ? 0 : 3000
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
