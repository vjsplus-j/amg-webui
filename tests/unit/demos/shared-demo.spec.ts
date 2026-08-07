import { describe, expect, it, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import { ThemeService } from '@amg-webui/theme'
import {
  sharedDemoRegistry,
  sharedDemoIds,
  type SharedDemoId
} from '@amg-webui/demos/registry'

beforeAll(() => {
  LocaleService.init()
  ThemeService.init({ design: 'linear', scheme: 'light' })
})

describe('shared demos SSOT', () => {
  it('registers all v0.1 core demo ids', () => {
    const expected: SharedDemoId[] = [
      'button-basic',
      'input-text-basic',
      'select-basic',
      'checkbox-basic',
      'radio-basic',
      'switch-basic',
      'date-picker-basic',
      'form-basic',
      'data-table-basic',
      'tree-basic',
      'dialog-basic',
      'drawer-basic',
      'tabs-basic',
      'menu-basic',
      'pagination-basic',
      'upload-basic'
    ]
    expect(sharedDemoIds.sort()).toEqual(expected.sort())
    for (const id of expected) {
      expect(sharedDemoRegistry[id]?.component).toBeTruthy()
      expect(sharedDemoRegistry[id]?.source).toContain('<script')
    }
  })

  it('mounts button-basic interactively', async () => {
    const entry = sharedDemoRegistry['button-basic']
    const wrapper = mount(entry.component, { attachTo: document.body })
    await nextTick()
    expect(wrapper.find('.vp-button-host').exists()).toBe(true)
    expect(entry.source).toContain('LocaleKeys.button.confirm')
    wrapper.unmount()
  })
})
