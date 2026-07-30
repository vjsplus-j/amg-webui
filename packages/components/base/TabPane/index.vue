<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue'
import { TABS_INJECTION_KEY } from '../Tabs/types'
import type { TabPaneProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<TabPaneProps>(), {
  lazy: false,
  forceRender: false,
  disabled: false
})

const ctx = inject(TABS_INJECTION_KEY, null)

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
    if (active) activated.value = true
  },
  { immediate: true }
)

const shouldRender = computed(
  () => props.forceRender || !props.lazy || activated.value
)

const paneId = computed(() => `vp-tabpanel-${String(props.name)}`)
const labelledBy = computed(() => `vp-tab-${String(props.name)}`)
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
    :hidden="ctx ? !isActive : false"
    :tabindex="isActive || !ctx ? 0 : -1"
  >
    <slot />
  </div>
</template>
