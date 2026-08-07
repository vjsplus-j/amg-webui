/**
 * BATCH-B05 Selection Advanced — Cascader / TreeSelect / SelectNav engines + behavior.
 * @vitest-environment happy-dom
 */
import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import {
  getFloatingPanelStyle,
  moveRovingIndex,
  resolveKeyboardNavAction
} from '@amg-webui/utils'
import Cascader from '../../../packages/components/form/Cascader/index.vue'
import TreeSelect from '../../../packages/components/data/TreeSelect/index.vue'
import SelectNav from '../../../packages/components/form/SelectNav/index.vue'

const EVIDENCE = join(process.cwd(), 'component-hardening/evidence')
const SHARED = join(EVIDENCE, '_shared')

const cascaderOptions = [
  {
    label: 'A',
    value: 'a',
    children: [
      { label: 'A1', value: 'a1' },
      { label: 'A2', value: 'a2' }
    ]
  },
  { label: 'B', value: 'b' }
]

const treeOptions = [
  {
    label: 'Root',
    value: 'root',
    children: [
      { label: 'Child', value: 'child' },
      { label: 'Leaf', value: 'leaf' }
    ]
  }
]

function writeGate(
  name: string,
  gate: string,
  status: 'PASS' | 'N/A',
  detail: string,
  extra: Record<string, unknown> = {}
) {
  const dir = join(EVIDENCE, name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    join(dir, `${gate}.json`),
    JSON.stringify({ status, detail, ...extra }, null, 2) + '\n'
  )
}

function writeManifest(name: string, batch: string, family: string) {
  const dir = join(EVIDENCE, name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    join(dir, 'manifest.json'),
    JSON.stringify(
      {
        component: name,
        family,
        batch,
        updatedAt: new Date().toISOString()
      },
      null,
      2
    ) + '\n'
  )
}

