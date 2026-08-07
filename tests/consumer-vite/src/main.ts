import { createApp, h } from 'vue'
import type { DataTableProps, DataTableInstance, Column } from 'amg-webui/data'
import 'amg-webui/style.css'
import { Button, ThemeService } from 'amg-webui'
import { Button as ButtonFromCore } from 'amg-webui/core'
import { InputText, Select } from 'amg-webui/form'
import { DataTable, Tree } from 'amg-webui/data'
import { Dialog } from 'amg-webui/overlay'
import ButtonOd from 'amg-webui/button'
import DataTableOd from 'amg-webui/data-table'
import { sanitizeHtml } from 'amg-webui/security'
import { createComponentRegistry } from 'amg-webui/lowcode'
import { isClient } from 'amg-webui/utils/env'
import { useFocusTrap } from 'amg-webui/hooks/useFocusTrap'
import { ThemeService as ThemeFromSubpath } from 'amg-webui/theme'
import { ThemeStudioShell } from 'amg-webui/theme/studio'

const safe = sanitizeHtml('<b>ok</b><script>x</script>')
const registry = createComponentRegistry()
void registry
void ThemeService
void ThemeFromSubpath
void ThemeStudioShell
void useFocusTrap
void DataTable
void DataTableOd
void ButtonOd
void ButtonFromCore
void InputText
void Select
void Tree
void Dialog

const columns = [{ field: 'id', header: 'ID' }] satisfies Column[]
const tableProps = { value: [], columns } satisfies Partial<DataTableProps>
void tableProps
type _Instance = DataTableInstance
void null as unknown as _Instance

createApp({
  setup() {
    return () =>
      h('div', { class: 'consumer-vite' }, [
        h(Button, null, () => `vite:${isClient() ? 'client' : 'ssr'}:${safe}`)
      ])
  }
}).mount('#app')
