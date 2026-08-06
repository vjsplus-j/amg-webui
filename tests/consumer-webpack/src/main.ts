import { createApp, h } from 'vue'
import 'amg-webui/style.css'
import { Button } from 'amg-webui'
import ButtonOd from 'amg-webui/button'
import { sanitizeHtml } from 'amg-webui/security'

const label = sanitizeHtml('<i>webpack</i>')

createApp({
  setup() {
    return () =>
      h('div', [
        h(Button, null, () => label),
        h(ButtonOd, null, () => 'od')
      ])
  }
}).mount('#app')
