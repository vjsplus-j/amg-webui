/**
 * Deepen preview/drag/canvas shells + generate curated demos for utility + industry components.
 * Run: node scripts/gen-preview-drag-industry.mjs
 */
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { expandStyle, kebab } from './lib/expand-shell-style.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const baseDir = join(root, 'packages/components/base')
const demosDir = join(root, 'example/demos')
const localeRoot = join(root, 'packages/locale')

const slug = (name) => name.charAt(0).toLowerCase() + name.slice(1)

const UTIL_SHELLS = [
  'PdfPreview',
  'FilePreview',
  'AudioPlay',
  'BrowserDetect',
  'CanvasPreview',
  'CanvasShortcut',
  'DragRuler',
  'DragSortNode',
  'DragWrapper',
  'FreeLayoutDrag',
  'GridLayoutDrag',
  'TemplateDrag'
]

const INDUSTRY_DEMOS = [
  'AudioTalk',
  'GbsAlarmModal',
  'GbsCascadePanel',
  'GbsSignMonitor',
  'GbsStatusCard',
  'GbsTimeSync',
  'OnvifAlarmPanel',
  'OnvifChannelManage',
  'OnvifDeviceList',
  'OnvifRecordPlan',
  'OnvifSettingPanel',
  'OnvifUrlForm',
  'VcrBackupTask',
  'VcrClipCut',
  'VcrDownloadPanel',
  'VcrMarkPoint',
  'VcrSearchPanel',
  'VcrSpeedControl',
  'VcrStorageDashboard',
  'VcrTimelinePlayer',
  'VideoAdjust',
  'VideoPreview',
  'VideoSnapshot',
  'VideoVolume',
  'VideoWatermark'
]

const ALL_DEMOS = [...UTIL_SHELLS, ...INDUSTRY_DEMOS]

const STYLE_EXTRA = {
  PdfPreview: `\n  &__obj, &__frame { width: 100%; border: none; border-radius: var(--border-radius-sm, var(--border-radius-md)); }`,
  FilePreview: `\n  &__img { max-width: 100%; object-fit: contain; }\n  &__frame { width: 100%; border: none; }`,
  AudioPlay: `\n  &__audio { width: 100%; }`,
  BrowserDetect: `\n  &__item { display: flex; gap: var(--spacing-md); padding: var(--spacing-xs) 0; }\n  &__item dt { font-weight: 600; min-width: 5rem; }`,
  CanvasPreview: `\n  &__node { position: absolute; padding: var(--spacing-sm); background: var(--surface-2); border: 1px solid var(--ds-border); border-radius: var(--border-radius-sm); }\n  &--grid { display: grid; gap: var(--spacing-sm); position: relative; }\n  &--grid &__node { position: relative; }`,
  DragRuler: `\n  position: relative; min-height: 12rem;\n  &__h, &__v { position: absolute; background: var(--surface-2); font-size: var(--font-size-xs); }\n  &__h { top: 0; left: 0; right: 0; height: var(--spacing-lg); }\n  &__v { top: 0; left: 0; bottom: 0; width: var(--spacing-lg); }\n  &__guides { position: relative; min-height: 10rem; margin-top: var(--spacing-xl); }`,
  DragSortNode: `\n  &__item { cursor: grab; padding: var(--spacing-sm) var(--spacing-md); background: var(--surface-2); border-radius: var(--border-radius-sm); }`,
  DragWrapper: `\n  min-height: 6rem; border: 1px dashed var(--ds-border); border-radius: var(--border-radius-md); padding: var(--spacing-md);`,
  FreeLayoutDrag: `\n  min-height: 4rem; border: 1px solid var(--ds-border); border-radius: var(--border-radius-md); padding: var(--spacing-md);`,
  GridLayoutDrag: `\n  display: grid; gap: var(--spacing-sm); min-height: 4rem; padding: var(--spacing-md); border: 1px solid var(--ds-border); border-radius: var(--border-radius-md);`,
  TemplateDrag: `\n  &__item { cursor: grab; padding: var(--spacing-sm) var(--spacing-md); background: var(--surface-2); border-radius: var(--border-radius-sm); list-style: none; }`
}

