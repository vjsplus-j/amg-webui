import { createApp, h } from 'vue'
import 'amg-webui/style.css'
import { Button, ThemeService } from 'amg-webui'
import ButtonOd from 'amg-webui/button'
import DataTable from 'amg-webui/data-table'
import { sanitizeHtml } from 'amg-webui/security'
import { createComponentRegistry } from 'amg-webui/lowcode'
import { isClient } from 'amg-webui/utils/env'
import { useFocusTrap } from 'amg-webui/hooks/useFocusTrap'
import { ThemeService as ThemeFromSubpath } from 'amg-webui/theme'

const safe = sanitizeHtml('<b>ok</b><script>x</script>')
const registry = createComponentRegistry()
void registry
void ThemeService
void ThemeFromSubpath
void useFocusTrap
void DataTable
void ButtonOd

createApp({
  setup() {
    return () =>
      h('div', { class: 'consumer-vite' }, [
        h(Button, null, () => `vite:${isClient() ? 'client' : 'ssr'}:${safe}`)
      ])
  }
}).mount('#app')
