<script setup lang="ts">
import { computed } from 'vue'
import type { SkeletonProps } from './types'
import './style.scss'

const props = withDefaults(defineProps<SkeletonProps>(), {
  rows: 3,
  animated: true,
  loading: true,
  variant: 'text',
  animation: 'shimmer',
  round: false
})

const rowCount = computed(() => Math.max(1, props.rows ?? 3))
const tableRowCount = computed(() => Math.max(3, Math.min(rowCount.value, 8)))

const resolvedVariant = computed(() => {
  if (props.variant === 'avatar') return 'circle'
  if (props.variant === 'image') return 'rect'
  return props.variant
})

const animKind = computed(() => {
  if (!props.animated || props.animation === false) return false
  return props.animation === 'pulse' ? 'pulse' : 'shimmer'
})

function toCssSize(v: string | number | undefined): string | undefined {
  if (v === undefined || v === '') return undefined
  return typeof v === 'number' ? `${v}px` : v
}

function rowWidth(index: number): string | undefined {
  const w = props.width
  if (Array.isArray(w)) {
    const item = w[index] ?? w[w.length - 1]
    return toCssSize(item)
  }
  if (w !== undefined && (resolvedVariant.value === 'text' || resolvedVariant.value === 'paragraph')) {
    return toCssSize(w as string | number)
  }
  return undefined
}

function blockStyle(): Record<string, string> {
  const style: Record<string, string> = {}
  const w = !Array.isArray(props.width) ? toCssSize(props.width as string | number | undefined) : undefined
  const h = toCssSize(props.height)
  const sz = props.size
  if (typeof sz === 'number') {
    style.width = `${sz}px`
    style.height = `${sz}px`
  } else if (typeof sz === 'string' && !['xs', 'sm', 'md', 'lg', 'xl'].includes(sz)) {
    style.width = sz
    style.height = sz
  }
  if (w) style.width = w
  if (h) style.height = h
  return style
}

const sizeClass = computed(() => {
  const sz = props.size
  if (typeof sz === 'string' && ['xs', 'sm', 'md', 'lg', 'xl'].includes(sz)) {
    return `vp-skeleton--size-${sz}`
  }
  return undefined
})

const skeletonClass = computed(() => [
  'vp-skeleton',
  `vp-skeleton--${resolvedVariant.value}`,
  sizeClass.value,
  {
    'vp-skeleton--animated': Boolean(animKind.value),
    'vp-skeleton--shimmer': animKind.value === 'shimmer',
    'vp-skeleton--pulse': animKind.value === 'pulse',
    'vp-skeleton--round': props.round
  },
  props.class
])

const rootStyle = computed(() => ({ ...(props.style || {}) }))

const lineStyle = (index: number) => {
  const style: Record<string, string> = {}
  const w = rowWidth(index)
  const h = toCssSize(props.height)
  if (w) style.width = w
  if (h) style.height = h
  return style
}

const staggered = computed(() => {
  const w = props.width
  return w === undefined || (Array.isArray(w) && w.length === 0)
})
</script>

