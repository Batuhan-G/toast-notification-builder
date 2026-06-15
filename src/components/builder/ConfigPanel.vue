<script setup lang="ts">
import { useBuilderStore } from '@/stores/builder'
import type { NotificationType, Position, AnimationStyle } from '@/types/notification'
import TypeSelector from './TypeSelector.vue'
import DurationControl from './DurationControl.vue'
import PositionSelector from './PositionSelector.vue'
import ColorField from './ColorField.vue'
import ToggleOptions from './ToggleOptions.vue'
import AnimationSelector from './AnimationSelector.vue'
import IconUploader from './IconUploader.vue'

const builder = useBuilderStore()

function onTypeChange(type: NotificationType): void {
  builder.setType(type)
}

function onPositionChange(position: Position): void {
  builder.setPosition(position)
}

function onAnimationChange(animation: AnimationStyle): void {
  builder.setAnimation(animation)
}
</script>

<template>
  <div class="config-panel">
    <h2 class="config-panel__title">Configuration</h2>

    <div class="config-panel__body">
      <div class="config-panel__section">
        <TypeSelector
          :model-value="builder.config.type"
          @update:model-value="onTypeChange"
        />
      </div>

      <div class="config-panel__section">
        <label for="toast-title" class="field-legend">Title</label>
        <input
          id="toast-title"
          type="text"
          class="config-panel__input"
          placeholder="Notification title"
          :value="builder.config.title"
          @input="builder.setTitle(($event.target as HTMLInputElement).value)"
        />
      </div>

      <div class="config-panel__section">
        <label for="toast-message" class="field-legend">Message</label>
        <textarea
          id="toast-message"
          class="config-panel__textarea"
          placeholder="Notification message"
          rows="3"
          :value="builder.config.message"
          @input="builder.setMessage(($event.target as HTMLTextAreaElement).value)"
        />
      </div>

      <div class="config-panel__section">
        <DurationControl
          :duration="builder.config.duration"
          @update:duration="builder.setDuration($event)"
          @update:persistent="builder.setPersistent($event)"
        />
      </div>

      <div class="config-panel__section">
        <PositionSelector
          :model-value="builder.config.position"
          @update:model-value="onPositionChange"
        />
      </div>

      <hr class="config-panel__divider" />

      <div class="config-panel__section">
        <span class="field-legend config-panel__section-label">Style</span>
        <div class="config-panel__colors">
          <ColorField
            label="Background"
            input-id="bg-color"
            :model-value="builder.config.backgroundColor"
            @update:model-value="builder.setBackgroundColor($event)"
          />
          <ColorField
            label="Text Color"
            input-id="text-color"
            :model-value="builder.config.textColor"
            @update:model-value="builder.setTextColor($event)"
          />
        </div>
      </div>

      <div class="config-panel__section">
        <ToggleOptions
          :show-icon="builder.config.showIcon"
          :show-close-button="builder.config.showCloseButton"
          @toggle-icon="builder.toggleIcon()"
          @toggle-close-button="builder.toggleCloseButton()"
        />
      </div>

      <div class="config-panel__section">
        <AnimationSelector
          :model-value="builder.config.animation"
          @update:model-value="onAnimationChange"
        />
      </div>

      <div class="config-panel__section">
        <IconUploader
          :custom-icon="builder.config.customIcon"
          @update:custom-icon="builder.setCustomIcon($event)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.config-panel {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: $radius-lg;
  padding: $space-6;
  box-shadow: var(--shadow-card);
}

.config-panel__title {
  font-size: $font-size-base;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  padding-bottom: $space-4;
  border-bottom: 1px solid var(--border-default);
}

.config-panel__body {
  padding-top: $space-5;
}

.config-panel__section {
  & + & {
    margin-top: $space-5;
  }
}

.config-panel__divider {
  border: none;
  border-top: 1px solid var(--border-default);
  margin: $space-5 0;
}

.config-panel__section-label {
  margin-bottom: $space-4;
  color: var(--text-primary);
}

.config-panel__input,
.config-panel__textarea {
  width: 100%;
  padding: $space-2 $space-3;
  border: 1px solid var(--border-default);
  border-radius: $radius-sm;
  background-color: var(--bg-input);
  color: var(--text-primary);
  font-size: $font-size-sm;
  font-family: inherit;
  resize: vertical;
  box-sizing: border-box;

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--border-focus);
  }
}

.config-panel__textarea {
  font-family: $font-family-mono;
}

.config-panel__colors {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: $space-4;
}
</style>
