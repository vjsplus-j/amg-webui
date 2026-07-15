<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { PagerNavProps, PagerNavEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<PagerNavProps & { totalPages?: number }>(), {
  items: () => [],
  direction: 'horizontal',
  disabled: false
})
const emit = defineEmits<PagerNavEmits>()
const { t } = useLocale()

const rootClass = computed(() => [
  'vp-pager-nav',
  `vp-pager-nav--${props.direction}`,
  props.class
])

const page = computed({
  get: () => Number(props.modelValue ?? 1),
  set: (v: number) => {
    emit('update:modelValue', v)
    emit('change', v)
  }
})

const totalPages = computed(() =>
  Math.max(1, Number(props.totalPages ?? (props.items?.length || 1)))
)

function go(p: number) {
  if (p < 1 || p > totalPages.value || props.disabled) return
  page.value = p
}
</script>

<template>
  <nav :class="rootClass" :style="style" :aria-label="t(LocaleKeys.common.actions)">
    <button
      type="button"
      class="vp-pager-nav__btn"
      :disabled="disabled || page <= 1"
      :aria-label="t('common.previous')"
      @click="go(page - 1)"
    >
      
    </button>
    <button
      v-for="p in totalPages"
      :key="p"
      type="button"
      :class="['vp-pager-nav__item', { 'vp-pager-nav__item--active': p === page }]"
      :disabled="disabled"
      @click="go(p)"
    >
      {{ p }}
    </button>
    <button
      type="button"
      class="vp-pager-nav__btn"
      :disabled="disabled || page >= totalPages"
      :aria-label="t('common.next')"
      @click="go(page + 1)"
    >
      
    </button>
  </nav>
</template>