<template>
  <div
    v-if="loading"
    :class="skeletonClass"
    :style="rootStyle"
    role="status"
    aria-busy="true"
    :aria-label="ariaLabel"
  >
    <template v-if="resolvedVariant === 'circle'">
      <span class="vp-skeleton__item vp-skeleton__circle" :style="blockStyle()" />
    </template>

    <template v-else-if="resolvedVariant === 'rect'">
      <span class="vp-skeleton__item vp-skeleton__rect" :style="blockStyle()" />
    </template>

    <template v-else-if="resolvedVariant === 'page'">
      <!-- Admin content pane after login — fill the work area, not a nested card mock -->
      <div class="vp-skeleton__page">
        <header class="vp-skeleton__page-hero">
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--eyebrow" />
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--display" />
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--lead" />
        </header>

        <div class="vp-skeleton__page-banner">
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
        </div>

        <div class="vp-skeleton__page-stats">
          <div v-for="n in 4" :key="`stat-${n}`" class="vp-skeleton__page-stat">
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--kpi" />
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
          </div>
        </div>

        <div class="vp-skeleton__page-split">
          <div class="vp-skeleton__page-panel vp-skeleton__page-panel--primary">
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
            <span class="vp-skeleton__item vp-skeleton__rect vp-skeleton__rect--chart" />
          </div>
          <div class="vp-skeleton__page-panel">
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
            <div
              v-for="n in 4"
              :key="`side-${n}`"
              class="vp-skeleton__list-item"
            >
              <span class="vp-skeleton__item vp-skeleton__circle vp-skeleton__circle--sm" />
              <div class="vp-skeleton__list-body">
                <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
                <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
              </div>
            </div>
          </div>
        </div>

        <div class="vp-skeleton__page-zones">
          <div v-for="n in 6" :key="`zone-${n}`" class="vp-skeleton__page-zone">
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
            <span class="vp-skeleton__item vp-skeleton__chip" />
          </div>
        </div>

        <div class="vp-skeleton__page-main">
          <div class="vp-skeleton__page-table-head">
            <span
              v-for="c in 5"
              :key="`col-${c}`"
              class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3"
            />
          </div>
          <div
            v-for="r in tableRowCount"
            :key="`row-${r}`"
            class="vp-skeleton__page-table-row"
          >
            <span class="vp-skeleton__item vp-skeleton__circle vp-skeleton__circle--sm" />
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
            <span class="vp-skeleton__item vp-skeleton__chip" />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card'">
      <div class="vp-skeleton__card">
        <div class="vp-skeleton__card-head">
          <span class="vp-skeleton__item vp-skeleton__circle vp-skeleton__circle--sm" />
          <div class="vp-skeleton__card-meta">
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
          </div>
        </div>
        <span class="vp-skeleton__item vp-skeleton__rect vp-skeleton__rect--card" />
        <span
          v-for="n in Math.max(2, Math.min(rowCount, 4))"
          :key="n"
          class="vp-skeleton__item vp-skeleton__line"
          :class="staggered ? `vp-skeleton__line--row-${((n - 1) % 4) + 1}` : undefined"
          :style="lineStyle(n - 1)"
        />
      </div>
    </template>

    <!-- Compact card-body skeletons (no chrome — nest inside Card) -->
    <template v-else-if="resolvedVariant === 'card-basic'">
      <div class="vp-skeleton__mini">
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
        <span
          v-for="n in Math.max(2, Math.min(rowCount, 3))"
          :key="n"
          class="vp-skeleton__item vp-skeleton__line"
          :class="`vp-skeleton__line--row-${((n - 1) % 4) + 1}`"
        />
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-profile'">
      <div class="vp-skeleton__mini vp-skeleton__mini--profile">
        <span class="vp-skeleton__item vp-skeleton__circle vp-skeleton__circle--md" />
        <div class="vp-skeleton__card-meta">
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-metric'">
      <div class="vp-skeleton__mini vp-skeleton__mini--metric">
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
        <span class="vp-skeleton__item vp-skeleton__value" />
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-media'">
      <div class="vp-skeleton__mini vp-skeleton__mini--media">
        <span class="vp-skeleton__item vp-skeleton__rect vp-skeleton__rect--media" />
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-actions'">
      <div class="vp-skeleton__mini vp-skeleton__mini--actions">
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
        <div class="vp-skeleton__actions">
          <span class="vp-skeleton__item vp-skeleton__chip" />
          <span class="vp-skeleton__item vp-skeleton__chip" />
          <span class="vp-skeleton__item vp-skeleton__chip" />
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-duo'">
      <div class="vp-skeleton__mini vp-skeleton__mini--duo">
        <div class="vp-skeleton__mini-col">
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
          <span class="vp-skeleton__item vp-skeleton__value" />
        </div>
        <div class="vp-skeleton__mini-col">
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
          <span class="vp-skeleton__item vp-skeleton__value" />
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-stats'">
      <div class="vp-skeleton__mini vp-skeleton__mini--stats">
        <div v-for="n in 4" :key="n" class="vp-skeleton__mini-stat">
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--kpi" />
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-list'">
      <div class="vp-skeleton__mini vp-skeleton__mini--list">
        <div v-for="n in Math.max(3, Math.min(rowCount, 5))" :key="n" class="vp-skeleton__list-item">
          <span class="vp-skeleton__item vp-skeleton__circle vp-skeleton__circle--sm" />
          <div class="vp-skeleton__list-body">
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-table'">
      <div class="vp-skeleton__mini vp-skeleton__mini--table">
        <div class="vp-skeleton__table-row vp-skeleton__table-row--head">
          <span
            v-for="c in 4"
            :key="`h-${c}`"
            class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3"
          />
        </div>
        <div
          v-for="r in Math.max(3, Math.min(rowCount, 4))"
          :key="`r-${r}`"
          class="vp-skeleton__table-row"
        >
          <span
            v-for="c in 4"
            :key="`c-${r}-${c}`"
            class="vp-skeleton__item vp-skeleton__line"
            :class="`vp-skeleton__line--row-${((c - 1) % 4) + 1}`"
          />
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-chart'">
      <div class="vp-skeleton__mini vp-skeleton__mini--chart">
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
        <span class="vp-skeleton__item vp-skeleton__rect vp-skeleton__rect--chart" />
        <div class="vp-skeleton__actions">
          <span class="vp-skeleton__item vp-skeleton__chip" />
          <span class="vp-skeleton__item vp-skeleton__chip" />
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-form'">
      <div class="vp-skeleton__mini vp-skeleton__mini--form">
        <div v-for="n in 3" :key="n" class="vp-skeleton__form-field">
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
          <span class="vp-skeleton__item vp-skeleton__field" />
        </div>
        <div class="vp-skeleton__actions">
          <span class="vp-skeleton__item vp-skeleton__chip" />
          <span class="vp-skeleton__item vp-skeleton__chip" />
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-notice'">
      <div class="vp-skeleton__mini vp-skeleton__mini--notice">
        <span class="vp-skeleton__item vp-skeleton__circle vp-skeleton__circle--sm" />
        <div class="vp-skeleton__card-meta">
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-product'">
      <div class="vp-skeleton__mini vp-skeleton__mini--product">
        <span class="vp-skeleton__item vp-skeleton__rect vp-skeleton__rect--thumb" />
        <div class="vp-skeleton__card-meta">
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
          <span class="vp-skeleton__item vp-skeleton__chip" />
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-article'">
      <div class="vp-skeleton__mini vp-skeleton__mini--article">
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-1" />
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-comment'">
      <div class="vp-skeleton__mini vp-skeleton__mini--comment">
        <span class="vp-skeleton__item vp-skeleton__circle vp-skeleton__circle--sm" />
        <div class="vp-skeleton__card-meta">
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
          <span class="vp-skeleton__item vp-skeleton__bubble" />
          <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-timeline'">
      <div class="vp-skeleton__mini vp-skeleton__mini--timeline">
        <div v-for="n in 3" :key="n" class="vp-skeleton__timeline-row">
          <span class="vp-skeleton__item vp-skeleton__dot" />
          <div class="vp-skeleton__card-meta">
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-3" />
            <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-4" />
          </div>
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'card-toolbar'">
      <div class="vp-skeleton__mini vp-skeleton__mini--toolbar">
        <span class="vp-skeleton__item vp-skeleton__line vp-skeleton__line--row-2" />
        <div class="vp-skeleton__actions">
          <span class="vp-skeleton__item vp-skeleton__chip" />
          <span class="vp-skeleton__item vp-skeleton__chip" />
          <span class="vp-skeleton__item vp-skeleton__chip" />
        </div>
      </div>
    </template>

    <template v-else-if="resolvedVariant === 'list-item'">
      <div class="vp-skeleton__list-item">
        <span class="vp-skeleton__item vp-skeleton__circle" :style="blockStyle()" />
        <div class="vp-skeleton__list-body">
          <span
            v-for="n in rowCount"
            :key="n"
            class="vp-skeleton__item vp-skeleton__line"
            :class="staggered ? `vp-skeleton__line--row-${((n - 1) % 4) + 1}` : undefined"
            :style="lineStyle(n - 1)"
          />
        </div>
      </div>
    </template>

    <template v-else>
      <span
        v-for="n in rowCount"
        :key="n"
        class="vp-skeleton__item vp-skeleton__line"
        :class="staggered ? `vp-skeleton__line--row-${((n - 1) % 4) + 1}` : undefined"
        :style="lineStyle(n - 1)"
      />
    </template>
  </div>
  <slot v-else />
</template>
