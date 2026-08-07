import { readFileSync, writeFileSync } from 'node:fs'

const keys = [
  'page.intro.quickStart.tocPrerequisites',
  'page.intro.quickStart.tocInstall',
  'page.intro.quickStart.prereqTs',
  'page.intro.quickStart.installLead',
  'page.intro.installation.pkgCoreTitle',
  'page.intro.installation.pkgCoreDesc',
  'page.intro.installation.pkgFormTitle',
  'page.intro.installation.pkgFormDesc',
  'page.intro.installation.pkgDataTitle',
  'page.intro.installation.pkgDataDesc',
  'page.intro.installation.pkgOverlayTitle',
  'page.intro.installation.pkgOverlayDesc',
  'page.intro.installation.pkgThemeTitle',
  'page.intro.installation.pkgThemeDesc',
  'page.intro.installation.pkgDomainTitle',
  'page.intro.installation.pkgDomainDesc'
]

const enSrc = readFileSync('packages/locale/en-US/page.ts', 'utf8')
const values = {}
for (const k of keys) {
  const m = enSrc.match(new RegExp(`'${k.replace(/\./g, '\\.')}'\\s*:\\s*'((?:\\\\'|[^'])*)'`))
  if (!m) throw new Error(`missing in en-US: ${k}`)
  values[k] = m[1]
}

const locales = ['zh-HK', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU', 'ar-SA', 'hi-IN', 'ug-CN']
for (const loc of locales) {
  const file = `packages/locale/${loc}/page.ts`
  let s = readFileSync(file, 'utf8')
  for (const [k, v] of Object.entries(values)) {
    const line = `  '${k}': '${v}',`
    const re = new RegExp(`^\\s*'${k.replace(/\./g, '\\.')}'\\s*:\\s*'[^']*',?\\s*$`, 'm')
    if (re.test(s)) s = s.replace(re, line)
    else s = s.replace(/\n\}\s*$/, `\n${line}\n}\n`)
  }
  writeFileSync(file, s)
  console.log('synced', loc)
}
