import { LocaleKeys, LocaleService } from '@amg-webui/locale'
import type { CanvasNodeData } from '@amg-webui/utils'
import type { NavItem } from '@amg-webui/utils/nav'

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80">
      <rect width="120" height="80" fill="%23e8eaed"/>
      <text x="60" y="44" text-anchor="middle" font-size="12" fill="%236b7280">preview</text>
    </svg>`
  )

const PLACEHOLDER_VIDEO =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
      <rect width="320" height="180" fill="%23111827"/>
      <polygon points="140,70 140,110 180,90" fill="%23f9fafb"/>
    </svg>`
  )

function t(key: string, params?: Record<string, string | number>) {
  return LocaleService.t(key, params)
}

function sampleTree() {
  return [
    {
      label: 'A',
      value: 'a',
      children: [
        { label: 'A1', value: 'a1' },
        { label: 'A2', value: 'a2' }
      ]
    },
    { label: 'B', value: 'b', children: [{ label: 'B1', value: 'b1' }] }
  ]
}

function sampleRows() {
  return [
    { id: 1, name: 'demo-01', status: 'online', value: 12 },
    { id: 2, name: 'demo-02', status: 'offline', value: 28 },
    { id: 3, name: 'demo-03', status: 'online', value: 18 }
  ]
}

function sampleNavItems(): NavItem[] {
  return [
    { label: t('biz.name'), value: 'a' },
    { label: t('biz.status'), value: 'b' },
    { label: t('biz.email'), value: 'c' }
  ]
}

function sampleGroupNavItems(): NavItem[] {
  return [
    {
      label: t('biz.name'),
      children: [
        { label: 'A1', value: 'a1' },
        { label: 'A2', value: 'a2' }
      ]
    },
    {
      label: t('biz.status'),
      children: [{ label: 'B1', value: 'b1' }]
    }
  ]
}

function sampleColumns() {
  return [
    { field: 'id', header: 'ID' },
    { field: 'name', header: t('biz.name') },
    { field: 'status', header: t('biz.status') }
  ]
}

function sampleSelectOptions() {
  return [
    { label: t('biz.name'), value: 'name' },
    { label: t('biz.status'), value: 'status' },
    { label: t('biz.email'), value: 'email' }
  ]
}

function sampleRadioOptions() {
  return [
    { label: t('biz.name'), value: 'name' },
    { label: t('biz.status'), value: 'status' },
    { label: t('biz.email'), value: 'email' }
  ]
}

function sampleTransferData() {
  return [
    { key: 'a', label: t('biz.name') },
    { key: 'b', label: t('biz.status') },
    { key: 'c', label: t('biz.email') }
  ]
}

function sampleChartData() {
  return [40, 65, 30, 80, 55, 70]
}

function sampleCanvasNode(): CanvasNodeData {
  return {
    id: 'n1',
    type: 'default',
    x: 24,
    y: 24,
    w: 120,
    h: 48,
    label: 'Node',
    props: {}
  }
}

function sampleTimelineItems() {
  return [
    { title: t(LocaleKeys.exampleDoc.fallbackSampleTitle), time: '09:00' },
    { title: t('biz.status'), time: '10:30' },
    { title: t('biz.email'), time: '14:00' }
  ]
}

function sampleBreadcrumbItems() {
  return [
    { label: t('nav.base'), to: '/' },
    { label: t('biz.name'), to: '/list' },
    { label: t('biz.status') }
  ]
}

function sampleStepItems() {
  return [
    { title: t('biz.name') },
    { title: t('biz.status') },
    { title: t('biz.email') }
  ]
}

function sampleDescriptionsItems() {
  return [
    { label: t('biz.name'), value: 'demo-01' },
    { label: t('biz.status'), value: t('common.success') },
    { label: t('biz.email'), value: 'demo@example.com' }
  ]
}

export type SampleMountContext = {
  componentName: string
}

/**
 * Safe default props for bare-mount component doc previews.
 * Mirrors ComponentDocPage mountProps with expanded special-cases.
 */
