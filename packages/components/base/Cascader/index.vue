<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePopover } from '@amg-webui/hooks'
import type { CascaderProps, CascaderEmits, CascaderOption } from './types'
import './style.scss'

const props = withDefaults(defineProps<CascaderProps>(), {
  options: () => []
})

const emit = defineEmits<CascaderEmits>()

const { isOpen, triggerRef, panelRef, toggle, close } = usePopover()
const activePath = ref<CascaderOption[]>([])

const menus = computed(() => {
  const result: CascaderOption[][] = [props.options ?? []]
  for (const node of activePath.value) {
    if (node.children?.length) {
      result.push(node.children)
    }
  }
  return result
})

const displayLabel = computed(() => {
  if (!props.modelValue) return ''
  const findPath = (
    nodes: CascaderOption[],
    trail: CascaderOption[] = []
  ): CascaderOption[] | null => {
    for (const node of nodes) {
      const next = [...trail, node]
      if (node.value === props.modelValue) return next
      if (node.children?.length) {
        const found = findPath(node.children, next)
        if (found) return found
      }
    }
    return null
  }
  const path = findPath(props.options ?? [])
  return path?.map((n) => n.label).join(' / ') ?? String(props.modelValue)
})

const isPlaceholder = computed(() => !props.modelValue && !!props.placeholder)

const handleTriggerClick = () => {
  if (props.disabled) return
  toggle()
}

const handleItemClick = (menuIndex: number, option: CascaderOption) => {
  if (option.disabled) return
  activePath.value = activePath.value.slice(0, menuIndex)
  activePath.value.push(option)
  if (!option.children?.length) {
    emit('update:modelValue', option.value)
    emit('change', option.value)
    close()
    activePath.value = []
  }
}

const handleItemHover = (menuIndex: number, option: CascaderOption) => {
  if (option.disabled) return
  activePath.value = activePath.value.slice(0, menuIndex)
  activePath.value.push(option)
}
</script>

<template>
  <div :class="['vp-cascader', props.class]" :style="style">
    <button
      ref="triggerRef"
      type="button"
      class="vp-cascader__trigger"
      :disabled="disabled"
      @click="handleTriggerClick"
    >
      <span
        :class="['vp-cascader__label', { 'vp-cascader__label--placeholder': isPlaceholder }]"
      >
        {{ isPlaceholder ? placeholder : displayLabel }}
      </span>
      <span class="vp-cascader__icon" aria-hidden="true">•</span>
    </button>

    <div v-if="isOpen" ref="panelRef" class="vp-cascader__panel">
      <div v-for="(menu, menuIndex) in menus" :key="menuIndex" class="vp-cascader__menu">
        <div
          v-for="option in menu"
          :key="String(option.value)"
          :class="[
            'vp-cascader__item',
            {
              'vp-cascader__item--active': activePath[menuIndex]?.value === option.value,
              'vp-cascader__item--selected': option.value === modelValue,
              'vp-cascader__item--disabled': option.disabled
            }
          ]"
          @click="handleItemClick(menuIndex, option)"
          @mouseenter="handleItemHover(menuIndex, option)"
        >
          <span>{{ option.label }}</span>
          <span v-if="option.children?.length" class="vp-cascader__arrow" aria-hidden="true">›</span>
        </div>
      </div>
    </div>
  </div>
</template>
