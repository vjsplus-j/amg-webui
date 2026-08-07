<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useCanvasEditor } from '@amg-webui/hooks'
import { LOWCODE_BINDINGS_KEY, LOWCODE_EVENTS_KEY, type LowcodePropSchema } from '../../types'
import type { PropField, PropPanelEmits, PropPanelProps } from './types'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

const GEOM_KEYS = new Set(['x', 'y', 'w', 'h'])
const META_PROP_KEYS = new Set([LOWCODE_BINDINGS_KEY, LOWCODE_EVENTS_KEY])

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

  const type = node.value?.type
  const meta = type && props.registry ? props.registry.get(type) : undefined
  const schemaKeys = new Set(Object.keys(meta?.propsSchema ?? {}))

  const parentOptions =
    editor?.nodes.value
      .filter((n) => {
        if (n.id === node.value?.id) return false
        if (!props.registry) return true
        return props.registry.get(n.type)?.isContainer === true
      })
      .map((n) => ({ label: `${n.label} (${n.type})`, value: n.id })) ?? []

  const base: PropField[] = [
    // Canvas chrome name — only when component propsSchema does not own `label`
    // (avoids duplicate key clash that broke live prop updates).
    ...(!schemaKeys.has('label')
      ? [{ key: 'label', type: 'text' as const, label: t('component.prop-panel.field.nodeLabel') }]
      : []),
    { key: 'x', type: 'number', label: t('component.prop-panel.field.x') },
    { key: 'y', type: 'number', label: t('component.prop-panel.field.y') },
    { key: 'w', type: 'number', label: t('component.prop-panel.field.w') },
    { key: 'h', type: 'number', label: t('component.prop-panel.field.h') },
    {
      key: 'parentId',
      type: 'select',
      label: t('component.prop-panel.field.parentId'),
      options: [
        { label: t('component.prop-panel.field.parentNone'), value: '' },
        ...parentOptions
      ]
    }
  ]

  if (meta?.propsSchema) {
    for (const [key, schema] of Object.entries(meta.propsSchema)) {
      if (META_PROP_KEYS.has(key) || GEOM_KEYS.has(key)) continue
      base.push(schemaToField(key, schema))
    }
  } else if (node.value?.props) {
    for (const key of Object.keys(node.value.props)) {
      if (META_PROP_KEYS.has(key) || base.some((f) => f.key === key)) continue
      base.push({ key, type: 'text', fromProps: true })
    }
  }
  return base
})

function valueOf(key: string, fromProps?: boolean): unknown {
  if (!node.value) return props.modelValue[key] ?? ''
  if (key === 'parentId') return node.value.parentId ?? ''
  if (fromProps) return node.value.props?.[key] ?? ''
  if (GEOM_KEYS.has(key) || key === 'label') {
    return (node.value as unknown as Record<string, unknown>)[key] ?? ''
  }
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
    const asProp = Boolean(field.fromProps) || (!GEOM_KEYS.has(key) && key !== 'label')
    if (!asProp) {
      editor.updateNode(node.value.id, { [key]: val } as Partial<typeof node.value>)
    } else {
      const nextProps = { ...node.value.props, [key]: val }
      // Keep chrome label in sync when editing the component's label prop
      const patch: Partial<typeof node.value> = { props: nextProps }
      if (key === 'label' && typeof val === 'string') patch.label = val
      editor.updateNode(node.value.id, patch)
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

const hasSource = computed(() => Boolean(node.value) || resolvedFields.value.length > 0)
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
    <template v-if="hasSource && node">
      <label
        v-for="field in resolvedFields"
        :key="`${node.id}:${field.key}:${field.fromProps ? 'p' : 'n'}`"
        class="vp-prop-panel__field"
      >
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
          <option v-for="option in field.options" :key="String(option.value)" :value="option.value">
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
