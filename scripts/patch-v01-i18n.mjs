import { readFileSync, writeFileSync } from 'node:fs'

const packs = {
  'zh-CN': {
    filter: 'v0.1 子集',
    badge: 'v0.1',
    hint: '首发承诺 {count} 个组件（精选 Demo）'
  },
  'zh-TW': {
    filter: 'v0.1 子集',
    badge: 'v0.1',
    hint: '首發承諾 {count} 個元件（精選 Demo）'
  },
  'en-US': {
    filter: 'v0.1 subset',
    badge: 'v0.1',
    hint: '{count} components in the first release contract'
  },
  'ja-JP': {
    filter: 'v0.1 サブセット',
    badge: 'v0.1',
    hint: '初回公開 {count} コンポーネント（精選デモ）'
  },
  'ko-KR': {
    filter: 'v0.1 하위집합',
    badge: 'v0.1',
    hint: '첫 공개 {count}개 컴포넌트（精選 데모）'
  },
  'ko-KP': {
    filter: 'v0.1 하위집합',
    badge: 'v0.1',
    hint: '첫 공개 {count}개 콤포넌트（精選 데모）'
  },
  'ru-RU': {
    filter: 'Подмножество v0.1',
    badge: 'v0.1',
    hint: '{count} компонентов в контракте первого релиза'
  }
}

for (const [loc, c] of Object.entries(packs)) {
  const p = `packages/locale/${loc}/page.ts`
  let s = readFileSync(p, 'utf8')
  if (s.includes('page.gallery.v01.filter')) {
    console.log('skip', loc)
    continue
  }
  const block = [
    `  'page.gallery.v01.filter': ${JSON.stringify(c.filter)},`,
    `  'page.gallery.v01.badge': ${JSON.stringify(c.badge)},`,
    `  'page.gallery.v01.hint': ${JSON.stringify(c.hint)},`
  ].join('\n')
  s = s.replace(/\n\}\s*$/, `\n${block}\n}\n`)
  writeFileSync(p, s)
  console.log('patched', loc)
}
