import { createApp } from 'vue'
import { createSSRApp } from 'vue'
import App from './App.vue'
import 'amg-webui/style.css'
import { ThemeService } from 'amg-webui/theme'

// Call ThemeService only in client entry / onMounted.
// Prefer amg-webui/theme/core for SSR-safe theme state without DOM writes.

export function createClientApp() {
  ThemeService.init({ overrides: { design: 'linear', scheme: 'light' } })
  return createApp(App)
}

export function createServerApp() {
  return createSSRApp(App)
}
