/**
 * Generate VitePress component docs from generated API extracts + types.ts.
 *
 * Usage:
 *   node scripts/generate-vitepress-api.mjs
 *   node scripts/generate-vitepress-api.mjs --force
 *   node scripts/generate-vitepress-api.mjs --stable-only
 *   node scripts/generate-vitepress-api.mjs --update-evidence
 *
 * - Reads Stable list from component-hardening/program-status.json (frozen contracts SSOT)
 * - Writes docs/components/<kebab>.md if missing (or with --force)
 * - Patches component sidebar block in docs/.vitepress/config.ts (preserves other sections)
 * - Optionally updates component-hardening/evidence/<Name>/docs.json
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'
import { toKebab } from '../build/shared.mjs'
import {
  componentDirRel,
  componentToPackage,
  packageAlias
} from './component-package-map.mjs'
import {
  P0_COMPONENTS,
  RELATED,
  DISPLAY_NAMES,
  parseDisplayTitle,
  consumerImportFrom
} from './component-docs-constants.mjs'

export { DISPLAY_NAMES, RELATED }

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsComponentsDir = resolve(root, 'docs/components')
const vitepressConfigPath = resolve(root, 'docs/.vitepress/config.ts')
const programStatusPath = join(root, 'component-hardening/program-status.json')
const apiDir = join(root, 'generated/component-api')
const metadataDir = join(root, 'component-metadata')
const evidenceRoot = join(root, 'component-hardening/evidence')

const force = process.argv.includes('--force')
const stableOnly = process.argv.includes('--stable-only')
const onlyArg = process.argv.find((a) => a.startsWith('--only='))
const ONLY_COMPONENTS = onlyArg
  ? onlyArg
      .slice('--only='.length)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : null
const updateEvidence =
  process.argv.includes('--update-evidence') ||
  (!process.argv.includes('--no-update-evidence') && stableOnly)

/** Core docs pages — priority for prop descriptions + --only refresh */
export const CORE_DOCS = [
  'Button',
  'InputText',
  'Select',
  'Checkbox',
  'Radio',
  'Switch',
  'DatePicker',
  'Form',
  'DataTable',
  'Tree',
  'Dialog',
  'Drawer',
  'Tabs',
  'Menu',
  'Pagination',
  'Upload'
]

