import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const locales = {
  'zh-CN': {
    fallbackTitle: '示例标题',
    fallbackBody: '示例内容，用于非 curated 探针挂载。',
    titleSuccess: '成功',
    titleDanger: '删除',
    titleInfo: '信息',
    titleWarning: '确认'
  },
  'zh-TW': {
    fallbackTitle: '範例標題',
    fallbackBody: '範例內容，用於非 curated 探針掛載。',
    titleSuccess: '成功',
    titleDanger: '刪除',
    titleInfo: '資訊',
    titleWarning: '確認'
  },
  'en-US': {
    fallbackTitle: 'Sample title',
    fallbackBody: 'Sample body for non-curated mount probe.',
    titleSuccess: 'Success',
    titleDanger: 'Delete',
    titleInfo: 'Information',
    titleWarning: 'Confirm'
  },
  'ja-JP': {
    fallbackTitle: 'サンプルタイトル',
    fallbackBody: '非curatedマウント用のサンプル本文。',
    titleSuccess: '成功',
    titleDanger: '削除',
    titleInfo: '情報',
    titleWarning: '確認'
  },
  'ko-KR': {
    fallbackTitle: '샘플 제목',
    fallbackBody: '非 curated 마운트용 샘플 본문.',
    titleSuccess: '성공',
    titleDanger: '삭제',
    titleInfo: '정보',
    titleWarning: '확인'
  },
  'ko-KP': {
    fallbackTitle: '샘플 제목',
    fallbackBody: '非 curated 마운트용 샘플 본문.',
    titleSuccess: '성공',
    titleDanger: '삭제',
    titleInfo: '정보',
    titleWarning: '확인'
  },
  'ru-RU': {
    fallbackTitle: 'Пример заголовка',
    fallbackBody: 'Пример текста для некurated mount.',
    titleSuccess: 'Успех',
    titleDanger: 'Удалить',
    titleInfo: 'Информация',
    titleWarning: 'Подтверждение'
  }
}

for (const [loc, t] of Object.entries(locales)) {
  const file = path.join(root, 'packages/locale', loc, 'exampleDoc.ts')
  let content = fs.readFileSync(file, 'utf8')
  if (content.includes('example.doc.fallback.sampleTitle')) {
    console.log('skip', loc)
    continue
  }
  const lines = [
    ['example.doc.fallback.sampleTitle', t.fallbackTitle],
    ['example.doc.fallback.sampleBody', t.fallbackBody],
    ['example.doc.confirmDialog.sample.titleSuccess', t.titleSuccess],
    ['example.doc.confirmDialog.sample.titleDanger', t.titleDanger],
    ['example.doc.confirmDialog.sample.titleInfo', t.titleInfo],
    ['example.doc.confirmDialog.sample.titleWarning', t.titleWarning]
  ]
    .map(([k, v]) => `  "${k}": ${JSON.stringify(v)},`)
    .join('\n')
  content = content.replace(/\n}\s*$/, `\n${lines}\n}\n`)
  fs.writeFileSync(file, content)
  console.log('patched', loc)
}
