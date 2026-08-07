/**
 * Generate VitePress component API stubs from component types.ts.
 * Usage: node scripts/generate-vitepress-api.mjs [--force]
 *
 * - Writes docs/components/<kebab>.md if missing (or with --force)
 * - Rewrites component sidebar block in vitepress.config.ts
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
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
const force = process.argv.includes('--force')

function importAliasForComponent(name) {
  const pkg = componentToPackage.get(name)
  if (!pkg) return '@amg-webui/core'
  return packageAlias(pkg)
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

const ALL_COMPONENTS = [...new Set([...V01_PRIORITY, ...EXISTING_STUBS])].sort()

const DISPLAY_NAMES = {
  InputText: 'InputText 文本输入',
  DataTable: 'DataTable 数据表格',
  MessageBox: 'MessageBox 命令式对话框',
  ConfigProvider: 'ConfigProvider 全局配置',
  ButtonGroup: 'ButtonGroup 按钮组',
  Checkbox: 'Checkbox 复选框'
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

function toKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

function toTitle(name) {
  if (DISPLAY_NAMES[name]) return DISPLAY_NAMES[name]
  return name
}

function readTypes(name) {
  const p = join(root, componentDirRel(name), 'types.ts')
  if (!existsSync(p)) return ''
  return readFileSync(p, 'utf8')
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

function parseProps(content, name) {
  const candidates = [
    `${name}Props`,
    `${name}HostProps`,
    `${name}Options`
  ]
  for (const iface of candidates) {
    const body = extractInterfaceBody(content, iface)
    if (!body) continue
    const props = []
    const lines = body.split('\n')
    let pendingComment = ''
    for (const line of lines) {
      const cm = line.match(/^\s*\/\*\*\s*(.+?)\s*\*\/\s*$/)
      if (cm) {
        pendingComment = cm[1]
        continue
      }
      const cm2 = line.match(/^\s*\/\*\*\s*(.+)$/)
      if (cm2) {
        pendingComment = cm2[1].replace(/\s*\*\/\s*$/, '').trim()
        continue
      }
      const field = line.match(/^\s*(\w+)(\?)?:\s*([^;]+)/)
      if (!field) continue
      const [, key, optional, typeRaw] = field
      if (key === 'extends') continue
      props.push({
        name: key,
        type: typeRaw.trim(),
        optional: Boolean(optional),
        desc: pendingComment || '—'
      })
      pendingComment = ''
    }
    if (props.length) return props
  }
  return []
}

function parseEmits(content, name) {
  const candidates = [`${name}Emits`, `${name}HostEmits`]
  for (const iface of candidates) {
    const body = extractInterfaceBody(content, iface)
    if (!body) continue
    const events = []
    for (const line of body.split('\n')) {
      const m = line.match(/\(e:\s*'([^']+)'/)
      if (m) events.push(m[1])
    }
    if (events.length) return events
  }
  return []
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

function propsTable(props) {
  if (!props.length) {
    return '| Prop | 类型 | 默认 | 说明 |\n| --- | --- | --- | --- |\n| — | — | — | 见源码 `types.ts` |'
  }
  const rows = props.slice(0, 24).map((p) => {
    const def = p.optional ? '—' : '**必填**'
    const type = p.type.replace(/\|/g, '\\|')
    return `| \`${p.name}\` | \`${type}\` | ${def} | ${p.desc} |`
  })
  return ['| Prop | 类型 | 默认 | 说明 |', '| --- | --- | --- | --- |', ...rows].join('\n')
}

function emitsTable(events) {
  if (!events.length) {
    return '| 事件 | 说明 |\n| --- | --- |\n| — | 见源码 `types.ts` |'
  }
  return [
    '| 事件 | 说明 |',
    '| --- | --- |',
    ...events.map((e) => `| \`${e}\` | — |`)
  ].join('\n')
}

function generateMarkdown(name) {
  const typesContent = readTypes(name)
  const props = parseProps(typesContent, name)
  const emits = parseEmits(typesContent, name)
  const kebab = toKebab(name)
  const title = toTitle(name)
  const intro =
    name === 'MessageBox'
      ? '命令式确认 / 提示 / 输入框：`MessageBox.confirm` · `alert` · `prompt`。'
      : `${name} 组件 API（v0.1 子集）。`

  return `# ${title}

${intro}

## 基础用法

${defaultUsage(name)}

## 常用 API

${propsTable(props)}

${emits.length ? `\n| 事件 | 说明 |\n| --- | --- |\n${emits.map((e) => `| \`${e}\` | — |`).join('\n')}` : ''}

> 完整 Demo 见 \`example/demos/${name}/\`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
`
}

function writeStub(name) {
  const kebab = toKebab(name)
  const outPath = join(docsComponentsDir, `${kebab}.md`)
  if (existsSync(outPath) && !force) {
    console.log(`[skip] ${kebab}.md exists`)
    return false
  }
  if (!existsSync(join(root, componentDirRel(name)))) {
    console.warn(`[warn] component folder missing: ${name}`)
    return false
  }
  writeFileSync(outPath, generateMarkdown(name), 'utf8')
  console.log(`[write] docs/components/${kebab}.md`)
  return true
}

function buildSidebarItems() {
  return ALL_COMPONENTS.map((name) => ({
    text: name,
    link: `/components/${toKebab(name)}`
  }))
}

function updateVitepressConfig() {
  const items = buildSidebarItems()
  const itemsStr = items.map((i) => `          { text: '${i.text}', link: '${i.link}' }`).join(',\n')

  const config = `import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AMG-WebUI',
  description: 'Vue3 AMG WebUI component library',
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/installation' },
      { text: '组件', link: '/components/' },
      { text: '主题', link: '/theme/' },
      { text: '业务模块', link: '/business/' }
    ],
    sidebar: [
      {
        text: '起步',
        items: [
          { text: '简介', link: '/' },
          { text: '安装', link: '/guide/installation' },
          { text: '快速开始', link: '/guide/quick-start' },
          { text: '0.1 发布说明', link: '/RELEASE_0.1' },
          { text: '0.1 组件子集', link: '/V0_1_SUBSET' }
        ]
      },
      {
        text: '主题',
        items: [
          { text: '主题体系', link: '/theme/' },
          { text: 'Theme Studio', link: '/THEME_STUDIO' }
        ]
      },
      {
        text: '业务模块',
        items: [{ text: '概览', link: '/business/' }]
      },
      {
        text: '组件（v0.1 核心）',
        items: [
          { text: '概览', link: '/components/' },
${itemsStr}
        ]
      }
    ]
  }
})
`
  writeFileSync(vitepressConfigPath, config, 'utf8')
  console.log('[write] vitepress.config.ts sidebar updated')
}

let created = 0
for (const name of ALL_COMPONENTS) {
  if (writeStub(name)) created++
}
updateVitepressConfig()
console.log(`[done] ${created} stub(s) written, ${ALL_COMPONENTS.length} sidebar entries`)
