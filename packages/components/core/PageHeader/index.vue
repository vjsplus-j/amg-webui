<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import Icon from '@amg-webui/core/Icon/index.vue'
import type { PageHeaderEmits, PageHeaderProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<PageHeaderProps>(), {
  back: false,
  telemetry: undefined
})

const emit = defineEmits<PageHeaderEmits>()
const { t } = useLocale()

const backAriaLabel = computed(
  () => props.backLabel || t(LocaleKeys.component.pageHeader.back)
)

function onBack(event: MouseEvent) {
  emit('back', event)
}
</script>

<template>
  <header
    class="vp-page-header"
    :class="props.class"
    :style="props.style"
    data-component="PageHeader"
  >
    <div v-if="$slots.breadcrumb" class="vp-page-header__breadcrumb">
      <slot name="breadcrumb" />
    </div>

    <div class="vp-page-header__main">
      <div class="vp-page-header__heading">
        <slot name="back">
          <button
            v-if="back"
            type="button"
            class="vp-page-header__back"
            :aria-label="backAriaLabel"
            @click="onBack"
          >
            <Icon name="ChevronLeft" size="md" aria-hidden="true" />
          </button>
        </slot>

        <div class="vp-page-header__titles">
          <slot name="title">
            <h1 v-if="title" class="vp-page-header__title">{{ title }}</h1>
          </slot>
          <slot name="subtitle">
            <p v-if="subtitle" class="vp-page-header__subtitle">{{ subtitle }}</p>
          </slot>
        </div>
      </div>

      <div v-if="$slots.extra" class="vp-page-header__extra">
        <slot name="extra" />
      </div>
    </div>

    <div v-if="$slots.default" class="vp-page-header__content">
      <slot />
    </div>
  </header>
</template>
