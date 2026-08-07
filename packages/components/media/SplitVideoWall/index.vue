<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { SplitVideoWallProps, SplitVideoWallEmits, WallLayout } from './types'
import './style.scss'

const props = withDefaults(defineProps<SplitVideoWallProps>(), {
  layout: 4,
  selected: 0,
  disabled: false,
  layouts: () => [1, 4, 9],
  showToolbar: true,
  keyboard: true,
  aspectRatio: '16 / 9'
})
const emit = defineEmits<SplitVideoWallEmits>()
const { t } = useLocale()

const currentLayout = computed(() => props.layout)
const selectedIndex = computed(() => props.modelValue ?? props.selected)
const count = computed(() => currentLayout.value)
const cells = computed(() => Array.from({ length: count.value }, (_, i) => i))
const columns = computed(() => {
  if (currentLayout.value === 1) return 1
  if (currentLayout.value === 4) return 2
  if (currentLayout.value === 6 || currentLayout.value === 9) return 3
  return 4
})
const rootStyle = computed(() => ({
  ...props.style,
  '--vp-split-video-wall-columns': String(columns.value),
  '--vp-split-video-wall-aspect': props.aspectRatio
}))

function layoutLabel(layout: WallLayout) {
  return t(`industry.video.layout${layout}`)
}

function setLayout(l: WallLayout) {
  if (props.disabled || l === currentLayout.value) return
  emit('update:layout', l)
  emit('layout-change', l)
  const maxIndex = l - 1
  if (selectedIndex.value > maxIndex) selectCell(maxIndex)
}

function selectCell(i: number) {
  if (props.disabled) return
  emit('update:modelValue', i)
  emit('update:selected', i)
  emit('select', i)
}

function move(delta: number) {
  const next = Math.min(count.value - 1, Math.max(0, selectedIndex.value + delta))
  selectCell(next)
}

function onKeydown(event: KeyboardEvent) {
  if (!props.keyboard || props.disabled) return
  if (event.key === 'ArrowRight') {
    event.preventDefault()
    move(1)
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    move(-1)
  } else if (event.key === 'ArrowDown') {
    event.preventDefault()
    move(columns.value)
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    move(-columns.value)
  } else if (event.key === 'Home') {
    event.preventDefault()
    selectCell(0)
  } else if (event.key === 'End') {
    event.preventDefault()
    selectCell(count.value - 1)
  }
}

defineExpose({ setLayout, selectCell })
</script>

<template>
  <div
    :class="['vp-split-video-wall', { 'vp-split-video-wall--disabled': disabled }, props.class]"
    :style="rootStyle"
    data-component="SplitVideoWall"
    role="group"
    :aria-label="t('component.split-video-wall.title')"
    :aria-disabled="disabled || undefined"
  >
    <div v-if="showToolbar" class="vp-split-video-wall__toolbar" role="toolbar" :aria-label="t('component.split-video-wall.title')">
      <button
        v-for="item in layouts"
        :key="item"
        type="button"
        class="vp-split-video-wall__btn"
        :class="{ 'vp-split-video-wall__btn--active': currentLayout === item }"
        :disabled="disabled"
        :aria-pressed="currentLayout === item"
        @click="setLayout(item)"
      >
        {{ layoutLabel(item) }}
      </button>
    </div>
    <div class="vp-split-video-wall__grid" role="grid" :aria-rowcount="Math.ceil(count / columns)" :aria-colcount="columns" @keydown="onKeydown">
      <button
        v-for="i in cells"
        :key="i"
        type="button"
        :class="['vp-split-video-wall__cell', { 'vp-split-video-wall__cell--active': selectedIndex === i }]"
        :disabled="disabled"
        role="gridcell"
        :aria-selected="selectedIndex === i"
        :aria-label="t('industry.video.cell') + ' ' + (i + 1)"
        @click="selectCell(i)"
      >
        <slot :name="'cell-' + i" :index="i"><span class="vp-split-video-wall__muted">{{ t('industry.video.noSignal') }}</span></slot>
      </button>
    </div>
  </div>
</template>
