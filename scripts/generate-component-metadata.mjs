/**
 * Generate component-metadata/*.json for every public inventory component.
 *
 * Usage:
 *   node scripts/generate-component-metadata.mjs
 *   node scripts/generate-component-metadata.mjs Button Select
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toKebab } from '../build/shared.mjs'
import {
  FOUNDATION_PACKAGES,
  componentToPackage,
  allMappedComponentNames
} from './component-package-map.mjs'
import { DISPLAY_NAMES, RELATED } from './component-docs-constants.mjs'
import { FAMILIES } from './hardening/families.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'component-metadata')
const hardening = join(root, 'component-hardening')
const apiDir = join(root, 'generated/component-api')
const docsDir = join(root, 'docs/components')

const PROP_FEATURE_HINTS = {
  disabled: '支持禁用状态',
  loading: '加载状态反馈',
  readonly: '只读模式',
  clearable: '可一键清空',
  multiple: '多选模式',
  virtual: '虚拟滚动',
  filterable: '可筛选',
  searchable: '可搜索',
  checkable: '节点可勾选',
  lazy: '远程/懒加载数据',
  modal: '模态遮罩',
  closable: '可关闭',
  confirm: '内置确认交互',
  ripple: '点击涟漪反馈',
  fluid: '宽度 100%',
  block: '块级布局',
  size: '多尺寸规格',
  severity: '语义色变体',
  variant: '外观变体',
  placeholder: '占位提示',
  options: '选项列表配置',
  columns: '列配置',
  rules: '校验规则',
  modelValue: 'v-model 双向绑定'
}

const FAMILY_GUIDANCE = {
  foundation: {
    useCases: ['基础 UI 交互与页面操作', '按钮、标签、图标等原子组件'],
    avoidWhen: ['需要复杂业务编排时优先业务组件或组合模式']
  },
  input: {
    useCases: ['表单文本/数值输入', '受控与非受控输入场景'],
    avoidWhen: ['极复杂富文本编辑请使用 RichText / MdEditor']
  },
  selection: {
    useCases: ['下拉、级联、树选等选择场景', '表单字段与筛选器'],
    avoidWhen: ['超大数据集未开启虚拟化时可能影响性能']
  },
  datetime: {
    useCases: ['日期/时间选择与范围输入', '表单与筛选面板'],
    avoidWhen: ['需要非标准历法或复杂排班规则时需自定义']
  },
  form: {
    useCases: ['表单布局、校验与字段编排', '动态/分步表单'],
    avoidWhen: ['纯展示场景无需引入完整 Form']
  },
  overlay: {
    useCases: ['对话框、抽屉、气泡确认等浮层', '阻断式交互'],
    avoidWhen: ['轻量提示优先 Toast / Message']
  },
  feedback: {
    useCases: ['操作结果与状态提示', '空态与加载反馈'],
    avoidWhen: ['需要模态决策时用 Dialog / Confirm']
  },
  navigation: {
    useCases: ['菜单、标签页、面包屑等导航', '页面结构引导'],
    avoidWhen: ['单页极简场景可省略复杂导航组件']
  },
  layout: {
    useCases: ['页面栅格与区域布局', '响应式容器'],
    avoidWhen: ['简单页面可用原生 CSS 布局']
  },
  tree: {
    useCases: ['层级数据展示与勾选', '目录/组织架构'],
    avoidWhen: ['扁平列表请用 Table / List']
  },
  table: {
    useCases: ['结构化数据表格', '排序筛选分页场景'],
    avoidWhen: ['少量键值对用 Descriptions']
  },
  upload: {
    useCases: ['文件选择与上传', '批量/分片上传'],
    avoidWhen: ['仅需下载链接时用 Link / Button']
  },
  editor: {
    useCases: ['代码/富文本/Markdown 编辑'],
    avoidWhen: ['只读展示用 Typography / RichText 预览模式']
  },
  charts: {
    useCases: ['统计图表可视化', '仪表盘指标展示'],
    avoidWhen: ['极简单数值用 Statistic']
  },
  lowcode: {
    useCases: ['低代码画布与物料拖拽', 'Schema 渲染'],
    avoidWhen: ['标准后台 CRUD 无需低代码层']
  },
  media: {
    useCases: ['音视频播放与控制', '监控预览场景'],
    avoidWhen: ['非媒体业务无需引入行业包']
  },
  gb28181: {
    useCases: ['国标 GB28181 设备与级联', '视频监控平台'],
    avoidWhen: ['非国标场景勿引入行业包']
  },
  onvif: {
    useCases: ['ONVIF 设备发现与管理', 'IPC 运维面板'],
    avoidWhen: ['非 ONVIF 设备对接场景']
  },
  vcr: {
    useCases: ['录像回放与存储运维', '监控中心 VCR 能力'],
    avoidWhen: ['无录像业务时勿引入']
  },
  special: {
    useCases: ['特殊场景组件', '业务定制页面块'],
    avoidWhen: ['通用场景优先 foundation 组件']
  }
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function readEvidence(name, file) {
  const p = join(hardening, 'evidence', name, file)
  if (!existsSync(p)) return null
  try {
    return loadJson(p)
  } catch {
    return null
  }
}

function readDocIntro(name) {
  const p = join(docsDir, `${toKebab(name)}.md`)
  if (!existsSync(p)) return ''
  const content = readFileSync(p, 'utf8')
  const m = content.match(/^#[^\n]+\n\n([\s\S]*?)(?=\n## )/)
  return m ? m[1].trim() : ''
}

function inferFeatures(api, family) {
  const features = new Set()
  const familyLabel = FAMILIES[family]?.label
  if (familyLabel) features.add(`${familyLabel} 家族组件`)

  for (const prop of api?.props || []) {
    if (PROP_FEATURE_HINTS[prop.name]) features.add(PROP_FEATURE_HINTS[prop.name])
  }
  if (api?.events?.length) features.add('事件回调')
  if (api?.slots?.length) features.add('插槽自定义')
  if (api?.expose?.length) features.add('实例方法暴露')
  if (api?.models?.length) features.add('v-model 双向绑定')

  return [...features]
}

function buildP0Guidance(name, family, api, isP0) {
  const base = FAMILY_GUIDANCE[family] || FAMILY_GUIDANCE.special
  let useCases = [...base.useCases]
  let avoidWhen = [...base.avoidWhen]

  if (isP0) {
    const propNames = (api?.props || []).map((p) => p.name)
    if (propNames.includes('disabled')) useCases.push('需要禁用/只读控制的表单场景')
    if (propNames.includes('loading')) useCases.push('异步提交或加载过程反馈')
    if (propNames.includes('virtual')) useCases.push('大数据量列表/表格性能场景')
    if (family === 'table') avoidWhen.push('无结构化列需求时避免过度使用表格')
    if (family === 'overlay') avoidWhen.push('非阻断提示不要用 Modal 对话框')
  }

  return { useCases: [...new Set(useCases)], avoidWhen: [...new Set(avoidWhen)] }
}

function resolveTitle(name) {
  return DISPLAY_NAMES[name] || name
}

function resolveSummary(name, family, maturity, docIntro) {
  if (docIntro) {
    const first = docIntro.split('\n').find((l) => l.trim()) || ''
    const cleaned = first.replace(/\*\*/g, '').trim()
    // Ignore generator boilerplate / self-referential intros
    if (
      cleaned.length > 10 &&
      !/generate-vitepress|本文档由|Contract maturity|公共组件（API/.test(cleaned)
    ) {
      return cleaned
    }
  }
  const familyLabel = FAMILIES[family]?.label || family
  const title = DISPLAY_NAMES[name] || name
  return `${title}：面向企业场景的 ${familyLabel} 组件（成熟度 ${maturity}）。`
}