/** Shared prop descriptions (中文 / English) */
const COMMON_PROP_DESCRIPTIONS = {
  modelValue: '绑定值 / Bound value (v-model)',
  value: '表格行数据或绑定值 / Row data or bound value',
  defaultValue: '非受控初始值 / Uncontrolled initial value',
  disabled: '是否禁用 / Whether disabled',
  readonly: '是否只读 / Read-only',
  required: '是否必填 / Required field',
  size: '尺寸：`sm` · `md` · `lg` / Size variant',
  label: '显示文案 / Display label',
  placeholder: '占位提示 / Placeholder text',
  name: '表单字段名 / Form field name',
  id: '元素 id（无障碍）/ Element id for a11y',
  fluid: '宽度 100% / Full width',
  loading: '加载中状态 / Loading state',
  visible: '是否可见 / Visibility (v-model:visible)',
  tabindex: 'Tab 焦点顺序 / Tab order',
  ariaLabel: '无障碍标签 / ARIA label',
  ariaLabelledby: '关联标签 id / aria-labelledby',
  ariaDescribedby: '关联描述 id / aria-describedby',
  autofocus: '挂载后自动聚焦 / Autofocus on mount',
  clearable: '可一键清空 / Show clear button',
  options: '选项列表 / Option list',
  optionLabel: '选项显示字段 / Option label field',
  optionValue: '选项值字段 / Option value field',
  multiple: '多选模式 / Multiple selection',
  checkable: '节点可勾选 / Nodes checkable',
  expandedKeys: '展开的节点 key / Expanded node keys',
  selectedKeys: '选中的节点 key / Selected node keys',
  checkedKeys: '勾选的节点 key / Checked node keys',
  data: '树形数据 / Tree data',
  fieldNames: '字段映射 / Field name mapping',
  columns: '列定义 / Column definitions',
  rowKey: '行唯一键字段 / Unique row key field',
  selection: '选中行 keys / Selected row keys',
  selectionMode: '选择模式：`single` · `multiple` / Selection mode',
  paginator: '是否显示分页 / Show paginator',
  rows: '每页行数 / Rows per page',
  first: '分页起始索引 / Pagination offset',
  totalRecords: '总记录数（远程分页）/ Total records',
  sortField: '排序字段 / Sort field',
  sortOrder: '排序方向 / Sort order',
  striped: '斑马纹 / Striped rows',
  fixedHeader: '固定表头 / Fixed header',
  filterGlobal: '全局筛选 / Global filter',
  lazy: '远程数据模式 / Lazy remote data',
  filterDebounce: '筛选防抖毫秒 / Filter debounce (ms)',
  virtual: '虚拟滚动 / Virtual scrolling',
  virtualHeight: '虚拟视口高度（spacing 倍数）/ Virtual viewport height',
  rowHeight: '行高（px）/ Row height',
  virtualColumns: '横向虚拟列 / Virtual columns',
  virtualColumnThreshold: '自动开启虚拟列的列数阈值 / Column threshold',
  sortWorkerThreshold: 'Worker 排序行数阈值 / Worker sort threshold',
  trackId: 'Telemetry 追踪 id / Telemetry track id',
  telemetry: '是否上报 Telemetry / Enable telemetry',
  severity: '语义色：`primary` · `secondary` · `danger` 等 / Semantic color',
  variant: '外观变体：`solid` · `outlined` · `text` / Visual variant',
  icon: '图标名 / Icon name',
  iconPos: '图标位置 / Icon position',
  loadingText: '加载中文案 / Loading text',
  block: '块级按钮（整行）/ Block-level button',
  rounded: '圆角按钮 / Rounded shape',
  title: '标题 / Title',
  sizeDialog: '对话框尺寸 / Dialog size',
  closable: '显示关闭按钮 / Show close button',
  modal: '模态遮罩 / Modal overlay',
  maskClosable: '点击遮罩关闭 / Close on mask click',
  destroyOnClose: '关闭后销毁内容 / Destroy on close',
  placement: '抽屉方向 / Drawer placement',
  activeKey: '当前激活项 / Active tab key',
  items: '菜单项 / Menu items',
  modelValueMenu: '当前选中菜单 key / Selected menu key',
  accept: '接受的文件类型 / Accepted file types',
  maxSize: '单文件大小上限 / Max file size',
  maxCount: '最大文件数 / Max file count',
  showFileList: '显示文件列表 / Show file list',
  autoUpload: '选择后自动上传 / Auto upload',
  type: '输入类型 / Input type',
  maxlength: '最大长度 / Max length',
  minlength: '最小长度 / Min length',
  showCount: '显示字数统计 / Show character count',
  checked: '是否选中 / Checked state',
  indeterminate: '半选状态 / Indeterminate',
  trueValue: '选中时的值 / Value when checked',
  falseValue: '未选中时的值 / Value when unchecked',
  format: '日期格式 / Date format',
  showTime: '显示时间选择 / Show time picker',
  model: '表单数据对象 / Form model object',
  rules: '校验规则 / Validation rules',
  labelPosition: '标签位置 / Label position',
  labelWidth: '标签宽度 / Label width',
  inline: '行内表单 / Inline layout',
  hideRequiredMark: '隐藏必填星号 / Hide required mark',
  pageSize: '每页条数 / Page size',
  currentPage: '当前页码 / Current page',
  total: '总条数 / Total count',
  showSizeChanger: '可切换每页条数 / Page size changer',
  simple: '简洁分页 / Simple pagination'
}

/** Per-component prop overrides */
const COMPONENT_PROP_DESCRIPTIONS = {
  Button: {
    spin: '旋转动画 / Spin animation',
    pulse: '脉冲动画 / Pulse animation',
    link: '链接样式 / Link appearance',
    raised: '浮起阴影 / Raised shadow',
    shape: '形状：`rectangle` · `pill` · `circle` / Button shape'
  },
  DataTable: {
    value: '行数据源 / Row data source',
    columns: '列配置数组 / Column config array'
  },
  Form: {
    model: '表单数据对象（响应式）/ Reactive form model',
    rules: '字段校验规则映射 / Field validation rules'
  },
  Tree: {
    data: '树节点数组 / Tree node array',
    checkStrictly: '父子勾选不关联 / Decoupled check state'
  },
  Dialog: {
    visible: '是否显示（v-model:visible）/ Visibility'
  },
  Drawer: {
    visible: '是否显示（v-model:visible）/ Visibility'
  },
  Upload: {
    action: '上传地址 / Upload URL',
    headers: '请求头 / Request headers',
    data: '附加表单字段 / Extra form data'
  }
}

const COMMON_EVENT_DESCRIPTIONS = {
  'update:modelValue': 'v-model 更新 / v-model update',
  'update:value': 'value 更新 / value update',
  'update:visible': 'visible 更新 / visible update',
  'update:selection': '选中行更新 / selection update',
  'update:sortField': '排序字段更新 / sortField update',
  'update:sortOrder': '排序方向更新 / sortOrder update',
  'update:first': '分页偏移更新 / first update',
  'update:rows': '每页行数更新 / rows update',
  click: '点击 / Click',
  change: '值变更 / Change',
  input: '输入 / Input',
  blur: '失焦 / Blur',
  focus: '聚焦 / Focus',
  select: '选中 / Select',
  sort: '排序 / Sort',
  'row-click': '行点击 / Row click',
  'row-select': '行选择 / Row select',
  page: '翻页 / Page change',
  filter: '筛选 / Filter',
  close: '关闭 / Close',
  open: '打开 / Open',
  submit: '提交 / Submit',
  upload: '上传 / Upload',
  remove: '移除文件 / Remove file'
}

