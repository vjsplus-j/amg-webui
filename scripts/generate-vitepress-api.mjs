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
 * - Patches component sidebar block in vitepress.config.ts (preserves other sections)
 * - Optionally updates component-hardening/evidence/<Name>/docs.json
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  componentDirRel,
  componentToPackage,
  packageAlias
} from './component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const docsComponentsDir = resolve(root, 'docs/components')
const vitepressConfigPath = resolve(root, 'vitepress.config.ts')
const programStatusPath = join(root, 'component-hardening/program-status.json')
const apiDir = join(root, 'generated/component-api')
const evidenceRoot = join(root, 'component-hardening/evidence')

const force = process.argv.includes('--force')
const stableOnly = process.argv.includes('--stable-only')
const updateEvidence =
  process.argv.includes('--update-evidence') ||
  (!process.argv.includes('--no-update-evidence') && stableOnly)

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

const DISPLAY_NAMES = {
  InputText: 'InputText 文本输入',
  DataTable: 'DataTable 数据表格',
  MessageBox: 'MessageBox 命令式对话框',
  ConfigProvider: 'ConfigProvider 全局配置',
  ButtonGroup: 'ButtonGroup 按钮组',
  Checkbox: 'Checkbox 复选框',
  AutoComplete: 'AutoComplete 自动完成',
  DatePicker: 'DatePicker 日期选择',
  DateTimePicker: 'DateTimePicker 日期时间',
  TimePicker: 'TimePicker 时间选择',
  ColorPicker: 'ColorPicker 颜色选择',
  TreeSelect: 'TreeSelect 树形选择',
  DynamicForm: 'DynamicForm 动态表单',
  StepForm: 'StepForm 分步表单'
}

const RELATED = {
  Form: ['FormItem', 'FormGroup', 'FormTabs', 'DynamicForm', 'StepForm', 'InputText'],
  FormItem: ['Form', 'InputText', 'Select', 'Checkbox'],
  FormGroup: ['Form', 'FormItem'],
  FormTabs: ['Form', 'FormItem', 'Tabs'],
  DynamicForm: ['Form', 'FormItem'],
  StepForm: ['Form', 'FormItem'],
  InputText: ['Form', 'FormItem', 'Textarea', 'Password', 'InputNumber'],
  Textarea: ['Form', 'FormItem', 'InputText'],
  Password: ['Form', 'FormItem', 'InputText'],
  InputNumber: ['Form', 'FormItem', 'InputText'],
  InputOTP: ['Form', 'FormItem'],
  Mention: ['Form', 'FormItem', 'InputText'],
  Select: ['Form', 'FormItem', 'SelectNav', 'TreeSelect', 'Cascader'],
  AutoComplete: ['Form', 'FormItem', 'InputText', 'Select'],
  Cascader: ['Form', 'FormItem', 'Select'],
  TreeSelect: ['Form', 'FormItem', 'Select', 'Tree'],
  DatePicker: ['Form', 'FormItem', 'DateTimePicker', 'TimePicker', 'Calendar'],
  DateTimePicker: ['Form', 'FormItem', 'DatePicker', 'TimePicker'],
  TimePicker: ['Form', 'FormItem', 'DateTimePicker', 'TimeSelect'],
  TimeSelect: ['Form', 'FormItem', 'TimePicker'],
  TimeRangeInput: ['Form', 'FormItem', 'TimePicker', 'RangeInput'],
  RangeInput: ['Form', 'FormItem', 'InputNumber'],
  ColorPicker: ['Form', 'FormItem'],
  Calendar: ['DatePicker', 'DateTimePicker'],
  SelectNav: ['Select', 'Menu'],
  Button: ['ButtonGroup', 'Dialog'],
  Dialog: ['Button', 'Form'],
  DataTable: ['Pagination', 'Form']
}

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

function importAliasForComponent(name) {
  const pkg = componentToPackage.get(name)
  if (!pkg) return '@amg-webui/core'
  return packageAlias(pkg)
}

function toKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function toTitle(name) {
  if (DISPLAY_NAMES[name]) return DISPLAY_NAMES[name]
  return name
}

