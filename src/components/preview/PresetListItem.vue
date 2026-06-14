<script setup lang="ts">
import type { Preset } from '@/types/notification'
import { POSITION_LABELS, TYPE_COLORS } from '@/constants'

const props = defineProps<{ preset: Preset }>()

const emit = defineEmits<{
  load: [preset: Preset]
  delete: [id: string]
}>()


function durationLabel(duration: number): string {
  return duration === 0 ? 'Persistent' : `${duration / 1000}s`
}
</script>

<template>
  <li class="preset-item">
    <span
      class="preset-item__dot"
      :style="{ backgroundColor: TYPE_COLORS[props.preset.config.type] }"
      aria-hidden="true"
    />
    <div class="preset-item__body">
      <span class="preset-item__name">{{ props.preset.name }}</span>
      <span class="preset-item__sub">
        {{ durationLabel(props.preset.config.duration) }}
        <span class="preset-item__sep" aria-hidden="true">·</span>
        {{ POSITION_LABELS[props.preset.config.position] }}
      </span>
    </div>
    <div class="preset-item__actions">
      <button
        type="button"
        class="preset-item__btn"
        @click="emit('load', props.preset)"
      >
        Load
      </button>
      <button
        type="button"
        class="preset-item__btn"
        :aria-label="`Delete preset ${props.preset.name}`"
        @click="emit('delete', props.preset.id)"
      >
        Delete
      </button>
    </div>
  </li>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.preset-item {
  display: flex;
  align-items: center;
  gap: $space-3;
  padding: $space-3 $space-3;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: $radius-sm;
}

.preset-item__dot {
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.preset-item__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.preset-item__name {
  font-size: $font-size-sm;
  font-weight: 500;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preset-item__sub {
  font-size: $font-size-xs;
  color: var(--text-muted);
  display: flex;
  align-items: center;
  gap: $space-1;
}

.preset-item__sep {
  color: var(--text-muted);
}

.preset-item__actions {
  display: flex;
  gap: $space-1;
  flex-shrink: 0;
}

.preset-item__btn {
  padding: 3px $space-2;
  background-color: #ffffff;
  color: #111827;
  border: 1px solid var(--border-default);
  border-radius: 4px;
  font-size: $font-size-xs;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 100ms ease;

  &:hover {
    background-color: var(--bg-elevated);
  }

  &:focus-visible {
    outline: 2px solid var(--border-focus);
    outline-offset: 1px;
  }
}
</style>
