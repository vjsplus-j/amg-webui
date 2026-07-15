<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { DropdownProps, DropdownEmits, NavItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<DropdownProps>(), {
  items: () => [],
  direction: 'horizontal',
  disabled: false
})
const emit = defineEmits<DropdownEmits>()

const { t } = useLocale()
const open = ref(false)

const rootClass = computed(() => [
  'vp-dropdown',
  `vp-dropdown--${props.direction}`,
  props.class
])

const active = computed({
  get: () => props.modelValue,
  set: (v: string | number) => { emit('update:modelValue', v); emit('change', v) }
})

function selectItem(item: NavItem, e: MouseEvent) {
  if (item.disabled || props.disabled) return
  const v = item.value ?? item.label
  active.value = v
  emit('select', item, e)
}

</script>

<template>
  <div :class="rootClass" :style="style">
    <button type="button" class="vp-dropdown__trigger" :disabled="disabled" @click="open = !open">
      <slot name="trigger">{{ items?.find(i => (i.value ?? i.label) === modelValue)?.label ?? t(LocaleKeys.common.more) }}</slot>
    </button>
    <ul v-if="open" class="vp-dropdown__menu" role="menu">
      <li v-for="(item, i) in items" :key="i" role="none">
        <button
          type="button"
          role="menuitem"
          :class="['vp-dropdown__item', { 'vp-dropdown__item--active': (item.value ?? item.label) === modelValue }]"
          :disabled="disabled || item.disabled"
          @click="selectItem(item, $event); open = false"
        >{{ item.label }}</button>
      </li>
    </ul>
  </div>
</template>
