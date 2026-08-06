<script setup lang="ts">
import { computed, getCurrentInstance, ref, useSlots, watch } from 'vue'
import type { ButtonProps, ButtonEmits } from './types'
import { useButton } from './useButton'
import Icon from '../Icon/index.vue'
import Popconfirm from '../Popconfirm/index.vue'
import ButtonSplitMenu from './ButtonSplitMenu.vue'
import { isSafeHref, reportBlockedHref } from '@amg-webui/security'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

/** Inline intersection — SFC compiler does not expand imported `extends MotionProps`. */
type ButtonPropsWithMotion = ButtonProps & {
  spin?: boolean
  pulse?: boolean
  heartbeat?: boolean
  bounce?: boolean
  blink?: boolean
  breathe?: boolean
  glow?: boolean
  marqueeLeft?: boolean
  marqueeRight?: boolean
  scrollUp?: boolean
  scrollDown?: boolean
  dampOut?: boolean
  animationDuration?: number | string
}

const props = withDefaults(defineProps<ButtonPropsWithMotion>(), {
  label: '',
  iconPos: 'left',
  severity: undefined,
  variant: undefined,
  size: undefined,
  shape: 'rect',
  type: 'button',
  star: false,
  rated: false,
  /**
   * Vue casts omitted Boolean props to `false`. Default must be `true`
   * so unspecified `permission` stays allowed (hide mode would otherwise blank every Button).
   */
  permission: true,
  permissionMode: 'hide',
  replace: false,
  /** Omitted must stay `undefined` (inherit global); `false` only when explicitly set. */
  telemetry: undefined,
  spin: false,
  pulse: false,
  heartbeat: false,
  bounce: false,
  blink: false,
  breathe: false,
  glow: false,
  marqueeLeft: false,
  marqueeRight: false,
  scrollUp: false,
  scrollDown: false,
  dampOut: false
})

const emit = defineEmits<ButtonEmits>()
const slots = useSlots()

const iconOnly = computed(
  () =>
    !props.label &&
    !slots.default &&
    !props.loadingText &&
    Boolean(props.icon || props.img || slots.icon || props.loading)
)

const {
  buttonClass,
  buttonStyle,
  isDisabled,
  isReadonly,
  isInteractiveLocked,
  isLoading,
  hideByPermission,
  disableByPermission,
  permissionDenied,
  showStar,
  badgeText,
  resolvedSize,
  resolvedWait,
  resolvedGuard,
  resolvedRipple
} = useButton(props, { iconOnly })

const resolvedAriaLabel = computed(() => {
  if (props.ariaLabel) return props.ariaLabel
  if (iconOnly.value && props.label) return props.label
  return undefined
})

const showIconSlot = computed(() => Boolean(slots.icon || props.icon))
const iconTokenSize = computed(() => props.iconSize ?? resolvedSize.value)

const titleAttr = computed(() => {
  if (isDisabled.value && props.disabledTitle) return props.disabledTitle
  if (disableByPermission.value && props.permissionTip) return props.permissionTip
  return props.title
})

const safeHref = computed(() => {
  if (props.href && isSafeHref(props.href)) return props.href
  if (props.href) reportBlockedHref(props.href)
  return undefined
})

const isAnchor = computed(() => Boolean(safeHref.value) && !isDisabled.value)
const tagName = computed(() => (isAnchor.value ? 'a' : 'button'))

const confirmVisible = ref(false)
const confirmMessage = computed(() => {
  if (typeof props.confirm === 'string' && props.confirm) return props.confirm
  return props.confirmTitle || ''
})
const needsConfirm = computed(() => Boolean(props.confirm))
const hasDropdown = computed(() => Boolean(slots.dropdown))

const ripples = ref<{ id: number; x: number; y: number }[]>([])
let rippleId = 0

const guardTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const throttleLocked = ref(false)

watch(isLoading, (v) => {
  if (!v && guardTimer.value) {
    clearTimeout(guardTimer.value)
    guardTimer.value = null
  }
})

function spawnRipple(event: MouseEvent, el: HTMLElement) {
  if (!resolvedRipple.value) return
  const rect = el.getBoundingClientRect()
  const id = ++rippleId
  ripples.value.push({
    id,
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  })
  window.setTimeout(() => {
    ripples.value = ripples.value.filter((r) => r.id !== id)
  }, 480)
}

