/**
 * Add shared motion i18n keys to all locale exampleDoc packs.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const packs = {
  'zh-CN': {
    title: '共享动效 Motion',
    desc: '库级底层特性：spin / pulse / heartbeat / bounce（`useMotion` + `vp-motion--*`）。Avatar、Button、Tag、Icon 整机可用；Badge 角标支持 spin / heartbeat / bounce（`pulse` 仍为角标呼吸环）。互斥优先级 spin > bounce > heartbeat > pulse。',
    spin: '持续旋转动画（共享 vp-motion）',
    pulse: '透明度闪烁动画（共享 vp-motion；Badge 的 pulse 仍为角标呼吸环）',
    heartbeat: '心跳缩放动画（放大缩小）',
    bounce: '原地向上跳动动画',
    duration: '动画时长（毫秒或 CSS 时间）',
    badgeMotion: '角标共享动效'
  },
  'zh-TW': {
    title: '共享動效 Motion',
    desc: '庫級底層特性：spin / pulse / heartbeat / bounce（`useMotion` + `vp-motion--*`）。Avatar、Button、Tag、Icon 整機可用；Badge 角標支援 spin / heartbeat / bounce（`pulse` 仍為角標呼吸環）。互斥優先級 spin > bounce > heartbeat > pulse。',
    spin: '持續旋轉動畫（共享 vp-motion）',
    pulse: '透明度閃爍動畫（共享 vp-motion；Badge 的 pulse 仍為角標呼吸環）',
    heartbeat: '心跳縮放動畫（放大縮小）',
    bounce: '原地向上跳動動畫',
    duration: '動畫時長（毫秒或 CSS 時間）',
    badgeMotion: '角標共享動效'
  },
  'en-US': {
    title: 'Shared motion',
    desc: 'Library-wide host motion: spin / pulse / heartbeat / bounce via `useMotion` + `vp-motion--*`. Works on Avatar, Button, Tag, Icon hosts. Badge mark supports spin / heartbeat / bounce (`pulse` stays the ring reminder). Priority: spin > bounce > heartbeat > pulse.',
    spin: 'Continuous rotate (shared vp-motion)',
    pulse: 'Opacity blink (shared); Badge `pulse` is still the ring effect',
    heartbeat: 'Scale heartbeat',
    bounce: 'Bounce upward in place',
    duration: 'Animation duration (ms or CSS time)',
    badgeMotion: 'Badge shared motion'
  },
  'ja-JP': {
    title: '共有モーション',
    desc: 'ライブラリ共通のホスト動效：spin / pulse / heartbeat / bounce（`useMotion` + `vp-motion--*`）。Avatar / Button / Tag / Icon で利用可能。Badge は spin / heartbeat / bounce（`pulse` は角バッジリング）。優先度：spin > bounce > heartbeat > pulse。',
    spin: '連続回転（共有 vp-motion）',
    pulse: '透過点滅（共有；Badge の pulse はリング）',
    heartbeat: '拡大縮小ハートビート',
    bounce: 'その場で上に跳ねる',
    duration: 'アニメ時間（ms または CSS）',
    badgeMotion: 'バッジ共有モーション'
  },
  'ko-KR': {
    title: '공유 모션',
    desc: '라이브러리 공통 호스트 모션: spin / pulse / heartbeat / bounce (`useMotion` + `vp-motion--*`). Avatar·Button·Tag·Icon에 사용. Badge는 spin/heartbeat/bounce (`pulse`는 링). 우선순위: spin > bounce > heartbeat > pulse.',
    spin: '연속 회전 (공유 vp-motion)',
    pulse: '투명 깜빡임 (공유; Badge pulse는 링)',
    heartbeat: '확대·축소 하트비트',
    bounce: '제자리 위로 점프',
    duration: '애니메이션 시간(ms 또는 CSS)',
    badgeMotion: 'Badge 공유 모션'
  },
  'ko-KP': {
    title: '공유 모션',
    desc: '서고 공통 호스트 모션: spin / pulse / heartbeat / bounce (`useMotion` + `vp-motion--*`). Avatar·Button·Tag·Icon에 사용. Badge는 spin/heartbeat/bounce (`pulse`는 링). 우선순위: spin > bounce > heartbeat > pulse.',
    spin: '련속 회전 (공유 vp-motion)',
    pulse: '투명 깜박임 (공유; Badge pulse는 링)',
    heartbeat: '확대·축소 하트비트',
    bounce: '제자리 우로 뛰기',
    duration: '동영상 시간(ms 또는 CSS)',
    badgeMotion: 'Badge 공유 모션'
  },
  'ru-RU': {
    title: 'Общая анимация Motion',
    desc: 'Общие эффекты хоста: spin / pulse / heartbeat / bounce (`useMotion` + `vp-motion--*`). Avatar, Button, Tag, Icon. У Badge — spin / heartbeat / bounce (`pulse` остаётся кольцом). Приоритет: spin > bounce > heartbeat > pulse.',
    spin: 'Непрерывное вращение (общий vp-motion)',
    pulse: 'Мигание opacity (общее; pulse у Badge — кольцо)',
    heartbeat: 'Масштаб heartbeat',
    bounce: 'Подпрыгивание на месте',
    duration: 'Длительность (мс или CSS)',
    badgeMotion: 'Общая анимация Badge'
  }
}

function upsert(src, key, value) {
  const line = `  "${key}": ${JSON.stringify(value)},\n`
  const re = new RegExp(`  "${key.replace(/\./g, '\\.')}": "[^"]*",\\n`)
  if (re.test(src)) return src.replace(re, line)
  // insert before example.doc.overview if present, else before last }
  const anchor = '  "example.doc.overview'
  if (src.includes(anchor)) {
    return src.replace(anchor, `${line}${anchor}`)
  }
  return src.replace(/\n\}\s*$/, `\n${line}}\n`)
}

for (const [loc, p] of Object.entries(packs)) {
  const file = path.join(root, 'packages/locale', loc, 'exampleDoc.ts')
  let s = fs.readFileSync(file, 'utf8')
  s = upsert(s, 'example.doc.motion.demo.title', p.title)
  s = upsert(s, 'example.doc.motion.demo.desc', p.desc)
  s = upsert(s, 'example.doc.motion.prop.spin', p.spin)
  s = upsert(s, 'example.doc.motion.prop.pulse', p.pulse)
  s = upsert(s, 'example.doc.motion.prop.heartbeat', p.heartbeat)
  s = upsert(s, 'example.doc.motion.prop.bounce', p.bounce)
  s = upsert(s, 'example.doc.motion.prop.animationDuration', p.duration)
  s = upsert(s, 'example.doc.motion.demo.badge', p.badgeMotion)
  fs.writeFileSync(file, s)
  console.log('patched', loc)
}
