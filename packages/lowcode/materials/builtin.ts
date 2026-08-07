import { Button, Card, Divider, Tag } from '@amg-webui/core'
import { DataTable } from '@amg-webui/data'
import { DatePicker, FormItem, InputText, Select, Switch } from '@amg-webui/form'
import { Dialog } from '@amg-webui/overlay'
import { defineComponent, h, type Component } from 'vue'
import { createComponentRegistry } from '../registry'
import type { ComponentRegistry } from '../types'
import { DEFAULT_STYLE_SCHEMA, toMaterialV2, type LowcodeMaterial } from './types'

/** Simple flex/flow container for nested drops. */
export const StudioContainer: Component = defineComponent({
  name: 'StudioContainer',
  props: {
    title: { type: String, default: '' }
  },
  setup(props, { slots }) {
    return () =>
      h(
        'div',
        {
          class: 'vp-studio-container',
          'data-title': props.title || undefined
        },
        [props.title ? h('div', { class: 'vp-studio-container__title' }, props.title) : null, slots.default?.()]
      )
  }
})

/** Lightweight Form host for lowcode nesting. */
export const StudioForm: Component = defineComponent({
  name: 'StudioForm',
  props: {
    title: { type: String, default: '' }
  },
  setup(props, { slots }) {
    return () =>
      h('form', { class: 'vp-studio-form', onSubmit: (e: Event) => e.preventDefault() }, [
        props.title ? h('div', { class: 'vp-studio-form__title' }, props.title) : null,
        slots.default?.()
      ])
  }
})

const baseStyle = DEFAULT_STYLE_SCHEMA

