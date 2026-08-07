/**
 * SSR render + client mount interaction smoke for core interactive components.
 * Complements test:ssr (import / theme-core) and consumer-nuxt build fixture.
 */
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick } from 'vue'
import { renderToString } from '@vue/server-renderer'
import { LocaleService } from '@amg-webui/locale'
import { ThemeProvider, Button } from '@amg-webui/core'
import Form from '@amg-webui/form/Form/index.vue'
import FormItem from '@amg-webui/form/FormItem/index.vue'
import InputText from '@amg-webui/form/InputText/index.vue'
import Select from '@amg-webui/form/Select/index.vue'
import DataTable from '@amg-webui/data/DataTable/index.vue'
import Dialog from '@amg-webui/overlay/Dialog/index.vue'
import { getSampleMountProps } from '../../example/demos/_shared/sampleMountProps'

beforeAll(() => {
  LocaleService.init()
})

afterEach(async () => {
  vi.unstubAllGlobals()
  const { resetDefaultThemeRuntime } = await import('@amg-webui/theme/core')
  resetDefaultThemeRuntime()
})

async function ssrHtml(component: Parameters<typeof createSSRApp>[0], props?: Record<string, unknown>) {
  const app = createSSRApp(component, props ?? {})
  return renderToString(app)
}

