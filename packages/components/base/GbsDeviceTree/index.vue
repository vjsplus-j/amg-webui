<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { GbsDeviceTreeProps, GbsDeviceTreeEmits } from './types'
import './style.scss'
type Node = { label: string; value?: unknown; children?: Node[]; disabled?: boolean }
const props = withDefaults(defineProps<GbsDeviceTreeProps & { options?: Node[] }>(), {
  options: () => [
    { label: 'Region-01', value: 'r1', children: [{ label: 'IPC-001', value: 'd1' }, { label: 'IPC-002', value: 'd2' }] },
    { label: 'Region-02', value: 'r2', children: [{ label: 'NVR-001', value: 'd3' }] },
  ]
})
const emit = defineEmits<GbsDeviceTreeEmits>()
const { t } = useLocale()
const openMap = ref<Record<string, boolean>>({ r1: true })
const checked = ref<unknown[]>(Array.isArray(props.modelValue) ? [...(props.modelValue as unknown[])] : [])
watch(() => props.modelValue, v => { checked.value = Array.isArray(v) ? [...v] : [] })
const roots = computed(() => props.options?.length ? props.options : (Array.isArray(props.data) ? props.data as Node[] : []))
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
  <div :class="['vp-gbs-device-tree', 'vp-gbs-device-tree__panel', { 'vp-gbs-device-tree--disabled': disabled }, props.class]" :style="style" data-component="GbsDeviceTree">
    <h3 class="vp-gbs-device-tree__title">{{ title ?? t('industry.gbs.deviceId') }}</h3>
    <ul v-if="roots.length" class="vp-gbs-device-tree__tree">
      <li v-for="n in roots" :key="nid(n,'r')" class="vp-gbs-device-tree__tree-item">
        <div class="vp-gbs-device-tree__toolbar">
          <button v-if="n.children?.length" type="button" class="vp-gbs-device-tree__btn vp-gbs-device-tree__btn--ghost" @click="toggle(nid(n,'r'))">{{ openMap[nid(n,'r')] ? '−' : '+' }}</button>
          <input type="checkbox" :disabled="n.disabled || disabled" :checked="checked.includes(n.value ?? n.label)" @change="onCheck(n, $event)" />
          <span>{{ n.label }}</span>
        </div>
        <ul v-if="n.children?.length && openMap[nid(n,'r')]" class="vp-gbs-device-tree__tree" style="padding-left:var(--spacing-lg)">
          <li v-for="c in n.children" :key="nid(c,nid(n,'r'))" class="vp-gbs-device-tree__tree-item">
            <div class="vp-gbs-device-tree__toolbar">
              <input type="checkbox" :disabled="c.disabled || disabled" :checked="checked.includes(c.value ?? c.label)" @change="onCheck(c, $event)" />
              <span>{{ c.label }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <p v-else class="vp-gbs-device-tree__muted">{{ t('common.noData') }}</p>
    <slot />
  </div>
</template>