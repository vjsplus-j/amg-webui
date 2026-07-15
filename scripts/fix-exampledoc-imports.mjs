import fs from 'node:fs'
import path from 'node:path'

const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']

for (const loc of locales) {
  const dir = path.join('packages', 'locale', loc)
  const kebab = path.join(dir, 'example-doc.ts')
  if (fs.existsSync(kebab)) fs.unlinkSync(kebab)

  const indexPath = path.join(dir, 'index.ts')
  let idx = fs.readFileSync(indexPath, 'utf8')
  idx = idx.replace(/import exampleDoc from '\.\/play-doc'\r?\n?/g, '')
  idx = idx.replace(/import exampleDoc from '\.\/exampleDoc'\r?\n?/g, '')
  if (!idx.includes("import exampleDoc from './exampleDoc'")) {
    idx = idx.replace(
      "import industry from './industry'",
      "import industry from './industry'\nimport exampleDoc from './exampleDoc'"
    )
  }
  if (!idx.includes('...exampleDoc')) {
    idx = idx.replace('  ...industry', '  ...industry,\n  ...exampleDoc')
  }
  // ensure closing has exampleDoc before }
  fs.writeFileSync(indexPath, idx)
  console.log(loc, 'ok')
}
