<script setup lang="ts">
</script>

<template>
  <div class="app">
    <header class="app__header">
      <h1>Toast Notification Builder</h1>
    </header>
    <main class="app__content">
      <!-- ConfigPanel and PreviewPane will be added in Phase 4 -->
    </main>
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
</style>
