<script setup lang="ts">
import { computed, inject, onBeforeMount, onBeforeUnmount, ref, watch } from 'vue'
import { TABS_INJECTION_KEY } from '../Tabs/types'
import type { TabPaneEmits, TabPaneProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<TabPaneProps>(), {
  lazy: false,
  forceRender: false,
  destroyInactive: false,
  disabled: false
})

const emit = defineEmits<TabPaneEmits>()

const ctx = inject(TABS_INJECTION_KEY, null)

function register() {
  ctx?.registerPane({
    name: props.name,
    label: props.label,
    disabled: props.disabled
  })
}

onBeforeMount(register)
onBeforeUnmount(() => ctx?.unregisterPane(props.name))

watch(
  () => [props.name, props.label, props.disabled] as const,
  ([name], [oldName]) => {
    if (oldName !== name) ctx?.unregisterPane(oldName)
    register()
  }
)

const isActive = computed(() => ctx?.activeName.value === props.name)
const activated = ref(props.forceRender || !props.lazy)

watch(
  () => props.forceRender,
  (force) => {
    if (force) activated.value = true
  }
)

watch(
  isActive,
  (active) => {
    if (active) {
      activated.value = true
      emit('activate', props.name)
    } else {
      emit('deactivate', props.name)
    }
  },
  { immediate: true }
)

const shouldRender = computed(() => {
  if (!ctx) return true
  if (isActive.value) return true
  if (props.destroyInactive) return false
  return props.forceRender || !props.lazy || activated.value
})

const paneId = computed(() =>
  ctx ? `${ctx.idPrefix}-tabpanel-${String(props.name)}` : undefined
)
const labelledBy = computed(() =>
  ctx ? `${ctx.idPrefix}-tab-${String(props.name)}` : undefined
)
const resolvedTabindex = computed(() =>
  isActive.value || !ctx ? (props.tabindex ?? 0) : -1
)
const state = computed(() => (isActive.value || !ctx ? 'active' : 'inactive'))
</script>

<template>
  <div
    v-if="shouldRender"
    v-show="isActive || !ctx"
    :class="['vp-tab-pane', { 'vp-tab-pane--active': isActive }, props.class]"
    :style="style"
    role="tabpanel"
    :id="paneId"
    :aria-labelledby="labelledBy"
    :aria-label="ariaLabel"
    :hidden="ctx ? !isActive : false"
    :tabindex="resolvedTabindex"
    :data-state="state"
    data-component="TabPane"
  >
    <slot :active="isActive || !ctx" :pane-name="name" />
  </div>
</template>