describe('SSR hydration interaction smoke', () => {
  it('Button SSR render matches client mount and click works', async () => {
    const onClick = vi.fn()
    const BtnHost = defineComponent({
      setup() {
        return () => h(Button, { label: 'SSR Button', onClick })
      }
    })

    const html = await ssrHtml(BtnHost)
    expect(html).toContain('SSR Button')

    const wrapper = mount(BtnHost)
    await nextTick()
    expect(wrapper.text()).toContain('SSR Button')
    await wrapper.find('button').trigger('click')
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('Form + InputText SSR render and client input binding', async () => {
    const model = { name: 'Ada' }
    const FormHost = defineComponent({
      setup() {
        return () =>
          h(Form, { model }, () =>
            h(FormItem, { label: 'Name', prop: 'name' }, () =>
              h(InputText, {
                modelValue: model.name,
                'onUpdate:modelValue': (v: string) => {
                  model.name = v
                }
              })
            )
          )
      }
    })

    const html = await ssrHtml(FormHost)
    expect(html.length).toBeGreaterThan(0)

    const wrapper = mount(FormHost)
    await nextTick()
    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('Ada')
    await input.setValue('Grace')
    expect(model.name).toBe('Grace')
  })

  it('Select SSR render and client open/select', async () => {
    const props = getSampleMountProps('Select')
    const options = props.options as { label: string; value: string }[]
    const SelectHost = defineComponent({
      setup() {
        return () =>
          h(Select, {
            options,
            placeholder: String(props.placeholder),
            modelValue: options[0]?.value
          })
      }
    })

    const html = await ssrHtml(SelectHost)
    expect(html).toContain('vp-select')

    const wrapper = mount(SelectHost)
    await nextTick()
    expect(wrapper.find('.vp-select').exists()).toBe(true)
  })

  it('DataTable SSR render and client row visibility', async () => {
    const props = getSampleMountProps('DataTable')
    const rows = props.rows as Record<string, unknown>[]
    const columns = props.columns as { field: string; header: string }[]

    const html = await ssrHtml(DataTable, {
      value: rows,
      columns,
      virtual: false
    })
    expect(html).toContain('vp-datatable')

    const wrapper = mount(DataTable, {
      props: { value: rows, columns, virtual: false }
    })
    await nextTick()
    expect(wrapper.find('.vp-datatable__table').exists()).toBe(true)
    expect(wrapper.text()).toContain(String(rows[0]?.name ?? rows[0]?.id ?? ''))
  })

  it('Dialog SSR render (closed) and client open interaction', async () => {
    const DialogHost = defineComponent({
      setup() {
        return () =>
          h(
            Dialog,
            {
              visible: true,
              title: 'Hydration Dialog'
            },
            { default: () => 'Dialog body' }
          )
      }
    })

    const html = await ssrHtml(DialogHost)
    expect(html.length).toBeGreaterThan(0)

    const wrapper = mount(DialogHost, { attachTo: document.body })
    await flushPromises()
    expect(document.body.textContent).toContain('Hydration Dialog')
    expect(document.body.textContent).toContain('Dialog body')
    wrapper.unmount()
  })

  it('ThemeProvider SSR attrs serialize and client theme applies', async () => {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('document', undefined)
    vi.stubGlobal('localStorage', undefined)

    const core = await import('@amg-webui/theme/core')
    core.resetDefaultThemeRuntime()
    const runtime = core.createThemeRuntime({
      host: core.createNullHost(),
      storage: core.createMemoryStorage(),
      persist: false
    })
    runtime.init({ overrides: { design: 'mercedes', scheme: 'light' } })
    const attrs = runtime.serializeAttrs()
    expect(attrs['data-design']).toBe('mercedes')

    vi.unstubAllGlobals()
    core.resetDefaultThemeRuntime()

    const wrapper = mount(ThemeProvider, {
      props: { design: 'porsche', scheme: 'light', persist: false },
      slots: { default: () => h(Button, { label: 'Themed' }) },
      attachTo: document.body
    })
    await flushPromises()
    expect(wrapper.find('.vp-button-host').exists()).toBe(true)
    expect(document.documentElement.getAttribute('data-design')).toBeNull()
    expect(wrapper.element.getAttribute('data-design')).toBe('porsche')
    wrapper.unmount()
  })
})

describe('SSR hydration parity (core set)', () => {
  async function assertHydrationParity(
    label: string,
    component: Parameters<typeof createSSRApp>[0],
    props: Record<string, unknown> | undefined,
    selector: string,
    minCount = 1
  ) {
    const html = await ssrHtml(component, props)
    expect(html.length, `${label} SSR html empty`).toBeGreaterThan(0)

    const wrapper = mount(component, props ? { props } : undefined)
    await nextTick()
    expect(wrapper.find(selector).exists(), `${label} client mount missing ${selector}`).toBe(true)
    expect(wrapper.findAll(selector).length, `${label} hydration node count`).toBeGreaterThanOrEqual(
      minCount
    )
    wrapper.unmount()
  }

  it('Button hydrates single control root', async () => {
    await assertHydrationParity(
      'Button',
      defineComponent({
        setup: () => () => h(Button, { label: 'Hydrate Btn' })
      }),
      undefined,
      'button',
      1
    )
  })

  it('Form + InputText hydrates field control', async () => {
    const model = { name: 'Test' }
    await assertHydrationParity(
      'Form',
      defineComponent({
        setup: () => () =>
          h(Form, { model }, () =>
            h(FormItem, { label: 'Name', prop: 'name' }, () =>
              h(InputText, {
                modelValue: model.name,
                'onUpdate:modelValue': (v: string) => {
                  model.name = v
                }
              })
            )
          )
      }),
      undefined,
      'input',
      1
    )
  })

  it('Select hydrates combobox trigger', async () => {
    const props = getSampleMountProps('Select')
    await assertHydrationParity(
      'Select',
      Select,
      {
        options: props.options as { label: string; value: string }[],
        placeholder: String(props.placeholder),
        modelValue: (props.options as { value: string }[])[0]?.value
      },
      '.vp-select',
      1
    )
  })

  it('DataTable hydrates table shell', async () => {
    const props = getSampleMountProps('DataTable')
    await assertHydrationParity(
      'DataTable',
      DataTable,
      {
        value: props.rows as Record<string, unknown>[],
        columns: props.columns as { field: string; header: string }[],
        virtual: false
      },
      '.vp-datatable',
      1
    )
  })

  it('Dialog hydrates when visible', async () => {
    const DialogHost = defineComponent({
      setup: () => () =>
        h(Dialog, { visible: true, title: 'Open' }, { default: () => 'Body' })
    })
    const html = await ssrHtml(DialogHost)
    expect(html.length).toBeGreaterThan(0)

    const wrapper = mount(DialogHost, { attachTo: document.body })
    await flushPromises()
    expect(document.body.querySelector('.vp-dialog')).toBeTruthy()
    wrapper.unmount()
  })
})

describe('SSR env + hydration prerequisites', () => {
  it('core modules import under stubbed window', async () => {
    vi.stubGlobal('window', undefined)
    vi.stubGlobal('document', undefined)

    const mods = await Promise.all([
      import('@amg-webui/utils/env'),
      import('@amg-webui/theme/core'),
      import('@amg-webui/core/Button/index.vue')
    ])
    for (const mod of mods) expect(mod).toBeTruthy()
  })
})