const TYPES = {
  PdfPreview: `import type { BaseProps } from '@amg-webui/types'

export interface PdfPreviewProps extends BaseProps {
  src?: string | File | Blob | null
  height?: string
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface PdfPreviewEmits {
  (e: 'load'): void
  (e: 'clear'): void
}
`,
  FilePreview: `import type { BaseProps } from '@amg-webui/types'

export interface FilePreviewProps extends BaseProps {
  src?: string | File | Blob | null
  mime?: string
  height?: string
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface FilePreviewEmits {
  (e: 'load'): void
  (e: 'error', err: Error): void
  (e: 'clear'): void
}
`,
  AudioPlay: `import type { BaseProps } from '@amg-webui/types'

export interface AudioPlayProps extends BaseProps {
  src?: string | File | Blob | null
  controls?: boolean
  autoplay?: boolean
  loop?: boolean
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface AudioPlayEmits {
  (e: 'play'): void
  (e: 'pause'): void
  (e: 'ended'): void
  (e: 'clear'): void
}
`,
  BrowserDetect: `import type { BaseProps } from '@amg-webui/types'
import type { BrowserInfo } from '@amg-webui/utils'

export interface BrowserDetectProps extends BaseProps {
  userAgent?: string
  loading?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface BrowserDetectEmits {
  (e: 'detected', info: BrowserInfo): void
  (e: 'refresh'): void
}
`,
  CanvasPreview: `import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData } from '@amg-webui/utils'

export interface CanvasPreviewProps extends BaseProps {
  nodes?: CanvasNodeData[]
  mode?: 'free' | 'grid'
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface CanvasPreviewEmits {
  (e: 'select', id: string): void
  (e: 'refresh'): void
}
`,
  CanvasShortcut: `import type { BaseProps } from '@amg-webui/types'

export interface CanvasShortcutProps extends BaseProps {
  enabled?: boolean
  loading?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface CanvasShortcutEmits {
  (e: 'copy'): void
  (e: 'paste'): void
  (e: 'delete'): void
  (e: 'undo'): void
  (e: 'redo'): void
}
`,
  DragRuler: `import type { BaseProps } from '@amg-webui/types'

export interface DragRulerProps extends BaseProps {
  scale?: number
  showGuides?: boolean
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface DragRulerEmits {
  (e: 'click', event: MouseEvent): void
  (e: 'toggle-guides', value: boolean): void
}
`,
  DragSortNode: `import type { BaseProps } from '@amg-webui/types'
import type { CanvasNodeData } from '@amg-webui/utils'

export interface DragSortNodeProps extends BaseProps {
  nodes?: CanvasNodeData[]
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface DragSortNodeEmits {
  (e: 'reorder', nodes: CanvasNodeData[]): void
  (e: 'clear'): void
}
`,
  DragWrapper: `import type { BaseProps } from '@amg-webui/types'

export interface DragWrapperProps extends BaseProps {
  label?: string
  nested?: boolean
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface DragWrapperEmits {
  (e: 'drop', type: string): void
  (e: 'clear'): void
}
`,
  FreeLayoutDrag: `import type { BaseProps } from '@amg-webui/types'

export interface FreeLayoutDragProps extends BaseProps {
  enabled?: boolean
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface FreeLayoutDragEmits {
  (e: 'mode', mode: 'free'): void
  (e: 'toggle', enabled: boolean): void
}
`,
  GridLayoutDrag: `import type { BaseProps } from '@amg-webui/types'

export interface GridLayoutDragProps extends BaseProps {
  cols?: number
  enabled?: boolean
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface GridLayoutDragEmits {
  (e: 'mode', mode: 'grid'): void
  (e: 'toggle', enabled: boolean): void
}
`,
  TemplateDrag: `import type { BaseProps } from '@amg-webui/types'

export interface TemplateDragItem {
  id: string
  name: string
}

export interface TemplateDragProps extends BaseProps {
  templates?: TemplateDragItem[]
  loading?: boolean
  disabled?: boolean
  title?: string
  telemetry?: boolean
  trackId?: string
}

export interface TemplateDragEmits {
  (e: 'apply', tpl: TemplateDragItem): void
  (e: 'refresh'): void
}
`
}

