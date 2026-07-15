<script setup lang="ts">
import { computed } from 'vue'
import { useLocale, useCanvasEditor } from '@amg-webui/hooks'
import type { PropPanelProps, PropPanelEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<PropPanelProps>(), {
  fields: () => [
    { key: 'label', label: 'label', type: 'text' },
    { key: 'w', label: 'width', type: 'number' },
    { key: 'h', label: 'height', type: 'number' }
  ]
})

const emit = defineEmits<PropPanelEmits>()
const { t } = useLocale()
const editor = useCanvasEditor()

const node = computed(() => editor?.selectedNodes.value[0])

function valueOf(key: string): unknown {
  if (!node.value) return ''
  const record = node.value as unknown as Record<string, unknown>
  if (key in record) return record[key]
  return node.value.props?.[key] ?? ''
}

function onChange(key: string, e: Event) {
  if (!editor || !node.value) return
  const el = e.target as HTMLInputElement
  let val: unknown = el.type === 'checkbox' ? el.checked : el.type === 'number' ? Number(el.value) : el.value
  if (['label', 'w', 'h', 'x', 'y'].includes(key)) {
    editor.updateNode(node.value.id, { [key]: val } as Partial<typeof node.value>)
  } else {
    editor.updateNode(node.value.id, { props: { ...node.value.props, [key]: val } })
  }
  emit('update:prop', { key, value: val })
}
</script>

<template>
  <aside :class="['vp-prop-panel', props.class]" :style="style" data-component="PropPanel">
    <h3 class="vp-prop-panel__title">{{ t('component.prop-panel.title') }}</h3>
    <template v-if="node">
      <label v-for="field in fields" :key="field.key" class="vp-prop-panel__field">
        <span>{{ field.label ?? field.key }}</span>
        <input
          v-if="field.type !== 'boolean'"
          :type="field.type === 'number' ? 'number' : 'text'"
          :value="valueOf(field.key)"
          @input="onChange(field.key, $event)"
        />
        <input v-else type="checkbox" :checked="Boolean(valueOf(field.key))" @change="onChange(field.key, $event)" />
      </label>
    </template>
    <p v-else class="vp-prop-panel__muted">{{ t('component.prop-panel.empty') }}</p>
    <slot />
  </aside>
</template>
