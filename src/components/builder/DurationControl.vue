<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  duration: number
}>()

const emit = defineEmits<{
  'update:duration': [value: number]
  'update:persistent': [value: boolean]
}>()

const isPersistent = computed<boolean>(() => props.duration === 0)

const sliderValue = computed<number>(() =>
  isPersistent.value ? 3 : props.duration / 1000,
)

const durationLabel = computed<string>(() =>
  isPersistent.value ? 'Persistent' : `${sliderValue.value}s`,
)

function onSliderInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const seconds = Number(target.value)
  emit('update:duration', seconds * 1000)
}

function onPersistentChange(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:persistent', target.checked)
}
</script>

<template>
  <div class="duration-control">
    <label class="field-legend" for="duration-slider">Duration</label>
    <div class="duration-control__slider-row">
      <input
        id="duration-slider"
        type="range"
        class="duration-control__slider"
        min="1"
        max="10"
        step="1"
        :value="sliderValue"
        :disabled="isPersistent"
        @input="onSliderInput"
      />
      <span class="duration-control__value">{{ durationLabel }}</span>
    </div>
    <label class="duration-control__persistent">
      <input
        type="checkbox"
        :checked="isPersistent"
        @change="onPersistentChange"
      />
      <span>Persistent (no auto-dismiss)</span>
    </label>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/typography' as *;

.duration-control__slider-row {
  display: flex;
  align-items: center;
  gap: $space-3;
}

.duration-control__slider {
  flex: 1;
  height: 6px;
  appearance: none;
  -webkit-appearance: none;
  background: var(--border-default);
  border-radius: 3px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent-primary);
    border: none;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: var(--accent-primary);
    border: none;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;

    &::-webkit-slider-thumb {
      cursor: not-allowed;
    }

    &::-moz-range-thumb {
      cursor: not-allowed;
    }
  }
}

.duration-control__value {
  @include label;
  color: var(--text-secondary);
  min-width: 28px;
  text-align: right;
  flex-shrink: 0;
}

.duration-control__persistent {
  display: inline-flex;
  align-items: center;
  gap: $space-2;
  margin-top: $space-2;
  font-size: $font-size-sm;
  color: var(--text-secondary);
  cursor: pointer;

  input[type='checkbox'] {
    accent-color: var(--accent-primary);
    cursor: pointer;
  }
}
</style>
