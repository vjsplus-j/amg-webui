import { createApp } from 'vue'
import './style.scss'
import App from './App.vue'
import router from './router'
import {
  ThemeService,
  FontService,
  IconStyleService,
  type DesignStyleName
} from '@amg-webui/theme'
import type { IconStyleName } from '@amg-webui/theme'
import type { FontName } from '@amg-webui/theme'
import { LocaleService } from '@amg-webui/locale'

FontService.init()
IconStyleService.init()
ThemeService.init()
LocaleService.init()

const params = new URLSearchParams(window.location.search)
const design = params.get('design') as DesignStyleName | null
const icon = params.get('icon') as IconStyleName | null
const font = params.get('font') as FontName | null
if (design) ThemeService.setStyle(design)
if (icon) IconStyleService.setStyle(icon)
if (font) FontService.setFont(font)

/** Example debug shell only — disable browser context menu (does not affect library consumers). */
document.addEventListener(
  'contextmenu',
  (e) => {
    e.preventDefault()
  },
  { capture: true }
)

const app = createApp(App)
app.use(router)
app.mount('#app')