function resolveImportPaths(name, api) {
  if (api?.importPaths?.length) return api.importPaths
  const pkg = componentToPackage.get(name)
  const paths = [`amg-webui/${pkg}`]
  const kebab = toKebab(name)
  const exportsMap = loadJson(join(root, 'package.json')).exports || {}
  if (exportsMap[`./${kebab}`]) paths.push(`amg-webui/${kebab}`)
  return paths
}

function buildMetadata(name, inventory, contract, api) {
  const pkg = inventory.package || componentToPackage.get(name)
  const family = inventory.family || contract?.family || 'special'
  const maturity = contract?.maturity || inventory.maturity || 'beta'
  const isP0 = FOUNDATION_PACKAGES.includes(pkg)
  const docIntro = readDocIntro(name)
  const guidance = buildP0Guidance(name, family, api, isP0)
  let features = inferFeatures(api, family)

  if (isP0 && features.length === 0) {
    features = [`${FAMILIES[family]?.label || family} 能力`, 'P0 基础组件']
  }

  const keyboardEv = readEvidence(name, 'keyboard.json')
  const a11yEv = readEvidence(name, 'a11y.json')
  const themeEv = readEvidence(name, 'theme.json')
  const rtlEv = readEvidence(name, 'rtl.json')
  const ssrEv = readEvidence(name, 'ssr.json')

  const summary = resolveSummary(name, family, maturity, docIntro)
  let description = summary
  if (docIntro && !/generate-vitepress|本文档由|Contract maturity/.test(docIntro)) {
    description = docIntro
  }

  const limitations = []
  if (contract?.behavioralContract?.disabled) {
    limitations.push(contract.behavioralContract.disabled)
  }
  if (contract?.apiFreeze && !contract.apiFreeze.frozen && maturity !== 'stable') {
    limitations.push('API 尚未冻结，可能随 hardening 批次调整')
  }

  return {
    name,
    title: resolveTitle(name),
    summary,
    description,
    family,
    package: pkg,
    maturity,
    importPaths: resolveImportPaths(name, api),
    features,
    useCases: isP0 ? guidance.useCases : guidance.useCases.slice(0, 2),
    avoidWhen: isP0 ? guidance.avoidWhen : guidance.avoidWhen.slice(0, 2),
    related: RELATED[name] || [],
    keyboard: keyboardEv
      ? { status: keyboardEv.status, keys: keyboardEv.keys || [], detail: keyboardEv.detail }
      : { status: 'MISSING', keys: contract?.keyboard || [] },
    a11y: a11yEv
      ? { status: a11yEv.status, detail: a11yEv.detail }
      : { status: 'MISSING' },
    theme: themeEv
      ? { status: themeEv.status, detail: themeEv.detail }
      : { status: contract?.gates?.theme === 'optional' ? 'N/A' : 'MISSING' },
    rtl: rtlEv
      ? { status: rtlEv.status, detail: rtlEv.detail }
      : { status: contract?.gates?.rtl === 'optional' ? 'N/A' : 'MISSING' },
    ssr: ssrEv
      ? { status: ssrEv.status, detail: ssrEv.detail }
      : { status: contract?.gates?.ssr === 'mandatory' ? 'MISSING' : 'N/A' },
    limitations,
    generatedAt: new Date().toISOString(),
    sourceHash: api?.sourceHash || null
  }
}