// Vue templates — preserve core API, expand UI
const VUE = {
  PdfPreview: `<script setup lang="ts">
import { ref, toRef, watch, onBeforeUnmount, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { PdfPreviewProps, PdfPreviewEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<PdfPreviewProps>(), {
  src: null,
  height: '20rem',
  loading: false,
  disabled: false,
  telemetry: undefined
})

const emit = defineEmits<PdfPreviewEmits>()
const { t } = useLocale()
const url = ref('')

watch(toRef(props, 'src'), (val) => {
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  if (!val) return
  url.value = typeof val === 'string' ? val : URL.createObjectURL(val)
}, { immediate: true })

onBeforeUnmount(() => { if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value) })

const titleText = computed(() => props.title ?? t('component.pdf-preview.title'))

function onLoad() {
  emit('load')
  trackEmit({ component: 'PdfPreview', type: 'load', trackId: props.trackId, telemetry: props.telemetry })
}

function clearPreview() {
  if (props.disabled) return
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  emit('clear')
  trackEmit({ component: 'PdfPreview', type: 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section :class="['vp-pdf-preview', 'vp-pdf-preview__panel', props.class]" :style="style" role="region" aria-labelledby="vp-pdf-preview-title" data-component="PdfPreview">
    <header class="vp-pdf-preview__header">
      <h3 id="vp-pdf-preview-title" class="vp-pdf-preview__title">{{ titleText }}</h3>
      <div class="vp-pdf-preview__toolbar">
        <button type="button" class="vp-pdf-preview__btn vp-pdf-preview__btn--ghost" :disabled="disabled || !url" @click="clearPreview">{{ t(LocaleKeys.button.reset) }}</button>
      </div>
    </header>
    <div v-if="loading" class="vp-pdf-preview__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-pdf-preview__body">
      <object v-if="url" :data="url" type="application/pdf" class="vp-pdf-preview__obj" :style="{ height }" @load="onLoad">
        <iframe :src="url" class="vp-pdf-preview__frame" :style="{ height }" :title="titleText" />
      </object>
      <p v-else class="vp-pdf-preview__empty">{{ t('component.pdf-preview.lead') }}</p>
      <slot />
    </div>
  </section>
</template>
`,
  FilePreview: `<script setup lang="ts">
import { computed, ref, toRef, watch, onBeforeUnmount } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { FilePreviewProps, FilePreviewEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<FilePreviewProps>(), {
  src: null, mime: '', height: '16rem', loading: false, disabled: false, telemetry: undefined
})
const emit = defineEmits<FilePreviewEmits>()
const { t } = useLocale()
const url = ref('')

watch(toRef(props, 'src'), (val) => {
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  if (!val) return
  url.value = typeof val === 'string' ? val : URL.createObjectURL(val)
}, { immediate: true })

onBeforeUnmount(() => { if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value) })

const titleText = computed(() => props.title ?? t('component.file-preview.title'))
const isImage = computed(() => /^image\\//.test(props.mime) || /\\.(png|jpe?g|gif|webp|svg)$/i.test(url.value))
const isPdf = computed(() => props.mime === 'application/pdf' || /\\.pdf$/i.test(url.value))

function onLoad() {
  emit('load')
  trackEmit({ component: 'FilePreview', type: 'load', trackId: props.trackId, telemetry: props.telemetry })
}

function clearPreview() {
  if (props.disabled) return
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  emit('clear')
  trackEmit({ component: 'FilePreview', type: 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section :class="['vp-file-preview', 'vp-file-preview__panel', props.class]" :style="style" role="region" aria-labelledby="vp-file-preview-title" data-component="FilePreview">
    <header class="vp-file-preview__header">
      <h3 id="vp-file-preview-title" class="vp-file-preview__title">{{ titleText }}</h3>
      <button type="button" class="vp-file-preview__btn vp-file-preview__btn--ghost" :disabled="disabled || !url" @click="clearPreview">{{ t(LocaleKeys.button.reset) }}</button>
    </header>
    <div v-if="loading" class="vp-file-preview__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-file-preview__body">
      <template v-if="url">
        <img v-if="isImage" :src="url" class="vp-file-preview__img" :style="{ maxHeight: height }" alt="" @load="onLoad" @error="emit('error', new Error('load'))" />
        <iframe v-else-if="isPdf" :src="url" class="vp-file-preview__frame" :style="{ height }" :title="titleText" @load="onLoad" />
        <iframe v-else :src="url" class="vp-file-preview__frame" :style="{ height }" :title="titleText" @load="onLoad" />
      </template>
      <p v-else class="vp-file-preview__empty">{{ t('component.file-preview.lead') }}</p>
      <slot />
    </div>
  </section>
</template>
`,
  AudioPlay: `<script setup lang="ts">
import { ref, toRef, watch, onBeforeUnmount, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { AudioPlayProps, AudioPlayEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<AudioPlayProps>(), {
  src: null, controls: true, autoplay: false, loop: false, loading: false, disabled: false, telemetry: undefined
})
const emit = defineEmits<AudioPlayEmits>()
const { t } = useLocale()
const url = ref('')
const audioRef = ref<HTMLAudioElement | null>(null)

watch(toRef(props, 'src'), (val) => {
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  if (!val) return
  url.value = typeof val === 'string' ? val : URL.createObjectURL(val)
}, { immediate: true })

onBeforeUnmount(() => { if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value) })

const titleText = computed(() => props.title ?? t('component.audio-play.lead'))

function playAudio() {
  if (props.disabled || !audioRef.value) return
  audioRef.value.play()
  trackEmit({ component: 'AudioPlay', type: 'play', trackId: props.trackId, telemetry: props.telemetry })
}

function pauseAudio() {
  if (!audioRef.value) return
  audioRef.value.pause()
  trackEmit({ component: 'AudioPlay', type: 'pause', trackId: props.trackId, telemetry: props.telemetry })
}

function clearAudio() {
  if (props.disabled) return
  pauseAudio()
  if (url.value.startsWith('blob:')) URL.revokeObjectURL(url.value)
  url.value = ''
  emit('clear')
  trackEmit({ component: 'AudioPlay', type: 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section :class="['vp-audio-play', 'vp-audio-play__panel', props.class]" :style="style" role="region" aria-labelledby="vp-audio-play-title" data-component="AudioPlay">
    <header class="vp-audio-play__header">
      <h3 id="vp-audio-play-title" class="vp-audio-play__title">{{ titleText }}</h3>
    </header>
    <div v-if="loading" class="vp-audio-play__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-audio-play__body">
      <audio v-if="url" ref="audioRef" class="vp-audio-play__audio" :src="url" :controls="controls" :autoplay="autoplay" :loop="loop" :disabled="disabled" @play="emit('play')" @pause="emit('pause')" @ended="emit('ended')" />
      <p v-else class="vp-audio-play__empty">{{ t('component.audio-play.lead') }}</p>
      <div class="vp-audio-play__toolbar">
        <button type="button" class="vp-audio-play__btn" :disabled="disabled || !url" @click="playAudio">{{ t(LocaleKeys.industry.video.play) }}</button>
        <button type="button" class="vp-audio-play__btn vp-audio-play__btn--ghost" :disabled="disabled || !url" @click="pauseAudio">{{ t(LocaleKeys.industry.video.pause) }}</button>
        <button type="button" class="vp-audio-play__btn vp-audio-play__btn--ghost" :disabled="disabled" @click="clearAudio">{{ t(LocaleKeys.button.reset) }}</button>
      </div>
      <slot />
    </div>
  </section>
</template>
`
}

