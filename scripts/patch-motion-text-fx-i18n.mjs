/**
 * Add blink / breathe / glow motion + Typography FX keys to all exampleDoc packs.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const packs = {
  'zh-CN': {
    desc: '库级底层特性：spin / bounce / heartbeat / blink / pulse / breathe / glow（`useMotion` + `vp-motion--*`）。Avatar、Button、Tag、Icon、Typography 整机可用；Badge 角标支持共享动效（`pulse` 仍为角标呼吸环）。互斥优先级 spin > bounce > heartbeat > blink > pulse > breathe > glow。',
    blink: '锐利闪烁（频闪）动画',
    breathe: '呼吸灯动画（透明度 + 柔光）',
    glow: '荧光发光动画（text-shadow）',
    motionBlink: '闪烁 blink',
    motionBreathe: '呼吸灯 breathe',
    motionGlow: '荧光 glow',
    fx: '文字特效',
    fxDesc: '库级底层动效：blink 频闪、breathe 呼吸灯、glow 荧光。可与语义色组合。',
    propMotion: '共享 Motion：spin / pulse / heartbeat / bounce / blink / breathe / glow',
    sampleBlink: '闪烁提示',
    sampleBreathe: '呼吸灯状态',
    sampleGlow: '荧光标题',
    sampleMotion: 'AMG Typography Motion'
  },
  'zh-TW': {
    desc: '庫級底層特性：spin / bounce / heartbeat / blink / pulse / breathe / glow（`useMotion` + `vp-motion--*`）。Avatar、Button、Tag、Icon、Typography 整機可用；Badge 角標支援共享動效（`pulse` 仍為角標呼吸環）。互斥優先級 spin > bounce > heartbeat > blink > pulse > breathe > glow。',
    blink: '銳利閃爍（頻閃）動畫',
    breathe: '呼吸燈動畫（透明度 + 柔光）',
    glow: '螢光發光動畫（text-shadow）',
    motionBlink: '閃爍 blink',
    motionBreathe: '呼吸燈 breathe',
    motionGlow: '螢光 glow',
    fx: '文字特效',
    fxDesc: '庫級底層動效：blink 頻閃、breathe 呼吸燈、glow 螢光。可與語義色組合。',
    propMotion: '共享 Motion：spin / pulse / heartbeat / bounce / blink / breathe / glow',
    sampleBlink: '閃爍提示',
    sampleBreathe: '呼吸燈狀態',
    sampleGlow: '螢光標題',
    sampleMotion: 'AMG Typography Motion'
  },
  'en-US': {
    desc: 'Library-wide host motion: spin / bounce / heartbeat / blink / pulse / breathe / glow via `useMotion` + `vp-motion--*`. Works on Avatar, Button, Tag, Icon, Typography. Badge mark supports shared motion (`pulse` stays the ring). Priority: spin > bounce > heartbeat > blink > pulse > breathe > glow.',
    blink: 'Sharp strobe / flash',
    breathe: 'Breathing light (opacity + soft glow)',
    glow: 'Fluorescent text-shadow glow',
    motionBlink: 'Blink',
    motionBreathe: 'Breathe',
    motionGlow: 'Glow',
    fx: 'Text effects',
    fxDesc: 'Library motion: blink strobe, breathe light, glow neon. Pair with semantic colors.',
    propMotion: 'Shared Motion: spin / pulse / heartbeat / bounce / blink / breathe / glow',
    sampleBlink: 'Blinking tip',
    sampleBreathe: 'Breathing status',
    sampleGlow: 'Neon heading',
    sampleMotion: 'AMG Typography Motion'
  },
  'ja-JP': {
    desc: 'ライブラリ共通ホスト動效：spin / bounce / heartbeat / blink / pulse / breathe / glow（`useMotion` + `vp-motion--*`）。Avatar / Button / Tag / Icon / Typography で利用可能。Badge は共有動效（`pulse` はリング）。優先度：spin > bounce > heartbeat > blink > pulse > breathe > glow。',
    blink: '鋭い点滅（ストロボ）',
    breathe: '呼吸ランプ（透明度 + 柔光）',
    glow: '蛍光グロー（text-shadow）',
    motionBlink: '点滅 blink',
    motionBreathe: '呼吸 breathe',
    motionGlow: '蛍光 glow',
    fx: 'テキストエフェクト',
    fxDesc: '共通動效：blink 点滅、breathe 呼吸、glow 蛍光。セマンティック色と併用可能。',
    propMotion: '共有 Motion：spin / pulse / heartbeat / bounce / blink / breathe / glow',
    sampleBlink: '点滅ヒント',
    sampleBreathe: '呼吸ステータス',
    sampleGlow: '蛍光見出し',
    sampleMotion: 'AMG Typography Motion'
  },
  'ko-KR': {
    desc: '라이브러리 공통 호스트 모션: spin / bounce / heartbeat / blink / pulse / breathe / glow (`useMotion` + `vp-motion--*`). Avatar·Button·Tag·Icon·Typography에 사용. Badge는 공유 모션(`pulse`는 링). 우선순위: spin > bounce > heartbeat > blink > pulse > breathe > glow.',
    blink: '강한 깜빡임(스트로브)',
    breathe: '호흡등(투명도 + 소프트 글로우)',
    glow: '형광 글로우(text-shadow)',
    motionBlink: '깜빡임 blink',
    motionBreathe: '호흡등 breathe',
    motionGlow: '형광 glow',
    fx: '텍스트 효과',
    fxDesc: '공통 모션: blink 깜빡임, breathe 호흡등, glow 형광. 시맨틱 색과 함께 사용.',
    propMotion: '공유 Motion: spin / pulse / heartbeat / bounce / blink / breathe / glow',
    sampleBlink: '깜빡임 팁',
    sampleBreathe: '호흡등 상태',
    sampleGlow: '형광 제목',
    sampleMotion: 'AMG Typography Motion'
  },
  'ko-KP': {
    desc: '서고 공통 호스트 모션: spin / bounce / heartbeat / blink / pulse / breathe / glow (`useMotion` + `vp-motion--*`). Avatar·Button·Tag·Icon·Typography에 사용. Badge는 공유 모션(`pulse`는 링). 우선순위: spin > bounce > heartbeat > blink > pulse > breathe > glow.',
    blink: '강한 깜박임(스트로브)',
    breathe: '호흡등(투명도 + 소프트 글로우)',
    glow: '형광 글로우(text-shadow)',
    motionBlink: '깜박임 blink',
    motionBreathe: '호흡등 breathe',
    motionGlow: '형광 glow',
    fx: '본문 효과',
    fxDesc: '공통 모션: blink 깜박임, breathe 호흡등, glow 형광. 의미색과 함께 사용.',
    propMotion: '공유 Motion: spin / pulse / heartbeat / bounce / blink / breathe / glow',
    sampleBlink: '깜박임 알림',
    sampleBreathe: '호흡등 상태',
    sampleGlow: '형광 제목',
    sampleMotion: 'AMG Typography Motion'
  },
  'ru-RU': {
    desc: 'Общие эффекты хоста: spin / bounce / heartbeat / blink / pulse / breathe / glow (`useMotion` + `vp-motion--*`). Avatar, Button, Tag, Icon, Typography. У Badge — общая анимация (`pulse` остаётся кольцом). Приоритет: spin > bounce > heartbeat > blink > pulse > breathe > glow.',
    blink: 'Резкое мигание (строб)',
    breathe: 'Дыхание (opacity + мягкое свечение)',
    glow: 'Неоновое свечение (text-shadow)',
    motionBlink: 'Мигание blink',
    motionBreathe: 'Дыхание breathe',
    motionGlow: 'Свечение glow',
    fx: 'Текстовые эффекты',
    fxDesc: 'Общие эффекты: blink стробоскоп, breathe дыхание, glow неон. Сочетаются с семантическими цветами.',
    propMotion: 'Общий Motion: spin / pulse / heartbeat / bounce / blink / breathe / glow',
    sampleBlink: 'Мигающая подсказка',
    sampleBreathe: 'Статус дыхания',
    sampleGlow: 'Неоновый заголовок',
    sampleMotion: 'AMG Typography Motion'
  }
}

function upsert(src, key, value) {
  const line = `  "${key}": ${JSON.stringify(value)},\n`
  const re = new RegExp(`  "${key.replace(/\./g, '\\.')}": "[^"]*",\\n`)
  if (re.test(src)) return src.replace(re, line)
  const anchor = '  "example.doc.overview'
  if (src.includes(anchor)) {
    return src.replace(anchor, `${line}${anchor}`)
  }
  return src.replace(/\n\}\s*$/, `\n${line}}\n`)
}

for (const [loc, p] of Object.entries(packs)) {
  const file = path.join(root, 'packages/locale', loc, 'exampleDoc.ts')
  let s = fs.readFileSync(file, 'utf8')
  s = upsert(s, 'example.doc.motion.demo.desc', p.desc)
  s = upsert(s, 'example.doc.motion.prop.blink', p.blink)
  s = upsert(s, 'example.doc.motion.prop.breathe', p.breathe)
  s = upsert(s, 'example.doc.motion.prop.glow', p.glow)
  s = upsert(s, 'example.doc.icon.demo.motionBlink', p.motionBlink)
  s = upsert(s, 'example.doc.icon.demo.motionBreathe', p.motionBreathe)
  s = upsert(s, 'example.doc.icon.demo.motionGlow', p.motionGlow)
  s = upsert(s, 'example.doc.typography.demo.fx', p.fx)
  s = upsert(s, 'example.doc.typography.demo.fxDesc', p.fxDesc)
  s = upsert(s, 'example.doc.typography.prop.motion', p.propMotion)
  s = upsert(s, 'example.doc.typography.sample.blink', p.sampleBlink)
  s = upsert(s, 'example.doc.typography.sample.breathe', p.sampleBreathe)
  s = upsert(s, 'example.doc.typography.sample.glow', p.sampleGlow)
  s = upsert(s, 'example.doc.typography.sample.motion', p.sampleMotion)
  fs.writeFileSync(file, s)
  console.log('patched', loc)
}
