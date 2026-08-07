import DefaultTheme from 'vitepress/theme'
import { ThemeService, FontService, IconStyleService } from '@amg-webui/theme'
import { LocaleService } from '@amg-webui/locale'
import DocsDemo from './DocsDemo.vue'
import './amg-docs.scss'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    FontService.init()
    IconStyleService.init()
    ThemeService.init({ design: 'linear', scheme: 'light' })
    LocaleService.init()
    app.component('DocsDemo', DocsDemo)
  }
}
