import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { useThemeStore } from './stores/theme'
import './styles/main.scss'

const app = createApp(App)

app.use(createPinia())
useThemeStore()

app.mount('#app')
