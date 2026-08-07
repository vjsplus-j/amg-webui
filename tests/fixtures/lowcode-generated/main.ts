import { createApp } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import '@amg-webui/theme/styles/index.scss'
import GeneratedPage from './GeneratedPage.vue'

LocaleService.init()
createApp(GeneratedPage).mount('#app')
