<script setup lang="ts">
import { useNotificationsStore } from '@/stores/notifications'
import { POSITIONS } from '@/constants'
import ToastItem from './ToastItem.vue'

const notifications = useNotificationsStore()
</script>

<template>
  <Teleport to="body">
    <div class="toast-overlay">
      <div
        v-for="position in POSITIONS"
        :key="position"
        class="toast-container"
        :class="`toast-container--${position}`"
      >
        <TransitionGroup name="toast" tag="div" class="toast-stack" aria-live="polite" aria-atomic="false">
          <ToastItem
            v-for="toast in notifications.byPosition[position]"
            :key="toast.id"
            :config="toast"
            @close="notifications.dismiss(toast.id)"
          />
        </TransitionGroup>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.toast-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: $z-toast;
}

.toast-container {
  position: fixed;
  display: flex;
  padding: $space-4;
  pointer-events: none;
}

.toast-stack {
  display: flex;
  flex-direction: column;
  gap: $space-2;
}

.toast-container--top-left {
  top: 0;
  left: 0;
}

.toast-container--top-center {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.toast-container--top-right {
  top: 0;
  right: 0;
}

.toast-container--bottom-left {
  bottom: 0;
  left: 0;

  .toast-stack {
    flex-direction: column-reverse;
  }
}

.toast-container--bottom-center {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);

  .toast-stack {
    flex-direction: column-reverse;
  }
}

.toast-container--bottom-right {
  bottom: 0;
  right: 0;

  .toast-stack {
    flex-direction: column-reverse;
  }
}
</style>