function main() {
  const args = process.argv.slice(2).filter((a) => !a.startsWith('-'))
  const inventory = loadJson(join(hardening, 'inventory/component-inventory.json'))
  const publicComponents = inventory.components.filter((c) => c.public)
  const names = args.length
    ? args
    : publicComponents.map((c) => c.name).sort()

  mkdirSync(outDir, { recursive: true })
  const catalog = []

  for (const name of names) {
    const inv = publicComponents.find((c) => c.name === name) || {
      name,
      package: componentToPackage.get(name),
      family: 'special',
      public: true,
      maturity: 'beta'
    }

    let contract = null
    const contractPath = join(hardening, 'contracts', `${name}.json`)
    if (existsSync(contractPath)) contract = loadJson(contractPath)

    let api = null
    const apiPath = join(apiDir, `${name}.json`)
    if (existsSync(apiPath)) api = loadJson(apiPath)

    const meta = buildMetadata(name, inv, contract, api)
    writeFileSync(join(outDir, `${name}.json`), JSON.stringify(meta, null, 2) + '\n')
    catalog.push({
      name,
      title: meta.title,
      package: meta.package,
      family: meta.family,
      maturity: meta.maturity,
      sourceHash: meta.sourceHash
    })
  }

  writeFileSync(
    join(outDir, 'index.json'),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: catalog.length,
        components: catalog
      },
      null,
      2
    ) + '\n'
  )

  console.log(`[generate:component-metadata] wrote ${catalog.length} → component-metadata/`)
}

main()
