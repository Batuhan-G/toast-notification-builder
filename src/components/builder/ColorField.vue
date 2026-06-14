<script setup lang="ts">
defineProps<{
  label: string
  modelValue: string
  inputId: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function onColorInput(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

function onTextInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const value = target.value.trim()
  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <div class="color-field">
    <label :for="inputId" class="color-field__label">{{ label }}</label>
    <div class="color-field__inputs">
      <input
        type="color"
        class="color-field__swatch"
        :value="modelValue"
        :aria-label="label"
        @input="onColorInput"
      />
      <input
        :id="inputId"
        type="text"
        class="color-field__hex"
        :value="modelValue"
        maxlength="7"
        @input="onTextInput"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;
@use '@/styles/typography' as *;

.color-field__label {
  display: block;
  @include label;
  color: var(--text-secondary);
  margin-bottom: $space-1;
}

.color-field {
  min-width: 0;
}

.color-field__inputs {
  display: flex;
  align-items: center;
  gap: $space-2;
}

.color-field__swatch {
  width: 36px;
  height: 36px;
  border: 1px solid var(--border-default);
  border-radius: $radius-sm;
  padding: 2px;
  cursor: pointer;
  background-color: var(--bg-surface);

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: $radius-xs;
  }

  &::-moz-color-swatch {
    border: none;
    border-radius: $radius-xs;
  }
}

.color-field__hex {
  flex: 1;
  min-width: 0;
  padding: $space-2 $space-3;
  border: 1px solid var(--border-default);
  border-radius: $radius-sm;
  background-color: var(--bg-input);
  color: var(--text-primary);
  font-size: $font-size-sm;
  font-family: $font-family-mono;

  &:focus {
    outline: none;
    border-color: var(--border-focus);
  }
}
</style>