function inferPropDescription(name, type = '') {
  const common = COMMON_PROP_DESCRIPTIONS[name]
  if (common && common !== '—') return common
  const t = String(type)
  if (name === 'modelValue') return '绑定值（v-model）'
  if (name.startsWith('on') && name.length > 2) return `${name} 回调`
  if (t.includes('boolean')) return `是否启用 ${name}`
  if (t.includes('number')) return `${name} 数值`
  if (t.includes('string')) return `${name} 字符串`
  if (t.includes('[]') || t.includes('Array')) return `${name} 列表数据`
  if (t.includes('Function') || t.includes('=>')) return `${name} 回调函数`
  return `${name} 配置项`
}

function enrichPropDescriptions(componentName, props) {
  const overrides = COMPONENT_PROP_DESCRIPTIONS[componentName] || {}
  return props.map((p) => {
    if (p.description && p.description !== '—' && p.description.trim()) return p
    const desc =
      overrides[p.name] ||
      COMMON_PROP_DESCRIPTIONS[p.name] ||
      inferPropDescription(p.name, p.type)
    return { ...p, description: desc }
  })
}

/** Minimal Chinese event copy for P0 when extract description is empty */
const P0_EVENT_CN = {
  click: '点击时触发',
  dblclick: '双击时触发',
  focus: '获得焦点时触发',
  blur: '失去焦点时触发',
  change: '值变更时触发',
  input: '输入时触发',
  select: '选中时触发',
  sort: '排序时触发',
  close: '关闭时触发',
  open: '打开时触发',
  submit: '提交时触发',
  upload: '上传时触发',
  remove: '移除时触发',
  confirm: '确认时触发',
  cancelConfirm: '取消确认时触发',
  'row-click': '行点击时触发',
  'row-select': '行选择时触发',
  page: '翻页时触发',
  filter: '筛选时触发'
}

function inferP0EventDescription(name) {
  if (P0_EVENT_CN[name]) return P0_EVENT_CN[name]
  if (name.startsWith('update:')) {
    const field = name.slice(7)
    return `\`${field}\` 更新时触发（v-model）`
  }
  return `${name} 时触发`
}

function enrichEventDescriptions(events, componentName) {
  void componentName
  return events.map((e) => {
    const name = typeof e === 'string' ? e : e.name
    const existing = typeof e === 'string' ? '' : e.description
    if (existing && existing.trim() && existing !== '—') {
      return typeof e === 'string' ? { name, payload: 'void', description: existing } : e
    }
    const common = COMMON_EVENT_DESCRIPTIONS[name]
    let desc = common && common !== '—' ? common : ''
    if (!desc) desc = inferP0EventDescription(name)
    const payload = typeof e === 'string' ? 'void' : e.payload || 'void'
    return typeof e === 'string' ? { name, payload, description: desc } : { ...e, description: desc }
  })
}

/** v0.1 core API pages — priority for Release Step 4 */
export const V01_PRIORITY = [
  'Button',
  'Select',
  'DataTable',
  'Tree',
  'Form',
  'Dialog',
  'InputText',
  'Checkbox',
  'Switch',
  'Pagination',
  'Layout',
  'Menu',
  'Tabs',
  'Alert',
  'MessageBox',
  'ConfigProvider',
  'Segmented',
  'Affix',
  'Image',
  'Tour'
]

/** Wired VitePress interactive demos — SSOT: docs/demos/registry.ts */
const DOCS_DEMOS = {
  Button: 'button-basic',
  InputText: 'input-text-basic',
  Select: 'select-basic',
  Checkbox: 'checkbox-basic',
  Radio: 'radio-basic',
  Switch: 'switch-basic',
  DatePicker: 'date-picker-basic',
  Form: 'form-basic',
  DataTable: 'data-table-basic',
  Tree: 'tree-basic',
  Dialog: 'dialog-basic',
  Drawer: 'drawer-basic',
  Tabs: 'tabs-basic',
  Menu: 'menu-basic',
  Pagination: 'pagination-basic',
  Upload: 'upload-basic'
}

/** Existing thin stubs from prior docs pass */
const EXISTING_STUBS = [
  'ButtonGroup',
  'Checkbox',
  'Divider',
  'Ellipsis',
  'Empty',
  'Highlight',
  'Icon',
  'Radio',
  'Space',
  'Spin',
  'Switch',
  'Tabs'
]

