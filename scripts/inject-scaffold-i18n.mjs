/**
 * Inject component.* title/lead keys into all locale packs + wire index.ts.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const pairsPath = resolve(root, 'scripts/.scaffold-locale-keys.json')
if (!existsSync(pairsPath)) {
  console.error('missing scripts/.scaffold-locale-keys.json')
  process.exit(1)
}

/** @type {[string, string][]} */
const pairs = JSON.parse(readFileSync(pairsPath, 'utf8'))
const uniqueKeys = [...new Map(pairs.map(([k, name]) => [k, name])).entries()]

const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']

const copy = {
  'zh-CN': (name, kind) => (kind === 'title' ? name : `${name} 组件调试预览`),
  'zh-TW': (name, kind) => (kind === 'title' ? name : `${name} 元件調試預覽`),
  'en-US': (name, kind) => (kind === 'title' ? name : `${name} component preview`),
  'ja-JP': (name, kind) => (kind === 'title' ? name : `${name} コンポーネントプレビュー`),
  'ko-KR': (name, kind) => (kind === 'title' ? name : `${name} 컴포넌트 미리보기`),
  'ko-KP': (name, kind) => (kind === 'title' ? name : `${name} 구성요소 미리보기`),
  'ru-RU': (name, kind) => (kind === 'title' ? name : `Превью компонента ${name}`)
}

for (const code of locales) {
  const dir = resolve(root, 'packages/locale', code)
  const file = resolve(dir, 'component.ts')
  const lines = ['export default {']
  for (const [key, name] of uniqueKeys) {
    const kind = key.endsWith('.title') ? 'title' : 'lead'
    const text = copy[code](name, kind).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    lines.push(`  '${key}': '${text}',`)
  }
  lines.push('} as Record<string, string>', '')
  writeFileSync(file, lines.join('\n'), 'utf8')

  const idx = resolve(dir, 'index.ts')
  let src = readFileSync(idx, 'utf8')
  if (!src.includes("./component'")) {
    src = src.replace(
      "import nav from './nav'\n",
      "import nav from './nav'\nimport component from './component'\n"
    )
    src = src.replace('  ...nav\n}', '  ...nav,\n  ...component\n}')
    writeFileSync(idx, src, 'utf8')
  }
}

console.log(`[inject-scaffold-i18n] ${uniqueKeys.length} keys × ${locales.length} locales`)
