<script setup lang="ts">
import type { NotificationType } from '@/types/notification'
import { NOTIFICATION_TYPES, TYPE_LABELS } from '@/constants'
import { TYPE_ICONS } from '@/components/icons/typeIcons'

defineProps<{
  modelValue: NotificationType
}>()

const emit = defineEmits<{
  'update:modelValue': [value: NotificationType]
}>()
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
        :class="[
          `type-selector__card--${type}`,
          { 'type-selector__card--active': modelValue === type },
        ]"
        :aria-pressed="modelValue === type"
        @click="emit('update:modelValue', type)"
      >
        <span class="type-selector__icon" v-html="TYPE_ICONS[type]" />
        <span class="type-selector__label">{{ TYPE_LABELS[type] }}</span>
      </button>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

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

.type-selector__card--success .type-selector__icon {
  color: var(--type-success);
}
.type-selector__card--error .type-selector__icon {
  color: var(--type-error);
}
.type-selector__card--warning .type-selector__icon {
  color: var(--type-warning);
}
.type-selector__card--info .type-selector__icon {
  color: var(--type-info);
}

.type-selector__label {
  font-size: $font-size-xs;
  font-weight: 500;
  color: var(--text-secondary);
}

.type-selector__card--active {
  .type-selector__icon,
  .type-selector__label {
    color: var(--text-on-accent);
  }

  &.type-selector__card--success {
    background-color: var(--type-success-active);
    border-color: var(--type-success-active);
  }

  &.type-selector__card--error {
    background-color: var(--type-error-active);
    border-color: var(--type-error-active);
  }

  &.type-selector__card--warning {
    background-color: var(--type-warning-active);
    border-color: var(--type-warning-active);
  }

  &.type-selector__card--info {
    background-color: var(--type-info-active);
    border-color: var(--type-info-active);
  }
}
</style>
