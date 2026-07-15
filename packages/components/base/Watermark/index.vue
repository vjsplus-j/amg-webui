<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import type { WatermarkProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<WatermarkProps>(), {
  gap: () => [0, 0],
  rotate: -22,
  fontSize: 14,
  opacity: 0.15,
  zIndex: 1
})

const canvasRef = ref<HTMLDivElement | null>(null)
const bgUrl = ref('')
let observer: MutationObserver | null = null

const rootStyle = computed(() => {
  const [gx, gy] = props.gap
  return {
    '--vp-watermark-gap-x': gx ? `${gx}px` : undefined,
    '--vp-watermark-gap-y': gy ? `${gy}px` : undefined,
    '--vp-watermark-rotate': `${props.rotate}deg`,
    '--vp-watermark-font-size': `${props.fontSize}px`,
    '--vp-watermark-opacity': String(props.opacity),
    '--vp-watermark-z': String(props.zIndex),
    ...props.style
  }
})

function buildPattern(): string {
  const el = canvasRef.value?.parentElement
  if (!el) return ''

  const width = el.clientWidth || 300
  const height = el.clientHeight || 200
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  const gapX =
    props.gap[0] ||
    parseInt(getComputedStyle(el).getPropertyValue('--vp-watermark-gap-x')) ||
    32
  const gapY =
    props.gap[1] ||
    parseInt(getComputedStyle(el).getPropertyValue('--vp-watermark-gap-y')) ||
    32

  const cellW = gapX * 2
  const cellH = gapY * 2
  canvas.width = cellW
  canvas.height = cellH

  ctx.globalAlpha = props.opacity
  ctx.translate(cellW / 2, cellH / 2)
  ctx.rotate((props.rotate * Math.PI) / 180)

  if (props.image) {
    return props.image
  }

  const lines = Array.isArray(props.content)
    ? props.content
    : props.content
      ? [props.content]
      : ['']

  const fontSize = props.fontSize
  const styles = getComputedStyle(el)
  const fontFamily = styles.getPropertyValue('--font-family-sans').trim() || 'sans-serif'
  const textColor = styles.getPropertyValue('--text-secondary').trim() || styles.color
  ctx.font = `${fontSize}px ${fontFamily}`
  ctx.fillStyle = textColor
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const lineHeight = fontSize * 1.4
  const totalH = lines.length * lineHeight
  lines.forEach((line, i) => {
    ctx.fillText(line, 0, (i - (lines.length - 1) / 2) * lineHeight)
  })

  void totalH
  void width
  void height

  return canvas.toDataURL()
}

function renderWatermark() {
  if (props.image) {
    bgUrl.value = props.image
    return
  }
  const url = buildPattern()
  if (url) bgUrl.value = url
}

function setupObserver() {
  if (!canvasRef.value?.parentElement) return
  observer?.disconnect()
  observer = new MutationObserver(() => {
    if (!canvasRef.value?.parentElement?.contains(canvasRef.value)) {
      canvasRef.value?.parentElement?.appendChild(canvasRef.value)
    }
    renderWatermark()
  })
  observer.observe(canvasRef.value.parentElement, {
    childList: true,
    attributes: true,
    subtree: true
  })
}

watch(
  () => [props.content, props.gap, props.rotate, props.fontSize, props.opacity, props.image],
  () => renderWatermark(),
  { deep: true }
)

onMounted(() => {
  renderWatermark()
  setupObserver()
  window.addEventListener('resize', renderWatermark)
})

onUnmounted(() => {
  observer?.disconnect()
  observer = null
  window.removeEventListener('resize', renderWatermark)
})

const canvasStyle = computed(() =>
  bgUrl.value
    ? {
        backgroundImage: `url(${bgUrl.value})`,
        backgroundSize: 'auto'
      }
    : undefined
)
</script>

<template>
  <div :class="['vp-watermark', props.class]" :style="rootStyle">
    <div ref="canvasRef" class="vp-watermark__canvas" :style="canvasStyle" aria-hidden="true" />
    <div class="vp-watermark__content">
      <slot />
    </div>
  </div>
</template>
