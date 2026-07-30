import { readFileSync, writeFileSync } from 'node:fs'

const keys = {
  'zh-CN': { info: '信息', success: '成功', warning: '警告', danger: '危险' },
  'zh-TW': { info: '資訊', success: '成功', warning: '警告', danger: '危險' },
  'en-US': { info: 'Info', success: 'Success', warning: 'Warning', danger: 'Danger' },
  'ja-JP': { info: '情報', success: '成功', warning: '警告', danger: '危険' },
  'ko-KR': { info: '정보', success: '성공', warning: '경고', danger: '위험' },
  'ko-KP': { info: '정보', success: '성공', warning: '경고', danger: '위험' },
  'ru-RU': { info: 'Инфо', success: 'Успех', warning: 'Предупреждение', danger: 'Ошибка' }
}

for (const [loc, c] of Object.entries(keys)) {
  const p = `packages/locale/${loc}/exampleDoc.ts`
  let s = readFileSync(p, 'utf8')
  if (s.includes('example.doc.severity.info')) {
    console.log('skip', loc)
    continue
  }
  const block = [
    `  'example.doc.severity.info': ${JSON.stringify(c.info)},`,
    `  'example.doc.severity.success': ${JSON.stringify(c.success)},`,
    `  'example.doc.severity.warning': ${JSON.stringify(c.warning)},`,
    `  'example.doc.severity.danger': ${JSON.stringify(c.danger)},`
  ].join('\n')
  s = s.replace(/\n\}\s*$/, `\n${block}\n}\n`)
  writeFileSync(p, s)
  console.log('ok', loc)
}
