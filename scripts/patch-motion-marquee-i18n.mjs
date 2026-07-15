/**
 * i18n for marquee / scroll / dampOut motion kinds.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const packs = {
  'zh-CN': {
    desc: '库级底层特性：spin / bounce / heartbeat / marqueeLeft|Right / scrollUp|Down / dampOut / blink / pulse / breathe / glow（`useMotion` + `vp-motion--*`）。Avatar、Button、Tag、Icon、Typography 整机可用。互斥优先级 spin > bounce > heartbeat > marqueeLeft > marqueeRight > scrollUp > scrollDown > dampOut > blink > pulse > breathe > glow。',
    marquee: '向左 / 向右跑马灯',
    scroll: '向上 / 向下滚动',
    dampOut: '阻尼放大再缩小后消失（单次）',
    marqueeLeft: '向左跑马灯',
    marqueeRight: '向右跑马灯',
    scrollUp: '向上滚动',
    scrollDown: '向下滚动',
    motionDampOut: '阻尼消失 dampOut',
    motionMarqueeLeft: '向左跑马灯',
    motionMarqueeRight: '向右跑马灯',
    motionScrollUp: '向上滚动',
    motionScrollDown: '向下滚动',
    fxDesc:
      '库级底层动效：blink / breathe / glow；marqueeLeft|Right 跑马灯；scrollUp|Down 纵向滚动；dampOut 阻尼放大后消失。',
    propMotion:
      '共享 Motion：spin / pulse / heartbeat / bounce / blink / breathe / glow / marqueeLeft|Right / scrollUp|Down / dampOut',
    sampleMarqueeLeft: '向左跑马灯 · AMG-WebUI Typography Marquee',
    sampleMarqueeRight: '向右跑马灯 · AMG-WebUI Typography Marquee',
    sampleScrollUp: '向上滚动',
    sampleScrollDown: '向下滚动',
    sampleDampOut: '阻尼消失'
  },
  'zh-TW': {
    desc: '庫級底層特性：spin / bounce / heartbeat / marqueeLeft|Right / scrollUp|Down / dampOut / blink / pulse / breathe / glow（`useMotion` + `vp-motion--*`）。Avatar、Button、Tag、Icon、Typography 整機可用。互斥優先級 spin > bounce > heartbeat > marqueeLeft > marqueeRight > scrollUp > scrollDown > dampOut > blink > pulse > breathe > glow。',
    marquee: '向左 / 向右跑馬燈',
    scroll: '向上 / 向下滾動',
    dampOut: '阻尼放大再縮小後消失（單次）',
    marqueeLeft: '向左跑馬燈',
    marqueeRight: '向右跑馬燈',
    scrollUp: '向上滾動',
    scrollDown: '向下滾動',
    motionDampOut: '阻尼消失 dampOut',
    motionMarqueeLeft: '向左跑馬燈',
    motionMarqueeRight: '向右跑馬燈',
    motionScrollUp: '向上滾動',
    motionScrollDown: '向下滾動',
    fxDesc:
      '庫級底層動效：blink / breathe / glow；marqueeLeft|Right 跑馬燈；scrollUp|Down 縱向滾動；dampOut 阻尼放大後消失。',
    propMotion:
      '共享 Motion：spin / pulse / heartbeat / bounce / blink / breathe / glow / marqueeLeft|Right / scrollUp|Down / dampOut',
    sampleMarqueeLeft: '向左跑馬燈 · AMG-WebUI Typography Marquee',
    sampleMarqueeRight: '向右跑馬燈 · AMG-WebUI Typography Marquee',
    sampleScrollUp: '向上滾動',
    sampleScrollDown: '向下滾動',
    sampleDampOut: '阻尼消失'
  },
  'en-US': {
    desc: 'Library-wide host motion: spin / bounce / heartbeat / marqueeLeft|Right / scrollUp|Down / dampOut / blink / pulse / breathe / glow via `useMotion` + `vp-motion--*`. Priority: spin > bounce > heartbeat > marqueeLeft > marqueeRight > scrollUp > scrollDown > dampOut > blink > pulse > breathe > glow.',
    marquee: 'Marquee left / right',
    scroll: 'Scroll up / down',
    dampOut: 'Damped zoom then fade out (one-shot)',
    marqueeLeft: 'Marquee left',
    marqueeRight: 'Marquee right',
    scrollUp: 'Scroll up',
    scrollDown: 'Scroll down',
    motionDampOut: 'Damp out',
    motionMarqueeLeft: 'Marquee left',
    motionMarqueeRight: 'Marquee right',
    motionScrollUp: 'Scroll up',
    motionScrollDown: 'Scroll down',
    fxDesc:
      'Library motion: blink / breathe / glow; marqueeLeft|Right; scrollUp|Down; dampOut (damped zoom then vanish).',
    propMotion:
      'Shared Motion: spin / pulse / heartbeat / bounce / blink / breathe / glow / marqueeLeft|Right / scrollUp|Down / dampOut',
    sampleMarqueeLeft: 'Marquee left · AMG-WebUI Typography',
    sampleMarqueeRight: 'Marquee right · AMG-WebUI Typography',
    sampleScrollUp: 'Scroll up',
    sampleScrollDown: 'Scroll down',
    sampleDampOut: 'Damp out'
  },
  'ja-JP': {
    desc: 'ライブラリ共通ホスト動效：spin / bounce / heartbeat / marqueeLeft|Right / scrollUp|Down / dampOut / blink / pulse / breathe / glow。優先度：spin > bounce > heartbeat > marqueeLeft > marqueeRight > scrollUp > scrollDown > dampOut > blink > pulse > breathe > glow。',
    marquee: '左 / 右マーキー',
    scroll: '上 / 下スクロール',
    dampOut: '減衰ズーム後に消失（1回）',
    marqueeLeft: '左マーキー',
    marqueeRight: '右マーキー',
    scrollUp: '上スクロール',
    scrollDown: '下スクロール',
    motionDampOut: '減衰消失 dampOut',
    motionMarqueeLeft: '左マーキー',
    motionMarqueeRight: '右マーキー',
    motionScrollUp: '上スクロール',
    motionScrollDown: '下スクロール',
    fxDesc:
      '共通動效：blink / breathe / glow、marquee、scroll、dampOut（減衰ズーム後消失）。',
    propMotion:
      '共有 Motion：spin / pulse / heartbeat / bounce / blink / breathe / glow / marqueeLeft|Right / scrollUp|Down / dampOut',
    sampleMarqueeLeft: '左マーキー · AMG-WebUI',
    sampleMarqueeRight: '右マーキー · AMG-WebUI',
    sampleScrollUp: '上スクロール',
    sampleScrollDown: '下スクロール',
    sampleDampOut: '減衰消失'
  },
  'ko-KR': {
    desc: '라이브러리 공통 호스트 모션: spin / bounce / heartbeat / marqueeLeft|Right / scrollUp|Down / dampOut / blink / pulse / breathe / glow. 우선순위: spin > bounce > heartbeat > marqueeLeft > marqueeRight > scrollUp > scrollDown > dampOut > blink > pulse > breathe > glow.',
    marquee: '좌 / 우 마퀴',
    scroll: '위 / 아래 스크롤',
    dampOut: '감쇠 확대 후 축소·사라짐(1회)',
    marqueeLeft: '왼쪽 마퀴',
    marqueeRight: '오른쪽 마퀴',
    scrollUp: '위로 스크롤',
    scrollDown: '아래로 스크롤',
    motionDampOut: '감쇠 소멸 dampOut',
    motionMarqueeLeft: '왼쪽 마퀴',
    motionMarqueeRight: '오른쪽 마퀴',
    motionScrollUp: '위로 스크롤',
    motionScrollDown: '아래로 스크롤',
    fxDesc:
      '공통 모션: blink / breathe / glow, marquee, scroll, dampOut(감쇠 확대 후 소멸).',
    propMotion:
      '공유 Motion: spin / pulse / heartbeat / bounce / blink / breathe / glow / marqueeLeft|Right / scrollUp|Down / dampOut',
    sampleMarqueeLeft: '왼쪽 마퀴 · AMG-WebUI',
    sampleMarqueeRight: '오른쪽 마퀴 · AMG-WebUI',
    sampleScrollUp: '위로 스크롤',
    sampleScrollDown: '아래로 스크롤',
    sampleDampOut: '감쇠 소멸'
  },
  'ko-KP': {
    desc: '서고 공통 호스트 모션: spin / bounce / heartbeat / marqueeLeft|Right / scrollUp|Down / dampOut / blink / pulse / breathe / glow. 우선순위: spin > bounce > heartbeat > marqueeLeft > marqueeRight > scrollUp > scrollDown > dampOut > blink > pulse > breathe > glow.',
    marquee: '좌 / 우 마퀴',
    scroll: '우 / 아래 스크롤',
    dampOut: '감쇠 확대 후 축소·사라짐(1회)',
    marqueeLeft: '왼쪽 마퀴',
    marqueeRight: '오른쪽 마퀴',
    scrollUp: '우로 스크롤',
    scrollDown: '아래로 스크롤',
    motionDampOut: '감쇠 소멸 dampOut',
    motionMarqueeLeft: '왼쪽 마퀴',
    motionMarqueeRight: '오른쪽 마퀴',
    motionScrollUp: '우로 스크롤',
    motionScrollDown: '아래로 스크롤',
    fxDesc:
      '공통 모션: blink / breathe / glow, marquee, scroll, dampOut(감쇠 확대 후 소멸).',
    propMotion:
      '공유 Motion: spin / pulse / heartbeat / bounce / blink / breathe / glow / marqueeLeft|Right / scrollUp|Down / dampOut',
    sampleMarqueeLeft: '왼쪽 마퀴 · AMG-WebUI',
    sampleMarqueeRight: '오른쪽 마퀴 · AMG-WebUI',
    sampleScrollUp: '우로 스크롤',
    sampleScrollDown: '아래로 스크롤',
    sampleDampOut: '감쇠 소멸'
  },
  'ru-RU': {
    desc: 'Общие эффекты хоста: spin / bounce / heartbeat / marqueeLeft|Right / scrollUp|Down / dampOut / blink / pulse / breathe / glow. Приоритет: spin > bounce > heartbeat > marqueeLeft > marqueeRight > scrollUp > scrollDown > dampOut > blink > pulse > breathe > glow.',
    marquee: 'Бегущая строка влево / вправо',
    scroll: 'Прокрутка вверх / вниз',
    dampOut: 'Затухающее увеличение → сжатие → исчезновение (один раз)',
    marqueeLeft: 'Бегущая строка влево',
    marqueeRight: 'Бегущая строка вправо',
    scrollUp: 'Прокрутка вверх',
    scrollDown: 'Прокрутка вниз',
    motionDampOut: 'Затухание dampOut',
    motionMarqueeLeft: 'Маркиза влево',
    motionMarqueeRight: 'Маркиза вправо',
    motionScrollUp: 'Вверх',
    motionScrollDown: 'Вниз',
    fxDesc:
      'Общие эффекты: blink / breathe / glow; marquee; scroll; dampOut (затухающее увеличение затем исчезновение).',
    propMotion:
      'Общий Motion: spin / pulse / heartbeat / bounce / blink / breathe / glow / marqueeLeft|Right / scrollUp|Down / dampOut',
    sampleMarqueeLeft: 'Маркиза влево · AMG-WebUI',
    sampleMarqueeRight: 'Маркиза вправо · AMG-WebUI',
    sampleScrollUp: 'Вверх',
    sampleScrollDown: 'Вниз',
    sampleDampOut: 'Затухание'
  }
}

function upsert(src, key, value) {
  const line = `  "${key}": ${JSON.stringify(value)},\n`
  const re = new RegExp(`  "${key.replace(/\./g, '\\.')}": "(?:\\\\.|[^"\\\\])*",\\n`)
  if (re.test(src)) return src.replace(re, line)
  const anchor = '  "example.doc.overview'
  if (src.includes(anchor)) return src.replace(anchor, `${line}${anchor}`)
  return src.replace(/\n\}\s*$/, `\n${line}}\n`)
}

for (const [loc, p] of Object.entries(packs)) {
  const file = path.join(root, 'packages/locale', loc, 'exampleDoc.ts')
  let s = fs.readFileSync(file, 'utf8')
  s = upsert(s, 'example.doc.motion.demo.desc', p.desc)
  s = upsert(s, 'example.doc.motion.prop.marquee', p.marquee)
  s = upsert(s, 'example.doc.motion.prop.scroll', p.scroll)
  s = upsert(s, 'example.doc.motion.prop.dampOut', p.dampOut)
  s = upsert(s, 'example.doc.motion.prop.marqueeLeft', p.marqueeLeft)
  s = upsert(s, 'example.doc.motion.prop.marqueeRight', p.marqueeRight)
  s = upsert(s, 'example.doc.motion.prop.scrollUp', p.scrollUp)
  s = upsert(s, 'example.doc.motion.prop.scrollDown', p.scrollDown)
  s = upsert(s, 'example.doc.icon.demo.motionMarqueeLeft', p.motionMarqueeLeft)
  s = upsert(s, 'example.doc.icon.demo.motionMarqueeRight', p.motionMarqueeRight)
  s = upsert(s, 'example.doc.icon.demo.motionScrollUp', p.motionScrollUp)
  s = upsert(s, 'example.doc.icon.demo.motionScrollDown', p.motionScrollDown)
  s = upsert(s, 'example.doc.icon.demo.motionDampOut', p.motionDampOut)
  s = upsert(s, 'example.doc.typography.demo.fxDesc', p.fxDesc)
  s = upsert(s, 'example.doc.typography.prop.motion', p.propMotion)
  s = upsert(s, 'example.doc.typography.sample.marqueeLeft', p.sampleMarqueeLeft)
  s = upsert(s, 'example.doc.typography.sample.marqueeRight', p.sampleMarqueeRight)
  s = upsert(s, 'example.doc.typography.sample.scrollUp', p.sampleScrollUp)
  s = upsert(s, 'example.doc.typography.sample.scrollDown', p.sampleScrollDown)
  s = upsert(s, 'example.doc.typography.sample.dampOut', p.sampleDampOut)
  fs.writeFileSync(file, s)
  console.log('patched', loc)
}