// Generate remaining vue files with a helper for canvas/drag family
function panelVue(name, opts) {
  const prefix = `vp-${kebab(name)}`
  const id = prefix
  return `<script setup lang="ts">
${opts.script}
</script>

<template>
  <section :class="['${prefix}', '${prefix}__panel', props.class]" :style="style" role="region" aria-labelledby="${id}-title" data-component="${name}">
    <header class="${prefix}__header">
      <h3 id="${id}-title" class="${prefix}__title">{{ titleText }}</h3>
      <div class="${prefix}__status" role="status">${opts.statusSlot || ''}</div>
    </header>
    <div v-if="loading" class="${prefix}__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="${prefix}__body">
      ${opts.body}
      <slot />
    </div>
  </section>
</template>
`
}

VUE.BrowserDetect = panelVue('BrowserDetect', {
  script: `import { computed, onMounted, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import { detectBrowser } from '@amg-webui/utils'
import type { BrowserDetectProps, BrowserDetectEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<BrowserDetectProps>(), { loading: false, telemetry: undefined })
const emit = defineEmits<BrowserDetectEmits>()
const { t } = useLocale()
const tick = ref(0)
const info = computed(() => detectBrowser(props.userAgent))
const titleText = computed(() => props.title ?? t('component.browser-detect.browser'))

function refresh() {
  tick.value++
  emit('detected', info.value)
  emit('refresh')
  trackEmit({ component: 'BrowserDetect', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry })
}

onMounted(() => refresh())`,
  statusSlot: `{{ info.browser }} {{ info.version }}`,
  body: `<dl class="vp-browser-detect__list">
        <div class="vp-browser-detect__item"><dt>{{ t('component.browser-detect.browser') }}</dt><dd>{{ info.browser }} {{ info.version }}</dd></div>
        <div class="vp-browser-detect__item"><dt>{{ t('component.browser-detect.os') }}</dt><dd>{{ info.os }}</dd></div>
        <div class="vp-browser-detect__item"><dt>{{ t('component.browser-detect.device') }}</dt><dd>{{ info.device }}</dd></div>
      </dl>
      <div class="vp-browser-detect__toolbar">
        <button type="button" class="vp-browser-detect__btn vp-browser-detect__btn--ghost" @click="refresh">{{ t(LocaleKeys.button.refresh) }}</button>
      </div>`
})

VUE.CanvasPreview = panelVue('CanvasPreview', {
  script: `import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { CanvasPreviewProps, CanvasPreviewEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<CanvasPreviewProps>(), {
  nodes: () => [{ id: 'n1', label: 'Block A', type: 'text', x: 12, y: 12, w: 120, h: 48 }],
  mode: 'free', loading: false, disabled: false, telemetry: undefined
})
const emit = defineEmits<CanvasPreviewEmits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('component.canvas-preview.lead'))
const visible = computed(() => props.nodes.filter((n) => !n.hidden))

function selectNode(id: string) {
  if (props.disabled) return
  emit('select', id)
  trackEmit({ component: 'CanvasPreview', type: 'select', trackId: props.trackId, telemetry: props.telemetry, payload: { id } })
}

function refresh() {
  emit('refresh')
  trackEmit({ component: 'CanvasPreview', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry })
}`,
  statusSlot: `{{ visible.length }}`,
  body: `<div :class="['vp-canvas-preview__wrap', { 'vp-canvas-preview--grid': mode === 'grid' }]">
        <div v-for="node in visible" :key="node.id" class="vp-canvas-preview__node" role="button" tabindex="0" :style="{ left: mode === 'free' ? node.x + 'px' : undefined, top: mode === 'free' ? node.y + 'px' : undefined, width: node.w + 'px', minHeight: node.h + 'px' }" @click="selectNode(node.id)" @keydown.enter="selectNode(node.id)">
          <strong>{{ node.label }}</strong><span>{{ node.type }}</span>
        </div>
        <p v-if="!visible.length" class="vp-canvas-preview__empty">{{ t(LocaleKeys.common.noData) }}</p>
      </div>
      <div class="vp-canvas-preview__toolbar">
        <button type="button" class="vp-canvas-preview__btn vp-canvas-preview__btn--ghost" :disabled="disabled" @click="refresh">{{ t(LocaleKeys.button.refresh) }}</button>
      </div>`
})

