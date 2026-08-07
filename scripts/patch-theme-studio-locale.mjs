import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const block = `
  'page.lab.themeStudio.title': 'Lab · Theme Studio',
  'page.lab.themeStudio.lead': 'Visual theme token editor with live preview and CSS / JSON / theme.ts / SCSS export.',

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
  'theme.studio.preview.cardBody': 'Surface, border and shadow respond to token edits in real time.',
  'theme.studio.preview.inputPlaceholder': 'Input preview',
  'theme.studio.preview.alertSuccess': 'Success alert',
  'theme.studio.preview.alertWarning': 'Warning alert',
  'theme.studio.preview.switch': 'Switch',
  'theme.studio.preview.checkbox': 'Checkbox',
  'theme.studio.preview.radioA': 'Option A',
  'theme.studio.preview.radioB': 'Option B',
  'theme.studio.preview.badge': 'Notifications',
`

const locales = ['ar-SA', 'hi-IN', 'ja-JP', 'ko-KP', 'ko-KR', 'ru-RU', 'ug-CN', 'zh-HK']

for (const loc of locales) {
  const file = join('packages/locale', loc, 'page.ts')
  let src = readFileSync(file, 'utf8')
  if (src.includes('page.lab.themeStudio.title')) {
    console.log('skip', loc)
    continue
  }
  const marker = "'page.lab.lowcodeStudio.lead':"
  const idx = src.indexOf(marker)
  if (idx === -1) {
    console.log('no marker', loc)
    continue
  }
  const lineEnd = src.indexOf('\n', idx)
  src = src.slice(0, lineEnd + 1) + block + src.slice(lineEnd + 1)
  writeFileSync(file, src)
  console.log('patched', loc)
}
