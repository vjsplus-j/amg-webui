<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TransferProps, TransferEmits, TransferItem } from './types'
import { useVirtualWindow } from './useVirtualWindow'
import './style.scss'

const props = withDefaults(defineProps<TransferProps>(), {
  data: () => [],
  modelValue: () => [],
  filterable: false
})

const emit = defineEmits<TransferEmits>()

const leftFilter = ref('')
const rightFilter = ref('')
const leftChecked = ref<(string | number)[]>([])
const rightChecked = ref<(string | number)[]>([])

const selectedSet = computed(() => new Set(props.modelValue ?? []))

const leftItems = computed(() =>
  (props.data ?? []).filter((item) => !selectedSet.value.has(item.key))
)

const rightItems = computed(() =>
  (props.data ?? []).filter((item) => selectedSet.value.has(item.key))
)

const filterItems = (items: TransferItem[], query: string) => {
  if (!query) return items
  const q = query.toLowerCase()
  return items.filter((item) => item.label.toLowerCase().includes(q))
}

const filteredLeft = computed(() => filterItems(leftItems.value, leftFilter.value))
const filteredRight = computed(() => filterItems(rightItems.value, rightFilter.value))

const leftVirtual = useVirtualWindow(filteredLeft)
const rightVirtual = useVirtualWindow(filteredRight)

const rootClass = computed(() => [
  'vp-transfer',
  { 'vp-transfer--disabled': props.disabled },
  props.class
])

const emitKeys = (keys: (string | number)[]) => {
  emit('update:modelValue', keys)
  emit('change', keys)
}

const toggleCheck = (list: (string | number)[], key: string | number, checked: boolean) => {
  const set = new Set(list)
  if (checked) set.add(key)
  else set.delete(key)
  return [...set]
}

const moveToRight = () => {
  if (props.disabled || !leftChecked.value.length) return
  const next = [...new Set([...(props.modelValue ?? []), ...leftChecked.value])]
  leftChecked.value = []
  emitKeys(next)
}

const moveToLeft = () => {
  if (props.disabled || !rightChecked.value.length) return
  const remove = new Set(rightChecked.value)
  const next = (props.modelValue ?? []).filter((k) => !remove.has(k))
  rightChecked.value = []
  emitKeys(next)
}
</script>

<template>
  <div :class="rootClass" :style="style">
    <div class="vp-transfer__panel">
      <div class="vp-transfer__header">
        <slot name="left-title" :count="leftItems.length" />
      </div>
      <div v-if="filterable" class="vp-transfer__filter">
        <input v-model="leftFilter" type="text" />
      </div>
      <div class="vp-transfer__body" @scroll="leftVirtual.onScroll">
        <div class="vp-transfer__list" :style="{ height: `${leftVirtual.totalHeight.value}px` }">
          <div :style="{ transform: `translateY(${leftVirtual.offsetY.value}px)` }">
            <label
              v-for="{ item } in leftVirtual.visibleItems.value"
              :key="item.key"
              class="vp-transfer__item"
              :class="{ 'vp-transfer__item--disabled': item.disabled }"
              :style="{ height: `${leftVirtual.ITEM_HEIGHT}px` }"
            >
              <input
                type="checkbox"
                :checked="leftChecked.includes(item.key)"
                :disabled="item.disabled || disabled"
                @change="leftChecked = toggleCheck(leftChecked, item.key, ($event.target as HTMLInputElement).checked)"
              />
              <span>{{ item.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <div class="vp-transfer__actions">
      <button
        type="button"
        class="vp-transfer__action"
        :disabled="disabled || !leftChecked.length"
        aria-label="move right"
        @click="moveToRight"
      >
        ?
      </button>
      <button
        type="button"
        class="vp-transfer__action"
        :disabled="disabled || !rightChecked.length"
        aria-label="move left"
        @click="moveToLeft"
      >
        ?
      </button>
    </div>

    <div class="vp-transfer__panel">
      <div class="vp-transfer__header">
        <slot name="right-title" :count="rightItems.length" />
      </div>
      <div v-if="filterable" class="vp-transfer__filter">
        <input v-model="rightFilter" type="text" />
      </div>
      <div class="vp-transfer__body" @scroll="rightVirtual.onScroll">
        <div class="vp-transfer__list" :style="{ height: `${rightVirtual.totalHeight.value}px` }">
          <div :style="{ transform: `translateY(${rightVirtual.offsetY.value}px)` }">
            <label
              v-for="{ item } in rightVirtual.visibleItems.value"
              :key="item.key"
              class="vp-transfer__item"
              :class="{ 'vp-transfer__item--disabled': item.disabled }"
              :style="{ height: `${rightVirtual.ITEM_HEIGHT}px` }"
            >
              <input
                type="checkbox"
                :checked="rightChecked.includes(item.key)"
                :disabled="item.disabled || disabled"
                @change="rightChecked = toggleCheck(rightChecked, item.key, ($event.target as HTMLInputElement).checked)"
              />
              <span>{{ item.label }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
