import { createApp } from 'vue'
import App from './App.vue'
import 'amg-webui/style.css'
import { ThemeService } from 'amg-webui/theme'

ThemeService.init({ overrides: { design: 'linear', scheme: 'light' } })

createApp(App).mount('#app')
