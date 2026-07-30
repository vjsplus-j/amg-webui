import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const demosDir = join(process.cwd(), 'example/demos')
for (const name of readdirSync(demosDir)) {
  const p = join(demosDir, name, 'index.vue')
  if (!existsSync(p)) continue
  let t = readFileSync(p, 'utf8')
  if (!t.includes("import { computed } from 'vue'")) continue
  const body = t.replace(/import \{ computed \} from 'vue'/, '')
  if (/\bref\b/.test(body)) {
    t = t.replace("import { computed } from 'vue'", "import { computed, ref } from 'vue'")
    writeFileSync(p, t)
    console.log('restored ref', name)
  }
}