const EXTRA_SECTIONS = {
  Form: `
## FormItem 集成

\`FormItem\` provides field context; form controls auto-integrate via \`useFormItem\` (\`id\` / \`name\` / \`disabled\` / \`aria-*\` / blur-or-change validate):

- Text-like: \`InputText\` / \`Textarea\` / \`InputNumber\` / \`Password\` / \`Mention\` / \`InputOTP\` / \`InputCaptcha\` — native attrs via \`useNativeInputAttrs\`
- Boolean: \`Checkbox\` / \`Radio\` / \`Switch\`
- Composite: \`Select\` / \`Cascader\` / \`TreeSelect\` / \`DatePicker\` / \`DateTimePicker\` / \`TimePicker\` / \`TimeSelect\` / \`ColorPicker\` / \`Slider\` / \`Rate\` / \`Transfer\`

Undeclared native attrs (\`pattern\`, \`inputmode\`, \`minlength\`, \`aria-labelledby\`, …) are forwarded onto the real control via \`useNativeInputAttrs\` — not the wrapper host.
`,
  DataTable: `
## 虚拟滚动（诚实口径）

- **默认开启**固定行高窗口化（\`virtual: true\`）。
- 视口高度由 \`virtualHeight\`（\`--spacing-xs\` 倍数）同时驱动 **CSS** 与 **虚拟数学 fallback**；挂载后以 \`ResizeObserver\` 实测容器高度为准。
- 行高优先：\`rowHeight\` prop → \`--theme-table-row-height\` → 首行 \`ResizeObserver\` 实测。
- 列：\`virtualColumns\`（默认列数 ≥ \`virtualColumnThreshold\` 自动开）提供横向窗口；\`Column.fixed\` 支持左右冻结。
- 本地排序：行数 ≥ \`sortWorkerThreshold\`（默认 5000）走 Worker，失败回退主线程。
- **尚未实现**：逐行动态行高、分组虚拟化、展开行虚拟化、分片 100k 内核。
`
}

const USAGE_TEMPLATES = {
  MessageBox: () => `\`\`\`ts
import { MessageBox } from '${importAliasForComponent('MessageBox')}'

const result = await MessageBox.confirm({
  title: 'Confirm',
  message: 'Proceed with this action?'
})
if (result === 'confirm') {
  /* … */
}
\`\`\``,
  Form: () => `\`\`\`vue
<script setup>
import { ref } from 'vue'
import { Form, FormItem, InputText } from '${importAliasForComponent('Form')}'

const model = ref({ name: '' })
</script>

<template>
  <Form :model="model">
    <FormItem label="Name" prop="name">
      <InputText v-model="model.name" />
    </FormItem>
  </Form>
</template>
\`\`\``,
  Tabs: () => `\`\`\`vue
<script setup>
import { ref } from 'vue'
import { Tabs, TabPane } from '${importAliasForComponent('Tabs')}'

const active = ref('a')
</script>

<template>
  <Tabs v-model="active" aria-label="Demo tabs">
    <TabPane name="a" label="Tab A">Content A</TabPane>
    <TabPane name="b" label="Tab B">Content B</TabPane>
  </Tabs>
</template>
\`\`\``,
  Layout: () => `\`\`\`vue
<script setup>
import { Layout, Header, Sider, Main, Footer } from '${importAliasForComponent('Layout')}'
</script>

<template>
  <Layout>
    <Header>Header</Header>
    <Layout>
      <Sider>Sider</Sider>
      <Main>Main</Main>
    </Layout>
    <Footer>Footer</Footer>
  </Layout>
</template>
\`\`\``,
  DataTable: () => `\`\`\`vue
<script setup>
import { ref } from 'vue'
import { DataTable } from '${importAliasForComponent('DataTable')}'

const rows = ref([
  { id: 1, name: 'Alpha' },
  { id: 2, name: 'Beta' }
])
const columns = [
  { field: 'id', header: 'ID' },
  { field: 'name', header: 'Name' }
]
</script>

<template>
  <DataTable :value="rows" :columns="columns" />
</template>
\`\`\``
}

/** Consumer-facing import path for docs (amg-webui/<package>) */
function importPathForComponent(name) {
  const pkg = componentToPackage.get(name)
  return consumerImportFrom(pkg || 'core')
}

/** Internal @amg-webui alias for legacy templates */
function importAliasForComponent(name) {
  const pkg = componentToPackage.get(name)
  if (!pkg) return '@amg-webui/core'
  return packageAlias(pkg)
}

function formatEvidenceBlock(field) {
  if (!field) return ''
  if (typeof field === 'string') return field
  const lines = []
  if (field.status) lines.push(`- 状态：\`${field.status}\``)
  if (field.keys?.length) lines.push(`- 按键：${field.keys.map((k) => `\`${k}\``).join(' · ')}`)
  if (field.detail) lines.push(`- ${field.detail}`)
  return lines.join('\n')
}

function metadataHeading(meta, name) {
  if (!meta) return `# ${toTitle(name)}`
  const { title, titleZh } = parseDisplayTitle(name, meta.title)
  return titleZh ? `# ${title} ${titleZh}` : `# ${title}`
}

function metadataImportFrom(meta, name) {
  if (meta?.importPaths?.length) return meta.importPaths[0]
  if (meta?.importFrom) return meta.importFrom
  return importPathForComponent(name)
}

