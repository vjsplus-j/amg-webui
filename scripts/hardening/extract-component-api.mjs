/**
 * Extract public API surfaces from types.ts / index.vue into generated/component-api/*.json
 *
 * Usage:
 *   node scripts/hardening/extract-component-api.mjs
 *   node scripts/hardening/extract-component-api.mjs Button Select
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { toKebab } from '../../build/shared.mjs'
import {
  componentDirRel,
  allMappedComponentNames,
  componentToPackage
} from '../component-package-map.mjs'
import { hashPaths } from './hash-component-source.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const outDir = join(root, 'generated/component-api')

/** @type {import('node:fs').readFileSync} */
let packageJsonCache = null
function loadPackageJson() {
  if (!packageJsonCache) {
    packageJsonCache = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
  }
  return packageJsonCache
}

function readComp(name) {
  const rel = componentDirRel(name)
  const abs = join(root, rel)
  const typesPath = join(abs, 'types.ts')
  const vuePath = existsSync(join(abs, 'index.vue'))
    ? join(abs, 'index.vue')
    : join(abs, `${name}.vue`)
  return {
    abs,
    rel,
    typesPath,
    vuePath,
    types: existsSync(typesPath) ? readFileSync(typesPath, 'utf8') : '',
    vue: existsSync(vuePath) ? readFileSync(vuePath, 'utf8') : ''
  }
}

function resolveImportPaths(name) {
  const pkg = componentToPackage.get(name)
  const paths = [`amg-webui/${pkg}`]
  const kebab = toKebab(name)
  const exportsMap = loadPackageJson().exports || {}
  if (exportsMap[`./${kebab}`]) {
    paths.push(`amg-webui/${kebab}`)
  }
  return paths
}

function computeSourceHash(typesPath, vuePath) {
  const paths = [typesPath, vuePath].filter((p) => existsSync(p))
  return paths.length ? hashPaths(paths, { root }) : null
}

/** Brace-balanced interface body; supports `Name<T = …> extends … { … }`. */
function extractInterfaceBody(src, ifaceName) {
  const startRe = new RegExp(
    `export\\s+interface\\s+${ifaceName}\\b(?:\\s*<[^>]*>)?\\s*(?:extends[^{]*)?\\{`
  )
  const m = startRe.exec(src)
  if (!m) return null
  let i = m.index + m[0].length
  let depth = 1
  while (i < src.length && depth > 0) {
    const ch = src[i]
    if (ch === '{') depth += 1
    else if (ch === '}') depth -= 1
    i += 1
  }
  return src.slice(m.index + m[0].length, i - 1)
}

function stripBlockComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '')
}

/**
 * Map member name → JSDoc description from raw interface body (comments preserved).
 */