VUE.CanvasShortcut = panelVue('CanvasShortcut', {
  script: `import { computed, onBeforeUnmount, onMounted } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useCanvasEditor } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { CanvasShortcutProps, CanvasShortcutEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<CanvasShortcutProps>(), { enabled: true, loading: false, telemetry: undefined })
const emit = defineEmits<CanvasShortcutEmits>()
const { t } = useLocale()
const editor = useCanvasEditor()
const titleText = computed(() => props.title ?? t('component.canvas-shortcut.title'))

function onKeyDown(e: KeyboardEvent) {
  if (!props.enabled || !editor || editor.readonly.value) return
  const mod = e.metaKey || e.ctrlKey
  if (mod && e.key.toLowerCase() === 'c') { emit('copy'); trackEmit({ component: 'CanvasShortcut', type: 'copy', trackId: props.trackId, telemetry: props.telemetry }) }
  else if (mod && e.key.toLowerCase() === 'v') { emit('paste'); trackEmit({ component: 'CanvasShortcut', type: 'paste', trackId: props.trackId, telemetry: props.telemetry }) }
  else if ((e.key === 'Delete' || e.key === 'Backspace') && editor.selectedIds.value.length) { e.preventDefault(); editor.removeNodes(editor.selectedIds.value); emit('delete'); trackEmit({ component: 'CanvasShortcut', type: 'delete', trackId: props.trackId, telemetry: props.telemetry }) }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeyDown))`,
  statusSlot: `{{ enabled ? 'ON' : 'OFF' }}`,
  body: `<p class="vp-canvas-shortcut__muted">{{ t('component.canvas-shortcut.hint') }}</p>`
})

// Fix CanvasShortcut - component.canvas-shortcut keys may not exist, use generic
VUE.CanvasShortcut = VUE.CanvasShortcut.replace(/component\.canvas-shortcut\.title/g, "LocaleKeys.exampleDoc.demos").replace(/component\.canvas-shortcut\.hint/g, "'Ctrl+C / Ctrl+V / Delete'")

VUE.DragRuler = panelVue('DragRuler', {
  script: `import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { DragRulerProps, DragRulerEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragRulerProps>(), { scale: 1, showGuides: true, loading: false, disabled: false, telemetry: undefined })
const emit = defineEmits<DragRulerEmits>()
const { t } = useLocale()
const guides = ref(props.showGuides)
const titleText = computed(() => props.title ?? t('component.drag-ruler.title'))
const ticks = computed(() => Array.from({ length: 25 }, (_, i) => i * 10 * props.scale))

function toggleGuides() {
  if (props.disabled) return
  guides.value = !guides.value
  emit('toggle-guides', guides.value)
  trackEmit({ component: 'DragRuler', type: 'toggle-guides', trackId: props.trackId, telemetry: props.telemetry })
}`,
  body: `<div class="vp-drag-ruler__h"><span v-for="tick in ticks" :key="'h'+tick" class="vp-drag-ruler__tick">{{ tick }}</span></div>
      <div class="vp-drag-ruler__v"><span v-for="tick in ticks" :key="'v'+tick" class="vp-drag-ruler__tick">{{ tick }}</span></div>
      <div v-if="guides" class="vp-drag-ruler__guides"><slot /></div>
      <div class="vp-drag-ruler__toolbar">
        <button type="button" class="vp-drag-ruler__btn vp-drag-ruler__btn--ghost" :disabled="disabled" @click="toggleGuides">{{ t(LocaleKeys.button.confirm) }}</button>
      </div>`
})

VUE.DragRuler = VUE.DragRuler.replace(/component\.drag-ruler\.title/g, "LocaleKeys.exampleDoc.demos")

// Write util shells
for (const name of UTIL_SHELLS) {
  const dir = join(baseDir, name)
  const prefix = `vp-${kebab(name)}`
  writeFileSync(join(dir, 'style.scss'), expandStyle(prefix, STYLE_EXTRA[name] || ''))
  if (TYPES[name]) writeFileSync(join(dir, 'types.ts'), TYPES[name])
  if (VUE[name]) writeFileSync(join(dir, 'index.vue'), VUE[name])
  console.log('deepen', name)
}