export function createStudioMaterials(): LowcodeMaterial[] {
  return [
    toMaterialV2(
      {
        type: 'Container',
        label: 'Container',
        component: StudioContainer,
        group: 'layout',
        isContainer: true,
        defaultProps: { title: '' },
        defaultSize: { w: 480, h: 280 },
        propsSchema: { title: { type: 'string', title: 'Title' } },
        importFrom: '@amg-webui/lowcode',
        exportName: 'StudioContainer'
      },
      {
        category: 'layout',
        icon: 'Box',
        accepts: ['*'],
        styleSchema: baseStyle,
        version: '1.0.0'
      }
    ),
    toMaterialV2(
      {
        type: 'Card',
        label: 'Card',
        component: Card,
        group: 'layout',
        isContainer: true,
        defaultProps: {},
        defaultSize: { w: 320, h: 200 },
        propsSchema: { title: { type: 'string', title: 'Title' } },
        importFrom: '@amg-webui/core',
        events: ['click']
      },
      { category: 'layout', icon: 'Square', accepts: ['*'], styleSchema: baseStyle }
    ),
    toMaterialV2(
      {
        type: 'Form',
        label: 'Form',
        component: StudioForm,
        group: 'form',
        isContainer: true,
        defaultProps: { title: 'Form' },
        defaultSize: { w: 400, h: 320 },
        propsSchema: { title: { type: 'string', title: 'Title' } },
        importFrom: '@amg-webui/lowcode',
        exportName: 'StudioForm'
      },
      {
        category: 'form',
        icon: 'ClipboardList',
        accepts: ['FormItem', 'InputText', 'Select', 'DatePicker', 'Switch', 'Button'],
        styleSchema: baseStyle
      }
    ),
    toMaterialV2(
      {
        type: 'FormItem',
        label: 'FormItem',
        component: FormItem,
        group: 'form',
        isContainer: true,
        defaultProps: { label: 'Field' },
        defaultSize: { w: 360, h: 72 },
        propsSchema: {
          label: { type: 'string', title: 'Label', required: true }
        },
        importFrom: '@amg-webui/form'
      },
      {
        category: 'form',
        accepts: ['InputText', 'Select', 'DatePicker', 'Switch'],
        parentRules: ['Form', 'Container', 'Card'],
        styleSchema: baseStyle
      }
    ),
    toMaterialV2(
      {
        type: 'InputText',
        label: 'Input',
        component: InputText,
        group: 'form',
        defaultProps: { placeholder: '' },
        defaultSize: { w: 280, h: 40 },
        propsSchema: {
          placeholder: { type: 'string', title: 'Placeholder' },
          disabled: { type: 'boolean', title: 'Disabled' }
        },
        importFrom: '@amg-webui/form',
        events: ['update:modelValue']
      },
      {
        category: 'form',
        parentRules: ['FormItem', 'Form', 'Container', 'Card'],
        bindings: { modelValue: { pathHint: 'state.' } },
        styleSchema: baseStyle
      }
    ),
    toMaterialV2(
      {
        type: 'Select',
        label: 'Select',
        component: Select,
        group: 'form',
        defaultProps: {},
        defaultSize: { w: 280, h: 40 },
        propsSchema: {
          placeholder: { type: 'string', title: 'Placeholder' },
          disabled: { type: 'boolean', title: 'Disabled' }
        },
        importFrom: '@amg-webui/form',
        events: ['update:modelValue']
      },
      {
        category: 'form',
        parentRules: ['FormItem', 'Form', 'Container', 'Card'],
        bindings: { modelValue: { pathHint: 'state.' } },
        styleSchema: baseStyle
      }
    ),
    toMaterialV2(
      {
        type: 'DatePicker',
        label: 'DatePicker',
        component: DatePicker,
        group: 'form',
        defaultProps: {},
        defaultSize: { w: 280, h: 40 },
        propsSchema: { disabled: { type: 'boolean', title: 'Disabled' } },
        importFrom: '@amg-webui/form',
        events: ['update:modelValue']
      },
      {
        category: 'form',
        parentRules: ['FormItem', 'Form', 'Container', 'Card'],
        styleSchema: baseStyle
      }
    ),
    toMaterialV2(
      {
        type: 'Switch',
        label: 'Switch',
        component: Switch,
        group: 'form',
        defaultProps: {},
        defaultSize: { w: 56, h: 32 },
        propsSchema: { disabled: { type: 'boolean', title: 'Disabled' } },
        importFrom: '@amg-webui/form',
        events: ['update:modelValue']
      },
      {
        category: 'form',
        parentRules: ['FormItem', 'Form', 'Container', 'Card'],
        styleSchema: baseStyle
      }
    ),
    toMaterialV2(
      {
        type: 'Button',
        label: 'Button',
        component: Button,
        group: 'general',
        defaultProps: { label: 'OK' },
        defaultSize: { w: 120, h: 40 },
        propsSchema: {
          label: { type: 'string', title: 'Label', required: true },
          severity: {
            type: 'enum',
            enum: ['default', 'primary', 'success', 'warning', 'danger'],
            title: 'Severity'
          }
        },
        importFrom: '@amg-webui/core',
        events: ['click']
      },
      { category: 'general', styleSchema: baseStyle }
    ),
    toMaterialV2(
      {
        type: 'Tag',
        label: 'Tag',
        component: Tag,
        group: 'general',
        defaultProps: { label: 'Tag' },
        defaultSize: { w: 96, h: 32 },
        propsSchema: { label: { type: 'string', title: 'Label', required: true } },
        importFrom: '@amg-webui/core'
      },
      { category: 'general', styleSchema: baseStyle }
    ),
    toMaterialV2(
      {
        type: 'Divider',
        label: 'Divider',
        component: Divider,
        group: 'layout',
        defaultSize: { w: 320, h: 16 },
        propsSchema: {
          direction: {
            type: 'enum',
            enum: ['horizontal', 'vertical'],
            title: 'Direction'
          }
        },
        importFrom: '@amg-webui/core'
      },
      { category: 'layout', styleSchema: baseStyle }
    ),
    toMaterialV2(
      {
        type: 'DataTable',
        label: 'DataTable',
        component: DataTable,
        group: 'data',
        defaultProps: {
          columns: [
            { field: 'id', header: 'ID', width: '80px' },
            { field: 'name', header: 'Name' },
            { field: 'email', header: 'Email' },
            { field: 'status', header: 'Status', width: '100px' }
          ],
          value: []
        },
        defaultSize: { w: 720, h: 360 },
        propsSchema: {},
        importFrom: '@amg-webui/data',
        events: ['row-click']
      },
      {
        category: 'data',
        bindings: { value: { pathHint: 'data.' } },
        styleSchema: baseStyle
      }
    ),
    toMaterialV2(
      {
        type: 'Dialog',
        label: 'Dialog',
        component: Dialog,
        group: 'overlay',
        isContainer: true,
        defaultProps: { visible: false, header: 'Dialog' },
        defaultSize: { w: 400, h: 280 },
        propsSchema: {
          header: { type: 'string', title: 'Header' },
          visible: { type: 'boolean', title: 'Visible' }
        },
        importFrom: '@amg-webui/overlay',
        events: ['update:visible']
      },
      {
        category: 'overlay',
        accepts: ['*'],
        bindings: { visible: { pathHint: 'state.' } },
        styleSchema: baseStyle
      }
    )
  ]
}

export function createStudioRegistry(onConflict: 'throw' | 'skip' | 'replace' = 'replace'): ComponentRegistry {
  const materials = createStudioMaterials()
  return createComponentRegistry(materials, { onConflict })
}

export function canDropMaterial(
  parent: LowcodeMaterial | undefined | null,
  childType: string
): boolean {
  if (!parent) return true
  if (!parent.isContainer && !parent.accepts?.length) return false
  if (!parent.accepts?.length || parent.accepts.includes('*')) return true
  return parent.accepts.includes(childType)
}
