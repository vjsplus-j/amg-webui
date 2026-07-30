import { computed } from 'vue'
import { trackEmit } from '@amg-webui/telemetry'
import type { NavItem } from './types'
import { isNavItemActive, navItemValue } from './navItemValue'

type NavEmit = {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: NavItem, event: MouseEvent): void
}

export interface NavSelectionProps {
  modelValue?: string | number
  disabled?: boolean
  trackId?: string
  telemetry?: boolean
}

/** Shared v-model + select / trackEmit path for flat nav lists. */
export function useNavSelection(
  props: NavSelectionProps,
  emit: NavEmit,
  component: string
) {
  const active = computed({
    get: () => props.modelValue,
    set: (v: string | number) => {
      emit('update:modelValue', v)
      emit('change', v)
    }
  })

  function selectItem(item: NavItem, e: MouseEvent) {
    if (item.disabled || props.disabled) return
    const v = navItemValue(item)
    trackEmit({
      component,
      type: 'select',
      trackId: props.trackId,
      telemetry: props.telemetry,
      payload: { value: v }
    })
    active.value = v
    emit('select', item, e)
  }

  function isActive(item: NavItem) {
    return isNavItemActive(item, props.modelValue)
  }

  return { active, selectItem, isActive, navItemValue }
}