function loadComponentMetadata(name) {
  const p = join(metadataDir, `${name}.json`)
  if (!existsSync(p)) return null
  try {
    return JSON.parse(readFileSync(p, 'utf8'))
  } catch {
    return null
  }
}

function toTitle(name) {
  if (DISPLAY_NAMES[name]) return DISPLAY_NAMES[name]
  return name
}

function loadStableComponents() {
  if (existsSync(programStatusPath)) {
    const ps = JSON.parse(readFileSync(programStatusPath, 'utf8'))
    const fromHardening = ps.hardening?.stableComponents
    if (Array.isArray(fromHardening)) return [...fromHardening].sort()
    if (Array.isArray(ps.stableComponents) && ps.stableComponents.length) {
      return [...ps.stableComponents].sort()
    }
  }
  const contractsDir = join(root, 'component-hardening/contracts')
  const stable = []
  for (const file of readdirSync(contractsDir)) {
    if (!file.endsWith('.json')) continue
    const contract = JSON.parse(readFileSync(join(contractsDir, file), 'utf8'))
    if (contract.maturity === 'stable' && contract.apiFreeze?.frozen) {
      stable.push(contract.name || file.replace(/\.json$/, ''))
    }
  }
  return stable.sort()
}

const STABLE_COMPONENTS = loadStableComponents()

function loadAllPublicComponentNames() {
  const contractsDir = join(root, 'component-hardening/contracts')
  if (!existsSync(contractsDir)) return []
  return readdirSync(contractsDir)
    .filter((f) => f.endsWith('.json') && !['schema.json', 'family-api-profiles.json'].includes(f))
    .map((f) => {
      try {
        const c = JSON.parse(readFileSync(join(contractsDir, f), 'utf8'))
        return c.name || f.replace(/\.json$/, '')
      } catch {
        return f.replace(/\.json$/, '')
      }
    })
    .sort()
}

const ALL_COMPONENTS = (() => {
  if (stableOnly) return STABLE_COMPONENTS
  const fromPriority = [...new Set([...V01_PRIORITY, ...EXISTING_STUBS, ...STABLE_COMPONENTS])]
  // --force / drift gate: regenerate maturity for every public contract page
  if (force) {
    return [...new Set([...fromPriority, ...loadAllPublicComponentNames()])].sort()
  }
  return fromPriority.sort()
})()

function readTypes(name) {
  const p = join(root, componentDirRel(name), 'types.ts')
  if (!existsSync(p)) return ''
  return readFileSync(p, 'utf8')
}

function loadApiExtract(name) {
  const p = join(apiDir, `${name}.json`)
  if (!existsSync(p)) return null
  try {
    const data = JSON.parse(readFileSync(p, 'utf8'))
    if (data.note && /bulk stub/i.test(data.note)) return null
    return data
  } catch {
    return null
  }
}

function extractInterfaceBody(content, ifaceName) {
  const re = new RegExp(`export interface ${ifaceName}[^{]*\\{`, 'm')
  const m = content.match(re)
  if (!m) return null
  const start = m.index + m[0].length
  let depth = 1
  let i = start
  while (i < content.length && depth > 0) {
    if (content[i] === '{') depth++
    else if (content[i] === '}') depth--
    i++
  }
  return content.slice(start, i - 1)
}

function parsePropsFromTypes(content, name) {
  const candidates = [`${name}Props`, `${name}HostProps`, `${name}Options`]
  for (const iface of candidates) {
    const body = extractInterfaceBody(content, iface)
    if (!body) continue
    const props = []
    for (const line of body.split('\n')) {
      const field = line.match(/^\s*(\w+)(\?)?:\s*([^;]+)/)
      if (!field) continue
      const [, key, optional, typeRaw] = field
      if (key === 'extends') continue
      props.push({
        name: key,
        type: typeRaw.trim(),
        optional: Boolean(optional),
        description: '—'
      })
    }
    if (props.length) return props
  }
  return []
}

function parseEmitsFromTypes(content, name) {
  const candidates = [`${name}Emits`, `${name}HostEmits`]
  for (const iface of candidates) {
    const body = extractInterfaceBody(content, iface)
    if (!body) continue
    const events = []
    for (const line of body.split('\n')) {
      const m = line.match(/\(e:\s*'([^']+)'/)
      if (m) events.push({ name: m[1], payload: 'void', description: '—' })
    }
    if (events.length) return events
  }
  return []
}

function resolveApiSurface(name) {
  const extract = loadApiExtract(name)
  let surface
  if (extract) {
    surface = {
      props: extract.props || [],
      events: extract.events || [],
      slots: extract.slots || [],
      expose: extract.expose || [],
      models: extract.models || [],
      publicTypes: extract.publicTypes || [],
      source: 'generated/component-api'
    }
  } else {
    const typesContent = readTypes(name)
    surface = {
      props: parsePropsFromTypes(typesContent, name),
      events: parseEmitsFromTypes(typesContent, name),
      slots: [],
      expose: [],
      models: [],
      publicTypes: [],
      source: 'types.ts'
    }
  }
  surface.props = enrichPropDescriptions(name, surface.props)
  surface.events = enrichEventDescriptions(surface.events, name)
  return surface
}

