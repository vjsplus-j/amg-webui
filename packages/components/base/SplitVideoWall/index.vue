<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { SplitVideoWallProps, SplitVideoWallEmits, WallLayout } from './types'
import './style.scss'

const props = withDefaults(defineProps<SplitVideoWallProps>(), { layout: 4, selected: 0, disabled: false })
const emit = defineEmits<SplitVideoWallEmits>()
const { t } = useLocale()
const count = computed(() => props.layout)
const cells = computed(() => Array.from({ length: count.value }, (_, i) => i))
function setLayout(l: WallLayout) { emit('layout-change', l) }
function selectCell(i: number) { if (props.disabled) return; emit('update:selected', i); emit('select', i) }
</script>

<template>
  <div :class="['vp-split-video-wall', props.class]" :style="style" data-component="SplitVideoWall">
    <div class="vp-split-video-wall__toolbar">
      <button type="button" class="vp-split-video-wall__btn" :class="{ 'vp-split-video-wall__btn--active': layout === 1 }" :disabled="disabled" @click="setLayout(1)">{{ t('industry.video.layout1') }}</button>
      <button type="button" class="vp-split-video-wall__btn" :class="{ 'vp-split-video-wall__btn--active': layout === 4 }" :disabled="disabled" @click="setLayout(4)">{{ t('industry.video.layout4') }}</button>
      <button type="button" class="vp-split-video-wall__btn" :class="{ 'vp-split-video-wall__btn--active': layout === 9 }" :disabled="disabled" @click="setLayout(9)">{{ t('industry.video.layout9') }}</button>
    </div>
    <div :class="['vp-split-video-wall__grid', 'vp-split-video-wall__grid--' + layout]">
      <button v-for="i in cells" :key="i" type="button" :class="['vp-split-video-wall__cell', { 'vp-split-video-wall__cell--active': selected === i }]" :disabled="disabled" :aria-label="t('industry.video.cell') + ' ' + (i + 1)" @click="selectCell(i)">
        <slot :name="'cell-' + i" :index="i"><span class="vp-split-video-wall__muted">{{ t('industry.video.noSignal') }}</span></slot>
      </button>
    </div>
  </div>
</template>
