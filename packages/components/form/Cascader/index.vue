<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { usePopover } from '@amg-webui/hooks'
import {
  getFloatingPanelStyle,
  moveRovingIndex,
  resolveKeyboardNavAction
} from '@amg-webui/utils'
import type { CascaderProps, CascaderEmits, CascaderOption } from './types'
import { useFormItem } from '../FormItem/useFormItem'
import { useNativeInputAttrs } from '../FormItem/useNativeInputAttrs'
import './style.scss'

defineOptions({ inheritAttrs: false, name: 'Cascader' })

const props = withDefaults(defineProps<CascaderProps>(), {
  options: () => []
})

const emit = defineEmits<CascaderEmits>()

const {
  inputId,
  isDisabled,
  isInvalid,
  isRequired,
  ariaDescribedby,
  validateOnBlur,
  validateOnChange
} = useFormItem({
  id: () => props.id,
  disabled: () => props.disabled,
  invalid: () => props.invalid,
  name: () => props.name
})

const { nativeAttrs } = useNativeInputAttrs()

const { isOpen, triggerRef, panelRef, toggle, close } = usePopover()
const activePath = ref<CascaderOption[]>([])
const focusCol = ref(0)
const focusRow = ref(0)
const floatingPanelStyle = ref<Record<string, string>>({})

const menus = computed(() => {
  const result: CascaderOption[][] = [props.options ?? []]
  for (const node of activePath.value) {
    if (node.children?.length) {
      result.push(node.children)
    }
  }
  return result
})

const panelMergedStyle = computed(() => ({
  ...floatingPanelStyle.value
}))

function syncFloating() {
  const trigger = triggerRef.value
  if (!isOpen.value || !trigger) {
    floatingPanelStyle.value = {}
    return
  }
  const { style } = getFloatingPanelStyle(trigger, panelRef.value, {
    placement: 'bottom-start',
    matchTriggerWidth: true,
    offset: 4
  })
  floatingPanelStyle.value = style
}

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
  if (isDisabled.value) return
  toggle()
}

const handleTriggerBlur = () => {
  void validateOnBlur()
}

const handleItemClick = (menuIndex: number, option: CascaderOption) => {
  if (option.disabled) return
  activePath.value = activePath.value.slice(0, menuIndex)
  activePath.value.push(option)
  focusCol.value = menuIndex
  focusRow.value = Math.max(
    0,
    (menus.value[menuIndex] ?? []).findIndex((o) => o.value === option.value)
  )
  if (!option.children?.length) {
    emit('update:modelValue', option.value)
    emit('change', option.value)
    void validateOnChange()
    close()
    activePath.value = []
    floatingPanelStyle.value = {}
  }
}

const handleItemHover = (menuIndex: number, option: CascaderOption) => {
  if (option.disabled) return
  activePath.value = activePath.value.slice(0, menuIndex)
  activePath.value.push(option)
  focusCol.value = menuIndex
  focusRow.value = Math.max(
    0,
    (menus.value[menuIndex] ?? []).findIndex((o) => o.value === option.value)
  )
}

function commitFocused() {
  const menu = menus.value[focusCol.value] ?? []
  const option = menu[focusRow.value]
  if (!option || option.disabled) return
  handleItemClick(focusCol.value, option)
}

function handlePanelKeydown(event: KeyboardEvent) {
  if (!isOpen.value) return
  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })
  if (action === 'none') {
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      const menu = menus.value[focusCol.value] ?? []
      const option = menu[focusRow.value]
      if (option?.children?.length) {
        handleItemHover(focusCol.value, option)
        focusCol.value = Math.min(menus.value.length - 1, focusCol.value + 1)
        focusRow.value = 0
      }
      return
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      if (focusCol.value > 0) {
        focusCol.value -= 1
        activePath.value = activePath.value.slice(0, focusCol.value)
        focusRow.value = Math.max(
          0,
          (menus.value[focusCol.value] ?? []).findIndex(
            (o) => o.value === activePath.value[focusCol.value]?.value
          )
        )
      }
      return
    }
    return
  }
  event.preventDefault()
  if (action === 'close') {
    close()
    floatingPanelStyle.value = {}
    triggerRef.value?.focus?.()
    return
  }
  const count = (menus.value[focusCol.value] ?? []).length
  if (
    action === 'next' ||
    action === 'prev' ||
    action === 'first' ||
    action === 'last'
  ) {
    focusRow.value = moveRovingIndex(focusRow.value, action, count, true)
    const option = (menus.value[focusCol.value] ?? [])[focusRow.value]
    if (option) handleItemHover(focusCol.value, option)
    return
  }
  if (action === 'select') commitFocused()
}

function handleTriggerKeydown(event: KeyboardEvent) {
  if (isDisabled.value) return
  const action = resolveKeyboardNavAction(event, { orientation: 'vertical' })
  if (!isOpen.value) {
    if (action === 'next' || action === 'select' || event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen.value) toggle()
      focusCol.value = 0
      focusRow.value = 0
    }
    return
  }
  handlePanelKeydown(event)
}

watch(isOpen, (open) => {
  if (open) {
    focusCol.value = 0
    focusRow.value = 0
    nextTick(syncFloating)
  } else {
    floatingPanelStyle.value = {}
  }
})

watch(menus, () => {
  if (isOpen.value) nextTick(syncFloating)
})
</script>

<template>
  <div :class="['vp-cascader', props.class]" :style="style">
    <button
      ref="triggerRef"
      v-bind="nativeAttrs"
      :id="inputId"
      type="button"
      class="vp-cascader__trigger"
      role="combobox"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      :aria-invalid="isInvalid || undefined"
      :aria-required="isRequired || undefined"
      :aria-describedby="ariaDescribedby"
      :disabled="isDisabled"
      @click="handleTriggerClick"
      @blur="handleTriggerBlur"
      @keydown="handleTriggerKeydown"
    >
      <span
        :class="['vp-cascader__label', { 'vp-cascader__label--placeholder': isPlaceholder }]"
      >
        {{ isPlaceholder ? placeholder : displayLabel }}
      </span>
      <span class="vp-cascader__icon" aria-hidden="true">•</span>
    </button>

    <div
      v-if="isOpen"
      ref="panelRef"
      class="vp-cascader__panel"
      :style="panelMergedStyle"
      @keydown="handlePanelKeydown"
    >
      <div v-for="(menu, menuIndex) in menus" :key="menuIndex" class="vp-cascader__menu">
        <div
          v-for="(option, rowIndex) in menu"
          :key="String(option.value)"
          :class="[
            'vp-cascader__item',
            {
              'vp-cascader__item--active':
                activePath[menuIndex]?.value === option.value ||
                (menuIndex === focusCol && rowIndex === focusRow),
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
