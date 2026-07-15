/**
 * Score packages/components/base maturity → example/component-maturity.json
 * Levels (honest example debug labels, not marketing):
 *   stub  — still generic scaffold / placeholder MVP
 *   shell — thin wrapper or sub-primitive; exists but far from doc feature set
 *   beta  — real UI/logic, usable for debug; gaps vs product bar
 *   ready — substantial API/styles/interaction; shippable baseline
 *
 * Usage: node scripts/score-component-maturity.mjs
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const baseDir = resolve(root, 'packages/components/base')

const LEVELS = ['stub', 'shell', 'beta', 'ready']

function isScaffold(vue) {
  const lines = vue.split(/\r?\n/).length
  if (
    vue.includes('data-component=') &&
    vue.includes('__btn') &&
    /t\(['"]common\.search['"]\)/.test(vue) &&
    /t\(['"]button\.confirm['"]\)/.test(vue) &&
    lines < 100
  ) {
    return true
  }
  if (vue.includes('data-variant=') && vue.includes('letter-spacing:0.2em') && lines < 60) {
    return true
  }
  if (/mode: string = 'bubbles'/.test(vue) && lines < 80) return true
  return false
}

function countProps(typesSrc) {
  if (!typesSrc) return 0
  const iface = typesSrc.match(/export interface \w+Props[^{]*\{([\s\S]*?)\n\}/)
  if (!iface) return 0
  return (iface[1].match(/^\s+\w+\??:/gm) || []).length
}

function fileLines(path) {
  if (!existsSync(path)) return 0
  return readFileSync(path, 'utf8').split(/\r?\n/).length
}

function scoreOne(name) {
  const dir = join(baseDir, name)
  const vuePath = join(dir, 'index.vue')
  const typesPath = join(dir, 'types.ts')
  const stylePath = join(dir, 'style.scss')
  const vue = existsSync(vuePath) ? readFileSync(vuePath, 'utf8') : ''
  const types = existsSync(typesPath) ? readFileSync(typesPath, 'utf8') : ''
  const style = existsSync(stylePath) ? readFileSync(stylePath, 'utf8') : ''

  const vueLines = vue ? vue.split(/\r?\n/).length : 0
  const styleLines = style ? style.split(/\r?\n/).length : 0
  const propCount = countProps(types)
  const hasEmits = /defineEmits|Emits\s*\{/.test(vue) || /export interface \w+Emits/.test(types)
  const hasComposable = readdirSync(dir).some((f) => /^use[A-Z].*\.ts$/.test(f))
  const hasProvideInject = /provide\(|inject\(/.test(vue)
  const hasVModel = /update:modelValue|modelValue/.test(vue)
  const handlers = (vue.match(/@(?:click|change|input|keydown|scroll|focus|blur|submit|contextmenu)=/g) || [])
    .length
  const hasAria = /aria-|role=/.test(vue)
  const hasTokens = /var\(--(?:ds|theme|spacing|font-size|border-radius|shadow|text|surface|height)-/.test(
    style + vue
  )
  const slotOnly =
    /<slot\s*\/>/.test(vue) &&
    !(vue.includes('v-for') || vue.includes('v-if') || handlers > 0 || hasVModel)
  const templateLight = vueLines < 45 && styleLines < 40 && propCount <= 4

  const signals = []
  let score = 0

  if (isScaffold(vue)) {
    return {
      level: 'stub',
      score: 5,
      signals: ['scaffold'],
      vueLines,
      styleLines,
      propCount
    }
  }

  score += Math.min(35, Math.floor(vueLines / 4))
  score += Math.min(15, Math.floor(styleLines / 5))
  score += Math.min(15, propCount * 2)
  if (hasEmits) {
    score += 8
    signals.push('emits')
  }
  if (hasComposable) {
    score += 10
    signals.push('composable')
  }
  if (hasProvideInject) {
    score += 8
    signals.push('provide-inject')
  }
  if (hasVModel) {
    score += 6
    signals.push('v-model')
  }
  score += Math.min(10, handlers * 2)
  if (handlers) signals.push(`handlers:${handlers}`)
  if (hasAria) {
    score += 4
    signals.push('a11y')
  }
  if (hasTokens) {
    score += 4
    signals.push('tokens')
  }
  if (existsSync(join(dir, 'index.ts'))) score += 2

  // Sub-primitives / thin shells — cap as shell unless clearly richer
  const subPrimitive =
    /Item$|Pane$|Group$/.test(name) ||
    name === 'Steps' ||
    name === 'Timeline' ||
    (slotOnly && templateLight)

  if (subPrimitive && score < 55) {
    signals.push(slotOnly ? 'slot-shell' : 'sub-primitive')
    return {
      level: 'shell',
      score: Math.min(score, 35),
      signals,
      vueLines,
      styleLines,
      propCount
    }
  }

  if (templateLight && score < 40) {
    signals.push('thin')
    return {
      level: 'shell',
      score: Math.min(score, 38),
      signals,
      vueLines,
      styleLines,
      propCount
    }
  }

  let level = 'beta'
  if (score >= 70) level = 'ready'
  else if (score >= 40) level = 'beta'
  else level = 'shell'

  // Known doc gaps: multi-page TabsNav still lacks close / context menu / pin
  if (name === 'TabsNav' && level === 'ready') {
    level = 'beta'
    signals.push('doc-gap:multi-tab')
  }

  return {
    level,
    score: Math.min(100, score),
    signals,
    vueLines,
    styleLines,
    propCount
  }
}

const names = readdirSync(baseDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

const components = {}
const summary = { stub: 0, shell: 0, beta: 0, ready: 0 }

for (const name of names) {
  const row = scoreOne(name)
  components[name] = row
  summary[row.level] += 1
}

const generatedAt = new Date().toISOString()
const out = {
  version: 1,
  generatedAt,
  total: names.length,
  summary,
  levels: LEVELS,
  components
}

const outPath = resolve(root, 'example/component-maturity.json')
writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`)

console.log('[score-component-maturity]', {
  total: out.total,
  summary,
  out: 'example/component-maturity.json'
})