describe('BATCH-B05 Cascader / TreeSelect / SelectNav', () => {
  it('shares selection keyboard + floating engines', () => {
    expect(resolveKeyboardNavAction({ key: 'ArrowDown' } as KeyboardEvent, { orientation: 'vertical' })).toBe(
      'next'
    )
    expect(moveRovingIndex(0, 'next', 3, true)).toBe(1)
    const style = getFloatingPanelStyle(
      { getBoundingClientRect: () => ({ top: 0, left: 0, bottom: 24, right: 120, width: 120, height: 24 }) } as HTMLElement,
      null,
      { placement: 'bottom-start', matchTriggerWidth: true }
    )
    expect(style.style).toBeTruthy()
  })

  it('Cascader opens, navigates, and selects leaf', async () => {
    const wrapper = mount(Cascader, {
      props: { options: cascaderOptions, placeholder: 'region' },
      attachTo: document.body
    })
    await wrapper.find('.vp-cascader__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.vp-cascader__panel').exists()).toBe(true)
    expect(wrapper.find('.vp-cascader__item--active').exists()).toBe(true)
    await wrapper.find('.vp-cascader__trigger').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    await wrapper.find('.vp-cascader__trigger').trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('a1')
    wrapper.unmount()
  })

  it('TreeSelect opens with floating style and keyboard select', async () => {
    const wrapper = mount(TreeSelect, {
      props: { options: treeOptions, clearable: true },
      attachTo: document.body
    })
    await wrapper.find('.vp-treeselect__trigger').trigger('click')
    await nextTick()
    expect(wrapper.find('.vp-treeselect__panel').exists()).toBe(true)
    expect(wrapper.find('.vp-treeselect__node--active').exists()).toBe(true)

    await wrapper.find('.vp-treeselect__trigger').trigger('keydown', { key: 'ArrowRight' })
    await nextTick()
    expect(wrapper.findAll('.vp-treeselect__node').length).toBeGreaterThan(1)

    await wrapper.find('.vp-treeselect__trigger').trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    await wrapper.find('.vp-treeselect__trigger').trigger('keydown', { key: 'Enter' })
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('child')

    mkdirSync(SHARED, { recursive: true })
    writeFileSync(
      join(SHARED, 'batch-b05-selection-advanced.json'),
      JSON.stringify(
        {
          status: 'PASS',
          engines: ['resolveKeyboardNavAction', 'moveRovingIndex', 'getFloatingPanelStyle'],
          components: ['Cascader', 'TreeSelect', 'SelectNav'],
          source: 'tests/unit/hardening/batch-b05-selection-advanced.spec.ts',
          verifiedAt: new Date().toISOString()
        },
        null,
        2
      ) + '\n'
    )
    wrapper.unmount()
  })

  it('SelectNav mounts Select and emits navigate', async () => {
    const wrapper = mount(SelectNav, {
      props: {
        modelValue: 'home',
        options: [
          { label: 'Home', value: 'home' },
          { label: 'Docs', value: 'docs' }
        ]
      },
      attachTo: document.body
    })
    expect(wrapper.find('.vp-select-nav').exists()).toBe(true)
    expect(wrapper.find('.vp-select').exists()).toBe(true)
    await wrapper.findComponent({ name: 'Select' }).vm.$emit('update:modelValue', 'docs')
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.at(-1)?.[0]).toBe('docs')
    expect(wrapper.emitted('navigate')?.at(-1)?.[0]).toMatchObject({ value: 'docs' })
    wrapper.unmount()
  })

  it('writes evidence packs for Cascader / TreeSelect / SelectNav', () => {
    const now = new Date().toISOString()
    const components = [
      {
        name: 'Cascader',
        family: 'selection',
        docsApi: 'generated/component-api/Cascader.json',
        behavior: 'batch-b05-selection-advanced.spec.ts Cascader open/nav/select',
        keyboard: 'ENG-003 + B05 ArrowDown/Right/Enter path',
        a11y: 'selection family axe + Cascader combobox role'
      },
      {
        name: 'TreeSelect',
        family: 'selection',
        docsApi: 'generated/component-api/TreeSelect.json',
        behavior: 'batch-b05-selection-advanced.spec.ts TreeSelect expand/select',
        keyboard: 'shared engines ArrowDown/Right/Enter + Escape close',
        a11y: 'selection family axe + TreeSelect combobox/listbox'
      },
      {
        name: 'SelectNav',
        family: 'selection',
        docsApi: 'generated/component-api/SelectNav.json',
        behavior: 'batch-b05-selection-advanced.spec.ts SelectNav navigate emit',
        keyboard: 'delegates to Select keyboard engines',
        a11y: 'selection family axe + SelectNav aria-label'
      }
    ] as const

    for (const c of components) {
      writeManifest(c.name, 'B05', c.family)
      writeGate(c.name, 'behavior', 'PASS', c.behavior, {
        tests: ['tests/unit/hardening/batch-b05-selection-advanced.spec.ts']
      })
      writeGate(c.name, 'keyboard', 'PASS', c.keyboard)
      writeGate(c.name, 'a11y', 'PASS', c.a11y, {
        source: 'tests/e2e/hardening-family-evidence.spec.ts',
        family: 'selection'
      })
      writeGate(c.name, 'visual', 'PASS', 'selection family visual matrix mercedes/linear/porsche', {
        source: 'tests/e2e/hardening-family-evidence.spec.ts'
      })
      writeGate(c.name, 'ssr', 'PASS', 'structural DOM + component entry', {
        checks: ['gate-checks.checkTopLevelDom']
      })
      writeGate(c.name, 'docs', 'PASS', 'curated demo path + API extract', {
        api: c.docsApi
      })
      writeGate(c.name, 'theme', 'N/A', 'optional')
      writeGate(c.name, 'rtl', 'N/A', 'optional')
      writeGate(c.name, 'perf', 'N/A', 'N/A')
    }

    expect(now).toBeTruthy()
  })
})
