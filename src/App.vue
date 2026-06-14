<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
import ConfigPanel from '@/components/builder/ConfigPanel.vue'
import PreviewPane from '@/components/preview/PreviewPane.vue'
import ToastContainer from '@/components/toast/ToastContainer.vue'
</script>

<template>
  <div class="app">
    <header class="app__header">
      <div class="app__header-inner">
        <h1 class="app__title">Toast Notification Builder</h1>
        <ThemeToggle />
      </div>
    </header>
    <main class="app__content">
      <div class="app__grid">
        <ConfigPanel />
        <PreviewPane />
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
}

.app__header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.app__title {
  font-size: $font-size-xl;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.app__content {
  max-width: $layout-max-width;
  margin: $space-6 auto;
  padding: 0 $space-6;
}

.app__grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: $layout-gap;
  align-items: start;
}

@media (max-width: 900px) {
  .app__grid {
    grid-template-columns: 1fr;
  }
}
</style>
