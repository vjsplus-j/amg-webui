import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = process.cwd()
const m = JSON.parse(readFileSync(join(root, 'example/component-maturity.json'), 'utf8'))
const reg = readFileSync(join(root, 'example/demos/registry.ts'), 'utf8')
const keys = [...reg.matchAll(/^\s{2}(\w+):\s*\{/gm)].map((x) => x[1])
const regSet = new Set(keys)
const demosDir = join(root, 'example/demos')
const folders = readdirSync(demosDir).filter((d) => existsSync(join(demosDir, d, 'index.vue')))
const names = Object.keys(m.components)

const noReg = names.filter((n) => !regSet.has(n))
const folderNoReg = folders.filter((f) => !regSet.has(f))
const regNoFolder = keys.filter((k) => !folders.includes(k))

const thin = []
const rich = []
for (const f of folders) {
  const vue = readFileSync(join(demosDir, f, 'index.vue'), 'utf8')
  const lines = vue.split(/\r?\n/).length
  const bare =
    /<[A-Z]\w+\s*\/>/.test(vue) &&
    !/:model-value|:items|:options|:columns|:rows|:node|:open|:visible|:src|:fields/.test(vue)
  if (lines < 55 || bare) thin.push({ name: f, lines, bare })
  else rich.push(f)
}

const shells = Object.entries(m.components)
  .filter(([, r]) => r.level === 'shell')
  .map(([n, r]) => `${n}:${r.score}`)

const lowBeta = Object.entries(m.components)
  .filter(([, r]) => r.level === 'beta' && r.score < 50)
  .sort((a, b) => a[1].score - b[1].score)
  .map(([n, r]) => `${n}:${r.score}`)

// locale duplicate keys
const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']
const localeDups = {}
for (const loc of locales) {
  const src = readFileSync(join(root, `packages/locale/${loc}/exampleDoc.ts`), 'utf8')
  const seen = new Map()
  const dups = []
  const re = /^\s*(['"])([^'"]+)\1:/gm
  let match
  while ((match = re.exec(src))) {
    const k = match[2]
    if (seen.has(k)) dups.push(k)
    else seen.set(k, 1)
  }
  localeDups[loc] = { keys: seen.size, dupCount: dups.length, dupSample: dups.slice(0, 8) }
}

// W0 checkboxes in plan
const plan = readFileSync(join(root, 'docs/COMPONENT_DEEPEN_PLAN.md'), 'utf8')
const unchecked = [...plan.matchAll(/^- \[ \] (.+)$/gm)].map((x) => x[1])

console.log(
  JSON.stringify(
    {
      maturity: m.summary,
      totalComponents: names.length,
      demoFolders: folders.length,
      registryKeys: keys.length,
      componentsMissingRegistry: noReg,
      foldersNotInRegistry: folderNoReg,
      registryMissingFolder: regNoFolder,
      thinDemoCount: thin.length,
      richDemoCount: rich.length,
      thinBareCount: thin.filter((t) => t.bare).length,
      thinSample: thin.slice(0, 30).map((t) => `${t.name}:${t.lines}${t.bare ? ':bare' : ''}`),
      shells,
      lowBetaCount: lowBeta.length,
      lowBetaSample: lowBeta.slice(0, 30),
      localeDups,
      planUnchecked: unchecked
    },
    null,
    2
  )
)
