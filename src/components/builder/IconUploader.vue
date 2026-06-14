<script setup lang="ts">
import { ref } from 'vue'
import { validateIconFile, fileToDataUrl } from '@/utils/iconUpload'

defineProps<{
  customIcon: string | null
}>()

const emit = defineEmits<{
  'update:customIcon': [value: string | null]
}>()

const error = ref<string | null>(null)


async function onFileChange(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  error.value = null

  const validation = validateIconFile(file)
  if (!validation.ok) {
    error.value = validation.reason
    target.value = ''
    return
  }

  try {
    const dataUrl = await fileToDataUrl(file)
    emit('update:customIcon', dataUrl)
  } catch {
    error.value = 'Failed to read file.'
  }

  target.value = ''
}

function clearIcon(): void {
  error.value = null
  emit('update:customIcon', null)
}
</script>

<template>
  <div class="icon-uploader">
    <span class="field-legend">Custom Icon</span>
    <div class="icon-uploader__content">
      <div v-if="customIcon" class="icon-uploader__preview">
        <img :src="customIcon" alt="Custom icon preview" class="icon-uploader__thumb" />
        <button
          type="button"
          class="icon-uploader__clear"
          aria-label="Remove custom icon"
          @click="clearIcon"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <label class="icon-uploader__button">
        <input
          type="file"
          accept="image/*"
          class="icon-uploader__input"
          @change="onFileChange"
        />
        {{ customIcon ? 'Change' : 'Upload Icon' }}
      </label>
    </div>
    <p v-if="error" class="icon-uploader__error" role="alert">{{ error }}</p>
    <p class="icon-uploader__hint">Max 100 KB. PNG, JPG, or SVG.</p>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.icon-uploader__content {
  display: flex;
  align-items: center;
  gap: $space-3;
  margin-top: $space-2;
}

.icon-uploader__preview {
  position: relative;
  display: flex;
  align-items: center;
}

.icon-uploader__thumb {
  width: 36px;
  height: 36px;
  object-fit: contain;
  border: 1px solid var(--border-default);
  border-radius: $radius-sm;
  padding: 4px;
  background-color: var(--bg-surface);
}

.icon-uploader__clear {
  position: absolute;
  top: -6px;
  right: -6px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: 1px solid var(--border-default);
  border-radius: 50%;
  background-color: var(--bg-surface);
  color: var(--text-muted);
  cursor: pointer;
  padding: 0;

  &:hover {
    color: var(--text-primary);
  }

  &:focus-visible {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
  }
}

.icon-uploader__button {
  display: inline-flex;
  align-items: center;
  padding: $space-2 $space-3;
  border: 1px solid var(--border-default);
  border-radius: $radius-sm;
  background-color: var(--bg-elevated);
  color: var(--text-secondary);
  font-size: $font-size-sm;
  cursor: pointer;
  transition:
    background-color 150ms ease,
    border-color 150ms ease;

  &:hover {
    border-color: var(--border-strong);
    color: var(--text-primary);
  }
}

.icon-uploader__input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.icon-uploader__error {
  margin-top: $space-1;
  font-size: $font-size-sm;
  color: var(--color-danger);
}

.icon-uploader__hint {
  margin-top: $space-1;
  font-size: $font-size-sm;
  color: var(--text-muted);
}
</style>
