<script setup lang="ts">
import { computed } from 'vue'
import type { NotificationConfig } from '@/types/notification'
import { TYPE_ICONS } from './icons'

const props = defineProps<{
  config: Omit<NotificationConfig, 'id'>
  preview?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const iconSvg = computed<string>(() => TYPE_ICONS[props.config.type])

const isPersistent = computed<boolean>(() => props.config.duration === 0)

const progressDuration = computed<string>(() => `${props.config.duration}ms`)
</script>

<template>
  <div
    class="toast"
    :class="{ 'toast--persistent': isPersistent }"
    :style="{ backgroundColor: config.backgroundColor, color: config.textColor }"
    :data-animation="config.animation"
    :role="config.type === 'error' ? 'alert' : 'status'"
  >
    <div class="toast__icon" v-if="config.showIcon">
      <img
        v-if="config.customIcon"
        :src="config.customIcon"
        alt=""
        class="toast__custom-icon"
      />
      <span v-else v-html="iconSvg" />
    </div>
    <div class="toast__body">
      <p v-if="config.title" class="toast__title">{{ config.title }}</p>
      <p v-if="config.message" class="toast__message">{{ config.message }}</p>
    </div>
    <button
      v-if="config.showCloseButton"
      class="toast__close"
      :style="{ color: config.textColor }"
      aria-label="Close notification"
      @click="emit('close')"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
    </button>
    <div
      v-if="!isPersistent && !preview"
      class="toast__progress"
      :style="{ '--progress-duration': progressDuration, backgroundColor: config.textColor }"
    />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.toast {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: $space-3;
  padding: $space-3 $space-4;
  border-radius: $radius-md;
  min-width: 300px;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  pointer-events: auto;
}

.toast__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding-top: 2px;
}

.toast__custom-icon {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

.toast__body {
  flex: 1;
  min-width: 0;
}

.toast__title {
  font-size: $font-size-sm;
  font-weight: 600;
  line-height: 1.4;
}

.toast__message {
  font-size: $font-size-sm;
  line-height: 1.4;
  opacity: 0.9;
  margin-top: 2px;
}

.toast__close {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  opacity: 0.7;
  transition: opacity 150ms ease;
  border-radius: $radius-sm;

  &:hover {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
}

.toast__progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  opacity: 0.3;
  transform-origin: left;
  animation: progress-shrink var(--progress-duration) linear forwards;
}

@keyframes progress-shrink {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .toast__progress {
    animation: none;
    transform: scaleX(0);
  }
}
</style>
