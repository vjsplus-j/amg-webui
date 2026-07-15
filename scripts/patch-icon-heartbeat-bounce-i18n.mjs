/**
 * Add heartbeat / bounce Icon demo + prop locale strings (all packs).
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..')

const patches = {
  'zh-CN': {
    motionDesc:
      'Lucide 仅为静态 SVG，无需额外动画依赖。spin/pulse/heartbeat/bounce 由组件 CSS 负责，rotate/flip 写在 SVG style 上。关键帧动画互斥（优先级 spin > bounce > heartbeat > pulse）；面板下方有实时状态。',
    motionHeartbeat: '心跳 heartbeat',
    motionBounce: '跳动 bounce',
    heartbeat: '心跳缩放动画（放大缩小）',
    bounce: '原地向上跳动动画',
    when: '图标用于表达操作与状态。本库收录 Lucide 全量约 1745 个图标（42 类，对齐 lucide.dev），name 使用 PascalCase（如 Settings）。支持尺寸、颜色、旋转/翻转、spin/pulse/heartbeat/bounce、禁用与 loading。'
  },
  'zh-TW': {
    motionDesc:
      'Lucide 僅為靜態 SVG，無需額外動畫依賴。spin/pulse/heartbeat/bounce 由元件 CSS 負責，rotate/flip 寫在 SVG style 上。關鍵幀動畫互斥（優先級 spin > bounce > heartbeat > pulse）；面板下方有即時狀態。',
    motionHeartbeat: '心跳 heartbeat',
    motionBounce: '跳動 bounce',
    heartbeat: '心跳縮放動畫（放大縮小）',
    bounce: '原地向上跳動動畫',
    when: '圖示用於表達操作與狀態。本庫收錄 Lucide 全量約 1745 個圖示（42 類，對齊 lucide.dev），name 使用 PascalCase（如 Settings）。支援尺寸、顏色、旋轉/翻轉、spin/pulse/heartbeat/bounce、禁用與 loading。'
  },
  'en-US': {
    motionDesc:
      'Lucide is static SVG — no animation package needed. spin/pulse/heartbeat/bounce use our CSS; rotate/flip are SVG style.transform. Keyframe motions are mutually exclusive (priority: spin > bounce > heartbeat > pulse); live state is shown below the knobs.',
    motionHeartbeat: 'Heartbeat',
    motionBounce: 'Bounce',
    heartbeat: 'Scale heartbeat animation',
    bounce: 'Bounce upward in place',
    when: 'Icons express actions and status. This library ships the full Lucide set (~1745 icons, 42 categories, aligned with lucide.dev). Use PascalCase names (e.g. Settings). Supports size, color, rotate/flip, spin/pulse/heartbeat/bounce, disabled, and loading.'
  },
  'ja-JP': {
    motionDesc:
      'Lucide は静的 SVG のみで、追加のアニメ依存はありません。spin/pulse/heartbeat/bounce はコンポーネント CSS、rotate/flip は SVG の style.transform。キーフレーム系は排他（優先度 spin > bounce > heartbeat > pulse）。パネル下にライブ状態あり。',
    motionHeartbeat: 'ハートビート heartbeat',
    motionBounce: 'バウンス bounce',
    heartbeat: '拡大縮小のハートビートアニメ',
    bounce: 'その場で上に跳ねるアニメ',
    when: 'アイコンは操作と状態を表現します。本ライブラリは Lucide 全量（約 1745・42 カテゴリ、lucide.dev 準拠）を収録。name は PascalCase（例: Settings）。サイズ・色・回転/反転・spin/pulse/heartbeat/bounce・disabled・loading に対応。'
  },
  'ko-KR': {
    motionDesc:
      'Lucide는 정적 SVG이며 추가 애니메이션 패키지가 필요 없습니다. spin/pulse/heartbeat/bounce는 컴포넌트 CSS, rotate/flip는 SVG style.transform입니다. 키프레임 모션은 상호 배타(우선순위 spin > bounce > heartbeat > pulse). 패널 아래에 실시간 상태가 표시됩니다.',
    motionHeartbeat: '하트비트 heartbeat',
    motionBounce: '바운스 bounce',
    heartbeat: '확대·축소 하트비트 애니메이션',
    bounce: '제자리에서 위로 튀는 애니메이션',
    when: '아이콘은 동작과 상태를 표현합니다. 본 라이브러리는 Lucide 전체(~1745, 42 카테고리, lucide.dev 정렬)를 제공합니다. name은 PascalCase(예: Settings). 크기·색·회전/뒤집기·spin/pulse/heartbeat/bounce·disabled·loading을 지원합니다.'
  },
  'ko-KP': {
    motionDesc:
      'Lucide는 정적 SVG이며 추가 동영상 패키지가 필요 없습니다. spin/pulse/heartbeat/bounce는 컴포넌트 CSS, rotate/flip는 SVG style.transform입니다. 키프레임 모션은 상호 배타(우선순위 spin > bounce > heartbeat > pulse). 패널 아래에 실시간 상태가 표시됩니다.',
    motionHeartbeat: '하트비트 heartbeat',
    motionBounce: '바운스 bounce',
    heartbeat: '확대·축소 하트비트 동영상',
    bounce: '제자리에서 우로 뛰는 동영상',
    when: '도상은 동작과 상태를 표현합니다. 본 서고는 Lucide 전체(~1745, 42 범주, lucide.dev 정렬)를 제공합니다. name은 PascalCase(례: Settings). 크기·색·회전/뒤집기·spin/pulse/heartbeat/bounce·disabled·loading을 지원합니다.'
  },
  'ru-RU': {
    motionDesc:
      'Lucide — статичный SVG, без пакета анимаций. spin/pulse/heartbeat/bounce — CSS компонента; rotate/flip — style.transform на SVG. Кадровые эффекты взаимоисключающи (приоритет: spin > bounce > heartbeat > pulse); живое состояние под панелью.',
    motionHeartbeat: 'Сердцебиение heartbeat',
    motionBounce: 'Прыжок bounce',
    heartbeat: 'Анимация масштаба (heartbeat)',
    bounce: 'Подпрыгивание на месте',
    when: 'Иконки выражают действия и статусы. Библиотека включает полный набор Lucide (~1745, 42 категории, как lucide.dev). Имена в PascalCase (напр. Settings). Размер, цвет, поворот/отражение, spin/pulse/heartbeat/bounce, disabled и loading.'
  }
}

function setLine(src, key, value) {
  const re = new RegExp(`("${key.replace(/\./g, '\\.')}": )"[^"]*"`)
  if (!re.test(src)) throw new Error(`missing key ${key}`)
  return src.replace(re, `$1${JSON.stringify(value)}`)
}

function insertAfter(src, afterKey, lines) {
  const re = new RegExp(`("${afterKey.replace(/\./g, '\\.')}": "[^"]*",\\n)`)
  if (!re.test(src)) throw new Error(`missing anchor ${afterKey}`)
  return src.replace(re, `$1${lines}`)
}

for (const [loc, p] of Object.entries(patches)) {
  const file = path.join(root, 'packages/locale', loc, 'exampleDoc.ts')
  let s = fs.readFileSync(file, 'utf8')
  s = setLine(s, 'example.doc.icon.demo.motionDesc', p.motionDesc)
  s = setLine(s, 'example.doc.icon.when', p.when)

  if (!s.includes('example.doc.icon.demo.motionHeartbeat')) {
    s = insertAfter(
      s,
      'example.doc.icon.demo.motionPulse',
      `  "example.doc.icon.demo.motionHeartbeat": ${JSON.stringify(p.motionHeartbeat)},\n  "example.doc.icon.demo.motionBounce": ${JSON.stringify(p.motionBounce)},\n`
    )
  } else {
    s = setLine(s, 'example.doc.icon.demo.motionHeartbeat', p.motionHeartbeat)
    s = setLine(s, 'example.doc.icon.demo.motionBounce', p.motionBounce)
  }

  if (!s.includes('example.doc.icon.prop.heartbeat')) {
    s = insertAfter(
      s,
      'example.doc.icon.prop.pulse',
      `  "example.doc.icon.prop.heartbeat": ${JSON.stringify(p.heartbeat)},\n  "example.doc.icon.prop.bounce": ${JSON.stringify(p.bounce)},\n`
    )
  } else {
    s = setLine(s, 'example.doc.icon.prop.heartbeat', p.heartbeat)
    s = setLine(s, 'example.doc.icon.prop.bounce', p.bounce)
  }

  fs.writeFileSync(file, s)
  console.log('patched', loc)
}
