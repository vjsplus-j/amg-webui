<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import Select from '../Select/index.vue'
import type { SelectNavProps, SelectNavEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<SelectNavProps>(), {
  options: () => [],
  telemetry: undefined
})

const emit = defineEmits<SelectNavEmits>()
const { t } = useLocale()

const selectOptions = computed(() =>
  props.options.map((item) => ({
    label: item.label,
    value: item.value,
    disabled: item.disabled
  }))
)

const current = computed(() => props.options.find((o) => o.value === props.modelValue))

const resolvedAria = computed(
  () => props.ariaLabel || t('component.select-nav.title')
)

const resolvedPlaceholder = computed(
  () => props.placeholder || t('component.select-nav.title')
)

function applyValue(value: string | number, event?: Event) {
  if (props.disabled) return
  const item = props.options.find((o) => o.value === value)
  if (!item || item.disabled) return

  trackEmit({
    component: 'SelectNav',
    type: 'select',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { value }
  })

  emit('update:modelValue', value)
  emit('change', value)
  emit('select', item, event)
  emit('navigate', item)
}

function onUpdate(value: unknown) {
  if (value == null) return
  applyValue(value as string | number)
}

</script>

<template>
  <nav
    :class="['vp-select-nav', props.class, { 'vp-select-nav--disabled': disabled }]"
    :style="style"
    data-component="SelectNav"
    :aria-label="resolvedAria"
  >
    <Select
      class="vp-select-nav__select"
      :model-value="modelValue"
      :options="selectOptions"
      :disabled="disabled"
      :placeholder="resolvedPlaceholder"
      fluid
      @update:model-value="onUpdate"
    />
    <div v-if="current && $slots.default" class="vp-select-nav__current">
      <slot :item="current">{{ current.label }}</slot>
    </div>
  </nav>
</template>