function navigate(event: MouseEvent) {
  if (safeHref.value) {
    if (props.target === '_blank') {
      event.preventDefault()
      window.open(safeHref.value, '_blank', 'noopener,noreferrer')
    }
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
    component: 'Button',
    type: 'click',
    trackId: props.trackId,
    telemetry: props.telemetry,
    name: props.ariaLabel || props.label || undefined
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
  if (hideByPermission.value) {
    event.preventDefault()
    event.stopPropagation()
    trackEmit({
      component: 'Button',
      type: 'permissionDenied',
      category: 'alert',
      trackId: props.trackId,
      telemetry: props.telemetry,
      name: props.ariaLabel || props.label || undefined
    })
    return
  }
  if (isInteractiveLocked.value) {
    event.preventDefault()
    event.stopPropagation()
    trackEmit({
      component: 'Button',
      type: 'disabledClick',
      category: 'alert',
      trackId: props.trackId,
      telemetry: props.telemetry,
      name: props.ariaLabel || props.label || undefined
    })
    return
  }
  if (permissionDenied.value && props.permissionMode === 'disable') {
    event.preventDefault()
    event.stopPropagation()
    trackEmit({
      component: 'Button',
      type: 'permissionDenied',
      category: 'alert',
      trackId: props.trackId,
      telemetry: props.telemetry,
      name: props.ariaLabel || props.label || undefined
    })
    return
  }

  const el = event.currentTarget as HTMLElement | null
  if (el) spawnRipple(event, el)

  if (needsConfirm.value) {
    event.preventDefault()
    event.stopPropagation()
    confirmVisible.value = true
    return
  }

  if (!(await runBeforeClick(event))) {
    event.preventDefault()
    return
  }

  guardedEmit(event)
}

async function onConfirm(event: Event) {
  confirmVisible.value = false
  emit('confirm', event)
  const fake = event as unknown as MouseEvent
  if (!(await runBeforeClick(fake))) return
  guardedEmit(fake)
}

function onCancelConfirm(event: Event) {
  confirmVisible.value = false
  emit('cancelConfirm', event)
}

function handleFocus(event: FocusEvent) {
  emit('focus', event)
}

function handleBlur(event: FocusEvent) {
  emit('blur', event)
}

function handleKeydown(event: KeyboardEvent) {
  if (isInteractiveLocked.value) return
  if (isAnchor.value && event.key === ' ') {
    event.preventDefault()
    ;(event.currentTarget as HTMLElement).click()
  }
}
</script>

<template>
  <template v-if="!hideByPermission">
    <Popconfirm
      v-if="needsConfirm"
      :visible="confirmVisible"
      :title="confirmMessage"
      @update:visible="confirmVisible = $event"
      @confirm="onConfirm"
      @cancel="onCancelConfirm"
    >
      <template #trigger>
        <span class="vp-button-host" :class="{ 'vp-button-split': hasDropdown }">
          <component
            :is="tagName"
            :class="[buttonClass, { 'vp-button--split-main': hasDropdown }]"
            :href="isAnchor ? safeHref : undefined"
            :target="isAnchor ? target : undefined"
            :rel="isAnchor && target === '_blank' ? 'noopener noreferrer' : undefined"
            :type="isAnchor ? undefined : type"
            :disabled="isAnchor ? undefined : isDisabled"
            :aria-disabled="isDisabled || isReadonly ? true : undefined"
            :aria-busy="isLoading ? true : undefined"
            :aria-label="resolvedAriaLabel"
            :aria-expanded="ariaExpanded"
            :aria-pressed="ariaPressed"
            :aria-readonly="isReadonly ? true : undefined"
            :title="titleAttr"
            :style="buttonStyle"
            :tabindex="isDisabled ? -1 : undefined"
            @click="handleClick"
            @focus="handleFocus"
            @blur="handleBlur"
            @keydown="handleKeydown"
          >
            <span
              v-for="r in ripples"
              :key="r.id"
              class="vp-button__ripple"
              :style="{ left: r.x + 'px', top: r.y + 'px' }"
              aria-hidden="true"
            />

            <span v-if="showStar" class="vp-button__star" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
                <path
                  d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z"
                />
              </svg>
            </span>

            <img v-if="img" class="vp-button__img" :src="img" alt="" draggable="false" />

            <span v-if="$slots.prefix" class="vp-button__affix vp-button__prefix">
              <slot name="prefix" />
            </span>

            <span
              v-if="(iconPos === 'left' || iconPos === 'top') && (isLoading || showIconSlot)"
              class="vp-button__icon p-button-icon"
            >
              <slot v-if="isLoading && $slots.loading" name="loading" />
              <svg
                v-else-if="isLoading"
                class="vp-button__loader p-button-loader"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
              <slot v-else name="icon">
                <Icon v-if="icon" :name="icon" :size="iconTokenSize" />
              </slot>
            </span>

            <span v-if="isLoading && loadingText" class="vp-button__label p-button-label">{{ loadingText }}</span>
            <span v-else-if="label" class="vp-button__label p-button-label">{{ label }}</span>
            <span v-else-if="$slots.default" class="vp-button__label p-button-label">
              <slot />
            </span>

            <span
              v-if="iconPos === 'right' && (isLoading || showIconSlot)"
              class="vp-button__icon p-button-icon"
            >
              <slot v-if="isLoading && $slots.loading" name="loading" />
              <svg
                v-else-if="isLoading"
                class="vp-button__loader p-button-loader"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
              </svg>
              <slot v-else name="icon">
                <Icon v-if="icon" :name="icon" :size="iconTokenSize" />
              </slot>
            </span>

            <span v-if="$slots.suffix" class="vp-button__affix vp-button__suffix">
              <slot name="suffix" />
            </span>

            <span v-if="badgeText" class="vp-button__badge" aria-hidden="true">{{ badgeText }}</span>
          </component>

          <ButtonSplitMenu v-if="hasDropdown" :size="resolvedSize" :icon-size="iconTokenSize">
            <slot name="dropdown" />
          </ButtonSplitMenu>
        </span>
      </template>
    </Popconfirm>

    <span v-else class="vp-button-host" :class="{ 'vp-button-split': hasDropdown }">
      <component
        :is="tagName"
        :class="[buttonClass, { 'vp-button--split-main': hasDropdown }]"
        :href="isAnchor ? safeHref : undefined"
        :target="isAnchor ? target : undefined"
        :rel="isAnchor && target === '_blank' ? 'noopener noreferrer' : undefined"
        :type="isAnchor ? undefined : type"
        :disabled="isAnchor ? undefined : isDisabled"
        :aria-disabled="isDisabled || isReadonly ? true : undefined"
        :aria-busy="isLoading ? true : undefined"
        :aria-label="resolvedAriaLabel"
        :aria-expanded="ariaExpanded"
        :aria-pressed="ariaPressed"
        :aria-readonly="isReadonly ? true : undefined"
        :title="titleAttr"
        :style="buttonStyle"
        :tabindex="isDisabled ? -1 : undefined"
        @click="handleClick"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      >
        <span
          v-for="r in ripples"
          :key="r.id"
          class="vp-button__ripple"
          :style="{ left: r.x + 'px', top: r.y + 'px' }"
          aria-hidden="true"
        />

        <span v-if="showStar" class="vp-button__star" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
            <path
              d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z"
            />
          </svg>
        </span>

        <img v-if="img" class="vp-button__img" :src="img" alt="" draggable="false" />

        <span v-if="$slots.prefix" class="vp-button__affix vp-button__prefix">
          <slot name="prefix" />
        </span>

        <span
          v-if="(iconPos === 'left' || iconPos === 'top') && (isLoading || showIconSlot)"
          class="vp-button__icon p-button-icon"
        >
          <slot v-if="isLoading && $slots.loading" name="loading" />
          <svg
            v-else-if="isLoading"
            class="vp-button__loader p-button-loader"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
          <slot v-else name="icon">
            <Icon v-if="icon" :name="icon" :size="iconTokenSize" />
          </slot>
        </span>

        <span v-if="isLoading && loadingText" class="vp-button__label p-button-label">{{ loadingText }}</span>
        <span v-else-if="label" class="vp-button__label p-button-label">{{ label }}</span>
        <span v-else-if="$slots.default" class="vp-button__label p-button-label">
          <slot />
        </span>

        <span
          v-if="iconPos === 'right' && (isLoading || showIconSlot)"
          class="vp-button__icon p-button-icon"
        >
          <slot v-if="isLoading && $slots.loading" name="loading" />
          <svg
            v-else-if="isLoading"
            class="vp-button__loader p-button-loader"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" opacity="0.25" />
            <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
          <slot v-else name="icon">
            <Icon v-if="icon" :name="icon" :size="iconTokenSize" />
          </slot>
        </span>

        <span v-if="$slots.suffix" class="vp-button__affix vp-button__suffix">
          <slot name="suffix" />
        </span>

        <span v-if="badgeText" class="vp-button__badge" aria-hidden="true">{{ badgeText }}</span>
      </component>

      <ButtonSplitMenu v-if="hasDropdown" :size="resolvedSize" :icon-size="iconTokenSize">
        <slot name="dropdown" />
      </ButtonSplitMenu>
    </span>
  </template>
</template>
