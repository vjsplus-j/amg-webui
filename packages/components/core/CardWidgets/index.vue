<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '@amg-webui/core/Icon/index.vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { CARD_WIDGET_DEFAULT_KEYS, type CardWidgetItem, type CardWidgetKey } from './types'
import './style.scss'

defineOptions({ inheritAttrs: false })

const DND_MIME = 'application/vp-card-widget'

const props = withDefaults(
  defineProps<{
    modelValue?: CardWidgetKey[]
    widgets?: CardWidgetItem[]
    cols?: 1 | 2 | 3 | 4
    disabled?: boolean
    showHandle?: boolean
    trackId?: string
    telemetry?: boolean
    class?: string
    style?: Record<string, string>
  }>(),
  {
    telemetry: undefined,
    cols: 2,
    disabled: false,
    showHandle: true
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: CardWidgetKey[]]
  change: [value: CardWidgetKey[]]
  swap: [payload: { from: CardWidgetKey; to: CardWidgetKey; order: CardWidgetKey[] }]
  dragEnd: [
    payload: {
      order: CardWidgetKey[]
      swapped: boolean
      from?: CardWidgetKey
      to?: CardWidgetKey
    }
  ]
}>()

const { t } = useLocale()

const draggingKey = ref<CardWidgetKey | null>(null)
const overKey = ref<CardWidgetKey | null>(null)
/** Last successful swap in the current drag gesture (cleared in dragEnd) */
const pendingSwap = ref<{ from: CardWidgetKey; to: CardWidgetKey } | null>(null)
/** Uncontrolled fallback when parent omits v-model */
const localOrder = ref<CardWidgetKey[]>([...CARD_WIDGET_DEFAULT_KEYS])

const order = computed(() => {
  if (props.modelValue?.length) return [...props.modelValue]
  return [...localOrder.value]
})

const metaByKey = computed(() => {
  const map = new Map<string, CardWidgetItem>()
  for (const w of props.widgets || []) map.set(w.key, w)
  return map
})

const tiles = computed(() =>
  order.value.map((key) => {
    const meta = metaByKey.value.get(key)
    return {
      key,
      title: meta?.title ?? key.toUpperCase()
    }
  })
)

const rootClass = computed(() => [
  'vp-card-widgets',
  `vp-card-widgets--cols-${props.cols}`,
  {
    'vp-card-widgets--disabled': props.disabled,
    'vp-card-widgets--dragging': Boolean(draggingKey.value)
  },
  props.class
])

function commitOrder(next: CardWidgetKey[], from: CardWidgetKey, to: CardWidgetKey) {
  if (!props.modelValue?.length) localOrder.value = next
  pendingSwap.value = { from, to }
  trackEmit({
    component: 'CardWidgets',
    type: 'swap',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { from, to, order: next }
  })
  trackEmit({
    component: 'CardWidgets',
    type: 'change',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload: { order: next }
  })
  emit('update:modelValue', next)
  emit('change', next)
  emit('swap', { from, to, order: next })
}

function swapKeys(from: CardWidgetKey, to: CardWidgetKey) {
  if (from === to || props.disabled) return
  const next = [...order.value]
  const i = next.indexOf(from)
  const j = next.indexOf(to)
  if (i < 0 || j < 0) return
  ;[next[i], next[j]] = [next[j]!, next[i]!]
  commitOrder(next, from, to)
}

function onDragStart(e: DragEvent, key: CardWidgetKey) {
  if (props.disabled) {
    e.preventDefault()
    return
  }
  pendingSwap.value = null
  draggingKey.value = key
  e.dataTransfer?.setData(DND_MIME, key)
  e.dataTransfer!.effectAllowed = 'move'
  // Fallback for browsers that strip custom MIME on drop
  e.dataTransfer?.setData('text/plain', key)
}

function finishDrag() {
  const swap = pendingSwap.value
  pendingSwap.value = null
  draggingKey.value = null
  overKey.value = null
  const payload = {
    order: order.value,
    swapped: Boolean(swap),
    from: swap?.from,
    to: swap?.to
  }
  trackEmit({
    component: 'CardWidgets',
    type: 'dragEnd',
    trackId: props.trackId,
    telemetry: props.telemetry,
    payload
  })
  emit('dragEnd', payload)
}

function onDragEnd() {
  finishDrag()
}

function onDragOver(e: DragEvent, key: CardWidgetKey) {
  if (props.disabled || !draggingKey.value) return
  e.preventDefault()
  e.dataTransfer!.dropEffect = 'move'
  overKey.value = key
}

function onDragLeave(key: CardWidgetKey) {
  if (overKey.value === key) overKey.value = null
}

function onDrop(e: DragEvent, to: CardWidgetKey) {
  if (props.disabled) return
  e.preventDefault()
  const from =
    e.dataTransfer?.getData(DND_MIME) ||
    e.dataTransfer?.getData('text/plain') ||
    draggingKey.value
  if (from) swapKeys(from, to)
  // dragend will fire finishDrag; keep pendingSwap until then
  draggingKey.value = null
  overKey.value = null
}

const dragHint = computed(() => t('component.card-widgets.dragHint'))
</script>

<template>
  <div
    :class="rootClass"
    :style="style"
    role="list"
    :aria-disabled="disabled || undefined"
    :aria-label="dragHint"
  >
    <div
      v-for="tile in tiles"
      :key="tile.key"
      class="vp-card-widgets__tile"
      :class="{
        'vp-card-widgets__tile--dragging': draggingKey === tile.key,
        'vp-card-widgets__tile--over': overKey === tile.key && draggingKey !== tile.key
      }"
      role="listitem"
      :draggable="!disabled"
      :aria-grabbed="draggingKey === tile.key || undefined"
      @dragstart="onDragStart($event, tile.key)"
      @dragend="onDragEnd"
      @dragover="onDragOver($event, tile.key)"
      @dragleave="onDragLeave(tile.key)"
      @drop="onDrop($event, tile.key)"
    >
      <div class="vp-card-widgets__chrome">
        <span v-if="showHandle" class="vp-card-widgets__handle" aria-hidden="true">
          <Icon name="GripVertical" size="sm" />
        </span>
        <span class="vp-card-widgets__badge">{{ tile.title }}</span>
      </div>
      <div class="vp-card-widgets__body">
        <slot :name="tile.key" :key-name="tile.key" />
      </div>
    </div>
  </div>
</template>
