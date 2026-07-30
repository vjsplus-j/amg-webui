import { readFileSync, writeFileSync } from 'fs'

const en =
  'Toggle auto/fixed, single/multi select, track, gap, equal height; selected = top accent rail + soft elevation, no fill wash.'

for (const locale of ['ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']) {
  const file = `packages/locale/${locale}/exampleDoc.ts`
  let text = readFileSync(file, 'utf8')
  text = text.replace(
    /"example\.doc\.cardGrid\.demo\.basicDesc":\s*"[^"]*"/,
    `"example.doc.cardGrid.demo.basicDesc": ${JSON.stringify(en)}`
  )
  writeFileSync(file, text, 'utf8')
  console.log('patched', locale)
}
