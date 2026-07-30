<script setup lang="ts">
import { computed } from 'vue'
import StepNav from '../StepNav/index.vue'
import type { VerticalStepNavProps, VerticalStepNavEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<VerticalStepNavProps>(), {
  items: () => [],
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<VerticalStepNavEmits>()

const mergedClass = computed(() =>
  ['vp-vertical-step-nav', props.class].filter(Boolean).join(' ')
)
</script>

<template>
  <StepNav
    direction="vertical"
    :items="props.items"
    :model-value="props.modelValue"
    :disabled="props.disabled"
    :track-id="props.trackId"
    :telemetry="props.telemetry"
    :class="mergedClass"
    :style="props.style"
    @update:model-value="emit('update:modelValue', $event)"
    @change="emit('change', $event)"
    @select="(item, e) => emit('select', item, e)"
  />
</template>