function loadStableComponents() {
  if (existsSync(programStatusPath)) {
    const ps = JSON.parse(readFileSync(programStatusPath, 'utf8'))
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

const ALL_COMPONENTS = stableOnly
  ? STABLE_COMPONENTS
  : [...new Set([...V01_PRIORITY, ...EXISTING_STUBS, ...STABLE_COMPONENTS])].sort()

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
  if (extract) {
    return {
      props: extract.props || [],
      events: extract.events || [],
      slots: extract.slots || [],
      expose: extract.expose || [],
      models: extract.models || [],
      publicTypes: extract.publicTypes || [],
      source: 'generated/component-api'
    }
  }
  const typesContent = readTypes(name)
  return {
    props: parsePropsFromTypes(typesContent, name),
    events: parseEmitsFromTypes(typesContent, name),
    slots: [],
    expose: [],
    models: [],
    publicTypes: [],
    source: 'types.ts'
  }
}

function resolveDemoPath(name) {
  const base = join(root, 'example/demos', name)
  if (existsSync(join(base, 'index.vue'))) return `example/demos/${name}/index.vue`
  if (existsSync(join(base, 'parts/Basic.vue'))) return `example/demos/${name}/parts/Basic.vue`
  if (existsSync(base)) return `example/demos/${name}`
  return null
}

function defaultUsage(name) {
  const template = USAGE_TEMPLATES[name]
  if (template) return template()
  const alias = importAliasForComponent(name)
  return `\`\`\`vue
<script setup>
import { ${name} } from '${alias}'
</script>

<template>
  <${name} />
</template>
\`\`\``
}

function escPipe(s) {
  return String(s).replace(/\|/g, '\\|')
}

function propsTable(props) {
  if (!props.length) {
    return '| Prop | 类型 | 默认 | 说明 |\n| --- | --- | --- | --- |\n| — | — | — | 见 `generated/component-api` 或源码 `types.ts` |'
  }
  const rows = props.slice(0, 32).map((p) => {
    const optional = p.optional !== false
    const def = optional ? '—' : '**必填**'
    const type = escPipe(p.type)
    const desc = escPipe(p.description || '—')
    return `| \`${p.name}\` | \`${type}\` | ${def} | ${desc} |`
  })
  return ['| Prop | 类型 | 默认 | 说明 |', '| --- | --- | --- | --- |', ...rows].join('\n')
}

function eventsTable(events) {
  if (!events.length) return ''
  const rows = events.map((e) => {
    const name = typeof e === 'string' ? e : e.name
    const payload = typeof e === 'string' ? '—' : escPipe(e.payload || '—')
    return `| \`${name}\` | \`${payload}\` | — |`
  })
  return ['| 事件 | Payload | 说明 |', '| --- | --- | --- |', ...rows].join('\n')
}

function slotsTable(slots) {
  if (!slots.length) return ''
  const rows = slots.map((s) => {
    return `| \`${s.name}\` | \`${escPipe(s.props || '—')}\` | ${escPipe(s.description || '—')} |`
  })
  return ['| Slot | Props | 说明 |', '| --- | --- | --- |', ...rows].join('\n')
}

function exposeTable(expose) {
  if (!expose.length) return ''
  const rows = expose.map((x) => `| \`${x.name}\` | \`${escPipe(x.type)}\` | ${escPipe(x.description || '—')} |`)
  return ['| Expose | 类型 | 说明 |', '| --- | --- | --- |', ...rows].join('\n')
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

function relatedSection(name) {
  const related = RELATED[name]
  if (!related?.length) return '— 见同包组件与 `Form` / `Select` 等表单家族。'
  return related.map((r) => `- [${r}](./${toKebab(r)})`).join('\n')
}

function isStable(name) {
  return STABLE_COMPONENTS.includes(name)
}

function generateMarkdown(name) {
  const api = resolveApiSurface(name)
  const title = toTitle(name)
  const demoPath = resolveDemoPath(name)
  const demoDir = demoPath ? demoPath.replace(/\/index\.vue$|\/parts\/Basic\.vue$/, '') : `example/demos/${name}/`
  const stable = isStable(name)
  const intro =
    name === 'MessageBox'
      ? '命令式确认 / 提示 / 输入框：`MessageBox.confirm` · `alert` · `prompt`。'
      : stable
        ? `${name} 为 **Stable** 公共组件（API frozen）。本文档由 \`generate-vitepress-api.mjs\` 从 \`${api.source}\` 生成。`
        : `${name} 组件 API（v0.1 子集）。`

  const sections = [
    `# ${title}`,
    '',
    intro,
    '',
    '## 概览',
    '',
    stable
      ? `${name} 已通过 Component Hardening 证据门禁；完整交互演示见本地 example curated demo。`
      : `${name} 对外薄 API 文档；完整交互见本地 example。`,
    '',
    '## 何时使用 / 何时不用',
    '',
    `- **适用**：${stable ? '生产可用的 Stable 组件场景' : 'v0.1 子集内的标准 UI 场景'}。`,
    '- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。',
    '',
    '## 相关组件',
    '',
    relatedSection(name),
    '',
    '## 基础用法',
    '',
    defaultUsage(name),
    '',
    demoPath ? `Curated demo：\`${demoPath}\`` : `Curated demo 目录：\`${demoDir}\``,
    ''
  ]

  if (EXTRA_SECTIONS[name]) {
    sections.push(EXTRA_SECTIONS[name].trim(), '')
  }

  sections.push(
    '## Props',
    '',
    propsTable(api.props),
    ''
  )

  if (api.events.length) {
    sections.push('## Events', '', eventsTable(api.events), '')
  }
  if (api.slots.length) {
    sections.push('## Slots', '', slotsTable(api.slots), '')
  }
  if (api.expose.length) {
    sections.push('## Expose', '', exposeTable(api.expose), '')
  }
  if (api.models.length) {
    sections.push('## Models', '', modelsTable(api.models), '')
  }
  if (api.publicTypes.length) {
    sections.push(publicTypesSection(api.publicTypes).trim(), '')
  }

  if (stable) {
    sections.push(
      '## 无障碍与键盘',
      '',
      '交互行为与键盘路径以 `component-hardening/evidence/' +
        name +
        '/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/' +
        name +
        '/`。'
    )
    sections.push(
      '',
      '## 稳定性',
      '',
      '| 字段 | 值 |',
      '| --- | --- |',
      '| maturity | `stable` |',
      '| apiFreeze | `frozen` |',
      `| API extract | \`generated/component-api/${name}.json\` |`
    )
  }

  sections.push(
    '',
    `> 完整 Demo 见 \`${demoDir}\`。对外 docs 为 API 导向页面；交互预览仅在本地 example（不上线）。`
  )

  return sections.join('\n') + '\n'
}

function writeDoc(name) {
  const kebab = toKebab(name)
  const outPath = join(docsComponentsDir, `${kebab}.md`)
  if (existsSync(outPath) && !force) {
    return { action: 'skip', path: outPath }
  }
  if (!existsSync(join(root, componentDirRel(name)))) {
    return { action: 'missing-component', path: outPath }
  }
  mkdirSync(docsComponentsDir, { recursive: true })
  writeFileSync(outPath, generateMarkdown(name), 'utf8')
  return { action: existsSync(outPath) && force ? 'update' : 'create', path: outPath }
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

function buildSidebarItems() {
  const v01 = V01_PRIORITY.map((name) => ({ text: name, link: `/components/${toKebab(name)}` }))
  const stableExtra = STABLE_COMPONENTS.filter((n) => !V01_PRIORITY.includes(n)).map((name) => ({
    text: `${name} ★`,
    link: `/components/${toKebab(name)}`
  }))
  const stubs = EXISTING_STUBS.filter(
    (n) => !V01_PRIORITY.includes(n) && !STABLE_COMPONENTS.includes(n)
  ).map((name) => ({ text: name, link: `/components/${toKebab(name)}` }))

  return [
    { text: '概览', link: '/components/' },
    ...v01,
    ...(stableExtra.length
      ? [{ text: '—— Stable ——', link: '/components/' }, ...stableExtra]
      : []),
    ...(stubs.length ? [{ text: '—— 其它 stub ——', link: '/components/' }, ...stubs] : [])
  ]
}

function updateVitepressConfig() {
  if (!existsSync(vitepressConfigPath)) {
    console.warn('[warn] vitepress.config.ts missing — skip sidebar patch')
    return false
  }
  const items = buildSidebarItems()
  const itemsStr = items
    .map((i) => `          { text: '${i.text.replace(/'/g, "\\'")}', link: '${i.link}' }`)
    .join(',\n')

  let config = readFileSync(vitepressConfigPath, 'utf8')
  const blockRe =
    /(\{\s*\n\s*text:\s*'组件[^']*',\s*\n\s*items:\s*\[)([\s\S]*?)(\n\s*\]\s*\n\s*\})/
  if (!blockRe.test(config)) {
    console.warn('[warn] component sidebar block not found — skip patch')
    return false
  }
  config = config.replace(blockRe, `$1\n${itemsStr}$3`)
  writeFileSync(vitepressConfigPath, config, 'utf8')
  console.log('[write] vitepress.config.ts component sidebar patched')
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

for (const name of ALL_COMPONENTS) {
  const result = writeDoc(name)
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

updateVitepressConfig()

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
