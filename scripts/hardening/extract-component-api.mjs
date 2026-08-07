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
import { componentDirRel, allMappedComponentNames } from '../component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const outDir = join(root, 'generated/component-api')

function readComp(name) {
  const rel = componentDirRel(name)
  const abs = join(root, rel)
  const typesPath = join(abs, 'types.ts')
  const vuePath = existsSync(join(abs, 'index.vue'))
    ? join(abs, 'index.vue')
    : join(abs, `${name}.vue`)
  return {
    abs,
    types: existsSync(typesPath) ? readFileSync(typesPath, 'utf8') : '',
    vue: existsSync(vuePath) ? readFileSync(vuePath, 'utf8') : ''
  }
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
      // generics only — ignore arrow `=>`
      if (cleaned[i + 1] !== '=') angle += 1
    } else if (ch === '>') {
      if (prev !== '=') angle -= 1
    } else if (ch === '[') bracket += 1
    else if (ch === ']') bracket -= 1

    const top =
      paren === 0 && brace === 0 && angle === 0 && bracket === 0

    if (ch === ';' && top) {
      flush()
      continue
    }

    if ((ch === '\n' || ch === '\r') && top) {
      const piece = buf.trim()
      // Flush when buffer looks like a complete member (has `:`) and next non-ws starts a new member or EOF
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

function parseProps(body) {
  if (!body) return []
  const rows = []
  for (const raw of splitMembers(body)) {
    const member = raw.replace(/\s+/g, ' ').trim()
    // Skip call-signature emits: (e: 'x', …): void
    if (/^\(/.test(member)) continue
    // Skip index signatures
    if (/^\[/.test(member)) continue
    const m = member.match(/^([A-Za-z_][\w]*)\s*(\?)?\s*:\s*(.+)$/)
    if (!m) continue
    rows.push({
      name: m[1],
      optional: Boolean(m[2]),
      type: m[3].replace(/\s+/g, ' ').trim(),
      description: ''
    })
  }
  return rows
}

function parseEmits(body) {
  if (!body) return []
  const rows = []
  const flat = stripBlockComments(body).replace(/\s+/g, ' ')
  // (e: 'name', payload…): void   OR   (e: "name"): void
  const re =
    /\(\s*e:\s*['"]([\w:-]+)['"]\s*(?:,\s*([^)]*))?\)\s*:\s*void/g
  let m
  while ((m = re.exec(flat))) {
    if (!rows.some((r) => r.name === m[1])) {
      rows.push({
        name: m[1],
        payload: (m[2] || '').trim() || 'void',
        description: ''
      })
    }
  }
  // Record-style
  const re2 = /['"]([\w:-]+)['"]\s*:\s*\[([^\]]*)\]/g
  while ((m = re2.exec(flat))) {
    if (!rows.some((r) => r.name === m[1])) {
      rows.push({
        name: m[1],
        payload: m[2].trim() || 'void',
        description: ''
      })
    }
  }
  return rows
}

function parseSlots(body) {
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
          description: 'index signature slot'
        })
      }
      continue
    }
    // name?(props): Ret   OR   name?: (props) => Ret
    const fn =
      member.match(
        /^([A-Za-z_][\w]*)\s*\?\s*\(([^)]*)\)\s*:\s*\S+/
      ) ||
      member.match(
        /^([A-Za-z_][\w]*)\s*\??:\s*\(([^)]*)\)\s*(?:=>|:)\s*\S+/
      )
    if (fn) {
      rows.push({
        name: fn[1],
        props: (fn[2] || '').trim() || '—',
        description: ''
      })
      continue
    }
    const empty = member.match(
      /^([A-Za-z_][\w]*)\s*\??:\s*\(\)\s*(?:=>|:)\s*\S+/
    )
    if (empty) {
      rows.push({ name: empty[1], props: '—', description: '' })
    }
  }
  return rows
}

function parseExpose(body) {
  if (!body) return []
  return parseProps(body).map((r) => ({
    name: r.name,
    type: r.type,
    description: r.description
  }))
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
  const { types, vue } = readComp(name)
  const propsBody = extractInterfaceBody(types, `${name}Props`)
  const emitsBody = extractInterfaceBody(types, `${name}Emits`)
  const slotsBody = extractInterfaceBody(types, `${name}Slots`)
  const exposeBody = extractInterfaceBody(types, `${name}Expose`)

  const props = parseProps(propsBody)
  const events = parseEmits(emitsBody)
  const slots = parseSlots(slotsBody)
  const expose = parseExpose(exposeBody)
  const models = detectModels(types, vue)

  const publicTypes = [
    ...types.matchAll(/export\s+type\s+(\w+)/g),
    ...types.matchAll(/export\s+interface\s+(\w+)/g)
  ].map((m) => m[1])

  return {
    name,
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
        props: api.props.length,
        events: api.events.length,
        slots: api.slots.length,
        expose: api.expose.length,
        models: api.models.length
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
