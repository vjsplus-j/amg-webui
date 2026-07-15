<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { OnvifGroupTreeProps, OnvifGroupTreeEmits } from './types'
import './style.scss'
type Node = { label: string; value?: unknown; children?: Node[]; disabled?: boolean }
const props = withDefaults(defineProps<OnvifGroupTreeProps & { options?: Node[] }>(), {
  options: () => [
    { label: 'Building A', value: 'g1', children: [{ label: 'Floor 1', value: 'g1-1' }, { label: 'Floor 2', value: 'g1-2' }] },
    { label: 'Building B', value: 'g2', children: [{ label: 'Gate', value: 'g2-1' }] },
  ]
})
const emit = defineEmits<OnvifGroupTreeEmits>()
const { t } = useLocale()
const openMap = ref<Record<string, boolean>>({ 'g1': true })
const checked = ref<unknown[]>(Array.isArray(props.modelValue) ? [...(props.modelValue as unknown[])] : [])
watch(() => props.modelValue, v => { checked.value = Array.isArray(v) ? [...v] : [] })
const roots = computed<Node[]>(() => props.options?.length ? props.options : (Array.isArray(props.data) ? props.data as Node[] : []))
function nid(n: Node, p: string) { return p + '/' + String(n.value ?? n.label) }
function toggle(id: string) { openMap.value = { ...openMap.value, [id]: !openMap.value[id] } }
function onCheck(n: Node, ev: Event) {
  if (n.disabled || props.disabled) return
  const val = n.value ?? n.label
  const box = ev.target as HTMLInputElement
  const next = new Set(checked.value)
  if (box.checked) next.add(val); else next.delete(val)
  checked.value = [...next]
  emit('update:modelValue', checked.value)
  emit('change', checked.value)
}
</script>
<template>
  <div :class="['vp-onvif-group-tree', 'vp-onvif-group-tree__panel', { 'vp-onvif-group-tree--disabled': disabled }, props.class]" :style="style" data-component="OnvifGroupTree">
    <h3 class="vp-onvif-group-tree__title">{{ title ?? t('industry.onvif.group') }}</h3>
    <ul v-if="roots.length" class="vp-onvif-group-tree__tree">
      <li v-for="n in roots" :key="nid(n,'r')" class="vp-onvif-group-tree__tree-item">
        <div class="vp-onvif-group-tree__toolbar">
          <button v-if="n.children?.length" type="button" class="vp-onvif-group-tree__btn vp-onvif-group-tree__btn--ghost" @click="toggle(nid(n,'r'))">{{ openMap[nid(n,'r')] ? '−' : '+' }}</button>
          <input type="checkbox" :disabled="n.disabled || disabled" :checked="checked.includes(n.value ?? n.label)" @change="onCheck(n, $event)" />
          <span>{{ n.label }}</span>
        </div>
        <ul v-if="n.children?.length && openMap[nid(n,'r')]" class="vp-onvif-group-tree__tree" style="padding-left:var(--spacing-lg)">
          <li v-for="c in n.children" :key="nid(c,nid(n,'r'))" class="vp-onvif-group-tree__tree-item">
            <div class="vp-onvif-group-tree__toolbar">
              <input type="checkbox" :disabled="c.disabled || disabled" :checked="checked.includes(c.value ?? c.label)" @change="onCheck(c, $event)" />
              <span>{{ c.label }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <p v-else class="vp-onvif-group-tree__muted">{{ t('common.noData') }}</p>
    <slot />
  </div>
</template>