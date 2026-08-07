/**
 * Append Theme Studio / Visual Matrix / Skill Lab locale keys (UTF-8 safe).
 * Run: node scripts/i18n/patch-lab-studio-keys.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '../../packages/locale')

const zhKeys = {
  'page.lab.themeStudio.title': '实验 · Theme Studio',
  'page.lab.themeStudio.lead':
    '可视化定制主题 Token，实时预览并导出 CSS / JSON / theme.ts / SCSS。',
  'page.lab.visualMatrix.title': '实验 · 主题视觉矩阵',
  'page.lab.visualMatrix.lead':
    '8 套官方主题 × 亮暗 × LTR/RTL 核心组件 Playwright 截图基线门禁。',
  'page.lab.skill.title': '实验 · Skill Lab',
  'page.lab.skill.lead':
    'SR3 官方 Built-ins、Runtime Inspector、Pipeline Debugger 与 Telemetry Bridge。',
  'page.lab.skill.builtins': '官方 Built-ins',
  'page.lab.skill.keyword': '关键词',
  'page.lab.skill.runPipeline': '运行 Pipeline',
  'page.lab.skill.inspector': 'Runtime Inspector',
  'page.lab.skill.bridgeOn': 'Telemetry Bridge 开',
  'page.lab.skill.bridgeOff': 'Telemetry Bridge 关',
  'page.lab.skill.clear': '清空日志',
  'page.lab.skill.events': '事件流',
  'page.lab.skill.pipeline': 'Pipeline 轨迹',
  'page.lab.skill.telemetry': 'Telemetry Bridge',
  'theme.studio.group.palette': '色板',
  'theme.studio.group.typography': '排版',
  'theme.studio.group.radius': '圆角',
  'theme.studio.group.elevation': '阴影',
  'theme.studio.namePlaceholder': '自定义主题名称',
  'theme.studio.scheme.dark': '暗色预览',
  'theme.studio.scheme.light': '亮色预览',
  'theme.studio.reset': '重置 Token',
  'theme.studio.presets': '官方设计主题',
  'theme.studio.preset.scheme': '亮暗',
  'theme.studio.import.title': '导入',
  'theme.studio.import.placeholder': '粘贴 JSON / CSS / SCSS / theme.ts …',
  'theme.studio.import.paste': '从剪贴板导入',
  'theme.studio.import.file': '选择文件',
  'theme.studio.import.fail': '导入失败：格式无效',
  'theme.studio.import.ok': '导入成功',
  'theme.studio.export.title': '导出',
  'theme.studio.export.download': '下载',
  'theme.studio.export.copy': '复制',
  'theme.studio.validation.title': '校验',
  'theme.studio.validation.pass': '通过',
  'theme.studio.validation.fail': '未通过',
  'theme.studio.validation.issues': '个问题',
  'theme.studio.validation.clean': '无问题',
  'theme.studio.preview.title': '组件预览',
  'theme.studio.preview.primary': '主要',
  'theme.studio.preview.secondary': '次要',
  'theme.studio.preview.dashed': '虚线',
  'theme.studio.preview.text': '文本',
  'theme.studio.preview.cardTitle': '卡片标题',
  'theme.studio.preview.cardBody': '预览卡片正文，用于观察间距与排版。',
  'theme.studio.preview.inputPlaceholder': '输入预览',
  'theme.studio.preview.alertSuccess': '成功提示',
  'theme.studio.preview.alertWarning': '警告提示',
  'theme.studio.preview.switch': '开关',
  'theme.studio.preview.checkbox': '复选',
  'theme.studio.preview.radioA': '选项 A',
  'theme.studio.preview.radioB': '选项 B',
  'theme.studio.preview.badge': '徽章'
}

const enKeys = {
  'page.lab.themeStudio.title': 'Lab · Theme Studio',
  'page.lab.themeStudio.lead':
    'Visual theme token editor with live preview and CSS / JSON / theme.ts / SCSS export.',
  'page.lab.visualMatrix.title': 'Lab · Visual Theme Matrix',
  'page.lab.visualMatrix.lead':
    'Playwright screenshot baselines for 8 official themes × light/dark × LTR/RTL core components.',
  'page.lab.skill.title': 'Lab · Skill Lab',
  'page.lab.skill.lead':
    'SR3 official built-ins, Runtime Inspector, Pipeline Debugger, and Telemetry Bridge.',
  'page.lab.skill.builtins': 'Official built-ins',
  'page.lab.skill.keyword': 'Keyword',
  'page.lab.skill.runPipeline': 'Run pipeline',
  'page.lab.skill.inspector': 'Runtime Inspector',
  'page.lab.skill.bridgeOn': 'Telemetry bridge on',
  'page.lab.skill.bridgeOff': 'Telemetry bridge off',
  'page.lab.skill.clear': 'Clear log',
  'page.lab.skill.events': 'Event stream',
  'page.lab.skill.pipeline': 'Pipeline traces',
  'page.lab.skill.telemetry': 'Telemetry Bridge',
  'theme.studio.group.palette': 'Palette',
  'theme.studio.group.typography': 'Typography',
  'theme.studio.group.radius': 'Radius',
  'theme.studio.group.elevation': 'Elevation',
  'theme.studio.namePlaceholder': 'Custom theme name',
  'theme.studio.scheme.dark': 'Dark preview',
  'theme.studio.scheme.light': 'Light preview',
  'theme.studio.reset': 'Reset tokens',
  'theme.studio.presets': 'Official design themes',
  'theme.studio.preset.scheme': 'Light/dark',
  'theme.studio.import.title': 'Import',
  'theme.studio.import.placeholder': 'Paste JSON / CSS / SCSS / theme.ts …',
  'theme.studio.import.paste': 'Import from paste',
  'theme.studio.import.file': 'Choose file',
  'theme.studio.import.fail': 'Import failed: invalid format',
  'theme.studio.import.ok': 'Import succeeded',
  'theme.studio.export.title': 'Export',
  'theme.studio.export.download': 'Download',
  'theme.studio.export.copy': 'Copy',
  'theme.studio.validation.title': 'Validation',
  'theme.studio.validation.pass': 'Pass',
  'theme.studio.validation.fail': 'Fail',
  'theme.studio.validation.issues': 'issues',
  'theme.studio.validation.clean': 'No issues',
  'theme.studio.preview.title': 'Component preview',
  'theme.studio.preview.primary': 'Primary',
  'theme.studio.preview.secondary': 'Secondary',
  'theme.studio.preview.dashed': 'Dashed',
  'theme.studio.preview.text': 'Text',
  'theme.studio.preview.cardTitle': 'Card title',
  'theme.studio.preview.cardBody': 'Preview card body for spacing and typography.',
  'theme.studio.preview.inputPlaceholder': 'Preview input',
  'theme.studio.preview.alertSuccess': 'Success alert',
  'theme.studio.preview.alertWarning': 'Warning alert',
  'theme.studio.preview.switch': 'Switch',
  'theme.studio.preview.checkbox': 'Checkbox',
  'theme.studio.preview.radioA': 'Option A',
  'theme.studio.preview.radioB': 'Option B',
  'theme.studio.preview.badge': 'Badge'
}

function formatEntries(keys) {
  return Object.entries(keys)
    .map(([k, v]) => `  '${k}': ${JSON.stringify(v)},`)
    .join('\n')
}

const locales = readdirSync(root, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)

for (const loc of locales) {
  const file = join(root, loc, 'page.ts')
  let src = readFileSync(file, 'utf8')
  if (src.includes("'page.lab.skill.title'")) {
    console.log(`skip ${loc}`)
    continue
  }
  const keys = loc === 'zh-CN' ? zhKeys : enKeys
  const block = formatEntries(keys)
  if (!src.trimEnd().endsWith('}')) {
    throw new Error(`${loc}: unexpected file ending`)
  }
  src = src.replace(/\}\s*$/, `${block}\n}\n`)
  writeFileSync(file, src, 'utf8')
  console.log(`patched ${loc}`)
}
