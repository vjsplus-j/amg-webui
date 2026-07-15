import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const packs = {
  'zh-CN':
    'Lucide 仅为静态 SVG，无需额外动画依赖。spin/pulse/heartbeat/bounce/blink/breathe/glow 由组件 CSS（共享 vp-motion）负责，rotate/flip 写在 SVG style 上。关键帧动画互斥（优先级 spin > bounce > heartbeat > blink > pulse > breathe > glow）；面板下方有实时状态。',
  'zh-TW':
    'Lucide 僅為靜態 SVG，無需額外動畫依賴。spin/pulse/heartbeat/bounce/blink/breathe/glow 由元件 CSS（共享 vp-motion）負責，rotate/flip 寫在 SVG style 上。關鍵幀動畫互斥（優先級 spin > bounce > heartbeat > blink > pulse > breathe > glow）；面板下方有即時狀態。',
  'en-US':
    'Lucide is a static SVG — no animation package needed. spin/pulse/heartbeat/bounce/blink/breathe/glow use shared vp-motion CSS; rotate/flip go on the SVG style. Keyframe motions are mutually exclusive (priority: spin > bounce > heartbeat > blink > pulse > breathe > glow); live state shows under the panel.',
  'ja-JP':
    'Lucide は静的 SVG で、追加のアニメ依存は不要。spin/pulse/heartbeat/bounce/blink/breathe/glow は共有 vp-motion CSS。rotate/flip は SVG style。キーフレームは互斥（優先度 spin > bounce > heartbeat > blink > pulse > breathe > glow）。',
  'ko-KR':
    'Lucide는 정적 SVG이며 추가 애니메이션 패키지가 필요 없습니다. spin/pulse/heartbeat/bounce/blink/breathe/glow는 공유 vp-motion CSS, rotate/flip는 SVG style. 키프레임은 상호 배타(우선순위 spin > bounce > heartbeat > blink > pulse > breathe > glow).',
  'ko-KP':
    'Lucide는 정적 SVG이며 추가 동영상 패키지가 필요 없습니다. spin/pulse/heartbeat/bounce/blink/breathe/glow는 공유 vp-motion CSS, rotate/flip는 SVG style. 키프레임은 상호 배타(우선순위 spin > bounce > heartbeat > blink > pulse > breathe > glow).',
  'ru-RU':
    'Lucide — статический SVG, без пакета анимаций. spin/pulse/heartbeat/bounce/blink/breathe/glow — общий CSS vp-motion; rotate/flip — style.transform на SVG. Кадровые эффекты взаимоисключающи (приоритет: spin > bounce > heartbeat > blink > pulse > breathe > glow).'
}

const key = 'example.doc.icon.demo.motionDesc'

for (const [loc, value] of Object.entries(packs)) {
  const file = path.join(root, 'packages/locale', loc, 'exampleDoc.ts')
  let s = fs.readFileSync(file, 'utf8')
  const line = `  "${key}": ${JSON.stringify(value)},\n`
  const re = new RegExp(`  "${key.replace(/\./g, '\\.')}": "(?:\\\\.|[^"\\\\])*",\\n`)
  if (!re.test(s)) {
    console.warn('miss', loc)
    continue
  }
  s = s.replace(re, line)
  fs.writeFileSync(file, s)
  console.log('ok', loc)
}
