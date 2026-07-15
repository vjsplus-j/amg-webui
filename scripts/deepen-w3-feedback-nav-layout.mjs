/**
 * Deepen w3_feedback_nav_layout MVP stubs → real feedback / nav components.
 * Usage: node scripts/deepen-w3-feedback-nav-layout.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const base = resolve(root, 'packages/components/base')
const wave = JSON.parse(readFileSync(resolve(root, 'scripts/.component-waves.json'), 'utf8'))
const names = wave.waves.w3_feedback_nav_layout

const kebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()

const navItemType = `export interface NavItem {
  label: string
  value?: string | number
  icon?: string
  disabled?: boolean
  href?: string
  to?: string
  children?: NavItem[]
}
`

const feedbackOverlay = (name, k, extra = {}) => {
  const severity = extra.severity
  const isModal = extra.modal
  const isPopconfirm = extra.popconfirm
  const isPopover = extra.popover
  const isMask = extra.mask
  const isToast = extra.toast
  const isNotice = extra.notice
  const isException = extra.exception
  const isTip = extra.tip
  const isProgressTip = extra.progressTip
  const isLoadingTip = extra.loadingTip
  const isConfirm = extra.confirm

  const needsPosition = isToast
  const needsSeverity = isModal || isConfirm || isToast || isNotice || isTip || isProgressTip || (isModal && severity)
  const typeImports = ['BaseProps', ...(needsPosition ? ['Position'] : []), ...(needsSeverity ? ['Severity'] : [])].join(', ')

  let types = `import type { ${typeImports} } from '@amg-webui/types'

export interface ${name}Props extends BaseProps {
`
  if (isModal || isConfirm) {
    types += `  visible?: boolean
  title?: string
  message?: string
  closable?: boolean
  dismissible?: boolean
  confirmLabel?: string
  cancelLabel?: string
`
    if (severity) types += `  severity?: Severity
`
  } else if (isPopconfirm || isPopover) {
    types += `  visible?: boolean
  title?: string
  placement?: 'top' | 'bottom' | 'left' | 'right'
  dismissible?: boolean
  disabled?: boolean
`
  } else if (isMask) {
    types += `  visible?: boolean
  dismissible?: boolean
  zIndex?: number
`
  } else if (isToast) {
    types += `  visible?: boolean
  title?: string
  message?: string
  severity?: Severity
  duration?: number
  closable?: boolean
  position?: Position
`
  } else if (isNotice) {
    types += `  message?: string
  severity?: Severity
  closable?: boolean
  scrollable?: boolean
`
  } else if (isException) {
    types += `  status?: '403' | '404' | '500' | 'offline'
  title?: string
  description?: string
`
  } else if (isProgressTip) {
    types += `  message?: string
  percentage?: number
  severity?: Severity
`
  } else if (isLoadingTip) {
    types += `  message?: string
  loading?: boolean
`
  } else if (isTip) {
    types += `  message?: string
  severity?: Severity
  closable?: boolean
`
  }
  types += `}

export interface ${name}Emits {
`
  if (isModal || isConfirm || isPopconfirm || isPopover || isMask || isToast) {
    types += `  (e: 'update:visible', value: boolean): void
`
  }
  if (isModal || isConfirm || isPopconfirm) {
    types += `  (e: 'confirm', event: Event): void
  (e: 'cancel', event: Event): void
`
  }
  if (isToast || isNotice || isTip || isPopover) {
    types += `  (e: 'close'): void
`
  }
  if (isException) {
    types += `  (e: 'action', event: MouseEvent): void
`
  }
  types += `}
`

  return { types, severity, isModal, isPopconfirm, isPopover, isMask, isToast, isNotice, isException, isTip, isProgressTip, isLoadingTip, isConfirm }
}

function navTypes(name) {
  return `import type { BaseProps } from '@amg-webui/types'

${navItemType}

export interface ${name}Props extends BaseProps {
  items?: NavItem[]
  modelValue?: string | number
  disabled?: boolean
  direction?: 'horizontal' | 'vertical'
}

export interface ${name}Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'select', item: NavItem, event: MouseEvent): void
}
`
}

function indexTs(name) {
  return `import Comp from './index.vue'
import type { ${name}Props, ${name}Emits } from './types'

export { Comp as ${name} }
export type { ${name}Props, ${name}Emits }
export default Comp
`
}

function baseStyle(k) {
  return `.vp-${k} {
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
}
`
}

const templates = {
  Toast(name, k) {
    const meta = feedbackOverlay(name, k, { toast: true })
    const vue = `<script setup lang="ts">
import { computed, onUnmounted, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  visible: true,
  severity: 'info',
  duration: 3000,
  closable: true,
  position: 'top-right'
})
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()

let timer: ReturnType<typeof setTimeout> | undefined

const rootClass = computed(() => [
  'vp-${k}',
  \`vp-${k}--\${props.severity}\`,
  \`vp-${k}--\${props.position}\`,
  props.class
])

function close() {
  emit('update:visible', false)
  emit('close')
}

function arm() {
  if (timer) clearTimeout(timer)
  if (props.duration > 0 && props.visible) {
    timer = setTimeout(() => close(), props.duration)
  }
}

watch(() => [props.visible, props.duration] as const, () => arm(), { immediate: true })
onUnmounted(() => { if (timer) clearTimeout(timer) })
</script>

<template>
  <Teleport to="body">
    <Transition name="vp-${k}-fade">
      <div v-if="visible" :class="rootClass" :style="style" role="status">
        <div class="vp-${k}__body">
          <h4 v-if="title || $slots.title" class="vp-${k}__title">
            <slot name="title">{{ title }}</slot>
          </h4>
          <p v-if="message || $slots.default" class="vp-${k}__message">
            <slot>{{ message }}</slot>
          </p>
        </div>
        <button
          v-if="closable"
          type="button"
          class="vp-${k}__close"
          :aria-label="t(LocaleKeys.common.close)"
          @click="close"
        >×</button>
      </div>
    </Transition>
  </Teleport>
</template>
`
    const style = `.vp-${k} {
  position: fixed;
  z-index: 1000;
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-start;
  min-width: 16rem;
  max-width: 24rem;
  padding: var(--spacing-md);
  background: var(--surface-1);
  border: 1px solid var(--ds-border, var(--border-color));
  border-radius: var(--theme-card-radius, var(--border-radius-md));
  box-shadow: var(--shadow-md);

  &--top-right { top: var(--spacing-xl); right: var(--spacing-xl); }
  &--top-left { top: var(--spacing-xl); left: var(--spacing-xl); }
  &--bottom-right { bottom: var(--spacing-xl); right: var(--spacing-xl); }
  &--bottom-left { bottom: var(--spacing-xl); left: var(--spacing-xl); }

  &__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--spacing-xs); }
  &__title { margin: 0; font-size: var(--font-size-md); font-weight: 600; }
  &__message { margin: 0; font-size: var(--font-size-sm); color: var(--text-secondary); }
  &__close { appearance: none; border: none; background: transparent; color: var(--text-secondary); cursor: pointer; }

  &--success { border-color: var(--success-500); }
  &--warning { border-color: var(--warning-500); }
  &--danger { border-color: var(--danger-500); }
  &--info { border-color: var(--info-500); }
}

.vp-${k}-fade-enter-active, .vp-${k}-fade-leave-active {
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}
.vp-${k}-fade-enter-from, .vp-${k}-fade-leave-to {
  opacity: 0;
  transform: translateY(calc(var(--spacing-sm) * -1));
}
`
    return { types: meta.types, vue, style }
  },

  Popover(name, k) {
    const meta = feedbackOverlay(name, k, { popover: true })
    const vue = `<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  visible: false,
  placement: 'top',
  dismissible: true,
  disabled: false
})
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()

const rootRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

const rootClass = computed(() => [
  'vp-${k}',
  \`vp-${k}--\${props.placement}\`,
  { 'vp-${k}--open': props.visible },
  props.class
])

function toggle() {
  if (props.disabled) return
  emit('update:visible', !props.visible)
}

function close(_e?: Event) {
  emit('update:visible', false)
  emit('close')
}

function onDocClick(e: MouseEvent) {
  if (!props.visible || !props.dismissible) return
  const t = e.target as Node
  if (rootRef.value?.contains(t) || panelRef.value?.contains(t)) return
  close(e)
}

function onKey(e: KeyboardEvent) {
  if (props.visible && props.dismissible && e.key === 'Escape') close(e)
}

watch(() => props.visible, (v) => {
  if (!v) return
  requestAnimationFrame(() => panelRef.value?.focus())
})

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick, true)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <span ref="rootRef" :class="rootClass" :style="style">
    <span class="vp-${k}__trigger" @click="toggle">
      <slot name="trigger" />
    </span>
    <Teleport to="body">
      <Transition name="vp-${k}-fade">
        <div
          v-if="visible"
          ref="panelRef"
          class="vp-${k}__panel"
          role="dialog"
          tabindex="-1"
          @click.stop
        >
          <header v-if="title || $slots.title" class="vp-${k}__header">
            <slot name="title">{{ title }}</slot>
          </header>
          <div class="vp-${k}__content">
            <slot />
          </div>
          <button
            v-if="dismissible"
            type="button"
            class="vp-${k}__close"
            :aria-label="t(LocaleKeys.common.close)"
            @click="close"
          >×</button>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>
`
    const style = `.vp-${k} {
  position: relative;
  display: inline-flex;

  &__trigger { display: inline-flex; cursor: pointer; }
  &__panel {
    position: fixed;
    z-index: 1000;
    min-width: 12rem;
    max-width: 20rem;
    padding: var(--spacing-md);
    background: var(--surface-1);
    border: 1px solid var(--ds-border, var(--border-color));
    border-radius: var(--theme-card-radius, var(--border-radius-md));
    box-shadow: var(--shadow-md);
    outline: none;
  }
  &__header { font-weight: 600; margin-bottom: var(--spacing-sm); }
  &__close {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
    appearance: none;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--text-secondary);
  }
}
.vp-${k}-fade-enter-active, .vp-${k}-fade-leave-active { transition: opacity var(--transition-normal); }
.vp-${k}-fade-enter-from, .vp-${k}-fade-leave-to { opacity: 0; }
`
    return { types: meta.types, vue, style }
  },

  Popconfirm(name, k) {
    const meta = feedbackOverlay(name, k, { popconfirm: true })
    const vue = `<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  visible: false,
  placement: 'top',
  dismissible: true,
  disabled: false
})
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()

const rootRef = ref<HTMLElement | null>(null)
const panelRef = ref<HTMLElement | null>(null)

function open() {
  if (props.disabled) return
  emit('update:visible', true)
}

function close(e?: Event) {
  emit('update:visible', false)
  emit('cancel', e ?? new Event('cancel'))
}

function confirm(e: Event) {
  emit('confirm', e)
  emit('update:visible', false)
}

function onDocClick(e: MouseEvent) {
  if (!props.visible || !props.dismissible) return
  const target = e.target as Node
  if (rootRef.value?.contains(target) || panelRef.value?.contains(target)) return
  close(e)
}

function onKey(e: KeyboardEvent) {
  if (props.visible && props.dismissible && e.key === 'Escape') close(e)
}

const rootClass = computed(() => ['vp-${k}', { 'vp-${k}--open': props.visible }, props.class])

onMounted(() => {
  document.addEventListener('click', onDocClick, true)
  document.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick, true)
  document.removeEventListener('keydown', onKey)
})
</script>

<template>
  <span ref="rootRef" :class="rootClass" :style="style">
    <span class="vp-${k}__trigger" @click="open">
      <slot name="trigger" />
    </span>
    <Teleport to="body">
      <Transition name="vp-${k}-fade">
        <div v-if="visible" ref="panelRef" class="vp-${k}__panel" role="alertdialog" @click.stop>
          <p class="vp-${k}__message">
            <slot>{{ title }}</slot>
          </p>
          <div class="vp-${k}__actions">
            <button type="button" class="vp-${k}__btn vp-${k}__btn--ghost" @click="close">
              {{ t(LocaleKeys.button.cancel) }}
            </button>
            <button type="button" class="vp-${k}__btn vp-${k}__btn--primary" @click="confirm">
              {{ t(LocaleKeys.button.confirm) }}
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </span>
</template>
`
    const style = `.vp-${k} {
  display: inline-flex;
  &__trigger { cursor: pointer; }
  &__panel {
    position: fixed;
    z-index: 1000;
    min-width: 14rem;
    padding: var(--spacing-md);
    background: var(--surface-1);
    border: 1px solid var(--ds-border, var(--border-color));
    border-radius: var(--theme-card-radius, var(--border-radius-md));
    box-shadow: var(--shadow-md);
  }
  &__message { margin: 0 0 var(--spacing-md); font-size: var(--font-size-sm); }
  &__actions { display: flex; gap: var(--spacing-md); justify-content: flex-end; }
  &__btn {
    appearance: none;
    height: var(--height-sm, 2rem);
    padding: 0 var(--spacing-md);
    border-radius: var(--theme-btn-radius, var(--border-radius-md));
    cursor: pointer;
    border: 1px solid var(--ds-border, var(--border-color));
    background: var(--surface-2);
    color: var(--text-primary);
    &--primary { background: var(--primary-500); color: var(--surface-0, var(--surface-1)); border-color: transparent; }
  }
}
`
    return { types: meta.types, vue, style }
  },

  Mask(name, k) {
    const meta = feedbackOverlay(name, k, { mask: true })
    const vue = `<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  visible: false,
  dismissible: true,
  zIndex: 900
})
const emit = defineEmits<${name}Emits>()

const overlayStyle = computed(() => ({
  ...props.style,
  zIndex: String(props.zIndex)
}))

function close(_e?: Event) {
  emit('update:visible', false)
}

function onOverlay(e: MouseEvent) {
  if (props.dismissible && e.target === e.currentTarget) close(e)
}

function onKey(e: KeyboardEvent) {
  if (props.visible && props.dismissible && e.key === 'Escape') close(e)
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="vp-${k}-fade">
      <div
        v-if="visible"
        :class="['vp-${k}', props.class]"
        :style="overlayStyle"
        @click="onOverlay"
      >
        <div class="vp-${k}__content" @click.stop>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
`
    const style = `.vp-${k} {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--surface-0, #000) 45%, transparent);

  &__content { position: relative; }
}
.vp-${k}-fade-enter-active, .vp-${k}-fade-leave-active { transition: opacity var(--transition-normal); }
.vp-${k}-fade-enter-from, .vp-${k}-fade-leave-to { opacity: 0; }
`
    return { types: meta.types, vue, style }
  },

  NoticeBar(name, k) {
    const meta = feedbackOverlay(name, k, { notice: true })
    const vue = `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  severity: 'info',
  closable: true,
  scrollable: true
})
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()

const rootClass = computed(() => [
  'vp-${k}',
  \`vp-${k}--\${props.severity}\`,
  { 'vp-${k}--scroll': props.scrollable },
  props.class
])

function close() {
  emit('close')
}
</script>

<template>
  <div :class="rootClass" :style="style" role="status">
    <div class="vp-${k}__track">
      <span class="vp-${k}__text">
        <slot>{{ message }}</slot>
      </span>
    </div>
    <button
      v-if="closable"
      type="button"
      class="vp-${k}__close"
      :aria-label="t(LocaleKeys.common.close)"
      @click="close"
    >×</button>
  </div>
</template>
`
    const style = `.vp-${k} {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--surface-2);
  border-bottom: 1px solid var(--ds-border, var(--border-color));
  overflow: hidden;

  &__track { flex: 1; min-width: 0; overflow: hidden; }
  &__text { display: inline-block; white-space: nowrap; font-size: var(--font-size-sm); }
  &--scroll .vp-${k}__text { animation: vp-${k}-marquee 18s linear infinite; }
  &__close { appearance: none; border: none; background: transparent; cursor: pointer; color: var(--text-secondary); }

  &--success { color: var(--success-600, var(--success-500)); }
  &--warning { color: var(--warning-600, var(--warning-500)); }
  &--danger { color: var(--danger-600, var(--danger-500)); }
}

@keyframes vp-${k}-marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
`
    return { types: meta.types, vue, style }
  },

  Exception(name, k) {
    const meta = feedbackOverlay(name, k, { exception: true })
    const vue = `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  status: '404'
})
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()

const titleText = computed(() => props.title ?? t(LocaleKeys.error.notFound))
const leadText = computed(() => props.description ?? t('component.${k}.lead'))
</script>

<template>
  <div :class="['vp-${k}', \`vp-${k}--\${status}\`, props.class]" :style="style" role="alert">
    <p class="vp-${k}__code" aria-hidden="true">{{ status }}</p>
    <h1 class="vp-${k}__title">{{ titleText }}</h1>
    <p class="vp-${k}__lead">{{ leadText }}</p>
    <div class="vp-${k}__actions">
      <slot>
        <button type="button" class="vp-${k}__btn" @click="emit('action', $event)">
          {{ t(LocaleKeys.button.continue) }}
        </button>
      </slot>
    </div>
  </div>
</template>
`
    const style = `.vp-${k} {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--spacing-md);
  padding: var(--theme-page-pad, var(--spacing-xl));

  &__code { margin: 0; font-size: var(--font-size-2xl); letter-spacing: 0.15em; color: var(--text-secondary); }
  &__title { margin: 0; font-size: var(--font-size-xl); font-weight: 600; }
  &__lead { margin: 0; color: var(--text-secondary); font-size: var(--font-size-sm); }
  &__btn {
    appearance: none;
    border: 1px solid transparent;
    background: var(--primary-500);
    color: var(--surface-0, var(--surface-1));
    border-radius: var(--theme-btn-radius, var(--border-radius-md));
    height: var(--height-md, 2.25rem);
    padding: 0 var(--spacing-lg);
    cursor: pointer;
  }
}
`
    return { types: meta.types, vue, style }
  },

  StatusTip(name, k) {
    const meta = feedbackOverlay(name, k, { tip: true })
    const vue = `<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  severity: 'info',
  closable: false
})
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()
const show = ref(true)

const rootClass = computed(() => [
  'vp-${k}',
  \`vp-${k}--\${props.severity}\`,
  props.class
])

function close() {
  show.value = false
  emit('close')
}
</script>

<template>
  <div v-if="show" :class="rootClass" :style="style" role="status">
    <span class="vp-${k}__icon" aria-hidden="true">●</span>
    <span class="vp-${k}__text"><slot>{{ message }}</slot></span>
    <button
      v-if="closable"
      type="button"
      class="vp-${k}__close"
      :aria-label="t(LocaleKeys.common.close)"
      @click="close"
    >×</button>
  </div>
</template>
`
    const style = `.vp-${k} {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: var(--surface-2);
  border: 1px solid var(--ds-border, var(--border-color));

  &--success { border-color: var(--success-500); color: var(--success-600, var(--success-500)); }
  &--warning { border-color: var(--warning-500); color: var(--warning-600, var(--warning-500)); }
  &--danger { border-color: var(--danger-500); color: var(--danger-600, var(--danger-500)); }
  &--info { border-color: var(--info-500); color: var(--info-600, var(--info-500)); }

  &__close { appearance: none; border: none; background: transparent; cursor: pointer; }
}
`
    return { types: meta.types, vue, style }
  },

  ProgressTip(name, k) {
    const meta = feedbackOverlay(name, k, { progressTip: true })
    const vue = `<script setup lang="ts">
import { computed } from 'vue'
import Progress from '../Progress/index.vue'
import type { ${name}Props } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  percentage: 0,
  severity: 'info'
})

const pct = computed(() => Math.min(100, Math.max(0, props.percentage)))
const rootClass = computed(() => ['vp-${k}', \`vp-${k}--\${props.severity}\`, props.class])
</script>

<template>
  <div :class="rootClass" :style="style" role="status">
    <p v-if="message || $slots.default" class="vp-${k}__message">
      <slot>{{ message }}</slot>
    </p>
    <Progress :percentage="pct" type="line" />
  </div>
</template>
`
    const style = `.vp-${k} {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--surface-1);
  border: 1px solid var(--ds-border, var(--border-color));
  border-radius: var(--theme-card-radius, var(--border-radius-md));
  &__message { margin: 0; font-size: var(--font-size-sm); color: var(--text-secondary); }
}
`
    return { types: meta.types, vue, style }
  },

  LoadingTip(name, k) {
    const meta = feedbackOverlay(name, k, { loadingTip: true })
    const vue = `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ${name}Props } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  loading: true
})
const { t } = useLocale()

const rootClass = computed(() => [
  'vp-${k}',
  { 'vp-${k}--loading': props.loading },
  props.class
])
const label = computed(() => props.message ?? t(LocaleKeys.common.loading))
</script>

<template>
  <div :class="rootClass" :style="style" role="status" :aria-busy="loading">
    <span class="vp-${k}__spinner" aria-hidden="true" />
    <span class="vp-${k}__text">{{ label }}</span>
    <slot />
  </div>
</template>
`
    const style = `.vp-${k} {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);

  &__spinner {
    width: var(--height-sm, 2rem);
    height: var(--height-sm, 2rem);
    border: 2px solid var(--ds-border, var(--border-color));
    border-top-color: var(--primary-500);
    border-radius: 50%;
    animation: vp-${k}-spin 0.8s linear infinite;
  }
}

@keyframes vp-${k}-spin {
  to { transform: rotate(360deg); }
}
`
    return { types: meta.types, vue, style }
  },

  Modal(name, k, severity) {
    const meta = feedbackOverlay(name, k, { modal: true, severity })
    const vue = `<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  visible: false,
  closable: true,
  dismissible: true,
  severity: '${severity}',
  confirmLabel: '',
  cancelLabel: ''
})
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()

const confirmText = computed(() => props.confirmLabel || t(LocaleKeys.button.confirm))
const cancelText = computed(() => props.cancelLabel || t(LocaleKeys.button.cancel))
const closeLabel = computed(() => t(LocaleKeys.common.close))

const rootClass = computed(() => [
  'vp-${k}',
  \`vp-${k}--\${props.severity}\`,
  props.class
])

function close(e?: Event) {
  emit('update:visible', false)
  emit('cancel', e ?? new Event('cancel'))
}

function confirm(e: Event) {
  emit('confirm', e)
  emit('update:visible', false)
}

function onOverlay(e: MouseEvent) {
  if (props.dismissible && e.target === e.currentTarget) close(e)
}

function onKey(e: KeyboardEvent) {
  if (props.visible && props.dismissible && e.key === 'Escape') close(e)
}

onMounted(() => document.addEventListener('keydown', onKey))
onUnmounted(() => document.removeEventListener('keydown', onKey))
</script>

<template>
  <Teleport to="body">
    <Transition name="vp-${k}-fade">
      <div v-if="visible" class="vp-${k}-overlay" @click="onOverlay">
        <div :class="rootClass" :style="style" role="alertdialog" @click.stop>
          <header class="vp-${k}__header">
            <h3 class="vp-${k}__title">
              <slot name="title">{{ title }}</slot>
            </h3>
            <button
              v-if="closable"
              type="button"
              class="vp-${k}__close"
              :aria-label="closeLabel"
              @click="close"
            >×</button>
          </header>
          <div class="vp-${k}__body">
            <slot>{{ message }}</slot>
          </div>
          <footer class="vp-${k}__footer">
            <slot name="footer">
              <button type="button" class="vp-${k}__btn vp-${k}__btn--ghost" @click="close">
                {{ cancelText }}
              </button>
              <button type="button" class="vp-${k}__btn vp-${k}__btn--primary" @click="confirm">
                {{ confirmText }}
              </button>
            </slot>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
`
    const style = `.vp-${k}-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--surface-0, #000) 45%, transparent);
}

.vp-${k} {
  min-width: 18rem;
  max-width: 28rem;
  background: var(--surface-1);
  border: 1px solid var(--ds-border, var(--border-color));
  border-radius: var(--theme-card-radius, var(--border-radius-md));
  box-shadow: var(--shadow-lg);
  padding: var(--theme-card-pad, var(--spacing-md));

  &__header { display: flex; align-items: center; justify-content: space-between; gap: var(--spacing-md); }
  &__title { margin: 0; font-size: var(--font-size-lg); font-weight: 600; }
  &__body { margin: var(--spacing-md) 0; font-size: var(--font-size-sm); color: var(--text-secondary); }
  &__footer { display: flex; gap: var(--spacing-md); justify-content: flex-end; }
  &__close { appearance: none; border: none; background: transparent; cursor: pointer; color: var(--text-secondary); }
  &__btn {
    appearance: none;
    height: var(--height-md, 2.25rem);
    padding: 0 var(--spacing-lg);
    border-radius: var(--theme-btn-radius, var(--border-radius-md));
    cursor: pointer;
    border: 1px solid var(--ds-border, var(--border-color));
    background: var(--surface-2);
    &--primary { background: var(--primary-500); color: var(--surface-0, var(--surface-1)); border-color: transparent; }
  }

  &--success { border-color: var(--success-500); }
  &--warning { border-color: var(--warning-500); }
  &--danger { border-color: var(--danger-500); }
  &--info { border-color: var(--info-500); }
}

.vp-${k}-fade-enter-active, .vp-${k}-fade-leave-active { transition: opacity var(--transition-normal); }
.vp-${k}-fade-enter-from, .vp-${k}-fade-leave-to { opacity: 0; }
`
    return { types: meta.types, vue, style }
  },

  Confirm(name, k) {
    return templates.Modal(name, k, 'warning')
  },

  Nav(name, k, variant = 'default') {
    const types = navTypes(name)
    const selectHelpers = `
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
`
    const extra =
      variant === 'pager'
        ? `
const page = computed({
  get: () => Number(props.modelValue ?? 1),
  set: (v: number) => { emit('update:modelValue', v); emit('change', v) }
})
const totalPages = computed(() => Math.max(1, Number((props as any).totalPages ?? (props.items?.length || 1))))
function go(p: number) {
  if (p < 1 || p > totalPages.value || props.disabled) return
  page.value = p
}
`
        : variant === 'index'
          ? `
const letters = computed(() => {
  const fromItems = (props.items ?? []).map((i) => String(i.label).charAt(0).toUpperCase())
  return fromItems.length ? fromItems : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
})
${selectHelpers}`
          : selectHelpers

    const templateBlock =
      variant === 'pager'
        ? `<nav :class="rootClass" :style="style" aria-label="pagination">
    <button type="button" class="vp-${k}__btn" :disabled="disabled || page <= 1" @click="go(page - 1)">‹</button>
    <button
      v-for="p in totalPages"
      :key="p"
      type="button"
      :class="['vp-${k}__item', { 'vp-${k}__item--active': p === page }]"
      :disabled="disabled"
      @click="go(p)"
    >{{ p }}</button>
    <button type="button" class="vp-${k}__btn" :disabled="disabled || page >= totalPages" @click="go(page + 1)">›</button>
  </nav>`
        : variant === 'index'
          ? `<nav :class="rootClass" :style="style">
    <button
      v-for="(letter, i) in letters"
      :key="i"
      type="button"
      :class="['vp-${k}__item', { 'vp-${k}__item--active': modelValue === letter }]"
      :disabled="disabled"
      @click="selectItem({ label: letter, value: letter }, $event)"
    >{{ letter }}</button>
  </nav>`
          : variant === 'card'
            ? `<nav :class="rootClass" :style="style">
    <button
      v-for="(item, i) in items"
      :key="i"
      type="button"
      :class="['vp-${k}__card', { 'vp-${k}__card--active': (item.value ?? item.label) === modelValue }]"
      :disabled="disabled || item.disabled"
      @click="selectItem(item, $event)"
    >
      <span class="vp-${k}__label">{{ item.label }}</span>
      <span v-if="item.icon" class="vp-${k}__icon">{{ item.icon }}</span>
    </button>
  </nav>`
            : variant === 'float'
              ? `<nav :class="rootClass" :style="style">
    <button
      v-for="(item, i) in items"
      :key="i"
      type="button"
      :class="['vp-${k}__fab', { 'vp-${k}__fab--active': (item.value ?? item.label) === modelValue }]"
      :disabled="disabled || item.disabled"
      :title="item.label"
      @click="selectItem(item, $event)"
    >{{ item.icon ?? item.label.charAt(0) }}</button>
  </nav>`
              : variant === 'footer'
                ? `<nav :class="rootClass" :style="style">
    <a
      v-for="(item, i) in items"
      :key="i"
      :href="item.href ?? item.to ?? '#'"
      :class="['vp-${k}__link', { 'vp-${k}__link--active': (item.value ?? item.label) === modelValue }]"
      @click.prevent="selectItem(item, $event)"
    >{{ item.label }}</a>
  </nav>`
                : variant === 'group'
                  ? `<nav :class="rootClass" :style="style">
    <section v-for="(group, gi) in items" :key="gi" class="vp-${k}__group">
      <h4 class="vp-${k}__heading">{{ group.label }}</h4>
      <div class="vp-${k}__items">
        <button
          v-for="(child, ci) in group.children ?? []"
          :key="ci"
          type="button"
          :class="['vp-${k}__item', { 'vp-${k}__item--active': (child.value ?? child.label) === modelValue }]"
          :disabled="disabled || child.disabled"
          @click="selectItem(child, $event)"
        >{{ child.label }}</button>
      </div>
    </section>
  </nav>`
                  : variant === 'dropdown'
                    ? `<div :class="rootClass" :style="style">
    <button type="button" class="vp-${k}__trigger" :disabled="disabled" @click="open = !open">
      <slot name="trigger">{{ items?.find(i => (i.value ?? i.label) === modelValue)?.label ?? t(LocaleKeys.common.more) }}</slot>
    </button>
    <ul v-if="open" class="vp-${k}__menu" role="menu">
      <li v-for="(item, i) in items" :key="i" role="none">
        <button
          type="button"
          role="menuitem"
          :class="['vp-${k}__item', { 'vp-${k}__item--active': (item.value ?? item.label) === modelValue }]"
          :disabled="disabled || item.disabled"
          @click="selectItem(item, $event); open = false"
        >{{ item.label }}</button>
      </li>
    </ul>
  </div>`
                    : variant === 'anchor'
                      ? `<nav :class="rootClass" :style="style">
    <a
      v-for="(item, i) in items"
      :key="i"
      :href="item.href ?? ('#' + (item.value ?? item.label))"
      :class="['vp-${k}__link', { 'vp-${k}__link--active': (item.value ?? item.label) === modelValue }]"
      @click.prevent="selectItem(item, $event)"
    >{{ item.label }}</a>
  </nav>`
                      : variant === 'steps'
                        ? `<nav :class="rootClass" :style="style">
    <ol class="vp-${k}__list">
      <li
        v-for="(item, i) in items"
        :key="i"
        :class="['vp-${k}__step', { 'vp-${k}__step--active': i === Number(modelValue ?? 0), 'vp-${k}__step--done': i < Number(modelValue ?? 0) }]"
      >
        <button type="button" class="vp-${k}__dot" :disabled="disabled || item.disabled" @click="selectItem({ ...item, value: i }, $event)">
          {{ i + 1 }}
        </button>
        <span class="vp-${k}__label">{{ item.label }}</span>
      </li>
    </ol>
  </nav>`
                        : `<nav :class="rootClass" :style="style" role="navigation">
    <button
      v-for="(item, i) in items"
      :key="i"
      type="button"
      :class="['vp-${k}__item', { 'vp-${k}__item--active': (item.value ?? item.label) === modelValue }]"
      :disabled="disabled || item.disabled"
      @click="selectItem(item, $event)"
    >{{ item.label }}</button>
  </nav>`

    const imports =
      variant === 'dropdown'
        ? `import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import type { ${name}Props, ${name}Emits, NavItem } from './types'`
        : variant === 'pager'
          ? `import { computed } from 'vue'
import type { ${name}Props, ${name}Emits } from './types'`
          : `import { computed } from 'vue'
import type { ${name}Props, ${name}Emits, NavItem } from './types'`

    const setupExtra =
      variant === 'dropdown'
        ? `
const { t } = useLocale()
const open = ref(false)
`
        : ''

    const vue = `<script setup lang="ts">
${imports}
import './style.scss'

const props = withDefaults(defineProps<${name}Props${variant === 'pager' ? ' & { totalPages?: number }' : ''}>(), {
  items: () => [],
  direction: '${variant === 'vertical' || name === 'VerticalStepNav' || name === 'ScrollNav' || name === 'MiniNav' || name === 'Menu' || name === 'GroupNav' || name === 'Anchor' ? 'vertical' : 'horizontal'}',
  disabled: false
})
const emit = defineEmits<${name}Emits>()
${setupExtra}
const rootClass = computed(() => [
  'vp-${k}',
  \`vp-${k}--\${props.direction}\`,
  props.class
])
${extra}
</script>

<template>
  ${templateBlock}
</template>
`

    const style = `.vp-${k} {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;

  &--vertical { flex-direction: column; align-items: stretch; }

  &__item, &__link, &__btn {
    appearance: none;
    border: 1px solid var(--ds-border, var(--border-color));
    background: var(--surface-1);
    color: var(--text-primary);
    border-radius: var(--theme-btn-radius, var(--border-radius-md));
    padding: var(--spacing-xs) var(--spacing-md);
    font-size: var(--font-size-sm);
    cursor: pointer;
    text-decoration: none;
    &--active { background: var(--primary-500); color: var(--surface-0, var(--surface-1)); border-color: transparent; }
    &:disabled { opacity: 0.5; cursor: not-allowed; }
  }

  &__card {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    min-width: 8rem;
    padding: var(--theme-card-pad, var(--spacing-md));
    border: 1px solid var(--ds-border, var(--border-color));
    border-radius: var(--theme-card-radius, var(--border-radius-md));
    background: var(--surface-1);
    cursor: pointer;
    &--active { border-color: var(--primary-500); box-shadow: var(--shadow-sm); }
  }

  &__fab {
    width: var(--height-md, 2.25rem);
    height: var(--height-md, 2.25rem);
    border-radius: 50%;
    border: 1px solid var(--ds-border, var(--border-color));
    background: var(--surface-1);
    cursor: pointer;
    &--active { background: var(--primary-500); color: var(--surface-0, var(--surface-1)); }
  }

  &__group { display: flex; flex-direction: column; gap: var(--spacing-sm); }
  &__heading { margin: 0; font-size: var(--font-size-xs); color: var(--text-secondary); text-transform: uppercase; }
  &__items { display: flex; flex-wrap: wrap; gap: var(--spacing-sm); }

  &__list { list-style: none; margin: 0; padding: 0; display: flex; gap: var(--spacing-md); }
  &--vertical .vp-${k}__list { flex-direction: column; }
  &__step { display: flex; align-items: center; gap: var(--spacing-sm); }
  &__dot {
    width: var(--height-sm, 2rem);
    height: var(--height-sm, 2rem);
    border-radius: 50%;
    border: 1px solid var(--ds-border, var(--border-color));
    background: var(--surface-1);
    cursor: pointer;
  }
  &__step--active .vp-${k}__dot { background: var(--primary-500); color: var(--surface-0, var(--surface-1)); border-color: transparent; }
  &__step--done .vp-${k}__dot { border-color: var(--success-500); }

  &__trigger {
    appearance: none;
    border: 1px solid var(--ds-border, var(--border-color));
    background: var(--surface-1);
    border-radius: var(--theme-btn-radius, var(--border-radius-md));
    height: var(--height-md, 2.25rem);
    padding: 0 var(--spacing-md);
    cursor: pointer;
  }
  &__menu {
    list-style: none;
    margin: var(--spacing-xs) 0 0;
    padding: var(--spacing-xs);
    background: var(--surface-1);
    border: 1px solid var(--ds-border, var(--border-color));
    border-radius: var(--theme-card-radius, var(--border-radius-md));
    box-shadow: var(--shadow-md);
    min-width: 10rem;
  }
}

${variant === 'float' ? `.vp-${k} { position: fixed; right: var(--spacing-xl); bottom: var(--spacing-xl); flex-direction: column; z-index: 100; }` : ''}
${variant === 'footer' ? `.vp-${k} { justify-content: center; padding: var(--spacing-md) 0; border-top: 1px solid var(--ds-border, var(--border-color)); }` : ''}
`
    return { types, vue, style }
  }
}

function resolveTemplate(name) {
  const k = kebab(name)
  if (name === 'Toast') return templates.Toast(name, k)
  if (name === 'Popover') return templates.Popover(name, k)
  if (name === 'Popconfirm') return templates.Popconfirm(name, k)
  if (name === 'Mask') return templates.Mask(name, k)
  if (name === 'NoticeBar') return templates.NoticeBar(name, k)
  if (name === 'Exception') return templates.Exception(name, k)
  if (name === 'StatusTip') return templates.StatusTip(name, k)
  if (name === 'ProgressTip') return templates.ProgressTip(name, k)
  if (name === 'LoadingTip') return templates.LoadingTip(name, k)
  if (name === 'Confirm') return templates.Confirm(name, k)
  if (name === 'SuccessModal') return templates.Modal(name, k, 'success')
  if (name === 'ErrorModal') return templates.Modal(name, k, 'danger')
  if (name === 'WarnModal') return templates.Modal(name, k, 'warning')
  if (name === 'InfoModal') return templates.Modal(name, k, 'info')
  if (name === 'Dropdown') return templates.Nav(name, k, 'dropdown')
  if (name === 'PagerNav') return templates.Nav(name, k, 'pager')
  if (name === 'IndexNav') return templates.Nav(name, k, 'index')
  if (name === 'CardNav') return templates.Nav(name, k, 'card')
  if (name === 'FloatNav') return templates.Nav(name, k, 'float')
  if (name === 'FooterNav') return templates.Nav(name, k, 'footer')
  if (name === 'GroupNav') return templates.Nav(name, k, 'group')
  if (name === 'Anchor') return templates.Nav(name, k, 'anchor')
  if (name === 'StepNav' || name === 'VerticalStepNav') return templates.Nav(name, k, 'steps')
  return templates.Nav(name, k, 'default')
}

const upgraded = []
for (const name of names) {
  const dir = join(base, name)
  const { types, vue, style } = resolveTemplate(name)
  writeFileSync(join(dir, 'types.ts'), types)
  writeFileSync(join(dir, 'index.vue'), vue)
  writeFileSync(join(dir, 'style.scss'), style)
  writeFileSync(join(dir, 'index.ts'), indexTs(name))
  upgraded.push(name)
}

console.log(JSON.stringify({ upgraded: upgraded.length, names: upgraded }, null, 2))
