<script setup lang="ts">
import { provide, ref, watch, computed, useSlots, type VNode } from 'vue'
import { TABS_INJECTION_KEY } from './types'
import './style.scss'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    ariaLabel?: string
    class?: string
    style?: Record<string, string>
  }>(),
  {}
)

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
  change: [value: string | number]
  tabClick: [value: string | number, event: MouseEvent | KeyboardEvent]
}>()

const slots = useSlots()

const activeName = ref<string | number | undefined>(props.modelValue)

watch(
  () => props.modelValue,
  (val) => {
    activeName.value = val
  }
)

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
      items.push({
        name: p.name,
        label: p.label,
        disabled: Boolean((p as { disabled?: boolean }).disabled)
      })
    }
  }
  return items
})

watch(
  tabItems,
  (items) => {
    if (activeName.value != null) return
    const first = items.find((t) => !t.disabled)
    if (first) activeName.value = first.name
  },
  { immediate: true }
)

const setActive = (name: string | number) => {
  const tab = tabItems.value.find((t) => t.name === name)
  if (!tab || tab.disabled) return
  activeName.value = name
  emit('update:modelValue', name)
  emit('change', name)
}

provide(TABS_INJECTION_KEY, { activeName, setActive })

const activeVNode = computed(() => {
  const nodes = slots.default?.() ?? []
  return nodes.find(
    (node: VNode) => (node.props as TabMeta | undefined)?.name === activeName.value
  )
})

function focusableIndices(): number[] {
  return tabItems.value
    .map((t, i) => (t.disabled ? -1 : i))
    .filter((i) => i >= 0)
}

function activateByIndex(index: number, event: KeyboardEvent) {
  const tab = tabItems.value[index]
  if (!tab || tab.disabled) return
  setActive(tab.name)
  emit('tabClick', tab.name, event)
}

function onTabClick(name: string | number, event: MouseEvent) {
  setActive(name)
  emit('tabClick', name, event)
}

function onTabKeydown(event: KeyboardEvent, index: number) {
  const keys = focusableIndices()
  if (!keys.length) return
  const pos = keys.indexOf(index)
  if (pos < 0) return

  let next = -1
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
    next = keys[(pos + 1) % keys.length]!
  } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
    next = keys[(pos - 1 + keys.length) % keys.length]!
  } else if (event.key === 'Home') {
    next = keys[0]!
  } else if (event.key === 'End') {
    next = keys[keys.length - 1]!
  } else if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    activateByIndex(index, event)
    return
  } else {
    return
  }

  event.preventDefault()
  activateByIndex(next, event)
  const btn = (event.currentTarget as HTMLElement)
    .parentElement
    ?.querySelectorAll<HTMLElement>('[role="tab"]')[next]
  btn?.focus()
}

function tabId(name: string | number) {
  return `vp-tab-${String(name)}`
}

function panelId(name: string | number) {
  return `vp-tabpanel-${String(name)}`
}
</script>

<template>
  <div :class="['vp-tabs', props.class]" :style="style">
    <div
      class="vp-tabs__nav"
      role="tablist"
      :aria-label="ariaLabel"
      :aria-orientation="'horizontal'"
    >
      <button
        v-for="(tab, index) in tabItems"
        :id="tabId(tab.name)"
        :key="String(tab.name)"
        type="button"
        role="tab"
        class="vp-tabs__tab"
        :class="{ 'vp-tabs__tab--active': tab.name === activeName }"
        :disabled="tab.disabled"
        :tabindex="tab.name === activeName ? 0 : -1"
        :aria-selected="tab.name === activeName"
        :aria-controls="panelId(tab.name)"
        @click="onTabClick(tab.name, $event)"
        @keydown="onTabKeydown($event, index)"
      >
        {{ tab.label ?? tab.name }}
      </button>
    </div>
    <div
      :id="activeName != null ? panelId(activeName) : undefined"
      class="vp-tabs__content"
      role="tabpanel"
      :aria-labelledby="activeName != null ? tabId(activeName) : undefined"
      :tabindex="0"
    >
      <component :is="activeVNode" v-if="activeVNode" />
    </div>
  </div>
</template>