function resolveDemoPath(name) {
  const base = join(root, 'example/demos', name)
  if (existsSync(join(base, 'index.vue'))) return `example/demos/${name}/index.vue`
  if (existsSync(join(base, 'parts/Basic.vue'))) return `example/demos/${name}/parts/Basic.vue`
  if (existsSync(base)) return `example/demos/${name}`
  return null
}

function defaultUsage(name) {
  const importFrom = importPathForComponent(name)
  const template = USAGE_TEMPLATES[name]
  if (template) {
    return template().replace(/@amg-webui\/[\w-]+/g, importFrom)
  }
  return `\`\`\`vue
<script setup>
import { ${name} } from '${importFrom}'
</script>

<template>
  <${name} />
</template>
\`\`\``
}

function escPipe(s) {
  return String(s).replace(/\|/g, '\\|')
}

function formatPropDefault(p) {
  if (Object.prototype.hasOwnProperty.call(p, 'default') && p.default !== undefined && p.default !== null) {
    if (typeof p.default === 'boolean' || typeof p.default === 'number') return String(p.default)
    if (typeof p.default === 'string') return `\`${p.default}\``
    return `\`${JSON.stringify(p.default)}\``
  }
  if (p.optional === false) return '**必填**'
  // Prefer explicit undefined over em-dash placeholders (docs quality gate)
  return '`undefined`'
}

function propsTable(props) {
  if (!props.length) {
    return '| Prop | 类型 | 默认 | 说明 |\n| --- | --- | --- | --- |\n| （无公开 Props） | | | |'
  }
  const rows = props.map((p) => {
    const def = formatPropDefault(p)
    const type = escPipe(p.type)
    const desc = escPipe(p.description || inferPropDescription(p.name, p.type))
    return `| \`${p.name}\` | \`${type}\` | ${def} | ${desc} |`
  })
  return ['| Prop | 类型 | 默认 | 说明 |', '| --- | --- | --- | --- |', ...rows].join('\n')
}

function eventsTable(events) {
  if (!events.length) return ''
  const rows = events.map((e) => {
    const name = typeof e === 'string' ? e : e.name
    const payload = typeof e === 'string' ? 'void' : escPipe(e.payload || 'void')
    const desc =
      typeof e === 'string'
        ? inferP0EventDescription(name)
        : escPipe(e.description || inferP0EventDescription(name))
    return `| \`${name}\` | \`${payload}\` | ${desc} |`
  })
  return ['| 事件 | Payload | 说明 |', '| --- | --- | --- |', ...rows].join('\n')
}

function slotsTable(slots) {
  if (!slots.length) return ''
  const rows = slots.map((s) => {
    const desc =
      s.description && s.description !== '—'
        ? s.description
        : s.name === 'default'
          ? '默认插槽'
          : `${s.name} 插槽`
    return `| \`${s.name}\` | \`${escPipe(s.props || '')}\` | ${escPipe(desc)} |`
  })
  return ['| Slot | Props | 说明 |', '| --- | --- | --- |', ...rows].join('\n')
}

function exposeTable(expose) {
  if (!expose.length) return ''
  const rows = expose.map((x) => {
    const desc =
      x.description && x.description !== '—'
        ? x.description
        : `${x.name} 实例方法/属性`
    return `| \`${x.name}\` | \`${escPipe(x.type)}\` | ${escPipe(desc)} |`
  })
  return ['| 方法 / 属性 | 类型 | 说明 |', '| --- | --- | --- |', ...rows].join('\n')
}

function modelsTable(models) {
  if (!models.length) return ''
  const rows = models.map((m) => `| \`${m.name}\` | ${escPipe(m.description || 'v-model')} |`)
  return ['| Model | 说明 |', '| --- | --- |', ...rows].join('\n')
}

