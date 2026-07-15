<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Icon, Slider, Switch } from '@amg-webui/components/base'
import type { Size } from '@amg-webui/types'
import {
  ICON_CATEGORY_IDS,
  listIcons,
  type IconCategoryId
} from '@amg-webui/icons'
import { useLocale } from '@amg-webui/hooks'
import { LocaleKeys } from '@amg-webui/locale'
import { ToastService } from '@amg-webui/theme'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import type { PropRow } from '../../components/demo/types'

const { t } = useLocale()

/** Curated highlights — full set is in the library browser below */
const names = [
  'Activity',
  'Settings',
  'Search',
  'Star',
  'User',
  'Users',
  'Home',
  'Menu',
  'Plus',
  'X',
  'ChevronRight',
  'ChevronLeft',
  'Edit',
  'Trash2',
  'Download',
  'Upload',
  'Eye',
  'Bell',
  'Calendar',
  'Filter',
  'RefreshCw',
  'Lock',
  'Copy',
  'Folder',
  'Save',
  'CircleQuestionMark'
]

/** Lucide playground defaults — https://lucide.dev */
const STYLE_DEFAULT_STROKE = 2
const STYLE_DEFAULT_SIZE = 24
const STYLE_PREVIEW_NAMES = ['Smile', 'Settings', 'Search', 'Star', 'Bell', 'Home'] as const
const MOTION_PREVIEW_NAMES = ['RefreshCw', 'ChevronRight', 'Bell', 'Navigation'] as const

const sizes: Size[] = ['xs', 'sm', 'md', 'lg', 'xl']

const colorTokens = [
  { name: 'inherit', value: undefined as string | undefined },
  { name: 'primary', value: 'var(--primary-500)' },
  { name: 'success', value: 'var(--success-500)' },
  { name: 'warning', value: 'var(--warning-500)' },
  { name: 'danger', value: 'var(--danger-500)' }
]

type BrowserCategory = 'all' | IconCategoryId

const browserQuery = ref('')
const browserCategory = ref<BrowserCategory>('all')

const styleStrokeWidth = ref(STYLE_DEFAULT_STROKE)
const styleSize = ref(STYLE_DEFAULT_SIZE)
const styleAbsoluteStroke = ref(false)
/** Applied color; undefined = inherit parent text color */
const styleColor = ref<string | undefined>(undefined)
/** Native color input value (always #rrggbb) */
const colorPickerHex = ref('#000000')
/** Editable hex field (may be mid-edit, e.g. `#f0`) */
const hexInput = ref('#000000')

/** Motion / transform live controls */
const motionRotate = ref(0)
const motionSpin = ref(false)
const motionPulse = ref(false)
const motionHeartbeat = ref(false)
const motionBounce = ref(false)
const motionFlipH = ref(false)
const motionFlipV = ref(false)

function cssColorToHex(cssColor: string): string | undefined {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  const ctx = canvas.getContext('2d')
  if (!ctx) return undefined
  ctx.fillStyle = '#000000'
  ctx.fillStyle = cssColor
  const normalized = ctx.fillStyle
  if (typeof normalized !== 'string' || !normalized.startsWith('#')) return undefined
  if (normalized.length === 4) {
    const r = normalized[1]
    const g = normalized[2]
    const b = normalized[3]
    return `#${r}${r}${g}${g}${b}${b}`
  }
  return normalized.slice(0, 7)
}

