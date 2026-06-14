<script setup lang="ts">
import type { Position } from '@/types/notification'

defineProps<{
  modelValue: Position
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Position]
}>()

const positions: Position[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]

const positionLabels: Record<Position, string> = {
  'top-left': 'TL',
  'top-center': 'TC',
  'top-right': 'TR',
  'bottom-left': 'BL',
  'bottom-center': 'BC',
  'bottom-right': 'BR',
}
</script>

<template>
  <fieldset class="position-selector">
    <legend class="field-legend">Position</legend>
    <div class="position-selector__grid">
      <button
        v-for="pos in positions"
        :key="pos"
        class="position-selector__cell"
        :class="{ 'position-selector__cell--active': modelValue === pos }"
        @click="emit('update:modelValue', pos)"
      >
        {{ positionLabels[pos] }}
      </button>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/typography' as *;

.position-selector {
  border: none;
  padding: 0;
  margin: 0;
}

.position-selector__grid {
  display: inline-grid;
  grid-template-columns: repeat(3, 64px);
  gap: $space-1;
}

.position-selector__cell {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: $space-3 $space-2;
  border: 1px solid var(--border-default);
  border-radius: $radius-sm;
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  @include text-xs;
  cursor: pointer;
  transition:
    border-color 150ms ease,
    background-color 150ms ease,
    color 150ms ease;

  &:hover:not(.position-selector__cell--active) {
    border-color: var(--border-strong);
    color: var(--text-primary);
  }

  &--active {
    border-color: var(--accent-primary);
    background-color: var(--accent-primary);
    color: var(--text-on-accent);
  }

  &:focus-visible {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
  }
}
</style>