// Remaining drag components - write directly
writeFileSync(join(baseDir, 'DragSortNode/index.vue'), `<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { CanvasNodeData } from '@amg-webui/utils'
import type { DragSortNodeProps, DragSortNodeEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragSortNodeProps>(), {
  nodes: () => [{ id: 'a', label: 'Node A', type: 'box', x: 0, y: 0, w: 80, h: 32 }, { id: 'b', label: 'Node B', type: 'box', x: 0, y: 0, w: 80, h: 32 }],
  loading: false, disabled: false, telemetry: undefined
})
const emit = defineEmits<DragSortNodeEmits>()
const { t } = useLocale()
const list = ref<CanvasNodeData[]>([...props.nodes])
const dragId = ref<string | null>(null)
const titleText = computed(() => props.title ?? t(LocaleKeys.exampleDoc.demos))

watch(() => props.nodes, (v) => { list.value = [...v] })

function onDragStart(id: string) { dragId.value = id }
function onDrop(targetId: string) {
  if (!dragId.value || dragId.value === targetId || props.disabled) return
  const from = list.value.findIndex((n) => n.id === dragId.value)
  const to = list.value.findIndex((n) => n.id === targetId)
  if (from < 0 || to < 0) return
  const next = [...list.value]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  list.value = next
  dragId.value = null
  emit('reorder', next)
  trackEmit({ component: 'DragSortNode', type: 'reorder', trackId: props.trackId, telemetry: props.telemetry })
}
function clearList() {
  if (props.disabled) return
  list.value = []
  emit('clear')
  trackEmit({ component: 'DragSortNode', type: 'clear', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section class="vp-drag-sort-node vp-drag-sort-node__panel" role="region" aria-labelledby="vp-drag-sort-node-title" data-component="DragSortNode">
    <header class="vp-drag-sort-node__header">
      <h3 id="vp-drag-sort-node-title" class="vp-drag-sort-node__title">{{ titleText }}</h3>
    </header>
    <div v-if="loading" class="vp-drag-sort-node__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <ul v-else class="vp-drag-sort-node__list" role="listbox">
      <li v-for="node in list" :key="node.id" class="vp-drag-sort-node__item" draggable="true" role="option" @dragstart="onDragStart(node.id)" @dragover.prevent @drop="onDrop(node.id)">{{ node.label }}</li>
      <p v-if="!list.length" class="vp-drag-sort-node__empty">{{ t(LocaleKeys.common.noData) }}</p>
    </ul>
    <div class="vp-drag-sort-node__toolbar">
      <button type="button" class="vp-drag-sort-node__btn vp-drag-sort-node__btn--ghost" :disabled="disabled" @click="clearList">{{ t(LocaleKeys.button.reset) }}</button>
    </div>
  </section>
</template>
`)

writeFileSync(join(baseDir, 'DragWrapper/index.vue'), `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { DragWrapperProps, DragWrapperEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<DragWrapperProps>(), { label: '', nested: true, loading: false, disabled: false, telemetry: undefined })
const emit = defineEmits<DragWrapperEmits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? props.label || t('component.drag-wrapper.hint'))

function onDrop(e: DragEvent) {
  e.preventDefault()
  e.stopPropagation()
  if (props.disabled) return
  const type = e.dataTransfer?.getData('application/vp-material-type')
  if (type) { emit('drop', type); trackEmit({ component: 'DragWrapper', type: 'drop', trackId: props.trackId, telemetry: props.telemetry, payload: { type } }) }
}
function onDragOver(e: DragEvent) { e.preventDefault(); e.stopPropagation() }
function clearZone() { if (!props.disabled) { emit('clear'); trackEmit({ component: 'DragWrapper', type: 'clear', trackId: props.trackId, telemetry: props.telemetry }) } }
</script>

<template>
  <section :class="['vp-drag-wrapper', { 'vp-drag-wrapper--nested': nested }, props.class]" :style="style" role="region" aria-labelledby="vp-drag-wrapper-title" data-component="DragWrapper" @dragover="onDragOver" @drop="onDrop">
    <header class="vp-drag-wrapper__header"><h3 id="vp-drag-wrapper-title" class="vp-drag-wrapper__title">{{ titleText }}</h3></header>
    <div v-if="loading" class="vp-drag-wrapper__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-drag-wrapper__body">
      <div class="vp-drag-wrapper__slot"><slot /></div>
      <p v-if="!$slots.default" class="vp-drag-wrapper__empty">{{ t('component.drag-wrapper.hint') }}</p>
      <button type="button" class="vp-drag-wrapper__btn vp-drag-wrapper__btn--ghost" :disabled="disabled" @click="clearZone">{{ t(LocaleKeys.button.reset) }}</button>
    </div>
  </section>
</template>
`)

