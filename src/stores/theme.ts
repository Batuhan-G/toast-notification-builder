import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Theme } from '@/types/notification'
import { loadTheme, saveTheme } from '@/utils/storage'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(loadTheme())

  document.documentElement.dataset.theme = theme.value

  function toggle(): void {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
  }

  watch(theme, (newTheme: Theme) => {
    document.documentElement.dataset.theme = newTheme
    saveTheme(newTheme)
  })

  return { theme, toggle }
})
