import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { bootstrapAmgRuntime } from '@showcase/shared/setup/bootstrap'
import './style.scss'

bootstrapAmgRuntime()

createApp(App).use(router).mount('#app')
