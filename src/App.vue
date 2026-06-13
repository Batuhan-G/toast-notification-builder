<script setup lang="ts">
import { useBuilderStore } from '@/stores/builder'
import { useNotificationsStore } from '@/stores/notifications'
import ToastContainer from '@/components/toast/ToastContainer.vue'

const builder = useBuilderStore()
const notifications = useNotificationsStore()

function showTestToast(): void {
  const config = { ...builder.config }
  if (!config.title) config.title = 'Test Notification'
  if (!config.message) config.message = 'This is a test toast message.'
  notifications.show(config)
}
</script>

<template>
  <div class="app">
    <header class="app__header">
      <h1>Toast Notification Builder</h1>
    </header>
    <main class="app__content">
      <!-- Temporary dev controls — removed in Phase 4 -->
      <div class="dev-controls">
        <button @click="showTestToast">Show Test Toast</button>
        <button @click="builder.setType('error')">Set Error</button>
        <button @click="builder.setType('warning')">Set Warning</button>
        <button @click="builder.setType('info')">Set Info</button>
        <button @click="builder.setType('success')">Set Success</button>
        <button @click="builder.setAnimation('slide')">Slide</button>
        <button @click="builder.setAnimation('bounce')">Bounce</button>
        <button @click="builder.setAnimation('fade')">Fade</button>
        <button @click="builder.setDuration(0)">Persistent</button>
        <button @click="builder.setDuration(3000)">3s</button>
        <button @click="notifications.clearAll()">Clear All</button>
      </div>
    </main>
    <ToastContainer />
  </div>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.app__header {
  background-color: var(--bg-surface);
  border-bottom: 1px solid var(--border-default);
  padding: $space-4 $space-6;

  h1 {
    max-width: $layout-max-width;
    margin: 0 auto;
    font-size: $font-size-xl;
    font-weight: 600;
  }
}

.app__content {
  max-width: $layout-max-width;
  margin: $space-6 auto;
  padding: 0 $space-6;
}

.dev-controls {
  display: flex;
  flex-wrap: wrap;
  gap: $space-2;
  padding: $space-4;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-default);
  border-radius: $radius-lg;

  button {
    padding: $space-2 $space-4;
    border: 1px solid var(--border-default);
    border-radius: $radius-sm;
    background-color: var(--bg-elevated);
    color: var(--text-primary);
    cursor: pointer;
    font-size: $font-size-sm;

    &:hover {
      background-color: var(--accent-primary);
      color: var(--text-on-accent);
    }
  }
}
</style>
