import { createApp, h } from 'vue'
/** On-demand CSS only — no root `amg-webui/style.css`. */
import 'amg-webui/button/style.css'
import ButtonOd from 'amg-webui/button'
import { sanitizeHtml } from 'amg-webui/security'
import { isClient } from 'amg-webui/utils/env'

const safe = sanitizeHtml('<b>ok</b><script>x</script>')

createApp({
  setup() {
    return () =>
      h('div', { class: 'consumer-vite-ondemand-css' }, [
        h(ButtonOd, null, () => `ondemand-css:${isClient() ? 'client' : 'ssr'}:${safe}`)
      ])
  }
}).mount('#app')