function parseJsDocDescriptions(body) {
  const map = new Map()
  if (!body) return map

  const patterns = [
    /\/\*\*([\s\S]*?)\*\/\s*(?:\/\/[^\n]*)?\s*([A-Za-z_][\w]*)\s*[?]?\s*:/g,
    /\/\*\*([\s\S]*?)\*\/\s*\(\s*e:\s*['"]([\w:-]+)['"]/g,
    /\/\*\*([\s\S]*?)\*\/\s*([A-Za-z_][\w]*)\s*\?\s*\([^)]*\)/g
  ]

  for (const re of patterns) {
    let m
    while ((m = re.exec(body))) {
      const desc = cleanJsDoc(m[1])
      if (desc && !map.has(m[2])) map.set(m[2], desc)
    }
  }
  return map
}

function cleanJsDoc(raw) {
  return raw
    .split('\n')
    .map((l) => l.replace(/^\s*\*\s?/, '').trim())
    .filter((l) => l && !l.startsWith('@'))
    .join(' ')
    .trim()
}

/**
 * Split interface members on top-level `;` or newlines (TS often omits `;`).
 * Respects (), {}, <>, [], strings.
 */
function splitMembers(body) {
  const cleaned = stripBlockComments(body)
  const members = []
  let buf = ''
  let paren = 0
  let brace = 0
  let angle = 0
  let bracket = 0
  let quote = null

  function flush() {
    const piece = buf.trim()
    if (piece) members.push(piece)
    buf = ''
  }

  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i]
    const prev = cleaned[i - 1]
    if (quote) {
      buf += ch
      if (ch === quote && prev !== '\\') quote = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch
      buf += ch
      continue
    }
    if (ch === '(') paren += 1
    else if (ch === ')') paren -= 1
    else if (ch === '{') brace += 1
    else if (ch === '}') brace -= 1
    else if (ch === '<') {
      if (cleaned[i + 1] !== '=') angle += 1
    } else if (ch === '>') {
      if (prev !== '=') angle -= 1
    } else if (ch === '[') bracket += 1
    else if (ch === ']') bracket -= 1

    const top = paren === 0 && brace === 0 && angle === 0 && bracket === 0

    if (ch === ';' && top) {
      flush()
      continue
    }

    if ((ch === '\n' || ch === '\r') && top) {
      const piece = buf.trim()
      if (piece.includes(':')) {
        let j = i + 1
        while (j < cleaned.length && /[ \t]/.test(cleaned[j])) j += 1
        const next = cleaned[j]
        const nextStartsMember =
          next == null ||
          next === '\n' ||
          next === '\r' ||
          next === '/' ||
          next === '[' ||
          next === '(' ||
          /[A-Za-z_]/.test(next)
        if (nextStartsMember) {
          flush()
          continue
        }
      }
      buf += ' '
      continue
    }

    buf += ch
  }
  flush()
  return members
}

