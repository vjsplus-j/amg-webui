import { ref, watch, type Ref } from 'vue'
import type { BizSettingsSection } from '../types'

export function useSettingsTabs(controlled?: Ref<BizSettingsSection | undefined>) {
  const section = ref<BizSettingsSection>(controlled?.value ?? 'general')

  if (controlled) {
    watch(controlled, (v) => {
      if (v) section.value = v
    })
  }

  function setSection(next: BizSettingsSection) {
    section.value = next
  }

  return { section, setSection }
}