export function getSampleMountProps(
  componentName: string,
  extra: Record<string, unknown> = {}
): Record<string, unknown> {
  const name = componentName
  const sampleTitle = t(LocaleKeys.exampleDoc.fallbackSampleTitle)
  const sampleBody = t(LocaleKeys.exampleDoc.fallbackSampleBody)
  const tree = sampleTree()
  const rows = sampleRows()
  const navItems = sampleNavItems()

  const props: Record<string, unknown> = {
    options: tree,
    data: tree,
    treeData: tree,
    slides: rows,
    items: navItems,
    columns: sampleColumns(),
    rows,
    value: rows,
    fields: sampleSelectOptions(),
    suggestions: ['alpha', 'beta', 'demo'],
    placeholder: t('common.search'),
    src: PLACEHOLDER_IMAGE,
    poster: PLACEHOLDER_IMAGE,
    url: PLACEHOLDER_IMAGE,
    message: sampleBody,
    text: sampleBody,
    title: sampleTitle,
    content: sampleBody,
    label: sampleTitle,
    name: 'demo-field',
    modelValue: name.includes('Tag') || name.includes('Checkbox') ? [] : '',
    ...extra
  }

  // Overlays / feedback — start open in fallback preview; host must bind v-model
  // (static visible:true alone makes cancel/close appear broken)
  if (/Dialog|Drawer|Confirm|Toast|Notification|Loading|Mask|Modal/i.test(name)) {
    props.visible = true
    props.open = true
  }
  if (/Toast|Notification|Message/i.test(name)) {
    props.duration = 0
    props.autoHide = false
  }
  if (name === 'Loading') {
    props.fullscreen = false
  }

  // Media
  if (/Thumbnail|Image|ImageUpload|ImageCrop|ImageGroup|FilePreview|PdfPreview/i.test(name)) {
    props.alt = sampleTitle
    props.src = PLACEHOLDER_IMAGE
  }
  if (/Video|Vcr|SplitVideo/i.test(name)) {
    props.src = PLACEHOLDER_VIDEO
    props.poster = PLACEHOLDER_VIDEO
  }

  // Inputs
  if (/Select|Cascader|AutoComplete|Search|Input|Password|Textarea|Picker/i.test(name)) {
    if (!('modelValue' in extra)) {
      props.modelValue = undefined
    }
  }
  if (name === 'Slider') {
    props.modelValue = 40
  }
  if (name === 'Rate') {
    props.modelValue = 3
  }
  if (name === 'Countdown') {
    props.value = Date.now() + 86_400_000
  }
  if (name === 'FilterBar' || name === 'AdvancedSearch') {
    props.modelValue = []
  }
  if (/Upload/i.test(name)) {
    props.modelValue = []
  }

  // Nav family
  if (/Nav$/i.test(name) || /Nav[A-Z]/.test(name)) {
    props.items = /GroupNav|CategoryNav|ScrollNav|StepNav|VerticalStepNav|RouterNav/i.test(name)
      ? sampleGroupNavItems()
      : navItems
    props.modelValue = navItems[0]?.value ?? 'a'
  }

  // Tables
  if (/Table|DataTable|ProTable|EditTable|MergeTable|DrillTable|PivotTable|StickyTable|VirtualTable|TreeTable/i.test(name)) {
    props.columns = sampleColumns()
    props.rows = rows
    props.data = rows
  }

  // Tree family
  if (/Tree/i.test(name)) {
    props.options = tree
    props.data = tree
    props.modelValue = []
  }

  // Charts
  if (/Chart|Gauge|HeatMap|WordCloud|Ranking|Radar/i.test(name)) {
    props.data = sampleChartData()
  }

  // Canvas
  if (/CanvasNode|DragSortNode|CanvasLayer|CanvasPreview|DragCanvas|CanvasIo/i.test(name)) {
    props.node = sampleCanvasNode()
    props.nodes = [sampleCanvasNode()]
    props.width = 480
    props.height = 320
  }

  // Transfer
  if (/Transfer/i.test(name)) {
    props.data = sampleTransferData()
    props.modelValue = []
    props.source = sampleTransferData()
    props.target = []
  }

  // Radio / checkbox groups
  if (/RadioGroup|CheckboxGroup/i.test(name)) {
    props.options = sampleRadioOptions()
    props.modelValue = name.includes('Checkbox') ? [] : 'name'
  }

  if (name === 'Segmented') {
    props.options = sampleRadioOptions().map((o) => ({
      label: o.label,
      value: o.value
    }))
    props.modelValue = 'name'
  }
  if (name === 'Mention') {
    props.options = [
      { label: 'Alice', value: 'alice' },
      { label: 'Bob', value: 'bob' }
    ]
    props.modelValue = ''
  }
  if (name === 'Tour') {
    props.open = false
    props.steps = [{ target: 'body', title: sampleTitle, description: sampleBody }]
  }
  if (name === 'ImageViewer') {
    props.visible = false
    props.urlList = [PLACEHOLDER_IMAGE]
  }
  if (name === 'TimeSelect') {
    props.modelValue = '09:00'
  }
  if (name === 'InputOTP') {
    props.modelValue = ''
    props.length = 6
  }
  if (name === 'InfiniteScroll') {
    props.loading = false
    props.finished = false
  }

  // Timeline / steps / breadcrumb
  if (/Timeline/i.test(name)) {
    props.items = sampleTimelineItems()
  }
  if (/Steps|StepNav|VerticalStepNav/i.test(name)) {
    props.items = sampleStepItems()
    props.active = 0
    props.modelValue = 0
  }
  if (/Breadcrumb/i.test(name)) {
    props.items = sampleBreadcrumbItems()
  }
  if (/Descriptions/i.test(name)) {
    props.items = sampleDescriptionsItems()
  }

  // Forms / panels with schema
  if (/DynamicForm|TreeForm|StepForm|SearchFilterPanel|PermissionPanel|SettingPanel|PropPanel|DetailPanel|LoginPanel|BatchPanel/i.test(name)) {
    props.modelValue = {}
    props.schema = []
    props.fields = sampleSelectOptions()
  }

  // 404 pages — no required props; ensure title for a11y
  if (/404$/i.test(name)) {
    props.title = sampleTitle
  }

  // Carousel
  if (name === 'Carousel') {
    props.items = rows.map((row, index) => ({
      key: row.id,
      label: `${sampleTitle} ${index + 1}`
    }))
  }

  // Card lists
  if (/CardList|CardGrid|Waterfall/i.test(name)) {
    props.items = rows
    props.data = rows
  }

  return props
}
