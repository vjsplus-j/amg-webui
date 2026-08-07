/**
 * Shared AST / static gate helpers for verify:component.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { componentDirRel } from '../component-package-map.mjs'

const HEX_RE = /#(?:[0-9a-fA-F]{3,8})\b/g
const RGB_RE = /\brgba?\s*\(/g
const HARDCODE_CJK_RE =
  /['"`][^'"`]*[\u4e00-\u9fff\u3400-\u4dbf][^'"`]*['"`]/g
const TOP_DOM_RE =
  /(?:^|\n)\s*(?:const|let|var|[^/\n]*)\b(?:window|document)\b(?!\s*\?)/m

/** Allowlisted hex/token files and patterns (theme primitives only). */
const COLOR_ALLOW = [
  /tokens\.scss$/,
  /_primitives/,
  /themes\//,
  /\/theme\//
]

export function loadSources(root, name) {
  const rel = componentDirRel(name)
  const abs = join(root, rel)
  if (!existsSync(abs)) {
    return { rel, abs, exists: false, vue: '', types: '', style: '', all: '' }
  }
  const vueFile = existsSync(join(abs, 'index.vue'))
    ? join(abs, 'index.vue')
    : existsSync(join(abs, `${name}.vue`))
      ? join(abs, `${name}.vue`)
      : existsSync(join(abs, `${name}Host.vue`))
        ? join(abs, `${name}Host.vue`)
        : null
  const serviceFile = existsSync(join(abs, 'service.ts'))
    ? join(abs, 'service.ts')
    : null
  const typesFile = existsSync(join(abs, 'types.ts')) ? join(abs, 'types.ts') : null
  const styleFile = ['style.scss', 'index.scss', `${name}.scss`]
    .map((f) => join(abs, f))
    .find((p) => existsSync(p))

  const vue = vueFile ? readFileSync(vueFile, 'utf8') : ''
  const service = serviceFile ? readFileSync(serviceFile, 'utf8') : ''
  const types = typesFile ? readFileSync(typesFile, 'utf8') : ''
  const style = styleFile ? readFileSync(styleFile, 'utf8') : ''
  return {
    rel,
    abs,
    exists: true,
    vue,
    service,
    types,
    style,
    all: `${vue}\n${service}\n${types}\n${style}`,
    vueFile,
    serviceFile,
    typesFile,
    styleFile,
    /** Service-only public APIs (e.g. MessageBox) still count as present code. */
    hasPublicSurface: Boolean(vueFile || serviceFile || typesFile)
  }
}

export function checkHardcodedCopy(src) {
  // Strip comments roughly
  const code = src.vue
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
  // Ignore t('...') and LocaleKeys
  const stripped = code
    .replace(/\bt\s*\(\s*['"][^'"]+['"]/g, '')
    .replace(/LocaleKeys(?:\.\w+)+/g, '')
  const hits = stripped.match(HARDCODE_CJK_RE) || []
  // Filter brand / technical exceptions
  const filtered = hits.filter(
    (h) => !/AMG-WebUI|Vue|GB28181|ONVIF|OTP|SSR|API/.test(h)
  )
  return {
    ok: filtered.length === 0,
    hits: filtered.slice(0, 10)
  }
}

export function checkHardcodedColor(src, rel) {
  if (COLOR_ALLOW.some((re) => re.test(rel.replace(/\\/g, '/')))) {
    return { ok: true, hits: [] }
  }
  const style = src.style || ''
  // Allow CSS-variable driven color functions; flag only literal hex / rgb numbers
  const hex = [...(style.match(HEX_RE) || [])]
  const rgbLiteral =
    style.match(
      /\brgba?\(\s*\d+/g
    ) || []
  const hits = [...hex, ...rgbLiteral].filter(
    (h) => !/^#(?:fff|000|FFF|000)$/.test(h)
  )
  return {
    ok: hits.length === 0,
    hits: hits.slice(0, 10)
  }
}

export function checkTopLevelDom(src) {
  // Script setup top-level document/window without getDocument/getWindow
  const script = (src.vue.match(/<script[^>]*>([\s\S]*?)<\/script>/) || [])[1] || ''
  const lines = script.split(/\r?\n/)
  const hits = []
  let inFn = 0
  for (const line of lines) {
    const open = (line.match(/\{/g) || []).length
    const close = (line.match(/\}/g) || []).length
    const trimmed = line.trim()
    if (
      inFn === 0 &&
      /\b(?:window|document)\b/.test(trimmed) &&
      !/import|typeof|getWindow|getDocument|\/\/|onMounted|onBeforeMount|onUnmounted/.test(
        trimmed
      ) &&
      !/^\s*(?:\/\/|\*)/.test(line)
    ) {
      // allow `const win = getWindow()` patterns already excluded
      if (/^(?:const|let|var)\s+\w+\s*=\s*(?:window|document)/.test(trimmed)) {
        hits.push(trimmed.slice(0, 120))
      } else if (
        /^(?:window|document)\./.test(trimmed) &&
        !/function|=>/.test(trimmed)
      ) {
        hits.push(trimmed.slice(0, 120))
      }
    }
    inFn += open - close
    if (inFn < 0) inFn = 0
  }
  return { ok: hits.length === 0, hits: hits.slice(0, 5) }
}

export function checkPackageFiles(src) {
  const hasEntry =
    Boolean(src.vue) ||
    existsSync(join(src.abs, 'index.ts')) ||
    existsSync(join(src.abs, 'service.ts'))
  return {
    ok: src.exists && hasEntry,
    hasTypes: Boolean(src.types) || existsSync(join(src.abs, 'types.ts')),
    hasStyle: Boolean(src.style)
  }
}

export function checkCleanupHints(src) {
  const code = src.vue + src.types
  const adds =
    /addEventListener|setInterval|setTimeout|MutationObserver|ResizeObserver|IntersectionObserver|AbortController/.test(
      code
    )
  if (!adds) return { ok: true, note: 'no side-effect APIs detected' }
  const cleans =
    /removeEventListener|clearInterval|clearTimeout|\.disconnect\(|\.abort\(|onUnmounted|onBeforeUnmount|\{\s*once:\s*true\s*\}/.test(
      code
    )
  return {
    ok: cleans,
    note: cleans ? 'cleanup patterns found' : 'side effects without obvious cleanup'
  }
}
