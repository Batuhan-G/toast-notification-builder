<script setup lang="ts">
import { ANIMATIONS } from '@/types/notification'
import type { AnimationStyle } from '@/types/notification'

defineProps<{
  modelValue: AnimationStyle
}>()

const emit = defineEmits<{
  'update:modelValue': [value: AnimationStyle]
}>()

const animationLabels: Record<AnimationStyle, string> = {
  fade: 'Fade',
  slide: 'Slide',
  bounce: 'Bounce',
}
</script>

<template>
  <fieldset class="animation-selector">
    <legend class="field-legend">Animation</legend>
    <div class="animation-selector__group">
      <button
        v-for="anim in ANIMATIONS"
        :key="anim"
        type="button"
        class="animation-selector__option"
        :class="{ 'animation-selector__option--active': modelValue === anim }"
        :aria-pressed="modelValue === anim"
        @click="emit('update:modelValue', anim)"
      >
        {{ animationLabels[anim] }}
      </button>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/typography' as *;

.animation-selector {
  border: none;
  padding: 0;
  margin: 0;
}

.animation-selector__group {
  display: flex;
  gap: $space-2;
}

.animation-selector__option {
  flex: 1;
  padding: $space-2 $space-3;
  border: 1px solid var(--border-default);
  border-radius: $radius-md;
  background-color: var(--bg-surface);
  color: var(--text-secondary);
  @include label;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    color 150ms ease,
    border-color 150ms ease;

  &:hover:not(.animation-selector__option--active) {
    border-color: var(--border-strong);
    color: var(--text-primary);
  }

  &--active {
    background-color: var(--accent-primary);
    color: var(--text-on-accent);
    border-color: var(--accent-primary);

    &:hover {
      background-color: var(--accent-primary-hover);
      border-color: var(--accent-primary-hover);
    }
  }

  &:focus-visible {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
  }
}
</style>
