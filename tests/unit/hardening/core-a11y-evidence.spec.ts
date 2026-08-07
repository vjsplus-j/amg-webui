/**
 * Core component a11y evidence — mount real SFCs and run axe-core.
 * Writes A11Y_STRUCTURE + A11Y_CONTRAST into component-hardening/evidence/<Name>/a11y.json
 * @vitest-environment happy-dom
 */
import { beforeAll, describe, expect, it } from 'vitest'
import { mount, config } from '@vue/test-utils'
import { nextTick } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import axe from 'axe-core'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import Button from '@amg-webui/core/Button/index.vue'
import Select from '@amg-webui/form/Select/index.vue'
import Dialog from '@amg-webui/overlay/Dialog/index.vue'
import DatePicker from '@amg-webui/form/DatePicker/index.vue'
import DataTable from '@amg-webui/data/DataTable/index.vue'
import { disposeSortWorker } from '@amg-webui/utils/data-display/sortRows'

const EVIDENCE = join(process.cwd(), 'component-hardening/evidence')

beforeAll(() => {
  LocaleService.init()
  config.global.stubs = {
    teleport: true,
    Transition: false
  }
})

async function analyze(el: Element) {
  const structure = await axe.run(el, {
    rules: { 'color-contrast': { enabled: false } }
  })
  const contrast = await axe.run(el, {
    runOnly: { type: 'rule', values: ['color-contrast'] }
  })
  const count = (violations: axe.Result[]) => ({
    critical: violations.filter((v) => v.impact === 'critical').length,
    serious: violations.filter((v) => v.impact === 'serious').length
  })
  const s = count(structure.violations)
  const c = count(contrast.violations)
  return {
    structure: {
      ...s,
      blocking: s.critical + s.serious,
      violations: structure.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help
      }))
    },
    contrast: {
      ...c,
      blocking: c.critical + c.serious,
      violations: contrast.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        help: v.help
      }))
    }
  }
}

function writeA11y(
  name: string,
  result: Awaited<ReturnType<typeof analyze>>
) {
  const structureStatus = result.structure.blocking === 0 ? 'PASS' : 'FAIL'
  const contrastStatus = result.contrast.blocking === 0 ? 'PASS' : 'FAIL'
  const overall =
    structureStatus === 'PASS' && contrastStatus === 'PASS' ? 'PASS' : 'FAIL'
  const dir = join(EVIDENCE, name)
  mkdirSync(dir, { recursive: true })
  const payload = {
    status: overall,
    A11Y_STRUCTURE: {
      status: structureStatus,
      critical: result.structure.critical,
      serious: result.structure.serious,
      detail: 'axe-core on mounted SFC (unit)',
      violations: result.structure.violations
    },
    A11Y_CONTRAST: {
      status: contrastStatus,
      critical: result.contrast.critical,
      serious: result.contrast.serious,
      detail:
        contrastStatus === 'PASS'
          ? 'axe color-contrast on mounted SFC'
          : 'contrast FAIL — fix tokens or theme; not hidden',
      violations: result.contrast.violations
    },
    detail: `A11Y_STRUCTURE=${structureStatus}; A11Y_CONTRAST=${contrastStatus}`,
    source: 'tests/unit/hardening/core-a11y-evidence.spec.ts',
    updatedAt: new Date().toISOString()
  }
  writeFileSync(join(dir, 'a11y.json'), JSON.stringify(payload, null, 2) + '\n')
  return payload
}

describe('Core a11y evidence (structure + contrast)', () => {
  it('Button', async () => {
    const wrapper = mount(Button, {
      props: { label: 'Save' },
      attachTo: document.body
    })
    await nextTick()
    const result = await analyze(wrapper.element)
    const payload = writeA11y('Button', result)
    expect(payload.A11Y_STRUCTURE.status).toBe('PASS')
    // Contrast must be recorded; FAIL is honest if tokens fail AA
    expect(['PASS', 'FAIL']).toContain(payload.A11Y_CONTRAST.status)
    wrapper.unmount()
  })

  it('Select', async () => {
    const wrapper = mount(Select, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' }
        ],
        placeholder: 'Pick'
      },
      attachTo: document.body
    })
    await nextTick()
    const result = await analyze(wrapper.element)
    const payload = writeA11y('Select', result)
    expect(payload.A11Y_STRUCTURE.status).toBe('PASS')
    wrapper.unmount()
  })

  it('Dialog', async () => {
    const wrapper = mount(Dialog, {
      props: { visible: true, title: 'Confirm', modal: true },
      slots: { default: '<p>Body content</p>' },
      attachTo: document.body
    })
    await nextTick()
    const el =
      document.querySelector('.vp-dialog') ||
      document.querySelector('[role="dialog"]') ||
      wrapper.element
    const result = await analyze(el as Element)
    const payload = writeA11y('Dialog', result)
    expect(payload.A11Y_STRUCTURE.status).toBe('PASS')
    wrapper.unmount()
  })

  it('DatePicker', async () => {
    const wrapper = mount(DatePicker, {
      props: { modelValue: null },
      attachTo: document.body
    })
    await nextTick()
    const result = await analyze(wrapper.element)
    const payload = writeA11y('DatePicker', result)
    expect(payload.A11Y_STRUCTURE.status).toBe('PASS')
    wrapper.unmount()
  })

  it('DataTable', async () => {
    const wrapper = mount(DataTable, {
      props: {
        value: [
          { id: 1, name: 'A' },
          { id: 2, name: 'B' }
        ],
        columns: [
          { field: 'id', header: 'ID', sortable: true },
          { field: 'name', header: 'Name' }
        ],
        virtual: false,
        paginator: false
      },
      attachTo: document.body
    })
    await nextTick()
    const result = await analyze(wrapper.element)
    const payload = writeA11y('DataTable', result)
    expect(payload.A11Y_STRUCTURE.status).toBe('PASS')
    disposeSortWorker()
    wrapper.unmount()
  })
})
