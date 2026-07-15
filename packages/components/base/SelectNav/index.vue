<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import Select from '../Select/index.vue'
import type { SelectNavProps, SelectNavEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<SelectNavProps>(), {
  options: () => []
})

const emit = defineEmits<SelectNavEmits>()
const { t } = useLocale()

const selectOptions = computed(() =>
  props.options.map((item) => ({ label: item.label, value: item.value }))
)

const current = computed(() => props.options.find((o) => o.value === props.modelValue))

const onChange = (value: unknown) => {
  const v = value as string | number
  emit('update:modelValue', v)
  emit('change', v)
  const item = props.options.find((o) => o.value === v)
  if (item) emit('navigate', item)
}
</script>

<template>
  <nav :class="['vp-select-nav', props.class, { 'vp-select-nav--disabled': disabled }]" :style="style" data-component="SelectNav" :aria-label="t('component.select-nav.title')">
    <Select
      class="vp-select-nav__select"
      :model-value="modelValue"
      :options="selectOptions"
      :disabled="disabled"
      :placeholder="t('component.select-nav.title')"
      @update:model-value="onChange"
    />
    <div v-if="current" class="vp-select-nav__current">
      <slot :item="current">{{ current.label }}</slot>
    </div>
  </nav>
</template>
