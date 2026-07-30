<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import './style.scss'

const props = withDefaults(
  defineProps<{
    visible?: boolean
    dismissible?: boolean
    zIndex?: number
    lockScroll?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    visible: false,
    dismissible: true,
    zIndex: 900,
    lockScroll: true,
    telemetry: undefined
  }
)

const emit = defineEmits<{
  'update:visible': [value: boolean]
  close: [event?: Event]
}>()
const { t } = useLocale()

const panelRef = ref<HTMLElement | null>(null)
let previousOverflow = ''

const overlayStyle = computed(() => ({
  ...(props.style ?? {}),
  zIndex: String(props.zIndex)
}))

function close(event?: Event) {
  trackEmit({
    component: 'Mask',
    type: 'close',
    trackId: props.trackId,
    telemetry: props.telemetry
  })
  emit('update:visible', false)
  emit('close', event)
}

function onOverlay(e: MouseEvent) {
  if (props.dismissible && e.target === e.currentTarget) close(e)
}

function onKey(e: KeyboardEvent) {
  if (props.visible && props.dismissible && e.key === 'Escape') {
    e.preventDefault()
    close(e)
  }
}

function lockBody(lock: boolean) {
  if (!props.lockScroll || typeof document === 'undefined') return
  if (lock) {
    previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = previousOverflow
  }
}

watch(
  () => props.visible,
  (v) => {
    lockBody(Boolean(v))
    if (v) {
      requestAnimationFrame(() => panelRef.value?.focus())
    }
  }
)

onMounted(() => {
  document.addEventListener('keydown', onKey)
  if (props.visible) lockBody(true)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKey)
  lockBody(false)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="vp-mask-fade">
      <div
        v-if="visible"
        :class="['vp-mask', props.class]"
        :style="overlayStyle"
        role="presentation"
        @click="onOverlay"
      >
        <div
          ref="panelRef"
          class="vp-mask__content"
          role="dialog"
          aria-modal="true"
          :aria-label="t('component.mask.aria')"
          tabindex="-1"
          @click.stop
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