function publicTypesSection(types) {
  if (!types.length) return ''
  return `\n## Public types\n\n${types.map((t) => `- \`${t}\``).join('\n')}\n`
}

function relatedSection(name, meta) {
  const related = meta?.related?.length ? meta.related : RELATED[name]
  if (!related?.length) return '— 见同包组件与 `Form` / `Select` 等表单家族。'
  return related.map((r) => `- [${r}](./${toKebab(r)})`).join('\n')
}

function loadContractMaturity(name) {
  const p = join(root, 'component-hardening/contracts', `${name}.json`)
  if (!existsSync(p)) return { maturity: 'beta', frozen: false }
  try {
    const c = JSON.parse(readFileSync(p, 'utf8'))
    return {
      maturity: String(c.maturity || 'beta').toLowerCase(),
      frozen: Boolean(c.apiFreeze?.frozen)
    }
  } catch {
    return { maturity: 'beta', frozen: false }
  }
}

function isStable(name) {
  const { maturity, frozen } = loadContractMaturity(name)
  return maturity === 'stable' && frozen
}

function maturityLabel(name) {
  const { maturity, frozen } = loadContractMaturity(name)
  if (maturity === 'stable' && frozen) return 'Stable'
  if (maturity === 'rc') return 'RC'
  if (maturity === 'beta') return 'Beta'
  if (maturity === 'draft') return 'Draft'
  return maturity
}

function generateMarkdown(name) {
  const meta = loadComponentMetadata(name)
  const api = resolveApiSurface(name)
  const demoPath = resolveDemoPath(name)
  const demoDir = demoPath ? demoPath.replace(/\/index\.vue$|\/parts\/Basic\.vue$/, '') : `example/demos/${name}/`
  const stable = isStable(name)
  const maturity = maturityLabel(name)
  const contract = loadContractMaturity(name)
  const docsDemoId = DOCS_DEMOS[name]
  const importFrom = metadataImportFrom(meta, name)

  const heading = metadataHeading(meta, name)
  const summary =
    meta?.summary ||
    (name === 'MessageBox'
      ? '命令式确认 / 提示 / 输入框。'
      : `${name} 为 **${maturity}** 公共组件。`)

  const sections = [heading, '', summary, '']

  if (meta?.description || meta?.summary) {
    let intro = meta.description || meta.summary
    if (/generate-vitepress|本文档由|Contract maturity/.test(intro)) {
      intro = meta.summary || summary
    }
    sections.push('## 组件介绍', '', intro, '')
  }

  if (meta?.features?.length) {
    sections.push('## 核心特性', '', ...meta.features.map((f) => `- ${f}`), '')
  }

  sections.push('## 何时使用 / 不适用', '')
  if (meta?.useCases?.length) {
    sections.push('**适用**', '', ...meta.useCases.map((u) => `- ${u}`), '')
  } else {
    sections.push(
      `- **适用**：${stable ? '生产可用的 Stable 组件场景' : `${maturity} 阶段的标准 UI 场景`}。`,
      ''
    )
  }
  if (meta?.avoidWhen?.length) {
    sections.push('**不适用**', '', ...meta.avoidWhen.map((a) => `- ${a}`), '')
  } else {
    sections.push('- **不适用**：需要未实现能力时请查阅 example 或等待后续阶段。', '')
  }

  sections.push(
    '## 基础用法',
    '',
    `> \`import { ${name} } from '${importFrom}'\``,
    '',
    defaultUsage(name),
    '',
    demoPath ? `Curated demo：\`${demoPath}\`` : `Curated demo 目录：\`${demoDir}\``,
    ''
  )

  if (docsDemoId) {
    sections.push('## 示例', '', `<DocsDemo name="${docsDemoId}" />`, '')
  }

  if (EXTRA_SECTIONS[name]) {
    sections.push(EXTRA_SECTIONS[name].trim(), '')
  }

  sections.push('## API', '', '### Props', '', propsTable(api.props), '')

  if (api.events.length) {
    sections.push('### Events', '', eventsTable(api.events), '')
  }
  if (api.slots.length) {
    sections.push('### Slots', '', slotsTable(api.slots), '')
  }
  if (api.expose.length) {
    sections.push('### Expose', '', exposeTable(api.expose), '')
  }
  if (api.models.length) {
    sections.push('### Models', '', modelsTable(api.models), '')
  }
  if (api.publicTypes.length) {
    sections.push('### Public Types', '', api.publicTypes.map((t) => `- \`${t}\``).join('\n'), '')
  }

  const keyboardText = formatEvidenceBlock(meta?.keyboard)
  if (keyboardText) {
    sections.push('## 键盘交互', '', keyboardText, '')
  } else if (stable) {
    sections.push(
      '## 键盘交互',
      '',
      `以 \`component-hardening/evidence/${name}/keyboard.json\` 为准；本地复现：\`${demoDir}\`。`,
      ''
    )
  }

  const a11yText = formatEvidenceBlock(meta?.a11y)
  if (a11yText) {
    sections.push('## 无障碍', '', a11yText, '')
  } else if (stable) {
    sections.push(
      '## 无障碍',
      '',
      `以 \`component-hardening/evidence/${name}/a11y.json\` 为准。`,
      ''
    )
  }

  const themeText = formatEvidenceBlock(meta?.theme)
  if (themeText) sections.push('## Theme', '', themeText, '')
  const rtlText = formatEvidenceBlock(meta?.rtl)
  if (rtlText) sections.push('## RTL', '', rtlText, '')
  const ssrText = formatEvidenceBlock(meta?.ssr)
  if (ssrText) sections.push('## SSR', '', ssrText, '')

  if (meta?.limitations?.length) {
    sections.push('## 当前限制', '', ...meta.limitations.map((l) => `- ${l}`), '')
  }

  sections.push('## 相关组件', '', relatedSection(name, meta), '')

  sections.push(
    '## 稳定性',
    '',
    '| 字段 | 值 |',
    '| --- | --- |',
    `| maturity | \`${meta?.maturity || contract.maturity}\` |`,
    `| apiFreeze | \`${contract.frozen ? 'frozen' : 'unfrozen'}\` |`,
    `| import | \`${importFrom}\` |`,
    `| metadata | \`component-metadata/${name}.json\` |`,
    `| API extract | \`generated/component-api/${name}.json\` |`,
    ''
  )

  if (docsDemoId) {
    sections.push(`> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 \`${demoDir}\`。`, '')
  } else {
    sections.push(`> 完整 Demo 见 \`${demoDir}\`（example 本地调试，不上线）。`, '')
  }

  return sections.join('\n') + '\n'
}

