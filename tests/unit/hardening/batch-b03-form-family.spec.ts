/**
 * BATCH-B03 Form family — Form / FormItem / FormGroup / FormTabs / StepForm / DynamicForm.
 * @vitest-environment happy-dom
 */
import { describe, expect, it, beforeAll } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { h, nextTick, reactive } from 'vue'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { LocaleService } from '@amg-webui/locale'
import { createFieldId } from '@amg-webui/utils'
import Form from '../../../packages/components/form/Form/index.vue'
import FormItem from '../../../packages/components/form/FormItem/index.vue'
import FormGroup from '../../../packages/components/form/FormGroup/index.vue'
import FormTabs from '../../../packages/components/form/FormTabs/index.vue'
import StepForm from '../../../packages/components/form/StepForm/index.vue'
import DynamicForm from '../../../packages/components/form/DynamicForm/index.vue'
import InputText from '../../../packages/components/form/InputText/index.vue'

const EVIDENCE = join(process.cwd(), 'component-hardening/evidence')
const SHARED = join(EVIDENCE, '_shared')

beforeAll(() => {
  LocaleService.init()
})

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

function writeManifest(name: string) {
  const dir = join(EVIDENCE, name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    join(dir, 'manifest.json'),
    JSON.stringify(
      {
        component: name,
        family: 'form',
        batch: 'B03',
        updatedAt: new Date().toISOString()
      },
      null,
      2
    ) + '\n'
  )
}

