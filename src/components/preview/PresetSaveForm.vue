<script setup lang="ts">
import { ref } from 'vue'
import { useBuilderStore } from '@/stores/builder'
import { usePresetsStore } from '@/stores/presets'

const builder = useBuilderStore()
const presetsStore = usePresetsStore()

const name = ref('')
const error = ref('')

function save(): void {
  error.value = ''
  const trimmed = name.value.trim()
  if (trimmed === '') {
    error.value = 'Preset name is required.'
    return
  }
  try {
    presetsStore.savePreset(trimmed, builder.config)
    name.value = ''
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to save preset.'
  }
}
</script>

<template>
  <div class="preset-save-form">
    <h3 class="preset-save-form__heading">Save Preset</h3>
    <div class="preset-save-form__row">
      <label for="preset-name" class="sr-only">Preset name</label>
      <input
        id="preset-name"
        v-model="name"
        type="text"
        class="preset-save-form__input"
        placeholder="Preset name…"
        maxlength="80"
        @keydown.enter="save"
      />
      <button type="button" class="preset-save-form__btn" @click="save">Save</button>
    </div>
    <p v-if="error" class="preset-save-form__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.preset-save-form {
  margin-top: $space-5;
}

.preset-save-form__heading {
  font-size: $font-size-sm;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 $space-3;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.preset-save-form__row {
  display: flex;
  gap: $space-2;
}

.preset-save-form__input {
  flex: 1;
  padding: $space-2 $space-3;
  background-color: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: $radius-md;
  font-size: $font-size-sm;
  font-family: $font-family;

  &:focus {
    outline: 2px solid var(--border-focus);
    outline-offset: 1px;
    border-color: var(--border-focus);
  }

  &::placeholder {
    color: var(--text-muted);
  }
}

.preset-save-form__btn {
  padding: $space-2 $space-4;
  background-color: var(--accent-primary);
  color: var(--text-on-accent);
  border: none;
  border-radius: $radius-md;
  font-size: $font-size-sm;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 150ms ease;

  &:hover {
    background-color: var(--accent-primary-hover);
  }

  &:active {
    background-color: var(--accent-primary-active);
  }

  &:focus-visible {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
  }
}

.preset-save-form__error {
  margin: $space-2 0 0;
  font-size: $font-size-xs;
  color: var(--color-danger);
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
