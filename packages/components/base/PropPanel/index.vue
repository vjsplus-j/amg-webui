<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useCanvasEditor } from '@amg-webui/hooks'
import type { LowcodePropSchema } from '@amg-webui/lowcode'
import type { PropField, PropPanelEmits, PropPanelProps } from './types'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

const LAYOUT_FIELDS: PropField[] = [
  { key: 'label', type: 'text' },
  { key: 'w', type: 'number' },
  { key: 'h', type: 'number' },
  { key: 'x', type: 'number' },
  { key: 'y', type: 'number' }
]

function schemaToField(key: string, schema: LowcodePropSchema): PropField {
  const type =
    schema.type === 'number'
      ? 'number'
      : schema.type === 'boolean'
        ? 'boolean'
        : schema.type === 'enum'
          ? 'select'
          : 'text'
  return {
    key,
    label: schema.title ?? key,
    type,
    description: schema.description,
    fromProps: true,
    options: schema.enum?.map((v) => ({ label: String(v), value: v }))
  }
}

const props = withDefaults(defineProps<PropPanelProps>(), {
  fields: undefined,
  readonly: false,
  modelValue: () => ({}),
  telemetry: undefined
})

const emit = defineEmits<PropPanelEmits>()
const { t } = useLocale()
const editor = useCanvasEditor()

const node = computed(() => editor?.selectedNodes.value[0])

const resolvedFields = computed<PropField[]>(() => {
  if (props.fields?.length) return props.fields
  const parentOptions =
    editor?.nodes.value
      .filter((n) => {
        if (n.id === node.value?.id) return false
        if (!props.registry) return true
        return props.registry.get(n.type)?.isContainer === true
      })
      .map((n) => ({ label: `${n.label} (${n.type})`, value: n.id })) ?? []
  const base: PropField[] = [
    ...LAYOUT_FIELDS,
    {
      key: 'parentId',
      type: 'select',
      label: 'parentId',
      options: [{ label: '—', value: '' }, ...parentOptions]
    }
  ]
  const type = node.value?.type
  const meta = type && props.registry ? props.registry.get(type) : undefined
  if (meta?.propsSchema) {
    for (const [key, schema] of Object.entries(meta.propsSchema)) {
      base.push(schemaToField(key, schema))
    }
  } else if (node.value?.props) {
    for (const key of Object.keys(node.value.props)) {
      if (!base.some((f) => f.key === key)) {
        base.push({ key, type: 'text', fromProps: true })
      }
    }
  }
  return base
})

function valueOf(key: string, fromProps?: boolean): unknown {
  if (!node.value) return props.modelValue[key] ?? ''
  if (key === 'parentId') return node.value.parentId ?? ''
  if (fromProps) return node.value.props?.[key] ?? ''
  const record = node.value as unknown as Record<string, unknown>
  if (key in record && ['label', 'w', 'h', 'x', 'y'].includes(key)) return record[key]
  return node.value.props?.[key] ?? ''
}

function onChange(field: PropField, e: Event) {
  if (props.readonly) return
  const el = e.target as HTMLInputElement | HTMLSelectElement
  let val: unknown =
    el instanceof HTMLInputElement && el.type === 'checkbox'
      ? el.checked
      : el instanceof HTMLInputElement && el.type === 'number'
        ? Number(el.value)
        : el.value
  const key = field.key
  if (key === 'parentId' && editor && node.value) {
    const parentId = val === '' || val == null ? null : String(val)
    editor.setParent(node.value.id, parentId)
  } else if (editor && node.value) {
    const asProp = field.fromProps || !['label', 'w', 'h', 'x', 'y'].includes(key)
    if (!asProp) {
      editor.updateNode(node.value.id, { [key]: val } as Partial<typeof node.value>)
    } else {
      editor.updateNode(node.value.id, {
        props: { ...node.value.props, [key]: val }
      })
    }
  }
  const payload = { key, value: val }
  trackEmit({
    component: 'PropPanel',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload
  })
  emit('update:modelValue', { ...props.modelValue, [key]: val })
  emit('update:prop', payload)
  emit('change', payload)
}

/** Explicit `fields` = standalone editor; layout defaults alone do not count. */
const hasSource = computed(
  () => Boolean(node.value) || Boolean(props.fields?.length)
)
const titleText = computed(() => props.title ?? t('component.prop-panel.title'))
const emptyText = computed(() => props.emptyText ?? t('component.prop-panel.empty'))
</script>

<template>
  <aside
    :class="['vp-prop-panel', { 'vp-prop-panel--readonly': readonly }, props.class]"
    :style="style"
    data-component="PropPanel"
    role="complementary"
    :aria-label="titleText"
  >
    <h3 class="vp-prop-panel__title">{{ titleText }}</h3>
    <template v-if="hasSource">
      <label v-for="field in resolvedFields" :key="field.key" class="vp-prop-panel__field">
        <span>{{ field.label ?? field.key }}</span>
        <small v-if="field.description" class="vp-prop-panel__description">{{
          field.description
        }}</small>
        <select
          v-if="field.type === 'select'"
          :value="valueOf(field.key, field.fromProps) as string | number"
          :disabled="readonly || field.disabled"
          @change="onChange(field, $event)"
        >
          <option v-for="option in field.options" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
        <textarea
          v-else-if="field.type === 'textarea'"
          :value="valueOf(field.key, field.fromProps) as string"
          :placeholder="field.placeholder"
          :disabled="readonly || field.disabled"
          @input="onChange(field, $event)"
        />
        <input
          v-else-if="field.type !== 'boolean'"
          :type="field.type === 'number' ? 'number' : field.type === 'color' ? 'color' : 'text'"
          :value="valueOf(field.key, field.fromProps) as string | number"
          :placeholder="field.placeholder"
          :min="field.min"
          :max="field.max"
          :step="field.step"
          :disabled="readonly || field.disabled"
          :aria-label="field.label ?? field.key"
          @input="onChange(field, $event)"
        />
        <input
          v-else
          type="checkbox"
          :checked="Boolean(valueOf(field.key, field.fromProps))"
          :disabled="readonly || field.disabled"
          :aria-label="field.label ?? field.key"
          @change="onChange(field, $event)"
        />
      </label>
    </template>
    <p v-else class="vp-prop-panel__muted" role="status">{{ emptyText }}</p>
    <slot :node="node" :values="modelValue" />
  </aside>
</template>
