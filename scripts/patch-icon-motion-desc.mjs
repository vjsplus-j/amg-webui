/**
 * Patch Icon motionDesc — clarify Lucide needs no animation dependency.
 */
import fs from 'node:fs'

const map = {
  'zh-CN':
    'Lucide 仅为静态 SVG，无需额外动画依赖。spin/pulse 由组件 CSS 负责，rotate/flip 写在 SVG style 上。可先关 spin 拖角度验证；面板下方有实时状态。',
  'zh-TW':
    'Lucide 僅為靜態 SVG，無需額外動畫依賴。spin/pulse 由元件 CSS 負責，rotate/flip 寫在 SVG style 上。可先關 spin 拖角度驗證；面板下方有即時狀態。',
  'en-US':
    'Lucide is static SVG — no animation package needed. spin/pulse use our CSS; rotate/flip are SVG style.transform. Turn spin off first to verify angle; live state is shown below the knobs.',
  'ja-JP':
    'Lucide は静的 SVG のみで追加のアニメ依存はありません。spin/pulse は CSS、rotate/flip は SVG の style。まず spin をオフにして角度を確認。下に状態表示あり。',
  'ko-KR':
    'Lucide는 정적 SVG이며 별도 애니메이션 패키지가 필요 없습니다. spin/pulse는 CSS, rotate/flip는 SVG style입니다. 먼저 spin을 끄고 각도를 확인하세요. 아래에 상태가 표시됩니다.',
  'ko-KP':
    'Lucide는 정적 SVG이며 별도 애니메 패키지가 필요 없습니다. spin/pulse는 CSS, rotate/flip는 SVG style입니다. 먼저 spin을 끄고 각도를 확인하십시오. 아래에 상태가 표시됩니다.',
  'ru-RU':
    'Lucide — статический SVG, пакет анимации не нужен. spin/pulse — наш CSS; rotate/flip — style у SVG. Сначала выключите spin и проверьте угол; состояние показано под контролами.'
}

for (const [loc, text] of Object.entries(map)) {
  const file = `packages/locale/${loc}/exampleDoc.ts`
  let s = fs.readFileSync(file, 'utf8')
  s = s.replace(
    /"example\.doc\.icon\.demo\.motionDesc":\s*"(?:\\.|[^"\\])*"/,
    `"example.doc.icon.demo.motionDesc": ${JSON.stringify(text)}`
  )
  fs.writeFileSync(file, s, 'utf8')
  console.log(loc)
}