function shouldWriteDoc(name, outPath, forceWrite) {
  if (forceWrite || force) return true
  if (!existsSync(outPath)) return true
  if (P0_COMPONENTS.includes(name) && loadComponentMetadata(name)) return true
  return false
}

function writeDoc(name, forceWrite = false) {
  const kebab = toKebab(name)
  const outPath = join(docsComponentsDir, `${kebab}.md`)
  if (!shouldWriteDoc(name, outPath, forceWrite)) {
    return { action: 'skip', path: outPath }
  }
  if (!existsSync(join(root, componentDirRel(name)))) {
    return { action: 'missing-component', path: outPath }
  }
  mkdirSync(docsComponentsDir, { recursive: true })
  const existed = existsSync(outPath)
  writeFileSync(outPath, generateMarkdown(name), 'utf8')
  const action = existed ? 'update' : 'create'
  return { action, path: outPath }
}

function updateDocsEvidence(name) {
  const kebab = toKebab(name)
  const page = `docs/components/${kebab}.md`
  const api = `generated/component-api/${name}.json`
  const demo = resolveDemoPath(name)
  const evidenceDir = join(evidenceRoot, name)
  mkdirSync(evidenceDir, { recursive: true })

  if (!existsSync(join(root, page))) {
    return { action: 'skip-no-page', name }
  }
  if (!existsSync(join(root, api))) {
    return { action: 'skip-no-api', name }
  }

  const payload = {
    status: 'PASS',
    detail: 'VitePress docs page + generated API extract',
    page,
    api
  }
  if (demo) payload.demo = demo

  writeFileSync(join(evidenceDir, 'docs.json'), JSON.stringify(payload, null, 2) + '\n')
  return { action: 'updated', name, payload }
}

function refreshDocsSidebar() {
  const ps = spawnSync(process.execPath, ['scripts/generate-docs-sidebar.mjs'], {
    cwd: root,
    stdio: 'inherit'
  })
  if (ps.status !== 0) {
    console.warn('[warn] generate-docs-sidebar failed — sidebar may be stale')
    return false
  }
  return true
}

const report = {
  created: [],
  updated: [],
  skipped: [],
  failures: [],
  evidenceUpdated: [],
  evidenceSkipped: []
}

const TARGET_COMPONENTS = ONLY_COMPONENTS ?? ALL_COMPONENTS

for (const name of TARGET_COMPONENTS) {
  const result = writeDoc(name, Boolean(ONLY_COMPONENTS))
  if (result.action === 'create') {
    report.created.push(toKebab(name))
    console.log(`[write] docs/components/${toKebab(name)}.md`)
  } else if (result.action === 'update') {
    report.updated.push(toKebab(name))
    console.log(`[force] docs/components/${toKebab(name)}.md`)
  } else if (result.action === 'skip') {
    report.skipped.push(toKebab(name))
  } else {
    report.failures.push({ name, reason: result.action })
    console.warn(`[warn] ${name}: ${result.action}`)
  }
}

if (updateEvidence) {
  for (const name of STABLE_COMPONENTS) {
    const ev = updateDocsEvidence(name)
    if (ev.action === 'updated') {
      report.evidenceUpdated.push(name)
      console.log(`[evidence] ${name}/docs.json`)
    } else {
      report.evidenceSkipped.push({ name, reason: ev.action })
    }
  }
}

refreshDocsSidebar()

console.log('\n[summary]')
console.log(`  stable: ${STABLE_COMPONENTS.length} (${STABLE_COMPONENTS.join(', ')})`)
console.log(`  docs created: ${report.created.length} → ${report.created.join(', ') || '—'}`)
console.log(`  docs updated: ${report.updated.length} → ${report.updated.join(', ') || '—'}`)
console.log(`  docs skipped (existing): ${report.skipped.length}`)
console.log(`  evidence updated: ${report.evidenceUpdated.length}`)
if (report.failures.length) {
  console.log(`  failures: ${JSON.stringify(report.failures)}`)
}
if (report.evidenceSkipped.length) {
  console.log(`  evidence skipped: ${JSON.stringify(report.evidenceSkipped)}`)
}
