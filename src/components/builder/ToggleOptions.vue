<script setup lang="ts">
defineProps<{
  showIcon: boolean
  showCloseButton: boolean
}>()

const emit = defineEmits<{
  toggleIcon: []
  toggleCloseButton: []
}>()
</script>

<template>
  <fieldset class="toggle-options">
    <legend class="field-legend">Options</legend>
    <div class="toggle-options__row">
      <label class="toggle-options__item">
        <input
          type="checkbox"
          :checked="showIcon"
          @change="emit('toggleIcon')"
        />
        <span>Show Icon</span>
      </label>
      <label class="toggle-options__item">
        <input
          type="checkbox"
          :checked="showCloseButton"
          @change="emit('toggleCloseButton')"
        />
        <span>Show Close Button</span>
      </label>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.toggle-options {
  border: none;
  padding: 0;
  margin: 0;
}

.toggle-options__row {
  display: flex;
  align-items: center;
  gap: $space-5;
}

.toggle-options__item {
  display: flex;
  align-items: center;
  gap: $space-3;
  font-size: $font-size-sm;
  color: var(--text-secondary);
  cursor: pointer;

  input[type='checkbox'] {
    accent-color: var(--accent-primary);
    cursor: pointer;
  }
}
</style>
