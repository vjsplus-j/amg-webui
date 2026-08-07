<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { trackEmit } from '@amg-webui/telemetry'
import Icon from '@amg-webui/core/Icon/index.vue'
import type { PagerNavProps, PagerNavEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<PagerNavProps>(), {
  modelValue: 1,
  totalPages: 1,
  direction: 'horizontal',
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<PagerNavEmits>()
const { t } = useLocale()

const rootClass = computed(() => [
  'vp-pager-nav',
  `vp-pager-nav--${props.direction}`,
  { 'vp-pager-nav--disabled': props.disabled },
  props.class
])

const page = computed(() => Math.max(1, Number(props.modelValue ?? 1)))

const pages = computed(() => Math.max(1, Number(props.totalPages ?? 1)))

const resolvedAria = computed(
  () => props.ariaLabel || t('component.pager-nav.title')
)

function go(p: number) {
  if (props.disabled) return
  if (p < 1 || p > pages.value || p === page.value) return
  trackEmit({
    component: 'PagerNav',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { page: p }
  })
  emit('update:modelValue', p)
  emit('change', p)
}
</script>

<template>
  <nav
    :class="rootClass"
    :style="style"
    data-component="PagerNav"
    :aria-label="resolvedAria"
  >
    <button
      type="button"
      class="vp-pager-nav__btn"
      :disabled="disabled || page <= 1"
      :aria-label="t(LocaleKeys.common.previous)"
      @click="go(page - 1)"
    >
      <Icon name="ChevronLeft" size="sm" aria-hidden="true" />
    </button>
    <button
      v-for="p in pages"
      :key="p"
      type="button"
      class="vp-pager-nav__item"
      :class="{ 'vp-pager-nav__item--active': p === page }"
      :disabled="disabled"
      :aria-current="p === page ? 'page' : undefined"
      :aria-label="String(p)"
      @click="go(p)"
    >
      {{ p }}
    </button>
    <button
      type="button"
      class="vp-pager-nav__btn"
      :disabled="disabled || page >= pages"
      :aria-label="t(LocaleKeys.common.next)"
      @click="go(page + 1)"
    >
      <Icon name="ChevronRight" size="sm" aria-hidden="true" />
    </button>
  </nav>
</template>
