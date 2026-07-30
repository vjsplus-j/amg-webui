import { describe, expect, it, beforeAll } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick, h } from 'vue'
import { LocaleService } from '@amg-webui/locale'
import Button from '../../../packages/components/base/Button/index.vue'
import Select from '../../../packages/components/base/Select/index.vue'
import DataTable from '../../../packages/components/base/DataTable/index.vue'
import Tree from '../../../packages/components/base/Tree/index.vue'
import Dialog from '../../../packages/components/base/Dialog/index.vue'
import Form from '../../../packages/components/base/Form/index.vue'
import FormItem from '../../../packages/components/base/FormItem/index.vue'
import InputText from '../../../packages/components/base/InputText/index.vue'
import { getSampleMountProps } from '../../../example/demos/_shared/sampleMountProps'

beforeAll(() => {
  LocaleService.init()
})

describe('v0.1 component smoke mounts', () => {
  it('mounts Button', async () => {
    const wrapper = mount(Button, {
      props: { label: 'Smoke', severity: 'primary' }
    })
    await nextTick()
    expect(wrapper.find('.vp-button-host').exists()).toBe(true)
    expect(wrapper.text()).toContain('Smoke')
  })

  it('mounts Select with options', async () => {
    const props = getSampleMountProps('Select')
    const wrapper = mount(Select, {
      props: {
        options: props.options as { label: string; value: string }[],
        placeholder: String(props.placeholder)
      }
    })
    await nextTick()
    expect(wrapper.find('.p-select').exists()).toBe(true)
  })

  it('mounts DataTable with small row set', async () => {
    const props = getSampleMountProps('DataTable')
    const wrapper = mount(DataTable, {
      props: {
        value: props.rows as Record<string, unknown>[],
        columns: props.columns as { field: string; header: string }[],
        virtual: false
      }
    })
    await nextTick()
    expect(wrapper.find('.vp-datatable').exists()).toBe(true)
    expect(wrapper.find('.vp-datatable__table').exists()).toBe(true)
  })

  it('mounts Tree with options', async () => {
    const props = getSampleMountProps('Tree')
    const wrapper = mount(Tree, {
      props: {
        options: props.options as { label: string; value: string }[],
        modelValue: []
      }
    })
    await nextTick()
    expect(wrapper.find('.vp-tree').exists()).toBe(true)
  })

  it('mounts Dialog when visible', async () => {
    const wrapper = mount(Dialog, {
      props: {
        visible: true,
        title: 'Smoke dialog'
      },
      attachTo: document.body,
      slots: {
        default: () => 'Dialog body'
      }
    })
    await nextTick()
    expect(document.body.querySelector('.vp-dialog')).toBeTruthy()
    wrapper.unmount()
  })

  it('mounts Form with FormItem slot', async () => {
    const model = { username: 'demo' }
    const wrapper = mount(Form, {
      props: { model },
      slots: {
        default: () =>
          h(FormItem, { label: 'Username', prop: 'username' }, () =>
            h(InputText, {
              modelValue: model.username,
              'onUpdate:modelValue': (v: string) => {
                model.username = v
              }
            })
          )
      }
    })
    await nextTick()
    expect(wrapper.find('.vp-form').exists()).toBe(true)
    expect(wrapper.find('.vp-form-item').exists()).toBe(true)
  })
})
