/**
 * Shared AST / static gate helpers for verify:component.
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { componentDirRel } from '../component-package-map.mjs'

const HEX_RE = /#(?:[0-9a-fA-F]{3,8})\b/g
const HARDCODE_CJK_RE =
  /['"`][^'"`]*[\u4e00-\u9fff\u3400-\u4dbf][^'"`]*['"`]/g

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

/**
 * Extract slot names actually implemented in template / typed Slots / defineSlots.
 * Does NOT treat the word "Slots" alone as proof.
 */
export function extractImplementedSlots(src) {
  const slots = new Set()
  const vue = src.vue || ''
  const types = src.types || ''

  // <slot> → default; <slot name="x"> / <slot :name="..."> / dynamic body-*
  for (const m of vue.matchAll(/<slot\b([^>]*)\/?>/g)) {
    const attrs = m[1] || ''
    // Static name="x" only (not :name)
    const named = attrs.match(/(?:^|\s)name\s*=\s*(['"])([\w*-]+)\1/)
    if (named) {
      slots.add(named[2])
      continue
    }
    // :name / v-bind:name — do NOT use \b before ":" (colon is non-word)
    if (/:name\s*=|v-bind:name\s*=/.test(attrs)) {
      if (/body-/.test(attrs)) slots.add('body-*')
      continue
    }
    slots.add('default')
  }

  // #slot / v-slot: (consumer-facing pattern sometimes in docs SFCs; rare in library)
  for (const m of vue.matchAll(/#(default|[\w-]+)/g)) slots.add(m[1])
  for (const m of vue.matchAll(/v-slot:([\w-]+)/g)) slots.add(m[1])

  // defineSlots<{ ... }>()
  if (/defineSlots\s*</.test(vue)) {
    const block = vue.match(/defineSlots\s*<\s*\{([^}]*)\}/s)
    if (block) {
      for (const m of block[1].matchAll(/(?:['"]([\w*-]+)['"]|(\w+))\s*[?:]/g)) {
        slots.add(m[1] || m[2])
      }
    }
  }

  // interface XxxSlots — brace-balanced (nested `{ row }` must not truncate)
  const ifaceStart = types.search(/(?:export\s+)?interface\s+\w*Slots\b/)
  if (ifaceStart >= 0) {
    const brace = types.indexOf('{', ifaceStart)
    if (brace >= 0) {
      let depth = 0
      let end = brace
      for (; end < types.length; end++) {
        if (types[end] === '{') depth++
        else if (types[end] === '}') {
          depth--
          if (depth === 0) break
        }
      }
      const body = types.slice(brace + 1, end)
      for (const m of body.matchAll(/(?:['"]([\w*-]+)['"]|(?:^|[\n;])\s*(\w+)\s*\??\s*[:(])/g)) {
        const name = m[1] || m[2]
        if (name && name !== 'key' && name !== 'props') slots.add(name)
      }
      if (/body-/.test(body)) slots.add('body-*')
    }
  }

  if (/:name[\s\S]{0,120}body-/.test(vue) || /body-\$\{/.test(vue + types)) {
    slots.add('body-*')
  }

  return [...slots]
}

/**
 * Validate api.slots contract against real implementations.
 * - not-applicable → N/A (ok)
 * - required → every contract.requiredSlots (or family requiredSlots) must be implemented
 * - optional → PASS if typed/template slots exist OR no slots claimed
 */
export function checkSlots(src, contract, familyRequiredSlots = []) {
  if (contract?.api?.slots === 'not-applicable') {
    return { ok: true, status: 'N/A', detail: 'slots not-applicable', implemented: [], missing: [] }
  }

  const implemented = extractImplementedSlots(src)
  const required = [
    ...new Set([
      ...(contract?.requiredSlots || []),
      ...(familyRequiredSlots || [])
    ])
  ].filter(Boolean)

  if (contract?.api?.slots === 'required' || required.length > 0) {
    const missing = required.filter((slot) => {
      if (implemented.includes(slot)) return false
      // body-* covers body-foo dynamic slots
      if (slot.startsWith('body-') && implemented.includes('body-*')) return false
      if (slot === 'body-*' && implemented.some((s) => s.startsWith('body-'))) return false
      return true
    })
    const hasSurface =
      implemented.length > 0 ||
      /interface\s+\w*Slots\b/.test(src.types || '') ||
      /defineSlots\s*</.test(src.vue || '')
    if (required.length === 0) {
      // required api.slots but no requiredSlots list — still need a typed Slots surface
      return {
        ok: hasSurface,
        status: hasSurface ? 'PASS' : 'FAIL',
        detail: hasSurface
          ? `slots surface present: [${implemented.join(', ') || 'typed'}]`
          : 'api.slots=required but no Slots interface / defineSlots / <slot> found',
        implemented,
        missing: []
      }
    }
    return {
      ok: missing.length === 0,
      status: missing.length === 0 ? 'PASS' : 'FAIL',
      detail:
        missing.length === 0
          ? `requiredSlots ok: [${required.join(', ')}]`
          : `missing requiredSlots: [${missing.join(', ')}]; implemented=[${implemented.join(', ') || 'none'}]`,
      implemented,
      missing
    }
  }

  // optional
  return {
    ok: true,
    status: 'PASS',
    detail: implemented.length
      ? `optional slots: [${implemented.join(', ')}]`
      : 'optional; no slots declared',
    implemented,
    missing: []
  }
}
