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
  background-color: $color-card-bg;
  border-bottom: 1px solid $color-card-border;
  padding: $space-md $space-lg;

  h1 {
    max-width: $layout-max-width;
    margin: 0 auto;
    font-size: 1.25rem;
    font-weight: 600;
  }
}

.app__content {
  max-width: $layout-max-width;
  margin: $space-lg auto;
  padding: 0 $space-lg;
}
</style>