writeFileSync(join(baseDir, 'FreeLayoutDrag/index.vue'), `<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useCanvasEditor } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { FreeLayoutDragProps, FreeLayoutDragEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<FreeLayoutDragProps>(), { enabled: true, loading: false, disabled: false, telemetry: undefined })
const emit = defineEmits<FreeLayoutDragEmits>()
const { t } = useLocale()
const editor = useCanvasEditor()
const on = ref(props.enabled)
const titleText = computed(() => props.title ?? t(LocaleKeys.exampleDoc.demos))

watch(() => props.enabled, (v) => { on.value = v; if (v && editor) { editor.mode.value = 'free'; emit('mode', 'free') } }, { immediate: true })

function toggle() {
  if (props.disabled) return
  on.value = !on.value
  if (on.value && editor) editor.mode.value = 'free'
  emit('toggle', on.value)
  trackEmit({ component: 'FreeLayoutDrag', type: 'toggle', trackId: props.trackId, telemetry: props.telemetry, payload: { enabled: on.value } })
}
</script>

<template>
  <section :class="['vp-free-layout-drag', { 'vp-free-layout-drag--active': on }, props.class]" :style="style" role="region" aria-labelledby="vp-free-layout-drag-title" data-component="FreeLayoutDrag">
    <header class="vp-free-layout-drag__header"><h3 id="vp-free-layout-drag-title" class="vp-free-layout-drag__title">{{ titleText }}</h3><span class="vp-free-layout-drag__badge" :class="on ? 'vp-free-layout-drag__badge--on' : 'vp-free-layout-drag__badge--off'">{{ on ? 'free' : 'off' }}</span></header>
    <div v-if="loading" class="vp-free-layout-drag__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-free-layout-drag__body"><slot /><button type="button" class="vp-free-layout-drag__btn vp-free-layout-drag__btn--ghost" :disabled="disabled" @click="toggle">{{ t(LocaleKeys.button.confirm) }}</button></div>
  </section>
</template>
`)

writeFileSync(join(baseDir, 'GridLayoutDrag/index.vue'), `<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { useCanvasEditor } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { GridLayoutDragProps, GridLayoutDragEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<GridLayoutDragProps>(), { cols: 24, enabled: true, loading: false, disabled: false, telemetry: undefined })
const emit = defineEmits<GridLayoutDragEmits>()
const { t } = useLocale()
const editor = useCanvasEditor()
const on = ref(props.enabled)
const titleText = computed(() => props.title ?? t(LocaleKeys.exampleDoc.demos))
const gridStyle = computed(() => ({ gridTemplateColumns: \`repeat(\${props.cols}, 1fr)\` }))

watch(() => props.enabled, (v) => { on.value = v; if (v && editor) { editor.mode.value = 'grid'; emit('mode', 'grid') } }, { immediate: true })

function toggle() {
  if (props.disabled) return
  on.value = !on.value
  if (on.value && editor) editor.mode.value = 'grid'
  emit('toggle', on.value)
  trackEmit({ component: 'GridLayoutDrag', type: 'toggle', trackId: props.trackId, telemetry: props.telemetry })
}
</script>

<template>
  <section :class="['vp-grid-layout-drag', { 'vp-grid-layout-drag--active': on }, props.class]" :style="[gridStyle, style]" role="region" aria-labelledby="vp-grid-layout-drag-title" data-component="GridLayoutDrag">
    <header class="vp-grid-layout-drag__header"><h3 id="vp-grid-layout-drag-title" class="vp-grid-layout-drag__title">{{ titleText }}</h3></header>
    <div v-if="loading" class="vp-grid-layout-drag__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <div v-else class="vp-grid-layout-drag__body"><slot /><button type="button" class="vp-grid-layout-drag__btn vp-grid-layout-drag__btn--ghost" :disabled="disabled" @click="toggle">{{ t(LocaleKeys.button.confirm) }}</button></div>
  </section>
</template>
`)

writeFileSync(join(baseDir, 'TemplateDrag/index.vue'), `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import { trackEmit } from '@amg-webui/telemetry'
import { LocaleKeys } from '@amg-webui/locale'
import type { TemplateDragProps, TemplateDragEmits } from './types'
import './style.scss'

const props = withDefaults(defineProps<TemplateDragProps>(), {
  templates: () => [{ id: 't1', name: 'Form A' }, { id: 't2', name: 'Form B' }],
  loading: false, disabled: false, telemetry: undefined
})
const emit = defineEmits<TemplateDragEmits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t(LocaleKeys.exampleDoc.demos))

function onDragStart(e: DragEvent, id: string) { e.dataTransfer?.setData('application/vp-template-id', id) }
function onClick(tpl: (typeof props.templates)[number]) {
  if (props.disabled) return
  emit('apply', tpl)
  trackEmit({ component: 'TemplateDrag', type: 'apply', trackId: props.trackId, telemetry: props.telemetry, payload: { id: tpl.id } })
}
function refresh() { emit('refresh'); trackEmit({ component: 'TemplateDrag', type: 'refresh', trackId: props.trackId, telemetry: props.telemetry }) }
</script>

<template>
  <section class="vp-template-drag vp-template-drag__panel" role="region" aria-labelledby="vp-template-drag-title" data-component="TemplateDrag">
    <header class="vp-template-drag__header"><h3 id="vp-template-drag-title" class="vp-template-drag__title">{{ titleText }}</h3></header>
    <div v-if="loading" class="vp-template-drag__loading" role="status">{{ t(LocaleKeys.common.loading) }}</div>
    <ul v-else class="vp-template-drag__list" role="listbox">
      <li v-for="tpl in templates" :key="tpl.id" class="vp-template-drag__item" draggable="true" role="option" @dragstart="onDragStart($event, tpl.id)" @click="onClick(tpl)">{{ tpl.name }}</li>
      <p v-if="!templates.length" class="vp-template-drag__empty">{{ t(LocaleKeys.common.noData) }}</p>
    </ul>
    <div class="vp-template-drag__toolbar"><button type="button" class="vp-template-drag__btn vp-template-drag__btn--ghost" :disabled="disabled" @click="refresh">{{ t(LocaleKeys.button.refresh) }}</button></div>
  </section>
</template>
`)