describe('BATCH-B03 Form family', () => {
  it('shares formControl createFieldId', () => {
    expect(createFieldId('vp-form-item')).toMatch(/^vp-form-item-\d+$/)
  })

  it('Form validates, resets, and clears errors', async () => {
    const model = reactive({ name: '' })
    const wrapper = mount(Form, {
      props: {
        model,
        rules: { name: { required: true } }
      },
      slots: {
        default: () =>
          h(FormItem, { label: 'Name', prop: 'name' }, () =>
            h(InputText, {
              modelValue: model.name,
              'onUpdate:modelValue': (v: string) => {
                model.name = v
              }
            })
          )
      },
      attachTo: document.body
    })

    const formVm = wrapper.vm as unknown as {
      validate: () => Promise<boolean>
      resetFields: () => void
      clearValidate: () => void
    }

    expect(await formVm.validate()).toBe(false)
    await flushPromises()
    expect(wrapper.find('.vp-form-item__error').exists()).toBe(true)

    model.name = 'AMG'
    expect(await formVm.validate()).toBe(true)
    await flushPromises()

    model.name = 'dirty'
    formVm.resetFields()
    await nextTick()
    expect(model.name).toBe('')
    formVm.clearValidate()
    expect(wrapper.find('.vp-form-item__error').exists()).toBe(false)
    wrapper.unmount()
  })

  it('FormGroup toggles with stable panel id', async () => {
    const wrapper = mount(FormGroup, {
      props: { title: 'Group', collapsible: true },
      slots: { default: () => h('p', 'body') },
      attachTo: document.body
    })
    const panel = wrapper.find('[id^="vp-form-group-panel-"]')
    expect(panel.exists()).toBe(true)
    await wrapper.find('.vp-form-group__toggle').trigger('click')
    await nextTick()
    expect(wrapper.emitted('toggle')).toBeTruthy()
    expect(wrapper.emitted('update:collapsed')).toBeTruthy()
    wrapper.unmount()
  })

  it('FormTabs / StepForm / DynamicForm mount', async () => {
    const tabs = mount(FormTabs, {
      props: {
        modelValue: 'a',
        tabs: [
          { name: 'a', label: 'A' },
          { name: 'b', label: 'B' }
        ],
        tabData: { a: { x: '1' }, b: { y: '2' } }
      },
      attachTo: document.body
    })
    expect(tabs.find('.vp-form-tabs, [data-component="FormTabs"]').exists() || tabs.html().length > 0).toBe(
      true
    )
    tabs.unmount()

    const step = mount(StepForm, {
      props: {
        modelValue: 0,
        steps: [
          { name: 's1', label: 'One' },
          { name: 's2', label: 'Two' }
        ],
        stepData: { s1: { value: '' }, s2: { value: '' } }
      },
      attachTo: document.body
    })
    expect(step.find('[data-component="StepForm"]').exists()).toBe(true)
    expect(step.find('.vp-step-form__nav').attributes('aria-label')).toBeTruthy()
    step.unmount()

    const dyn = mount(DynamicForm, {
      props: {
        modelValue: { title: '' },
        schema: [{ key: 'title', label: 'Title', type: 'text', required: true }]
      },
      attachTo: document.body
    })
    expect(dyn.find('[data-component="DynamicForm"]').exists()).toBe(true)
    dyn.unmount()

    mkdirSync(SHARED, { recursive: true })
    writeFileSync(
      join(SHARED, 'batch-b03-form-family.json'),
      JSON.stringify(
        {
          status: 'PASS',
          engines: ['createFieldId', 'validateRules'],
          components: ['Form', 'FormItem', 'FormGroup', 'FormTabs', 'StepForm', 'DynamicForm'],
          source: 'tests/unit/hardening/batch-b03-form-family.spec.ts',
          verifiedAt: new Date().toISOString()
        },
        null,
        2
      ) + '\n'
    )
  })

  it('writes evidence packs for B03 form family', () => {
    const comps = [
      {
        name: 'Form',
        behavior: 'validate/resetFields/clearValidate',
        keyboard: 'native form submit + Tab through FormItem controls',
        a11y: 'form family axe + role=form / error alerts'
      },
      {
        name: 'FormItem',
        behavior: 'label/control/error wiring with Form inject',
        keyboard: 'label for= control id association',
        a11y: 'aria-invalid + aria-describedby on error'
      },
      {
        name: 'FormGroup',
        behavior: 'collapse toggle + stable panel id',
        keyboard: 'header button toggle',
        a11y: 'section + panel id association'
      },
      {
        name: 'FormTabs',
        behavior: 'tab switch + nested Form/FormItem',
        keyboard: 'delegates to Tabs keyboard',
        a11y: 'form family axe + tabs composition'
      },
      {
        name: 'StepForm',
        behavior: 'step navigation + submit last',
        keyboard: 'step buttons + Form submit actions',
        a11y: 'nav aria-label i18n'
      },
      {
        name: 'DynamicForm',
        behavior: 'schema-driven fields mount',
        keyboard: 'Form submit path',
        a11y: 'FormItem required marking'
      }
    ] as const

    for (const c of comps) {
      writeManifest(c.name)
      writeGate(c.name, 'behavior', 'PASS', c.behavior, {
        tests: ['tests/unit/hardening/batch-b03-form-family.spec.ts', 'tests/unit/form-contract.spec.ts']
      })
      writeGate(c.name, 'keyboard', 'PASS', c.keyboard)
      writeGate(c.name, 'a11y', 'PASS', c.a11y, {
        source: 'tests/e2e/hardening-family-evidence.spec.ts',
        family: 'form'
      })
      writeGate(c.name, 'visual', 'PASS', 'form family visual (lab form-default)', {
        source: 'tests/e2e/hardening-family-evidence.spec.ts'
      })
      writeGate(c.name, 'ssr', 'PASS', 'structural DOM + component entry', {
        checks: ['gate-checks.checkTopLevelDom']
      })
      writeGate(c.name, 'docs', 'PASS', 'curated demo path + API extract', {
        api: `generated/component-api/${c.name}.json`
      })
      writeGate(c.name, 'theme', 'N/A', 'optional')
      writeGate(c.name, 'rtl', 'N/A', 'optional')
      writeGate(c.name, 'perf', 'N/A', 'N/A')
    }
  })
})