/** Accept `#rgb` / `#rrggbb` / `rgb` / `rrggbb` → lowercase `#rrggbb` */
function normalizeHex(raw: string): string | undefined {
  let s = raw.trim()
  if (!s) return undefined
  if (!s.startsWith('#')) s = `#${s}`
  if (/^#[0-9a-fA-F]{3}$/.test(s)) {
    const r = s[1]
    const g = s[2]
    const b = s[3]
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }
  if (/^#[0-9a-fA-F]{6}$/.test(s)) return s.toLowerCase()
  return undefined
}

function applyHex(hex: string) {
  colorPickerHex.value = hex
  hexInput.value = hex
  styleColor.value = hex
}

function syncColorPickerFromToken() {
  const probe = document.createElement('span')
  probe.style.color = 'var(--text-primary)'
  probe.style.position = 'absolute'
  probe.style.visibility = 'hidden'
  document.body.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  document.body.removeChild(probe)
  const hex = cssColorToHex(resolved)
  if (hex) {
    colorPickerHex.value = hex
    hexInput.value = hex
  }
}

function resetStyle() {
  styleStrokeWidth.value = STYLE_DEFAULT_STROKE
  styleSize.value = STYLE_DEFAULT_SIZE
  styleAbsoluteStroke.value = false
  styleColor.value = undefined
  syncColorPickerFromToken()
}

function resetMotion() {
  motionRotate.value = 0
  motionSpin.value = false
  motionPulse.value = false
  motionHeartbeat.value = false
  motionBounce.value = false
  motionFlipH.value = false
  motionFlipV.value = false
}

function clearKeyframeMotions() {
  motionPulse.value = false
  motionHeartbeat.value = false
  motionBounce.value = false
}

function onMotionSpin(value: boolean) {
  motionSpin.value = Boolean(value)
  if (motionSpin.value) clearKeyframeMotions()
}

function onMotionPulse(value: boolean) {
  motionPulse.value = Boolean(value)
  if (motionPulse.value) {
    motionSpin.value = false
    motionHeartbeat.value = false
    motionBounce.value = false
  }
}

function onMotionHeartbeat(value: boolean) {
  motionHeartbeat.value = Boolean(value)
  if (motionHeartbeat.value) {
    motionSpin.value = false
    motionPulse.value = false
    motionBounce.value = false
  }
}

function onMotionBounce(value: boolean) {
  motionBounce.value = Boolean(value)
  if (motionBounce.value) {
    motionSpin.value = false
    motionPulse.value = false
    motionHeartbeat.value = false
  }
}

function onMotionFlipH(value: boolean) {
  motionFlipH.value = Boolean(value)
}

function onMotionFlipV(value: boolean) {
  motionFlipV.value = Boolean(value)
}

function onMotionRotate(value: number | [number, number]) {
  motionRotate.value = typeof value === 'number' ? value : value[0]
}

function onStyleStroke(value: number | [number, number]) {
  styleStrokeWidth.value = typeof value === 'number' ? value : value[0]
}

function onStyleSize(value: number | [number, number]) {
  styleSize.value = typeof value === 'number' ? value : value[0]
}

function onStyleAbsolute(value: boolean) {
  styleAbsoluteStroke.value = Boolean(value)
}

function onColorPick(event: Event) {
  applyHex((event.target as HTMLInputElement).value.toLowerCase())
}

function onHexInput() {
  const normalized = normalizeHex(hexInput.value)
  if (normalized) {
    colorPickerHex.value = normalized
    styleColor.value = normalized
  }
}

function onHexBlur() {
  const normalized = normalizeHex(hexInput.value)
  if (normalized) {
    applyHex(normalized)
    return
  }
  hexInput.value = styleColor.value ?? colorPickerHex.value
}

onMounted(() => {
  syncColorPickerFromToken()
})

const styleStrokeLabel = computed(() =>
  t('example.doc.icon.demo.styleStrokeValue', { value: styleStrokeWidth.value })
)
const styleSizeLabel = computed(() =>
  t('example.doc.icon.demo.styleSizeValue', { value: styleSize.value })
)
const motionRotateLabel = computed(() =>
  t('example.doc.icon.demo.motionRotateValue', { value: motionRotate.value })
)

/** Remount preview when motion knobs change so Lucide/HMR never sticks a stale tree */
const motionIconKey = computed(
  () =>
    [
      motionRotate.value,
      motionSpin.value ? 1 : 0,
      motionPulse.value ? 1 : 0,
      motionHeartbeat.value ? 1 : 0,
      motionBounce.value ? 1 : 0,
      motionFlipH.value ? 1 : 0,
      motionFlipV.value ? 1 : 0,
      styleSize.value,
      styleStrokeWidth.value,
      styleAbsoluteStroke.value ? 1 : 0,
      styleColor.value ?? ''
    ].join('|')
)

const codeStyle = computed(() => {
  const lines = [
    '<Icon',
    '  name="Smile"',
    `  :size="${styleSize.value}"`,
    ...(styleColor.value ? [`  color="${styleColor.value}"`] : []),
    `  :stroke-width="${styleStrokeWidth.value}"`,
    `  :absolute-stroke-width="${styleAbsoluteStroke.value}"`,
    '/>'
  ]
  return lines.join('\n')
})

const codeMotion = computed(() => {
  const lines = [
    '<Icon',
    '  name="RefreshCw"',
    `  :size="${styleSize.value}"`,
    ...(motionRotate.value ? [`  :rotate="${motionRotate.value}"`] : []),
    ...(motionSpin.value ? ['  spin'] : []),
    ...(motionPulse.value ? ['  pulse'] : []),
    ...(motionHeartbeat.value ? ['  heartbeat'] : []),
    ...(motionBounce.value ? ['  bounce'] : []),
    ...(motionFlipH.value ? ['  flip-h'] : []),
    ...(motionFlipV.value ? ['  flip-v'] : []),
    '/>'
  ]
  return lines.join('\n')
})

const browserCategories = computed(() => [
  { id: 'all' as const, label: t(LocaleKeys.common.all) },
  ...ICON_CATEGORY_IDS.map((id) => ({
    id,
    label: t(`example.doc.icon.category.${id}`)
  }))
])

const filteredLibrary = computed(() =>
  listIcons({
    category: browserCategory.value,
    query: browserQuery.value
  })
)

const libraryCountLabel = computed(() =>
  t('example.doc.icon.demo.browserCount', { count: filteredLibrary.value.length })
)

async function copyIconSnippet(name: string) {
  const attrs = [
    `name="${name}"`,
    `:size="${styleSize.value}"`,
    `:stroke-width="${styleStrokeWidth.value}"`,
    `:absolute-stroke-width="${styleAbsoluteStroke.value}"`
  ]
  if (styleColor.value) attrs.splice(1, 0, `color="${styleColor.value}"`)
  const snippet = `<Icon ${attrs.join(' ')} />`
  try {
    await navigator.clipboard.writeText(snippet)
    ToastService.success({
      summary: t(LocaleKeys.tip.copied),
      detail: snippet
    })
  } catch {
    ToastService.error({
      summary: t(LocaleKeys.common.copy),
      detail: name
    })
  }
}

const propRows = computed<PropRow[]>(() => [
  {
    name: 'name',
    description: t('example.doc.icon.prop.name'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'size',
    description: t('example.doc.icon.prop.size'),
    type: "Size | number | string",
    defaultValue: "'md'"
  },
  {
    name: 'color',
    description: t('example.doc.icon.prop.color'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'strokeWidth',
    description: t('example.doc.icon.prop.strokeWidth'),
    type: 'number',
    defaultValue: 'from IconStyleService'
  },
  {
    name: 'absoluteStrokeWidth',
    description: t('example.doc.icon.prop.absoluteStrokeWidth'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'spin',
    description: t('example.doc.icon.prop.spin'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'pulse',
    description: t('example.doc.icon.prop.pulse'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'heartbeat',
    description: t('example.doc.icon.prop.heartbeat'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'bounce',
    description: t('example.doc.icon.prop.bounce'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'rotate',
    description: t('example.doc.icon.prop.rotate'),
    type: 'number',
    defaultValue: '-'
  },
  {
    name: 'flip / flipH / flipV',
    description: t('example.doc.icon.prop.flip'),
    type: "'horizontal' | 'vertical' | 'both' | boolean",
    defaultValue: '-'
  },
  {
    name: 'disabled',
    description: t('example.doc.icon.prop.disabled'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'loading',
    description: t('example.doc.icon.prop.loading'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'selected',
    description: t('example.doc.icon.prop.selected'),
    type: 'boolean',
    defaultValue: 'false'
  },
  {
    name: 'animationDuration',
    description: t('example.doc.icon.prop.animationDuration'),
    type: 'number | string',
    defaultValue: '-'
  },
  {
    name: 'label / alt',
    description: t('example.doc.icon.prop.label'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'title',
    description: t('example.doc.icon.prop.title'),
    type: 'string',
    defaultValue: '-'
  },
  {
    name: 'opacity',
    description: t('example.doc.icon.prop.opacity'),
    type: 'number',
    defaultValue: '-'
  }
])

const codeGrid = `<Icon name="Settings" />
<Icon name="Search" size="lg" />`

const codeLibrary = `import { Search, ICON_CATALOG, listIcons } from '@amg-webui/icons'
import { Icon } from '@amg-webui/components/base'

<Icon name="Search" />
listIcons({ query: 'user', category: 'access' })`

const codeSize = `<Icon name="Star" size="xs" />
<!-- … sm md lg xl -->
<Icon name="Star" :size="32" />`

const codeColor = `<Icon name="Star" color="var(--primary-500)" />
<Icon name="CircleCheck" color="var(--ds-success)" />`

const codeAnim = `<Icon name="RefreshCw" spin />
<Icon name="Bell" pulse />
<Icon name="Heart" heartbeat />
<Icon name="ArrowUp" bounce />
<Icon name="Search" loading />`

const codeTransform = `<Icon name="ChevronRight" :rotate="90" />
<Icon name="ChevronRight" flip="horizontal" />
<Icon name="ChevronUp" flip-h />
<Icon name="ChevronUp" flip-v />`

const codeState = `<Icon name="Settings" disabled />
<Icon name="Star" selected />
<Icon name="Search" loading />`

const codeA11y = `<Icon name="Settings" :label="t('…')" />
<Icon name="Bell" alt="Notifications" title="Notifications" />`

const codeSlot = `<Icon size="lg">
  <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em">
    <circle cx="12" cy="12" r="8" />
  </svg>
</Icon>`
</script>
<template>
  <div class="vp-curated">
    <DemoBlock
      :title="t('example.doc.icon.demo.style')"
      :description="t('example.doc.icon.demo.styleDesc')"
      :code="codeStyle"
    >
      <div class="vp-icon-style">
        <div class="vp-icon-style__preview" role="list" :aria-label="t('example.doc.icon.demo.style')">
          <div
            v-for="n in STYLE_PREVIEW_NAMES"
            :key="n"
            class="vp-icon-style__preview-item"
            role="listitem"
            :title="n"
          >
            <Icon
              :name="n"
              :size="styleSize"
              :color="styleColor"
              :stroke-width="styleStrokeWidth"
              :absolute-stroke-width="styleAbsoluteStroke"
            />
          </div>
        </div>

        <div class="vp-icon-style__panel">
          <header class="vp-icon-style__head">
            <h4 class="vp-icon-style__title">{{ t('example.doc.icon.demo.style') }}</h4>
            <button
              type="button"
              class="vp-icon-style__reset"
              :aria-label="t('example.doc.icon.demo.styleReset')"
              :title="t('example.doc.icon.demo.styleReset')"
              @click="resetStyle"
            >
              <Icon name="RotateCcw" size="sm" />
            </button>
          </header>

          <div class="vp-icon-style__row">
            <span class="vp-icon-style__label">{{ t('example.doc.icon.demo.styleColor') }}</span>
            <div class="vp-icon-style__color">
              <input
                type="color"
                class="vp-icon-style__color-input"
                :value="colorPickerHex"
                :aria-label="t('example.doc.icon.demo.styleColor')"
                @input="onColorPick"
              />
              <input
                v-model="hexInput"
                type="text"
                class="vp-icon-style__hex"
                maxlength="7"
                spellcheck="false"
                autocomplete="off"
                :placeholder="t('example.doc.icon.demo.styleHexPlaceholder')"
                :aria-label="t('example.doc.icon.demo.styleHexPlaceholder')"
                @input="onHexInput"
                @blur="onHexBlur"
                @keydown.enter.prevent="onHexBlur"
              />
            </div>
          </div>

          <div class="vp-icon-style__row vp-icon-style__row--stack">
            <div class="vp-icon-style__meta">
              <span class="vp-icon-style__label">{{ t('example.doc.icon.demo.styleStroke') }}</span>
              <span class="vp-icon-style__value">{{ styleStrokeLabel }}</span>
            </div>
            <Slider
              :model-value="styleStrokeWidth"
              :min="0.5"
              :max="3"
              :step="0.25"
              @update:model-value="onStyleStroke"
            />
          </div>

          <div class="vp-icon-style__row vp-icon-style__row--stack">
            <div class="vp-icon-style__meta">
              <span class="vp-icon-style__label">{{ t('example.doc.icon.demo.styleSize') }}</span>
              <span class="vp-icon-style__value">{{ styleSizeLabel }}</span>
            </div>
            <Slider
              :model-value="styleSize"
              :min="16"
              :max="48"
              :step="1"
              @update:model-value="onStyleSize"
            />
          </div>

          <div class="vp-icon-style__row">
            <span class="vp-icon-style__label">{{ t('example.doc.icon.demo.styleAbsolute') }}</span>
            <Switch :model-value="styleAbsoluteStroke" @update:model-value="onStyleAbsolute" />
          </div>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.motion')"
      :description="t('example.doc.icon.demo.motionDesc')"
      :code="codeMotion"
    >
      <div class="vp-icon-style">
        <div class="vp-icon-style__preview" role="list" :aria-label="t('example.doc.icon.demo.motion')">
          <div
            v-for="n in MOTION_PREVIEW_NAMES"
            :key="`${n}-${motionIconKey}`"
            class="vp-icon-style__preview-item"
            role="listitem"
            :title="n"
          >
            <Icon
              :name="n"
              :size="Math.max(Number(styleSize) || 0, 32)"
              :color="styleColor"
              :stroke-width="Number(styleStrokeWidth) || 2"
              :absolute-stroke-width="Boolean(styleAbsoluteStroke)"
              :rotate="Number(motionRotate) || 0"
              :spin="Boolean(motionSpin)"
              :pulse="Boolean(motionPulse)"
              :heartbeat="Boolean(motionHeartbeat)"
              :bounce="Boolean(motionBounce)"
              :flip-h="Boolean(motionFlipH)"
              :flip-v="Boolean(motionFlipV)"
            />
          </div>
        </div>

        <div class="vp-icon-style__panel">
          <header class="vp-icon-style__head">
            <h4 class="vp-icon-style__title">{{ t('example.doc.icon.demo.motion') }}</h4>
            <button
              type="button"
              class="vp-icon-style__reset"
              :aria-label="t('example.doc.icon.demo.motionReset')"
              :title="t('example.doc.icon.demo.motionReset')"
              @click="resetMotion"
            >
              <Icon name="RotateCcw" size="sm" />
            </button>
          </header>

          <p class="vp-icon-style__debug" aria-live="polite">
            rotate={{ motionRotate }} · spin={{ motionSpin }} · pulse={{ motionPulse }} ·
            heartbeat={{ motionHeartbeat }} · bounce={{ motionBounce }} · flipH={{ motionFlipH }} ·
            flipV={{ motionFlipV }}
          </p>

          <div class="vp-icon-style__row vp-icon-style__row--stack">
            <div class="vp-icon-style__meta">
              <span class="vp-icon-style__label">{{ t('example.doc.icon.demo.motionRotate') }}</span>
              <span class="vp-icon-style__value">{{ motionRotateLabel }}</span>
            </div>
            <Slider
              class="vp-icon-style__slider"
              :model-value="motionRotate"
              :min="0"
              :max="360"
              :step="15"
              @update:model-value="onMotionRotate"
            />
          </div>

          <div class="vp-icon-style__row">
            <span class="vp-icon-style__label">{{ t('example.doc.icon.demo.motionSpin') }}</span>
            <Switch
              class="vp-icon-style__switch"
              :model-value="motionSpin"
              @update:model-value="onMotionSpin"
            />
          </div>

          <div class="vp-icon-style__row">
            <span class="vp-icon-style__label">{{ t('example.doc.icon.demo.motionPulse') }}</span>
            <Switch
              class="vp-icon-style__switch"
              :model-value="motionPulse"
              @update:model-value="onMotionPulse"
            />
          </div>

          <div class="vp-icon-style__row">
            <span class="vp-icon-style__label">{{ t('example.doc.icon.demo.motionHeartbeat') }}</span>
            <Switch
              class="vp-icon-style__switch"
              :model-value="motionHeartbeat"
              @update:model-value="onMotionHeartbeat"
            />
          </div>

          <div class="vp-icon-style__row">
            <span class="vp-icon-style__label">{{ t('example.doc.icon.demo.motionBounce') }}</span>
            <Switch
              class="vp-icon-style__switch"
              :model-value="motionBounce"
              @update:model-value="onMotionBounce"
            />
          </div>

          <div class="vp-icon-style__row">
            <span class="vp-icon-style__label">{{ t('example.doc.icon.demo.motionFlipH') }}</span>
            <Switch
              class="vp-icon-style__switch"
              :model-value="motionFlipH"
              @update:model-value="onMotionFlipH"
            />
          </div>

          <div class="vp-icon-style__row">
            <span class="vp-icon-style__label">{{ t('example.doc.icon.demo.motionFlipV') }}</span>
            <Switch
              class="vp-icon-style__switch"
              :model-value="motionFlipV"
              @update:model-value="onMotionFlipV"
            />
          </div>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.size')"
      :description="t('example.doc.icon.demo.sizeDesc')"
      :code="codeSize"
    >
      <div class="vp-icon-row">
        <div v-for="sz in sizes" :key="sz" class="vp-icon-sample">
          <Icon name="Star" :size="sz" />
          <code class="vp-icon-sample__cap">{{ sz }}</code>
        </div>
        <div class="vp-icon-sample">
          <Icon name="Star" :size="32" />
          <code class="vp-icon-sample__cap">:size="32"</code>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.color')"
      :description="t('example.doc.icon.demo.colorDesc')"
      :code="codeColor"
    >
      <div class="vp-icon-row">
        <div v-for="c in colorTokens" :key="c.name" class="vp-icon-sample">
          <Icon name="Star" size="lg" :color="c.value" :title="c.name" />
          <code class="vp-icon-sample__cap">{{ c.name }}</code>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.anim')"
      :description="t('example.doc.icon.demo.animDesc')"
      :code="codeAnim"
    >
      <div class="vp-icon-row">
        <div class="vp-icon-sample">
          <Icon name="RefreshCw" size="lg" spin />
          <code class="vp-icon-sample__cap">spin</code>
        </div>
        <div class="vp-icon-sample">
          <Icon name="Bell" size="lg" pulse />
          <code class="vp-icon-sample__cap">pulse</code>
        </div>
        <div class="vp-icon-sample">
          <Icon name="Heart" size="lg" heartbeat />
          <code class="vp-icon-sample__cap">heartbeat</code>
        </div>
        <div class="vp-icon-sample">
          <Icon name="ArrowUp" size="lg" bounce />
          <code class="vp-icon-sample__cap">bounce</code>
        </div>
        <div class="vp-icon-sample">
          <Icon name="Search" size="lg" loading />
          <code class="vp-icon-sample__cap">loading</code>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.transform')"
      :description="t('example.doc.icon.demo.transformDesc')"
      :code="codeTransform"
    >
      <div class="vp-icon-row">
        <div class="vp-icon-sample">
          <Icon name="ChevronRight" size="lg" />
          <code class="vp-icon-sample__cap">default</code>
        </div>
        <div class="vp-icon-sample">
          <Icon name="ChevronRight" size="lg" :rotate="90" />
          <code class="vp-icon-sample__cap">:rotate="90"</code>
        </div>
        <div class="vp-icon-sample">
          <Icon name="ChevronRight" size="lg" flip="horizontal" />
          <code class="vp-icon-sample__cap">flip="horizontal"</code>
        </div>
        <div class="vp-icon-sample">
          <Icon name="ChevronUp" size="lg" flip-h />
          <code class="vp-icon-sample__cap">flip-h</code>
        </div>
        <div class="vp-icon-sample">
          <Icon name="ChevronUp" size="lg" flip-v />
          <code class="vp-icon-sample__cap">flip-v</code>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.state')"
      :description="t('example.doc.icon.demo.stateDesc')"
      :code="codeState"
    >
      <div class="vp-icon-row">
        <div class="vp-icon-sample">
          <Icon name="Settings" size="lg" />
          <code class="vp-icon-sample__cap">default</code>
        </div>
        <div class="vp-icon-sample">
          <Icon name="Settings" size="lg" disabled />
          <code class="vp-icon-sample__cap">disabled</code>
        </div>
        <div class="vp-icon-sample">
          <Icon name="Star" size="lg" selected />
          <code class="vp-icon-sample__cap">selected</code>
        </div>
        <div class="vp-icon-sample">
          <Icon name="Search" size="lg" loading />
          <code class="vp-icon-sample__cap">loading</code>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.gallery')"
      :description="t('example.doc.icon.demo.galleryDesc')"
      :code="codeGrid"
    >
      <div class="vp-icon-grid" role="list">
        <div v-for="n in names" :key="n" class="vp-icon-grid__item" role="listitem" :title="n">
          <Icon
            :name="n"
            :size="styleSize"
            :color="styleColor"
            :stroke-width="styleStrokeWidth"
            :absolute-stroke-width="styleAbsoluteStroke"
          />
          <span class="vp-icon-grid__label">{{ n }}</span>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.browser')"
      :description="t('example.doc.icon.demo.browserDesc')"
      :code="codeLibrary"
    >
      <div class="vp-icon-browser">
        <div class="vp-icon-browser__toolbar">
          <label class="vp-icon-browser__search">
            <Icon name="Search" size="sm" aria-hidden="true" />
            <input
              v-model="browserQuery"
              type="search"
              class="vp-icon-browser__input"
              :placeholder="t('example.doc.icon.demo.browserSearch')"
              :aria-label="t('example.doc.icon.demo.browserSearch')"
            />
          </label>
          <div class="vp-icon-browser__cats" role="toolbar" :aria-label="t('example.doc.icon.demo.browser')">
            <button
              v-for="cat in browserCategories"
              :key="cat.id"
              type="button"
              class="vp-icon-browser__chip"
              :class="{ 'vp-icon-browser__chip--active': browserCategory === cat.id }"
              @click="browserCategory = cat.id"
            >
              {{ cat.label }}
            </button>
          </div>
          <p class="vp-icon-browser__count">{{ libraryCountLabel }}</p>
        </div>

        <div v-if="filteredLibrary.length" class="vp-icon-grid" role="list">
          <button
            v-for="entry in filteredLibrary"
            :key="entry.name"
            type="button"
            class="vp-icon-grid__item vp-icon-grid__item--interactive"
            role="listitem"
            :title="t('example.doc.icon.demo.browserCopy', { name: entry.name })"
            @click="copyIconSnippet(entry.name)"
          >
            <Icon
              :name="entry.name"
              :size="styleSize"
              :color="styleColor"
              :stroke-width="styleStrokeWidth"
              :absolute-stroke-width="styleAbsoluteStroke"
            />
            <span class="vp-icon-grid__label">{{ entry.name }}</span>
          </button>
        </div>
        <p v-else class="vp-icon-browser__empty">{{ t('example.doc.icon.demo.browserEmpty') }}</p>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.a11y')"
      :description="t('example.doc.icon.demo.a11yDesc')"
      :code="codeA11y"
    >
      <div class="vp-icon-row">
        <div class="vp-icon-sample">
          <Icon name="Settings" size="lg" :label="t('example.doc.icon.demo.a11yLabel')" />
          <code class="vp-icon-sample__cap">label</code>
        </div>
        <div class="vp-icon-sample">
          <Icon
            name="Bell"
            size="lg"
            :alt="t('example.doc.icon.demo.a11yAlt')"
            :title="t('example.doc.icon.demo.a11yAlt')"
          />
          <code class="vp-icon-sample__cap">alt / title</code>
        </div>
      </div>
    </DemoBlock>

    <DemoBlock
      :title="t('example.doc.icon.demo.slot')"
      :description="t('example.doc.icon.demo.slotDesc')"
      :code="codeSlot"
    >
      <div class="vp-icon-row">
        <div class="vp-icon-sample">
          <Icon size="lg" :label="t('example.doc.icon.demo.slotLabel')">
            <svg viewBox="0 0 24 24" fill="currentColor" width="1em" height="1em" aria-hidden="true">
              <circle cx="12" cy="12" r="8" />
            </svg>
          </Icon>
          <code class="vp-icon-sample__cap">slot</code>
        </div>
      </div>
    </DemoBlock>

    <section class="vp-curated__api">
      <h2 class="vp-curated__api-title">{{ t(LocaleKeys.exampleDoc.api) }}</h2>
      <PropsTable :rows="propRows" />
    </section>
  </div>
</template>

<style scoped>
.vp-curated {
  display: flex;
  flex-direction: column;
  gap: var(--theme-section-gap);
}

.vp-curated__api-title {
  margin: 0 0 var(--spacing-md);
  font-size: var(--font-size-lg);
  color: var(--text-primary);
}

.vp-icon-browser {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  width: 100%;
}

.vp-icon-browser__toolbar {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.vp-icon-browser__search {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: 0 var(--spacing-md);
  min-height: var(--height-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  background: var(--surface-1);
  color: var(--text-secondary);
}

.vp-icon-browser__input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);
  outline: none;
}

.vp-icon-browser__cats {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.vp-icon-browser__chip {
  padding: var(--spacing-xs) var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  background: var(--surface-1);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: color var(--transition-normal), border-color var(--transition-normal),
    background var(--transition-normal);
}

.vp-icon-browser__chip:hover {
  border-color: var(--border-color-hover);
  color: var(--text-primary);
}

.vp-icon-browser__chip--active {
  border-color: var(--primary-500);
  color: var(--primary-600);
  background: var(--ds-accent-muted);
}

.vp-icon-browser__count {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.vp-icon-browser__empty {
  margin: 0;
  padding: var(--spacing-xl);
  text-align: center;
  font-size: var(--font-size-md);
  color: var(--text-secondary);
}

.vp-icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(5.5rem, 1fr));
  gap: var(--spacing-md);
  width: 100%;
}

.vp-icon-grid__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
  color: var(--text-primary);
}

.vp-icon-grid__item--interactive {
  cursor: pointer;
  font: inherit;
  transition: border-color var(--transition-normal), background var(--transition-normal);
}

.vp-icon-grid__item--interactive:hover {
  border-color: var(--border-color-hover);
  background: var(--surface-2);
}

.vp-icon-grid__item--interactive:focus-visible {
  outline: 2px solid var(--ds-focus-ring);
  outline-offset: 2px;
}

.vp-icon-grid__label {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.vp-icon-row {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: var(--spacing-xl);
  color: var(--text-primary);
}

.vp-icon-sample {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  min-width: 4.5rem;
}

.vp-icon-sample__cap {
  margin: 0;
  padding: 0;
  font-size: var(--font-size-xs);
  font-family: var(--font-family-mono, ui-monospace, monospace);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
  white-space: nowrap;
}

.vp-icon-style {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(12rem, 18rem);
  gap: var(--theme-section-gap);
  width: 100%;
  align-items: start;
}

.vp-icon-style__preview {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xl);
  min-height: 8rem;
  padding: var(--spacing-xl);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-2);
  color: var(--text-primary);
}

.vp-icon-style__preview-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.vp-icon-style__panel {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  padding: var(--theme-card-pad);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-card-radius);
  background: var(--surface-1);
}

.vp-icon-style__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.vp-icon-style__title {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-heading, 600);
  color: var(--text-primary);
  line-height: var(--line-height-body);
}

.vp-icon-style__reset {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--height-sm);
  height: var(--height-sm);
  padding: 0;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-btn-radius);
  background: var(--surface-1);
  color: var(--text-secondary);
  cursor: pointer;
  transition: color var(--transition-normal), border-color var(--transition-normal),
    background var(--transition-normal);
}

.vp-icon-style__reset:hover {
  color: var(--text-primary);
  border-color: var(--border-color-hover);
  background: var(--surface-2);
}

.vp-icon-style__reset:focus-visible {
  outline: 2px solid var(--ds-focus-ring);
  outline-offset: 2px;
}

.vp-icon-style__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.vp-icon-style__row--stack {
  flex-direction: column;
  align-items: stretch;
}

.vp-icon-style__meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.vp-icon-style__label {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  line-height: var(--line-height-body);
}

.vp-icon-style__value {
  font-size: var(--font-size-sm);
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.vp-icon-style__debug {
  margin: 0;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--theme-input-radius);
  background: var(--surface-2);
  color: var(--text-secondary);
  font-size: var(--font-size-xs);
  font-family: var(--font-family-mono, ui-monospace, monospace);
  line-height: var(--line-height-body);
  word-break: break-all;
}

.vp-icon-style__range {
  width: 100%;
  accent-color: var(--primary-500);
  cursor: pointer;
}

.vp-icon-style__row input[type='checkbox'] {
  width: var(--spacing-lg);
  height: var(--spacing-lg);
  accent-color: var(--primary-500);
  cursor: pointer;
}

.vp-icon-style__color {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  min-height: var(--height-sm);
  min-width: 0;
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  background: var(--surface-2);
}

.vp-icon-style__color-input {
  flex-shrink: 0;
  width: var(--spacing-xl);
  height: var(--spacing-xl);
  padding: 0;
  border: 1px solid var(--ds-border);
  border-radius: var(--theme-input-radius);
  background: transparent;
  cursor: pointer;
}

.vp-icon-style__hex {
  flex: 1;
  min-width: 5.5rem;
  max-width: 7rem;
  border: 0;
  background: transparent;
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  font-family: var(--font-family-mono, ui-monospace, monospace);
  font-variant-numeric: tabular-nums;
  line-height: var(--line-height-body);
  outline: none;
}

.vp-icon-style__hex::placeholder {
  color: var(--text-secondary);
}

@media (max-width: 48rem) {
  .vp-icon-style {
    grid-template-columns: 1fr;
  }
}
</style>
