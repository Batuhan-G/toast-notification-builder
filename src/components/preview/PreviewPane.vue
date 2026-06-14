<script setup lang="ts">
import { useBuilderStore } from '@/stores/builder'
import { useNotificationsStore } from '@/stores/notifications'
import ToastItem from '@/components/toast/ToastItem.vue'

const builder = useBuilderStore()
const notifications = useNotificationsStore()

function showNotification(): void {
  notifications.show(builder.config)
}
</script>

<template>
  <div class="preview-pane">
    <h2 class="preview-pane__title">Preview</h2>

    <div class="preview-pane__stage">
      <div
        class="preview-pane__toast-wrapper"
        :class="`preview-pane__toast-wrapper--${builder.config.position}`"
      >
        <ToastItem :config="builder.config" :preview="true" />
      </div>
    </div>

    <button class="preview-pane__show-btn" @click="showNotification">
      Show Notification
    </button>
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.preview-pane {
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: $radius-lg;
  padding: $space-6;
  box-shadow: var(--shadow-card);
}

.preview-pane__title {
  font-size: $font-size-base;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  padding-bottom: $space-4;
  border-bottom: 1px solid var(--border-default);
}

.preview-pane__stage {
  position: relative;
  background-color: var(--bg-elevated);
  border-radius: $radius-md;
  min-height: 200px;
  padding: $space-4;
  margin-top: $space-5;
  display: flex;
  overflow: hidden;
}

.preview-pane__toast-wrapper {
  display: flex;
  width: 100%;

  &--top-left {
    align-items: flex-start;
    justify-content: flex-start;
  }

  &--top-center {
    align-items: flex-start;
    justify-content: center;
  }

  &--top-right {
    align-items: flex-start;
    justify-content: flex-end;
  }

  &--bottom-left {
    align-items: flex-end;
    justify-content: flex-start;
  }

  &--bottom-center {
    align-items: flex-end;
    justify-content: center;
  }

  &--bottom-right {
    align-items: flex-end;
    justify-content: flex-end;
  }
}

.preview-pane__show-btn {
  display: block;
  width: 100%;
  margin-top: $space-4;
  padding: $space-3 $space-4;
  border: none;
  border-radius: $radius-md;
  background-color: var(--accent-primary);
  color: var(--text-on-accent);
  font-size: $font-size-base;
  font-weight: 500;
  cursor: pointer;
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
</style>