function stringifyDefault(expr) {
  const s = expr.trim().replace(/\s+/g, ' ')
  if (!s || s === 'undefined') return null
  if (/^\([^)]*\)\s*=>/.test(s)) return s
  if (s === 'true') return true
  if (s === 'false') return false
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s)
  if (
    (s.startsWith("'") && s.endsWith("'")) ||
    (s.startsWith('"') && s.endsWith('"'))
  ) {
    try {
      return JSON.parse(s.replace(/^'/, '"').replace(/'$/, '"'))
    } catch {
      return s.slice(1, -1)
    }
  }
  if (s.startsWith('[') || s.startsWith('{')) {
    try {
      return JSON.parse(s)
    } catch {
      return s
    }
  }
  return s
}

function splitObjectEntries(body) {
  const entries = []
  let buf = ''
  let key = null
  let depth = 0
  let quote = null

  function flushValue() {
    if (key != null) {
      entries.push([key, buf.trim()])
      key = null
      buf = ''
    }
  }

  for (let i = 0; i < body.length; i++) {
    const ch = body[i]
    const prev = body[i - 1]

    if (quote) {
      buf += ch
      if (ch === quote && prev !== '\\') quote = null
      continue
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch
      if (key != null) buf += ch
      else {
        let j = i + 1
        let k = ''
        while (j < body.length && body[j] !== ch) {
          k += body[j]
          j++
        }
        key = k
        i = j
      }
      continue
    }

    if (key == null) {
      if (/[A-Za-z_$]/.test(ch)) {
        let j = i
        let k = ''
        while (j < body.length && /[\w$]/.test(body[j])) {
          k += body[j]
          j++
        }
        key = k
        i = j - 1
      }
      continue
    }

    if (ch === ':' && depth === 0 && !buf.trim()) continue

    if (ch === '(' || ch === '{' || ch === '[') depth += 1
    else if (ch === ')' || ch === '}' || ch === ']') depth -= 1

    if (ch === ',' && depth === 0) {
      flushValue()
      continue
    }

    buf += ch
  }
  flushValue()
  return entries
}

function parseWithDefaults(vue) {
  const map = new Map()
  const idx = vue.search(/withDefaults\s*\(\s*defineProps/)
  if (idx < 0) return map

  const afterDefine = vue.indexOf('),', idx)
  if (afterDefine < 0) return map

  const braceStart = vue.indexOf('{', afterDefine)
  if (braceStart < 0) return map

  let depth = 0
  let end = braceStart
  for (let i = braceStart; i < vue.length; i++) {
    const ch = vue[i]
    if (ch === '{') depth += 1
    else if (ch === '}') {
      depth -= 1
      if (depth === 0) {
        end = i
        break
      }
    }
  }

  const body = vue.slice(braceStart + 1, end)
  for (const [key, raw] of splitObjectEntries(body)) {
    const cleaned = raw.replace(/\/\*\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '').trim()
    map.set(key, stringifyDefault(cleaned))
  }
  return map
}

function parseProps(body, jsDocs, defaults) {
  if (!body) return []
  const rows = []
  for (const raw of splitMembers(body)) {
    const member = raw.replace(/\s+/g, ' ').trim()
    if (/^\(/.test(member)) continue
    if (/^\[/.test(member)) continue
    const m = member.match(/^([A-Za-z_][\w]*)\s*(\?)?\s*:\s*(.+)$/)
    if (!m) continue
    const name = m[1]
    rows.push({
      name,
      optional: Boolean(m[2]),
      type: m[3].replace(/\s+/g, ' ').trim(),
      description: jsDocs.get(name) || '',
      default: defaults.has(name) ? defaults.get(name) : null
    })
  }
  return rows
}

function parseEmits(body, jsDocs) {
  if (!body) return []
  const rows = []
  const flat = stripBlockComments(body).replace(/\s+/g, ' ')
  const re = /\(\s*e:\s*['"]([\w:-]+)['"]\s*(?:,\s*([^)]*))?\)\s*:\s*void/g
  let m
  while ((m = re.exec(flat))) {
    if (!rows.some((r) => r.name === m[1])) {
      rows.push({
        name: m[1],
        payload: (m[2] || '').trim() || 'void',
        description: jsDocs.get(m[1]) || ''
      })
    }
  }
  const re2 = /['"]([\w:-]+)['"]\s*:\s*\[([^\]]*)\]/g
  while ((m = re2.exec(flat))) {
    if (!rows.some((r) => r.name === m[1])) {
      rows.push({
        name: m[1],
        payload: m[2].trim() || 'void',
        description: jsDocs.get(m[1]) || ''
      })
    }
  }
  return rows
}

function parseSlots(body, jsDocs) {
  if (!body) return []
  const rows = []
  for (const raw of splitMembers(body)) {
    const member = raw.replace(/\s+/g, ' ').trim()
    if (/^\[/.test(member)) {
      const idx = member.match(
        /^\[([^\]]+)\]\s*\??:\s*\(([^)]*)\)\s*(?:=>|:)\s*\S+/
      )
      if (idx) {
        rows.push({
          name: `[${idx[1]}]`,
          props: idx[2].trim() || '—',
          description: jsDocs.get(`[${idx[1]}]`) || 'index signature slot'
        })
      }
      continue
    }
    const fn =
      member.match(/^([A-Za-z_][\w]*)\s*\?\s*\(([^)]*)\)\s*:\s*\S+/) ||
      member.match(/^([A-Za-z_][\w]*)\s*\??:\s*\(([^)]*)\)\s*(?:=>|:)\s*\S+/)
    if (fn) {
      rows.push({
        name: fn[1],
        props: (fn[2] || '').trim() || '—',
        description: jsDocs.get(fn[1]) || ''
      })
      continue
    }
    const empty = member.match(/^([A-Za-z_][\w]*)\s*\??:\s*\(\)\s*(?:=>|:)\s*\S+/)
    if (empty) {
      rows.push({
        name: empty[1],
        props: '—',
        description: jsDocs.get(empty[1]) || ''
      })
    }
  }
  return rows
}

function parseExpose(body, jsDocs) {
  if (!body) return []
  const rows = []
  for (const raw of splitMembers(body)) {
    const member = raw.replace(/\s+/g, ' ').trim()
    if (/^\(/.test(member)) continue
    const m = member.match(/^([A-Za-z_][\w]*)\s*(\?)?\s*:\s*(.+)$/)
    if (!m) continue
    rows.push({
      name: m[1],
      type: m[3].replace(/\s+/g, ' ').trim(),
      description: jsDocs.get(m[1]) || ''
    })
  }
  return rows
}

function detectModels(types, vue) {
  const models = []
  if (/modelValue/.test(types) || /defineModel\s*\(/.test(vue)) {
    models.push({ name: 'modelValue', description: 'v-model' })
  }
  if (/\bselection\??:/.test(types) && /update:selection/.test(types)) {
    models.push({ name: 'selection', description: 'v-model:selection' })
  }
  const defineModels = [
    ...vue.matchAll(/defineModel\s*(?:<[^>]*>)?\s*\(\s*['"]([^'"]+)['"]/g)
  ]
  for (const m of defineModels) {
    if (!models.some((x) => x.name === m[1])) {
      models.push({ name: m[1], description: `defineModel('${m[1]}')` })
    }
  }
  return models
}

function extractOne(name) {
  const { types, vue, typesPath, vuePath } = readComp(name)
  const pkg = componentToPackage.get(name)
  const propsBody = extractInterfaceBody(types, `${name}Props`)
  const emitsBody = extractInterfaceBody(types, `${name}Emits`)
  const slotsBody = extractInterfaceBody(types, `${name}Slots`)
  const exposeBody = extractInterfaceBody(types, `${name}Expose`)

  const propsJsDocs = parseJsDocDescriptions(propsBody)
  const emitsJsDocs = parseJsDocDescriptions(emitsBody)
  const slotsJsDocs = parseJsDocDescriptions(slotsBody)
  const exposeJsDocs = parseJsDocDescriptions(exposeBody)

  const defaults = parseWithDefaults(vue)

  const props = parseProps(propsBody, propsJsDocs, defaults)
  const events = parseEmits(emitsBody, emitsJsDocs)
  const slots = parseSlots(slotsBody, slotsJsDocs)
  const expose = parseExpose(exposeBody, exposeJsDocs)
  const models = detectModels(types, vue)

  const publicTypes = [
    ...types.matchAll(/export\s+type\s+(\w+)/g),
    ...types.matchAll(/export\s+interface\s+(\w+)/g)
  ].map((m) => m[1])

  return {
    name,
    package: pkg,
    importPaths: resolveImportPaths(name),
    sourceHash: computeSourceHash(typesPath, vuePath),
    generatedAt: new Date().toISOString(),
    source: {
      types: `${componentDirRel(name)}/types.ts`,
      vue: Boolean(vue)
    },
    props,
    events,
    slots,
    expose,
    models,
    publicTypes: [...new Set(publicTypes)],
    completeness: {
      props: props.length > 0,
      emits: events.length > 0 || Boolean(emitsBody),
      slots: slots.length > 0 || Boolean(slotsBody),
      expose: expose.length > 0 || Boolean(exposeBody),
      models: models.length > 0
    }
  }
}

function main() {
  const args = process.argv.slice(2)
  const names = args.length ? args : allMappedComponentNames()
  mkdirSync(outDir, { recursive: true })
  const index = []
  for (const name of names) {
    try {
      const api = extractOne(name)
      writeFileSync(join(outDir, `${name}.json`), JSON.stringify(api, null, 2) + '\n')
      index.push({
        name,
        package: api.package,
        props: api.props.length,
        events: api.events.length,
        slots: api.slots.length,
        expose: api.expose.length,
        models: api.models.length,
        sourceHash: api.sourceHash
      })
    } catch (e) {
      index.push({ name, error: e.message })
    }
  }
  writeFileSync(
    join(outDir, 'index.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), components: index }, null, 2) +
      '\n'
  )
  console.log(`[extract-api] wrote ${index.length} → generated/component-api/`)
  for (const row of index.filter((r) =>
    ['Button', 'Select', 'DatePicker', 'Dialog', 'DataTable'].includes(r.name)
  )) {
    console.log(
      `  ${row.name}: props=${row.props} events=${row.events} slots=${row.slots} expose=${row.expose} models=${row.models}`
    )
  }
}

main()
