import { beforeAll, describe, expect, it } from 'vitest'

import { mount, flushPromises } from '@vue/test-utils'

import { nextTick, reactive, h } from 'vue'

import { LocaleService } from '@amg-webui/locale'

import Form from '@amg-webui/form/Form/index.vue'

import FormItem from '@amg-webui/form/FormItem/index.vue'

import InputText from '@amg-webui/form/InputText/index.vue'

import Search from '@amg-webui/form/Search/index.vue'

import YearPicker from '@amg-webui/form/YearPicker/index.vue'

import CheckboxGroup from '@amg-webui/form/CheckboxGroup/index.vue'



beforeAll(() => {

  LocaleService.init()

})



describe('Form + FormItem + InputText a11y contract', () => {

  it('wires aria-invalid and aria-describedby when validation fails', async () => {

    const model = reactive({ email: '' })

    const wrapper = mount(Form, {

      props: {

        model,

        rules: {

          email: { required: true }

        }

      },

      slots: {

        default: () =>

          h(FormItem, { label: 'Email', prop: 'email' }, () =>

            h(InputText, {

              modelValue: model.email,

              'onUpdate:modelValue': (v: string) => {

                model.email = v

              }

            })

          )

      }

    })



    await wrapper.find('form').trigger('submit.prevent')

    await flushPromises()

    await nextTick()



    const input = wrapper.get('input')

    expect(input.attributes('aria-invalid')).toBe('true')

    const describedBy = input.attributes('aria-describedby')

    expect(describedBy).toBeTruthy()



    const errorEl = wrapper.get(`#${describedBy}`)

    expect(errorEl.attributes('role')).toBe('alert')

    expect(errorEl.text().length).toBeGreaterThan(0)



    const control = wrapper.get('.vp-form-item__control')

    expect(control.attributes('aria-invalid')).toBe('true')

    expect(control.attributes('aria-describedby')).toBe(describedBy)

  })



  it('clears aria-invalid after the field becomes valid', async () => {

    const model = reactive({ name: '' })

    const wrapper = mount(Form, {

      props: {

        model,

        rules: {

          name: { required: true, min: 2 }

        }

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

      }

    })



    await wrapper.find('form').trigger('submit.prevent')

    await flushPromises()

    await nextTick()

    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')



    model.name = 'Amy'

    await wrapper.get('input').trigger('blur')

    await flushPromises()

    await nextTick()



    expect(wrapper.get('input').attributes('aria-invalid')).toBeUndefined()

    expect(wrapper.find('.vp-form-item__error').exists()).toBe(false)

  })

})



describe('Form + FormItem + Search a11y contract', () => {

  it('wires aria-invalid when validation fails', async () => {

    const model = reactive({ query: '' })

    const wrapper = mount(Form, {

      props: {

        model,

        rules: {

          query: { required: true }

        }

      },

      slots: {

        default: () =>

          h(FormItem, { label: 'Query', prop: 'query' }, () =>

            h(Search, {

              modelValue: model.query,

              'onUpdate:modelValue': (v: string) => {

                model.query = v

              }

            })

          )

      }

    })



    await wrapper.find('form').trigger('submit.prevent')

    await flushPromises()

    await nextTick()



    const input = wrapper.get('input.vp-search__input')

    expect(input.attributes('aria-invalid')).toBe('true')

    expect(input.attributes('aria-describedby')).toBeTruthy()

  })

})



describe('Form + FormItem + YearPicker a11y contract', () => {

  it('wires aria-invalid on trigger when validation fails', async () => {

    const model = reactive<{ year: number | null }>({ year: null })

    const wrapper = mount(Form, {

      props: {

        model,

        rules: {

          year: { required: true }

        }

      },

      slots: {

        default: () =>

          h(FormItem, { label: 'Year', prop: 'year' }, () =>

            h(YearPicker, {

              modelValue: model.year,

              placeholder: 'Pick year',

              'onUpdate:modelValue': (v: number | null) => {

                model.year = v

              }

            })

          )

      }

    })



    await wrapper.find('form').trigger('submit.prevent')

    await flushPromises()

    await nextTick()



    const trigger = wrapper.get('.vp-yearpicker__trigger')

    expect(trigger.attributes('aria-invalid')).toBe('true')

    expect(trigger.attributes('aria-describedby')).toBeTruthy()

  })

})



describe('Form + FormItem + CheckboxGroup a11y contract', () => {

  it('wires aria-invalid on group root when validation fails', async () => {

    const model = reactive<{ tags: string[] }>({ tags: [] })

    const wrapper = mount(Form, {

      props: {

        model,

        rules: {

          tags: { required: true }

        }

      },

      slots: {

        default: () =>

          h(FormItem, { label: 'Tags', prop: 'tags' }, () =>

            h(

              CheckboxGroup,

              {

                modelValue: model.tags,

                options: [

                  { label: 'A', value: 'a' },

                  { label: 'B', value: 'b' }

                ],

                'onUpdate:modelValue': (v: string[]) => {

                  model.tags = v

                }

              }

            )

          )

      }

    })



    await wrapper.find('form').trigger('submit.prevent')

    await flushPromises()

    await nextTick()



    const group = wrapper.get('[role="group"]')

    expect(group.attributes('aria-invalid')).toBe('true')

    expect(group.attributes('aria-describedby')).toBeTruthy()



    const childInputs = wrapper.findAll('.vp-checkbox__input')

    for (const input of childInputs) {

      expect(input.attributes('aria-invalid')).toBeUndefined()

    }

  })

})

