<script setup lang="ts">
import { ref } from 'vue'
import { usePresetsStore } from '@/stores/presets'
import { useBuilderStore } from '@/stores/builder'
import type { Preset } from '@/types/notification'
import PresetListItem from './PresetListItem.vue'

const presetsStore = usePresetsStore()
const builder = useBuilderStore()

const name = ref('')
const error = ref('')

function load(preset: Preset): void {
  builder.applyPreset(preset)
}

function remove(id: string): void {
  presetsStore.deletePreset(id)
}

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
  <div class="preset-list">
    <h3 class="preset-list__heading">Saved Presets</h3>

    <ul v-if="presetsStore.presets.length > 0" class="preset-list__items">
      <PresetListItem
        v-for="preset in presetsStore.presets"
        :key="preset.id"
        :preset="preset"
        @load="load"
        @delete="remove"
      />
    </ul>
    <p v-else class="preset-list__empty">No presets saved yet.</p>

    <div class="preset-list__save-row">
      <label for="preset-name" class="sr-only">Preset name</label>
      <input
        id="preset-name"
        v-model="name"
        type="text"
        class="preset-list__input"
        placeholder="Preset name..."
        maxlength="80"
        @keydown.enter="save"
      />
      <button type="button" class="preset-list__save-btn" @click="save">Save</button>
    </div>
    <p v-if="error" class="preset-list__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.preset-list {
  margin-top: $space-5;
}

.preset-list__heading {
  font-size: $font-size-sm;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 $space-3;
  letter-spacing: 0.04em;
}

.preset-list__items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: $space-2;
  max-height: 200px;
  overflow-y: auto;
}

.preset-list__empty {
  font-size: $font-size-sm;
  color: var(--text-muted);
  margin: 0;
}

.preset-list__save-row {
  display: flex;
  gap: $space-2;
  margin-top: $space-4;
}

.preset-list__input {
  flex: 1;
  padding: $space-2 $space-3;
  background-color: var(--bg-input);
  color: var(--text-primary);
  border: 1px solid var(--border-default);
  border-radius: $radius-md;
  font-size: $font-size-sm;
  font-family: $font-family;

  &:focus-visible {
    outline: none;
    border-color: var(--border-focus);
  }

  &::placeholder {
    color: var(--text-muted);
  }
}

.preset-list__save-btn {
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

.preset-list__error {
  margin: $space-2 0 0;
  font-size: $font-size-xs;
  color: var(--type-error);
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
