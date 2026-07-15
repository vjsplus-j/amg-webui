<script setup lang="ts">
import { provide, ref, watch, computed, useSlots, type VNode } from 'vue'
import type { TabsProps, TabsEmits } from './types'
import { TABS_INJECTION_KEY } from './types'
import './style.scss'

const props = defineProps<TabsProps>()
const emit = defineEmits<TabsEmits>()
const slots = useSlots()

const activeName = ref<string | number | undefined>(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    activeName.value = val
  }
)

const setActive = (name: string | number) => {
  activeName.value = name
  emit('update:modelValue', name)
  emit('change', name)
}

provide(TABS_INJECTION_KEY, { activeName, setActive })

interface TabMeta {
  name: string | number
  label?: string
  disabled?: boolean
}

const tabItems = computed(() => {
  const nodes = slots.default?.() ?? []
  const items: TabMeta[] = []
  for (const node of nodes) {
    const p = (node.props ?? {}) as TabMeta
    if (p.name !== undefined) {
      items.push({ name: p.name, label: p.label, disabled: (p as { disabled?: boolean }).disabled })
    }
  }
  return items
})

const activeVNode = computed(() => {
  const nodes = slots.default?.() ?? []
  return nodes.find((node: VNode) => (node.props as TabMeta | undefined)?.name === activeName.value)
})
</script>

<template>
  <div :class="['vp-tabs', props.class]" :style="style">
    <div class="vp-tabs__nav" role="tablist">
      <button
        v-for="tab in tabItems"
        :key="String(tab.name)"
        type="button"
        role="tab"
        :class="['vp-tabs__tab', { 'vp-tabs__tab--active': tab.name === activeName }]"
        :disabled="tab.disabled"
        @click="setActive(tab.name)"
      >
        {{ tab.label ?? tab.name }}
      </button>
    </div>
    <div class="vp-tabs__content" role="tabpanel">
      <component :is="activeVNode" v-if="activeVNode" />
    </div>
  </div>
</template>
