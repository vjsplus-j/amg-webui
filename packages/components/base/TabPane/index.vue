<script setup lang="ts">
import { inject, computed } from 'vue'
import type { TabPaneProps } from './types'
import { TABS_INJECTION_KEY } from '../Tabs/types'
import './style.scss'

const props = defineProps<TabPaneProps>()

const ctx = inject(TABS_INJECTION_KEY, null)

const isActive = computed(() => ctx?.activeName.value === props.name)
</script>

<template>
  <div v-show="isActive" :class="['vp-tab-pane', props.class]" :style="style">
    <slot />
  </div>
</template>