for (const name of ['DragSortNode', 'DragWrapper', 'FreeLayoutDrag', 'GridLayoutDrag', 'TemplateDrag']) {
  const prefix = `vp-${kebab(name)}`
  writeFileSync(join(baseDir, name, 'style.scss'), expandStyle(prefix, STYLE_EXTRA[name] || ''))
  if (TYPES[name]) writeFileSync(join(baseDir, name, 'types.ts'), TYPES[name])
  console.log('deepen', name)
}

// ── Demo generation ──────────────────────────────────────────
const DEMO_OVERRIDES = {
  GbsAlarmModal: { setup: 'const open = ref(true)', body: '<GbsAlarmModal v-model:open="open" />' },
  VideoPreview: { setup: "const src = 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4'", body: '<VideoPreview :src="src" />' }
}

function makeDemo(name) {
  const s = slug(name)
  const ov = DEMO_OVERRIDES[name] || {}
  const setup = ov.setup || ''
  const body = ov.body || `<${name} />`
  const vueImport = setup.includes('ref(') ? 'computed, ref' : 'computed'
  return `<script setup lang="ts">
import { ${vueImport} } from 'vue'
import { ${name} } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
${setup}
const codeBasic = demoSfc({
  imports: [\`import { ${name} } from '@amg-webui/components/base'\`],
  template: ['  <${name} />']
})
const propRows = computed<PropRow[]>(() => [
  { name: 'class / style', type: 'BaseProps', description: t('example.doc.${s}.prop.base') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.${s}.when') }}</p>
    <DemoBlock :title="t('example.doc.${s}.demo.basic')" :description="t('example.doc.${s}.demo.basicDesc')" :code="codeBasic" default-open>
      ${body}
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

for (const name of ALL_DEMOS) {
  const dir = join(demosDir, name)
  mkdirSync(dir, { recursive: true })
  writeFileSync(join(dir, 'index.vue'), makeDemo(name))
  console.log('demo', name)
}

// ── Registry ─────────────────────────────────────────────────
const registryPath = join(demosDir, 'registry.ts')
let regText = readFileSync(registryPath, 'utf8')
for (const name of ALL_DEMOS) {
  const key = slug(name)
  const line = `  ${name}: { whenKey: 'example.doc.${key}.when', Demo: loadDemo('${name}') },`
  if (!regText.includes(`loadDemo('${name}')`)) {
    regText = regText.replace(/\n}\n\nexport function getCuratedDemo/, `\n${line}\n}\n\nexport function getCuratedDemo`)
    console.log('registry', name)
  }
}
writeFileSync(registryPath, regText)

// ── i18n ─────────────────────────────────────────────────────
const zhEntries = {}
const enEntries = {}
for (const name of ALL_DEMOS) {
  const s = slug(name)
  zhEntries[`example.doc.${s}.when`] = `${name}：调试示例与基础 API。`
  zhEntries[`example.doc.${s}.demo.basic`] = '基础用法'
  zhEntries[`example.doc.${s}.demo.basicDesc`] = '默认 props 挂载；可在 Props 表查看扩展项。'
  zhEntries[`example.doc.${s}.prop.base`] = 'class / style 等 BaseProps'
  enEntries[`example.doc.${s}.when`] = `${name}: debug demo and baseline API.`
  enEntries[`example.doc.${s}.demo.basic`] = 'Basic'
  enEntries[`example.doc.${s}.demo.basicDesc`] = 'Mount with defaults; see props table for extensions.'
  enEntries[`example.doc.${s}.prop.base`] = 'BaseProps: class / style'
}

const packs = {
  'zh-CN': zhEntries,
  'zh-TW': zhEntries,
  'en-US': enEntries,
  'ja-JP': enEntries,
  'ko-KR': enEntries,
  'ko-KP': enEntries,
  'ru-RU': enEntries
}

function patchLocale(locale) {
  const file = join(localeRoot, locale, 'exampleDoc.ts')
  let text = readFileSync(file, 'utf8')
  const map = packs[locale]
  const missing = Object.entries(map).filter(([k]) => !text.includes(`"${k}"`))
  if (!missing.length) return console.log(locale, 'i18n ok')
  const insert = missing.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n')
  const idx = text.lastIndexOf('}')
  const before = text.slice(0, idx).replace(/\s+$/, '')
  text = before + (before.endsWith(',') ? '\n' : ',\n') + insert + '\n' + text.slice(idx)
  writeFileSync(file, text)
  console.log(locale, 'i18n +', missing.length)
}

for (const locale of Object.keys(packs)) patchLocale(locale)

console.log('Done — preview/drag shells + industry demos')
