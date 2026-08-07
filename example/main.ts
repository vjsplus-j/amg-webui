import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from './router'
import {
  ThemeService,
  FontService,
  IconStyleService,
  type DesignStyleName,
  type ColorScheme
} from '@amg-webui/theme'
import type { IconStyleName } from '@amg-webui/theme'
import type { FontName } from '@amg-webui/theme'
import { LocaleService } from '@amg-webui/locale'
import { registerExampleDocLocales } from './locale/registerExampleDocLocales'

FontService.init()
IconStyleService.init()
ThemeService.init()
LocaleService.init()
registerExampleDocLocales()

const params = new URLSearchParams(window.location.search)
const design = params.get('design') as DesignStyleName | null
const scheme = params.get('scheme') as ColorScheme | null
const icon = params.get('icon') as IconStyleName | null
const font = params.get('font') as FontName | null
if (design) ThemeService.setStyle(design)
if (scheme === 'dark' || scheme === 'light') ThemeService.setScheme(scheme)
if (icon) IconStyleService.setStyle(icon)
if (font) FontService.setFont(font)

const app = createApp(App)
app.use(router)
app.mount('#app')
