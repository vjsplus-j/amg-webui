/**
 * Inline defineEmits<XxxEmits>() for components that Vite SFC fails to resolve.
 * Targets the low-beta deepen set + Loading/Result.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const targets = [
  'Loading',
  'Result',
  'ProgressTip',
  'Countdown',
  'NoticeBar',
  'Descriptions',
  'Spacer',
  'Print',
  'PropPanel',
  'MenuBar',
  'FormLayout',
  'Container',
  'ColumnLayout',
  'CardGrid',
  'PieChart',
  'EmbedLayout',
  'CanvasNode',
  'CanvasIo',
  'CanvasLayer',
  'TablePrint',
  'OcrScan',
  'DragMaterial',
  'GbsRegisterForm',
  'GbsGatewayForm',
  'OnvifSearch'
]

const base = join(process.cwd(), 'packages/components/base')
let fixed = 0

for (const name of targets) {
  const vuePath = join(base, name, 'index.vue')
  if (!existsSync(vuePath)) continue
  let src = readFileSync(vuePath, 'utf8')
  const m = src.match(/defineEmits<(\w+Emits)>\(\)/)
  if (!m) continue
  const emitName = m[1]
  const typesPath = join(base, name, 'types.ts')
  if (!existsSync(typesPath)) continue
  const types = readFileSync(typesPath, 'utf8')
  const block = types.match(
    new RegExp(`export\\s+interface\\s+${emitName}\\s*\\{([\\s\\S]*?)\\n\\}`)
  )
  if (!block) {
    console.log('skip (no interface)', name)
    continue
  }
  const body = block[1].trim()
  // Remove type import of Emits
  src = src.replace(
    new RegExp(`import\\s+type\\s*\\{([^}]*)\\}\\s*from\\s*['"]\\.\\/types['"]`),
    (_all, inner) => {
      const parts = inner
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((p) => p !== emitName)
      if (!parts.length) return ''
      return `import type { ${parts.join(', ')} } from './types'`
    }
  )
  src = src.replace(
    `defineEmits<${emitName}>()`,
    `defineEmits<{\n  ${body}\n}>()`
  )
  writeFileSync(vuePath, src, 'utf8')
  fixed++
  console.log('fixed', name)
}

console.log(JSON.stringify({ fixed }, null, 2))
