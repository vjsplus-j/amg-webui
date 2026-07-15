<script setup lang="ts">
import { computed } from 'vue'
import type { GroupNavProps, GroupNavEmits, NavItem } from './types'
import './style.scss'

const props = withDefaults(defineProps<GroupNavProps>(), {
  items: () => [],
  direction: 'vertical',
  disabled: false
})
const emit = defineEmits<GroupNavEmits>()

const rootClass = computed(() => [
  'vp-group-nav',
  `vp-group-nav--${props.direction}`,
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
  <nav :class="rootClass" :style="style">
    <section v-for="(group, gi) in items" :key="gi" class="vp-group-nav__group">
      <h4 class="vp-group-nav__heading">{{ group.label }}</h4>
      <div class="vp-group-nav__items">
        <button
          v-for="(child, ci) in group.children ?? []"
          :key="ci"
          type="button"
          :class="['vp-group-nav__item', { 'vp-group-nav__item--active': (child.value ?? child.label) === modelValue }]"
          :disabled="disabled || child.disabled"
          @click="selectItem(child, $event)"
        >{{ child.label }}</button>
      </div>
    </section>
  </nav>
</template>
