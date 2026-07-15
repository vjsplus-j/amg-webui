/**
 * Batch-scaffold missing base components as usable MVPs (vp-*, tokens, i18n-ready).
 * Usage: node scripts/scaffold-missing.mjs [missing-components.txt]
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const listFile = resolve(root, process.argv[2] || 'missing-components.txt')
const names = readFileSync(listFile, 'utf8')
  .split(/\r?\n/)
  .map((s) => s.trim())
  .filter(Boolean)

const kebab = (name) =>
  name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()

function classify(name) {
  if (/404$/.test(name) || /404/.test(name)) return 'page404'
  if (/Chart$|HeatMap|WordCloud|Ranking|GaugeChart/.test(name)) return 'chart'
  if (/Table$|ProTable|VirtualTable|TreeTable|MergeTable|EditTable|StickyTable|TableDrag|TableExport|TablePrint|PivotTable|DrillTable/.test(name))
    return 'table'
  if (/Tree$|LazyTree|EditTree|VirtualTree|FolderTree|TransferTree|TreeTransfer|TreeForm|TreeSelect/.test(name))
    return 'tree'
  if (/Nav$|Menu$|Dropdown|Anchor|PagerNav|TabsNav|TopNav/.test(name)) return 'nav'
  if (
    /^(Layout|Header|Sider|Main|Footer|Row|Col|Space|Center|Container|CardGrid|ColumnLayout|Block|Spacer|FixedLayout|FlowLayout|StackLayout|ScaleLayout|EmbedLayout|FormLayout)$/.test(
      name
    )
  )
    return 'layout'
  if (/Modal$|Toast|Popconfirm|Popover|Mask|NoticeBar|Exception|StatusTip|ProgressTip|LoadingTip|Confirm$/.test(name))
    return 'feedback'
  if (/Onvif|Gbs|Vcr|Video|PTZ|AudioTalk|AudioPlay|SplitVideo/.test(name)) return 'domain'
  if (/Drag|Canvas|PropPanel|TemplateDrag|FreeLayout|GridLayout|DragVerify|CanvasIo|CanvasPreview/.test(name))
    return 'lowcode'
  if (/LoginPanel|UserInfoCard|SearchFilter|TableAction|DetailPanel|FlowPanel|BatchPanel|Dashboard|SettingPanel|PermissionPanel/.test(name))
    return 'bizpanel'
  if (/Upload|Preview|Print|Excel|Pdf|Ocr|Crypto|Clipboard|Browser|ImageCrop|FilePreview|Qrcode|Barcode/.test(name))
    return 'tool'
  if (/Picker|Form|Input|Upload|Search|Select|Captcha|Sms|Editor|Range|Color|Filter|Transfer|Crop|Template/.test(name))
    return 'form'
  return 'generic'
}

function files(name, cls) {
  const k = kebab(name)
  const titleKey = `component.${k}.title`
  const leadKey = `component.${k}.lead`

  const types = `import type { BaseProps } from '@amg-webui/types'

export interface ${name}Props extends BaseProps {
  title?: string
  description?: string
  data?: unknown
  modelValue?: unknown
  disabled?: boolean
  loading?: boolean
}

export interface ${name}Emits {
  (e: 'update:modelValue', value: unknown): void
  (e: 'change', value: unknown): void
  (e: 'click', event: MouseEvent): void
}
`

  const indexTs = `import Comp from './index.vue'
import type { ${name}Props, ${name}Emits } from './types'

export { Comp as ${name} }
export type { ${name}Props, ${name}Emits }
export default Comp
`

  const style = `.vp-${k} {
  color: var(--text-primary);
  font-size: var(--font-size-md);
  line-height: var(--line-height-body);

  &__title {
    margin: 0 0 var(--spacing-sm);
    font-size: var(--font-size-lg);
    font-weight: 600;
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    min-width: 0;
  }

  &__panel {
    background: var(--surface-1);
    border: 1px solid var(--ds-border, var(--border-color));
    border-radius: var(--theme-card-radius, var(--border-radius-md));
    padding: var(--theme-card-pad, var(--spacing-md));
  }

  &__muted {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  &__chart {
    width: 100%;
    height: auto;
    display: block;
  }

  &__toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-md);
    align-items: center;
  }

  &--disabled {
    opacity: 0.55;
    pointer-events: none;
  }
}
`

  let vueBody = ''

  if (cls === 'chart') {
    vueBody = `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  data: () => [40, 65, 30, 80, 55, 70]
})
defineEmits<${name}Emits>()
const { t } = useLocale()

const series = computed(() => {
  const raw = Array.isArray(props.data) ? (props.data as number[]) : [40, 65, 30, 80, 55, 70]
  return raw.map((n) => Number(n) || 0)
})
const max = computed(() => Math.max(1, ...series.value))
const points = computed(() => {
  const w = 320
  const h = 120
  const pad = 8
  const vals = series.value
  if (!vals.length) return ''
  return vals
    .map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / Math.max(1, vals.length - 1)
      const y = h - pad - (v / max.value) * (h - pad * 2)
      return \`\${x},\${y}\`
    })
    .join(' ')
})
const bars = computed(() => {
  const vals = series.value
  const w = 320
  const h = 120
  const gap = 6
  const bw = (w - gap * (vals.length + 1)) / Math.max(1, vals.length)
  return vals.map((v, i) => {
    const bh = (v / max.value) * (h - 16)
    return { x: gap + i * (bw + gap), y: h - 8 - bh, w: bw, h: bh }
  })
})
const titleText = computed(() => props.title ?? t('${titleKey}'))
</script>

<template>
  <div :class="['vp-${k}', 'vp-${k}__panel', { 'vp-${k}--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-${k}__title">{{ titleText }}</h3>
    <p class="vp-${k}__muted">{{ description ?? t('${leadKey}') }}</p>
    <svg class="vp-${k}__chart" viewBox="0 0 320 120" role="img">
      <template v-if="'${name}'.includes('Pie') || '${name}' === 'RadarChart' || '${name}' === 'WordCloud' || '${name}' === 'HeatMap' || '${name}' === 'GraphChart' || '${name}' === 'TreeChart'">
        <circle
          v-for="(v, i) in series"
          :key="i"
          :cx="40 + (i % 5) * 56"
          :cy="40 + Math.floor(i / 5) * 40"
          :r="8 + (v / max) * 16"
          fill="var(--primary-500)"
          opacity="0.75"
        />
      </template>
      <template v-else-if="'${name}'.includes('Line') || '${name}' === 'GaugeChart'">
        <polyline fill="none" stroke="var(--primary-500)" stroke-width="2" :points="points" />
      </template>
      <template v-else>
        <rect
          v-for="(b, i) in bars"
          :key="i"
          :x="b.x"
          :y="b.y"
          :width="b.w"
          :height="b.h"
          rx="2"
          fill="var(--primary-500)"
        />
      </template>
    </svg>
    <slot />
  </div>
</template>
`
  } else if (cls === 'layout') {
    const isRow = name === 'Row'
    const isCol = name === 'Col'
    const isSpace = name === 'Space'
    vueBody = `<script setup lang="ts">
import { computed } from 'vue'
import type { ${name}Props } from './types'
import './style.scss'

const props = defineProps<${name}Props & { gutter?: number | string; span?: number; wrap?: boolean; direction?: 'horizontal' | 'vertical'; align?: string; justify?: string }>()

const rootClass = computed(() => [
  'vp-${k}',
  props.class,
  { 'vp-${k}--wrap': props.wrap !== false }
])

const rootStyle = computed(() => {
  const s: Record<string, string> = { ...(props.style || {}) }
  ${isRow || isSpace ? `s.display = 'flex'
  s.flexDirection = props.direction === 'vertical' ? 'column' : 'row'
  s.flexWrap = props.wrap === false ? 'nowrap' : 'wrap'
  s.gap = props.gutter != null ? (typeof props.gutter === 'number' ? \`\${props.gutter}px\` : String(props.gutter)) : 'var(--spacing-md)'
  if (props.align) s.alignItems = props.align
  if (props.justify) s.justifyContent = props.justify` : ''}
  ${isCol ? `s.flex = props.span != null ? \`0 0 \${(Number(props.span) / 24) * 100}%\` : '1 1 auto'
  s.maxWidth = props.span != null ? \`\${(Number(props.span) / 24) * 100}%\` : undefined as unknown as string` : ''}
  ${!isRow && !isCol && !isSpace ? `s.display = 'block'` : ''}
  return s
})
</script>

<template>
  <div :class="rootClass" :style="rootStyle">
    <slot />
  </div>
</template>
`
  } else if (cls === 'page404') {
    vueBody = `<script setup lang="ts">
import { computed } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = defineProps<${name}Props>()
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()
const titleText = computed(() => props.title ?? t('error.notFound'))
const leadText = computed(() => props.description ?? t('${leadKey}'))
</script>

<template>
  <div :class="['vp-${k}', 'vp-${k}__panel', props.class]" :style="style" data-variant="${k}">
    <div class="vp-${k}__body" style="align-items:center;text-align:center;padding:var(--theme-page-pad)">
      <p class="vp-${k}__muted" aria-hidden="true" style="font-size:var(--font-size-2xl);letter-spacing:0.2em">404</p>
      <h1 class="vp-${k}__title">{{ titleText }}</h1>
      <p class="vp-${k}__muted">{{ leadText }}</p>
      <div class="vp-${k}__toolbar">
        <slot>
          <button type="button" class="vp-${k}__action" @click="emit('click', $event)">
            {{ t('button.continue') }}
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-${k}__action {
  appearance: none;
  border: 1px solid var(--ds-border, var(--border-color));
  background: var(--primary-500);
  color: var(--surface-0, var(--surface-1));
  border-radius: var(--theme-btn-radius, var(--border-radius-md));
  height: var(--height-md, 2.25rem);
  padding: 0 var(--spacing-lg);
  cursor: pointer;
}
</style>
`
  } else if (cls === 'table') {
    vueBody = `<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props & { columns?: { field: string; header: string }[]; rows?: Record<string, unknown>[] }>(), {
  columns: () => [],
  rows: () => []
})
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()
const keyword = ref('')
const filtered = computed(() => {
  const rows = (props.rows?.length ? props.rows : (Array.isArray(props.data) ? props.data as Record<string, unknown>[] : []))
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return rows
  return rows.filter((r) => JSON.stringify(r).toLowerCase().includes(kw))
})
const cols = computed(() =>
  props.columns?.length
    ? props.columns
    : filtered.value[0]
      ? Object.keys(filtered.value[0]).slice(0, 6).map((field) => ({ field, header: field }))
      : []
)
</script>

<template>
  <div :class="['vp-${k}', 'vp-${k}__panel', { 'vp-${k}--disabled': disabled }, props.class]" :style="style">
    <div class="vp-${k}__toolbar">
      <strong class="vp-${k}__title" style="margin:0">{{ title ?? t('${titleKey}') }}</strong>
      <input
        v-model="keyword"
        class="vp-${k}__search"
        type="search"
        :placeholder="t('common.search')"
      />
      <slot name="actions" />
    </div>
    <div class="vp-${k}__scroll" style="overflow:auto;max-height:20rem">
      <table class="vp-${k}__table" style="width:100%;border-collapse:collapse">
        <thead>
          <tr>
            <th
              v-for="c in cols"
              :key="c.field"
              style="text-align:left;padding:var(--spacing-sm) var(--spacing-md);border-bottom:1px solid var(--ds-border);position:sticky;top:0;background:var(--surface-1)"
            >{{ c.header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in filtered" :key="i" @click="emit('change', row)">
            <td
              v-for="c in cols"
              :key="c.field"
              style="padding:var(--spacing-sm) var(--spacing-md);border-bottom:1px solid var(--ds-border)"
            >{{ row[c.field] }}</td>
          </tr>
          <tr v-if="!filtered.length">
            <td :colspan="Math.max(cols.length, 1)" class="vp-${k}__muted" style="padding:var(--spacing-lg)">
              {{ t('common.noData') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <slot />
  </div>
</template>

<style scoped>
.vp-${k}__search {
  flex: 1;
  min-width: 8rem;
  height: var(--height-md, 2.25rem);
  border: 1px solid var(--ds-border, var(--border-color));
  border-radius: var(--theme-input-radius, var(--border-radius-md));
  padding: 0 var(--spacing-md);
  background: var(--surface-0, var(--surface-1));
  color: var(--text-primary);
}
</style>
`
  } else if (cls === 'tree') {
    vueBody = `<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

export type TreeNode = { label: string; value?: unknown; children?: TreeNode[]; disabled?: boolean }

const props = withDefaults(defineProps<${name}Props & { options?: TreeNode[]; checkable?: boolean }>(), {
  options: () => [],
  checkable: true
})
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()
const open = ref<Record<string, boolean>>({})
const checked = ref<unknown[]>(Array.isArray(props.modelValue) ? (props.modelValue as unknown[]) : [])

const nodes = computed(() => (props.options?.length ? props.options : (props.data as TreeNode[]) || []))

function keyOf(n: TreeNode, path: string) {
  return String(n.value ?? n.label) + path
}
function toggleOpen(k: string) {
  open.value = { ...open.value, [k]: !open.value[k] }
}
function toggleCheck(n: TreeNode) {
  if (n.disabled || props.disabled) return
  const v = n.value ?? n.label
  const set = new Set(checked.value)
  if (set.has(v)) set.delete(v)
  else set.add(v)
  checked.value = [...set]
  emit('update:modelValue', checked.value)
  emit('change', checked.value)
}
</script>

<template>
  <div :class="['vp-${k}', 'vp-${k}__panel', { 'vp-${k}--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-${k}__title">{{ title ?? t('${titleKey}') }}</h3>
    <ul class="vp-${k}__list" style="list-style:none;margin:0;padding:0">
      <TreeNodeRow
        v-for="(n, i) in nodes"
        :key="i"
        :node="n"
        path=""
        :depth="0"
      />
    </ul>
    <p v-if="!nodes.length" class="vp-${k}__muted">{{ t('common.noData') }}</p>
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, h, inject, provide } from 'vue'

const CTX = Symbol('vp-${k}-tree')

const TreeNodeRow = defineComponent({
  name: 'Vp${name}Node',
  props: {
    node: { type: Object, required: true },
    path: { type: String, default: '' },
    depth: { type: Number, default: 0 }
  },
  setup(props) {
    const ctx = inject(CTX) as any
    provide(CTX, ctx)
    return () => {
      const n = props.node as any
      const k = String(n.value ?? n.label) + props.path
      const hasChildren = Array.isArray(n.children) && n.children.length
      const isOpen = ctx.open[k]
      return h('li', { style: { paddingLeft: \`calc(var(--spacing-md) * \${props.depth})\` } }, [
        h('div', { class: 'vp-${k}__toolbar', style: { gap: 'var(--spacing-sm)', padding: 'var(--spacing-xs) 0' } }, [
          hasChildren
            ? h('button', { type: 'button', onClick: () => ctx.toggleOpen(k), style: btnStyle() }, isOpen ? '−' : '+')
            : h('span', { style: { width: '1.25rem' } }),
          ctx.checkable
            ? h('input', {
                type: 'checkbox',
                checked: ctx.checked.includes(n.value ?? n.label),
                disabled: n.disabled,
                onChange: () => ctx.toggleCheck(n)
              })
            : null,
          h('span', n.label)
        ]),
        hasChildren && isOpen
          ? h(
              'ul',
              { style: { listStyle: 'none', margin: 0, padding: 0 } },
              n.children.map((c: any, i: number) =>
                h(TreeNodeRow, { node: c, path: k + i, depth: props.depth + 1, key: i })
              )
            )
          : null
      ])
    }
  }
})

function btnStyle() {
  return {
    width: '1.25rem',
    height: '1.25rem',
    border: '1px solid var(--ds-border)',
    background: 'var(--surface-2)',
    borderRadius: 'var(--border-radius-sm)',
    cursor: 'pointer',
    color: 'var(--text-primary)'
  }
}

export default {
  components: { TreeNodeRow },
  setup(props: any, { expose }: any) {
    const open = (props as any).$.setupState?.open
  }
}
</script>
`
  } else {
    // generic / form / feedback / nav / domain / lowcode / bizpanel / tool
    const interactive =
      cls === 'form' || cls === 'feedback' || cls === 'nav' || cls === 'domain' || cls === 'bizpanel' || cls === 'tool' || cls === 'lowcode' || cls === 'generic'
    vueBody = `<script setup lang="ts">
import { computed, ref } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

const props = withDefaults(defineProps<${name}Props>(), {
  modelValue: undefined,
  loading: false,
  disabled: false
})
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()
const local = ref(props.modelValue)

const titleText = computed(() => props.title ?? t('${titleKey}'))
const leadText = computed(() => props.description ?? t('${leadKey}'))

function onInput(e: Event) {
  const v = (e.target as HTMLInputElement).value
  local.value = v
  emit('update:modelValue', v)
  emit('change', v)
}

function onPrimary(e: MouseEvent) {
  if (props.disabled || props.loading) return
  emit('click', e)
}
</script>

<template>
  <div
    :class="['vp-${k}', 'vp-${k}__panel', { 'vp-${k}--disabled': disabled, 'vp-${k}--loading': loading }, props.class]"
    :style="style"
    data-component="${name}"
  >
    <div class="vp-${k}__body">
      <h3 class="vp-${k}__title">{{ titleText }}</h3>
      <p class="vp-${k}__muted">{{ leadText }}</p>
      ${
        interactive
          ? `<div class="vp-${k}__toolbar">
        <slot name="controls">
          <input
            class="vp-${k}__input"
            type="text"
            :disabled="disabled || loading"
            :value="local == null ? '' : String(local)"
            :placeholder="t('common.search')"
            @input="onInput"
          />
          <button type="button" class="vp-${k}__btn" :disabled="disabled || loading" @click="onPrimary">
            {{ loading ? t('common.loading') : t('button.confirm') }}
          </button>
        </slot>
      </div>`
          : ''
      }
      <div class="vp-${k}__content">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-${k}__input {
  flex: 1;
  min-width: 8rem;
  height: var(--height-md, 2.25rem);
  border: 1px solid var(--ds-border, var(--border-color));
  border-radius: var(--theme-input-radius, var(--border-radius-md));
  padding: 0 var(--spacing-md);
  background: var(--surface-0, var(--surface-1));
  color: var(--text-primary);
}
.vp-${k}__btn {
  appearance: none;
  border: 1px solid transparent;
  background: var(--primary-500);
  color: var(--surface-0, var(--surface-1));
  border-radius: var(--theme-btn-radius, var(--border-radius-md));
  height: var(--height-md, 2.25rem);
  padding: 0 var(--spacing-lg);
  cursor: pointer;
}
.vp-${k}__btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
`
  }

  // Tree template above is fragile with dual script - use simpler tree for reliability
  if (cls === 'tree') {
    vueBody = `<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useLocale } from '@amg-webui/hooks'
import type { ${name}Props, ${name}Emits } from './types'
import './style.scss'

type Node = { label: string; value?: unknown; children?: Node[]; disabled?: boolean }

const props = withDefaults(defineProps<${name}Props & { options?: Node[] }>(), {
  options: () => []
})
const emit = defineEmits<${name}Emits>()
const { t } = useLocale()
const openMap = ref<Record<string, boolean>>({})
const checked = ref<unknown[]>(Array.isArray(props.modelValue) ? [...(props.modelValue as unknown[])] : [])

watch(
  () => props.modelValue,
  (v) => {
    checked.value = Array.isArray(v) ? [...v] : []
  }
)

const roots = computed<Node[]>(() => {
  if (props.options?.length) return props.options
  if (Array.isArray(props.data)) return props.data as Node[]
  return []
})

function nid(n: Node, p: string) {
  return \`\${p}/\${String(n.value ?? n.label)}\`
}
function toggle(id: string) {
  openMap.value = { ...openMap.value, [id]: !openMap.value[id] }
}
function onCheck(n: Node, ev: Event) {
  if (n.disabled || props.disabled) return
  const val = n.value ?? n.label
  const box = ev.target as HTMLInputElement
  const next = new Set(checked.value)
  if (box.checked) next.add(val)
  else next.delete(val)
  checked.value = [...next]
  emit('update:modelValue', checked.value)
  emit('change', checked.value)
}
</script>

<template>
  <div :class="['vp-${k}', 'vp-${k}__panel', { 'vp-${k}--disabled': disabled }, props.class]" :style="style">
    <h3 class="vp-${k}__title">{{ title ?? t('${titleKey}') }}</h3>
    <ul v-if="roots.length" class="vp-${k}__list" style="list-style:none;margin:0;padding:0">
      <li v-for="n in roots" :key="nid(n, 'r')" style="padding:var(--spacing-xs) 0">
        <div class="vp-${k}__toolbar" style="gap:var(--spacing-sm)">
          <button
            v-if="n.children?.length"
            type="button"
            @click="toggle(nid(n, 'r'))"
          >{{ openMap[nid(n, 'r')] ? '−' : '+' }}</button>
          <input
            type="checkbox"
            :disabled="n.disabled || disabled"
            :checked="checked.includes(n.value ?? n.label)"
            @change="onCheck(n, $event)"
          />
          <span>{{ n.label }}</span>
        </div>
        <ul v-if="n.children?.length && openMap[nid(n, 'r')]" style="list-style:none;margin:0;padding-left:var(--spacing-lg)">
          <li v-for="c in n.children" :key="nid(c, nid(n, 'r'))" style="padding:var(--spacing-xs) 0">
            <div class="vp-${k}__toolbar" style="gap:var(--spacing-sm)">
              <input
                type="checkbox"
                :disabled="c.disabled || disabled"
                :checked="checked.includes(c.value ?? c.label)"
                @change="onCheck(c, $event)"
              />
              <span>{{ c.label }}</span>
            </div>
          </li>
        </ul>
      </li>
    </ul>
    <p v-else class="vp-${k}__muted">{{ t('common.noData') }}</p>
    <slot />
  </div>
</template>
`
  }

  return { types, indexTs, style, vueBody, titleKey, leadKey, k }
}

let created = 0
let skipped = 0
const localeEntries = []

for (const name of names) {
  const dir = resolve(root, 'packages/components/base', name)
  if (existsSync(dir)) {
    skipped++
    continue
  }
  mkdirSync(dir, { recursive: true })
  const cls = classify(name)
  const f = files(name, cls)
  writeFileSync(resolve(dir, 'types.ts'), f.types, 'utf8')
  writeFileSync(resolve(dir, 'index.ts'), f.indexTs, 'utf8')
  writeFileSync(resolve(dir, 'style.scss'), f.style, 'utf8')
  writeFileSync(resolve(dir, 'index.vue'), f.vueBody, 'utf8')
  localeEntries.push([f.titleKey, name], [f.leadKey, name])
  created++
}

writeFileSync(
  resolve(root, 'scripts/.scaffold-locale-keys.json'),
  JSON.stringify(localeEntries, null, 2),
  'utf8'
)

console.log(`[scaffold-missing] created=${created} skipped=${skipped} total=${names.length}`)
console.log('Next: npm run generate:entry && node scripts/inject-scaffold-i18n.mjs')
