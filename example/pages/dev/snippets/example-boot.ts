import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {
  ThemeService,
  FontService,
  IconStyleService,
  type DesignStyleName
} from 'amg-webui/theme'
import type { IconStyleName, FontName } from 'amg-webui/theme'
import { LocaleService } from 'amg-webui/locale'

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

createApp(App).use(router).mount('#app')
