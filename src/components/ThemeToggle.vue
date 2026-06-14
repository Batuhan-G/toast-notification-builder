<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import SunIcon from '@/components/icons/SunIcon.vue'
import MoonIcon from '@/components/icons/MoonIcon.vue'

const themeStore = useThemeStore()

const isDark = computed<boolean>(() => themeStore.theme === 'dark')
</script>

<template>
  <button
    class="theme-toggle"
    :aria-pressed="isDark"
    aria-label="Toggle dark mode"
    @click="themeStore.toggle()"
  >
    <SunIcon v-if="isDark" />
    <MoonIcon v-else />
  </button>
</template>

<style scoped lang="scss">
@use '@/styles/variables' as *;

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 1px solid var(--border-default);
  border-radius: $radius-md;
  background-color: var(--bg-elevated);
  color: var(--text-primary);
  cursor: pointer;
  transition:
    background-color 150ms ease,
    border-color 150ms ease;

  &:hover {
    border-color: var(--border-strong);
    background-color: var(--bg-surface);
  }

  &:focus-visible {
    outline: 2px solid var(--border-focus);
    outline-offset: 2px;
  }
}
</style>
