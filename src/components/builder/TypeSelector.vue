<script setup lang="ts">
import { NOTIFICATION_TYPES } from '@/types/notification'
import type { NotificationType } from '@/types/notification'
import { TYPE_DEFAULTS } from '@/utils/defaults'
import { TYPE_ICONS } from '@/components/icons/typeIcons'

defineProps<{
  modelValue: NotificationType
}>()

const emit = defineEmits<{
  'update:modelValue': [value: NotificationType]
}>()

const typeLabels: Record<NotificationType, string> = {
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
}
</script>

<template>
  <fieldset class="type-selector">
    <legend class="field-legend">Type</legend>
    <div class="type-selector__grid">
      <button
        v-for="type in NOTIFICATION_TYPES"
        :key="type"
        type="button"
        class="type-selector__card"
        :class="{ 'type-selector__card--active': modelValue === type }"
        :aria-pressed="modelValue === type"
        :style="
          modelValue === type
            ? {
                backgroundColor: TYPE_DEFAULTS[type].backgroundColor,
                color: TYPE_DEFAULTS[type].textColor,
                borderColor: TYPE_DEFAULTS[type].backgroundColor,
              }
            : { color: TYPE_DEFAULTS[type].backgroundColor }
        "
        @click="emit('update:modelValue', type)"
      >
        <span class="type-selector__icon" v-html="TYPE_ICONS[type]" />
        <span class="type-selector__label">{{ typeLabels[type] }}</span>
      </button>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/typography' as *;

.type-selector {
  border: none;
  padding: 0;
  margin: 0;
}

.type-selector__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: $space-2;
}

.type-selector__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: $space-1;
  padding: $space-3 $space-2;
  border: 2px solid var(--border-default);
  border-radius: $radius-md;
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background-color 150ms ease,
    color 150ms ease;

  &:hover:not(.type-selector__card--active) {
    border-color: var(--border-strong);
  }

  &:focus-visible {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
  }
}

.type-selector__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.type-selector__label {
  @include label-xs;
}
</style>
