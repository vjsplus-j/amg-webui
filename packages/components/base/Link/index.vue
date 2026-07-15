<script setup lang="ts">
import { getCurrentInstance, onBeforeUnmount, ref } from 'vue'
import type {
  LinkClickGuard,
  LinkIconPos,
  LinkPermissionMode,
  LinkProps,
  LinkType,
  LinkUnderline
} from './types'
import type { Size } from '@amg-webui/types'
import { useLink } from './useLink'
import Icon from '../Icon/index.vue'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

/**
 * Inline props ? SFC does not expand imported `LinkProps` into runtime options.
 * `permission` must default `true` (Vue Boolean omit ? false would hide every Link).
 */
const props = withDefaults(
  defineProps<{
    href?: string
    to?: string
    type?: LinkType
    size?: Size
    underline?: LinkUnderline
    disabled?: boolean
    readonly?: boolean
    loading?: boolean
    target?: '_self' | '_blank' | '_parent' | '_top' | string
    replace?: boolean
    icon?: string
    iconPos?: LinkIconPos
    iconSize?: Size
    iconGap?: Size | string
    ariaLabel?: string
    tooltip?: string
    stopPropagation?: boolean
    permission?: boolean | (() => boolean)
    permissionMode?: LinkPermissionMode
    permissionTip?: string
    beforeClick?: LinkProps['beforeClick']
    clickGuard?: LinkClickGuard
    wait?: number
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    telemetry: undefined,
    type: 'default',
    size: 'md',
    underline: 'hover',
    disabled: false,
    readonly: false,
    loading: false,
    iconPos: 'left',
    permission: true,
    permissionMode: 'hide',
    clickGuard: 'none',
    stopPropagation: false,
    replace: false
  }
)

const emit = defineEmits<{
  click: [event: MouseEvent]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const {
  safeHref,
  isAnchor,
  linkClass,
  linkStyle,
  iconTokenSize,
  hideByPermission,
  isInteractiveLocked,
  resolvedWait,
  resolvedGuard,
  nativeTitle
} = useLink(props)

const guardTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const throttleLocked = ref(false)

onBeforeUnmount(() => {
  if (guardTimer.value) clearTimeout(guardTimer.value)
})

function navigate(event: MouseEvent) {
  if (props.href && isSafeNavHref()) {
    /* let the browser follow the anchor */
    return
  }
  if (!props.to) return
  event.preventDefault()
  const router = getCurrentInstance()?.appContext.config.globalProperties.$router as
    | { push: (t: string) => void; replace: (t: string) => void }
    | undefined
  if (router) {
    if (props.replace) router.replace(props.to)
    else router.push(props.to)
    return
  }
  if (props.target === '_blank') {
    window.open(props.to, '_blank', 'noopener,noreferrer')
  } else if (props.replace) {
    window.location.replace(props.to)
  } else {
    window.location.assign(props.to)
  }
}

function isSafeNavHref() {
  return Boolean(props.href && safeHref.value === props.href)
}

async function runBeforeClick(event: MouseEvent): Promise<boolean> {
  if (!props.beforeClick) return true
  try {
    const result = await props.beforeClick(event)
    return result !== false
  } catch {
    return false
  }
}

function emitClick(event: MouseEvent) {
  trackEmit({
    component: 'Link',
    type: 'click',
    trackId: props.trackId,
    telemetry: props.telemetry,
    name: props.ariaLabel || props.tooltip || undefined
  })
  emit('click', event)
  navigate(event)
}

function guardedEmit(event: MouseEvent) {
  const wait = resolvedWait.value
  const mode = resolvedGuard.value
  if (mode === 'debounce') {
    if (guardTimer.value) clearTimeout(guardTimer.value)
    guardTimer.value = setTimeout(() => {
      guardTimer.value = null
      emitClick(event)
    }, wait)
    return
  }
  if (mode === 'throttle') {
    if (throttleLocked.value) return
    throttleLocked.value = true
    emitClick(event)
    window.setTimeout(() => {
      throttleLocked.value = false
    }, wait)
    return
  }
  emitClick(event)
}

async function handleClick(event: MouseEvent) {
  if (props.stopPropagation) event.stopPropagation()

  if (hideByPermission.value) {
    event.preventDefault()
    event.stopPropagation()
    trackEmit({
      component: 'Link',
      type: 'permissionDenied',
      category: 'alert',
      trackId: props.trackId,
      telemetry: props.telemetry,
      name: props.ariaLabel || props.tooltip || undefined
    })
    return
  }
  if (isInteractiveLocked.value) {
    event.preventDefault()
    event.stopPropagation()
    trackEmit({
      component: 'Link',
      type: 'disabledClick',
      category: 'alert',
      trackId: props.trackId,
      telemetry: props.telemetry,
      name: props.ariaLabel || props.tooltip || undefined
    })
    return
  }

  if (!(await runBeforeClick(event))) {
    event.preventDefault()
    return
  }

  guardedEmit(event)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') return
  event.preventDefault()
  handleClick(event as unknown as MouseEvent)
}

function onFocus(event: FocusEvent) {
  emit('focus', event)
}

function onBlur(event: FocusEvent) {
  emit('blur', event)
}
</script>

<template>
  <template v-if="!hideByPermission">
    <a
      v-if="isAnchor"
      :class="linkClass"
      :style="linkStyle"
      :href="safeHref"
      :target="target"
      :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
      :aria-label="ariaLabel"
      :aria-busy="loading || undefined"
      :title="nativeTitle"
      @click="handleClick"
      @focus="onFocus"
      @blur="onBlur"
    >
      <Icon
        v-if="loading || (icon && iconPos === 'left')"
        :name="loading ? 'Loader2' : icon!"
        :size="iconTokenSize"
        :spin="loading"
        class="vp-link__icon"
      />
      <span class="vp-link__text"><slot /></span>
      <Icon
        v-if="!loading && icon && iconPos === 'right'"
        :name="icon"
        :size="iconTokenSize"
        class="vp-link__icon"
      />
    </a>
    <span
      v-else
      :class="linkClass"
      :style="linkStyle"
      role="link"
      :aria-disabled="isInteractiveLocked || undefined"
      :aria-busy="loading || undefined"
      :aria-label="ariaLabel"
      :title="nativeTitle"
      :tabindex="isInteractiveLocked ? -1 : 0"
      @click="handleClick"
      @keydown="handleKeydown"
      @focus="onFocus"
      @blur="onBlur"
    >
      <Icon
        v-if="loading || (icon && iconPos === 'left')"
        :name="loading ? 'Loader2' : icon!"
        :size="iconTokenSize"
        :spin="loading"
        class="vp-link__icon"
      />
      <span class="vp-link__text"><slot /></span>
      <Icon
        v-if="!loading && icon && iconPos === 'right'"
        :name="icon"
        :size="iconTokenSize"
        class="vp-link__icon"
      />
    </span>
  </template>
</template>
