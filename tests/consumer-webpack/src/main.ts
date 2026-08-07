import { createApp, h } from 'vue'
import 'amg-webui/style.css'
import { Button } from 'amg-webui'
import ButtonOd from 'amg-webui/button'
import { sanitizeHtml } from 'amg-webui/security'
import { ThemeStudioShell } from 'amg-webui/theme/studio'

const label = sanitizeHtml('<i>webpack</i>')
void ThemeStudioShell

createApp({
  setup() {
    return () =>
      h('div', [
        h(Button, null, () => label),
        h(ButtonOd, null, () => 'od')
      ])
  }
}).mount('#app')
