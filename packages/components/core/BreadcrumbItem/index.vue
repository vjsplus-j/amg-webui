<script setup lang="ts">
import { computed, inject, ref } from 'vue'
import { trackEmit } from '@amg-webui/telemetry'
import { BREADCRUMB_INJECTION_KEY } from '../Breadcrumb/types'
import './style.scss'

/**
 * Inline props — SFC does not expand imported `*Props` that extend BaseProps.
 */
const props = withDefaults(
  defineProps<{
    to?: string
    href?: string
    current?: boolean
    disabled?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    telemetry: undefined,
    disabled: false
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const ctx = inject(BREADCRUMB_INJECTION_KEY, {
  separator: ref('/'),
  separatorSlot: computed(() => undefined),
  inList: false
})

const rootTag = computed(() => (ctx.inList ? 'li' : 'div'))

const isLink = computed(() => Boolean(props.href || props.to) && !props.disabled)
const linkHref = computed(() => props.href ?? props.to)

/** Host Breadcrumb `#separator` slot nodes (if any). */
const hostSepNodes = computed(() => {
  const slot = ctx.separatorSlot?.value
  return slot ? slot() : null
})

function onClick(event: MouseEvent) {
  if (props.disabled) {
    event.preventDefault()
    return
  }
  trackEmit({
    component: 'BreadcrumbItem',
    type: 'click',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { href: props.href, to: props.to }
  })
  emit('click', event)
}
</script>

<template>
  <component
    :is="rootTag"
    :class="[
      'vp-breadcrumb-item',
      {
        'vp-breadcrumb-item--disabled': disabled,
        'vp-breadcrumb-item--current': current
      },
      props.class
    ]"
    :style="style"
  >
    <a
      v-if="isLink"
      :href="linkHref"
      class="vp-breadcrumb-item__link"
      :aria-current="current ? 'page' : undefined"
      @click="onClick"
    >
      <slot />
    </a>
    <span
      v-else
      class="vp-breadcrumb-item__text"
      :aria-current="current ? 'page' : undefined"
    >
      <slot />
    </span>
    <span class="vp-breadcrumb-item__separator" aria-hidden="true">
      <slot name="separator">
        <template v-if="hostSepNodes">
          <component :is="() => hostSepNodes" />
        </template>
        <template v-else>{{ ctx.separator.value }}</template>
      </slot>
    </span>
  </component>
</template>
