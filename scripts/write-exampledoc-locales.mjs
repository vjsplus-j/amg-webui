import fs from 'node:fs'
import path from 'node:path'

const en = {
  'nav.base.category.general': 'General',
  'nav.base.category.layout': 'Layout',
  'nav.base.category.navigation': 'Navigation',
  'nav.base.category.dataEntry': 'Data Entry',
  'nav.base.category.dataDisplay': 'Data Display',
  'nav.base.category.feedback': 'Feedback',
  'nav.base.category.other': 'Other',
  'nav.base.category.industry': 'Industry',
  'page.base.component.title': 'Component',
  'page.base.catalog.title': 'Components',
  'page.base.catalog.lead':
    'Browse all base components by Ant Design–style categories. Open a page for usage, demos, and API.',
  'example.doc.whenToUse': 'When to use',
  'example.doc.demos': 'Examples',
  'example.doc.codeDemos': 'Examples',
  'example.doc.api': 'API',
  'example.doc.showCode': 'Show code',
  'example.doc.hideCode': 'Hide code',
  'example.doc.basicMount': 'Basic mount',
  'example.doc.fallbackHint':
    'Curated demos pending. Catalog probe mount keeps the sidebar navigable.',
  'example.doc.apiDraft': 'Draft props table — full API lands as the component is deepened.',
  'example.doc.propClass': 'Custom root class',
  'example.doc.propStyle': 'Custom root inline style',
  'example.doc.propName': 'Property',
  'example.doc.propDesc': 'Description',
  'example.doc.propType': 'Type',
  'example.doc.propDefault': 'Default',
  'example.doc.whenFallback':
    'Debug preview for {name}. Full when-to-use copy ships with doc deepen.',
  'example.doc.overview': 'Components',
  'example.doc.fallbackLead': 'Component debug preview',
  'example.doc.demoPending': 'Demo pending deepen',
  'example.doc.basicMountDesc': 'Async-mount the source component for a quick smoke check.',
  'example.doc.button.when':
    'Buttons trigger immediate actions. Use one solid primary CTA per region; secondary actions use outlined or link styles.',
  'example.doc.button.demo.variant': 'Variants',
  'example.doc.button.demo.variantDesc': 'solid / outlined / link for action hierarchy.',
  'example.doc.button.demo.size': 'Size',
  'example.doc.button.demo.sizeDesc': 'xs through xl mapped to density tokens.',
  'example.doc.button.demo.icon': 'Icon and shape',
  'example.doc.button.demo.iconDesc': 'Icons, circle/square, image buttons.',
  'example.doc.button.demo.states': 'States',
  'example.doc.button.demo.statesDesc': 'Loading, disabled, badge, star.',
  'example.doc.button.prop.label': 'Label text',
  'example.doc.button.prop.icon': 'Lucide icon name',
  'example.doc.button.prop.severity': 'Semantic color',
  'example.doc.button.prop.variant': 'Variant: solid / outlined / text…',
  'example.doc.button.prop.size': 'Size',
  'example.doc.button.prop.shape': 'Shape',
  'example.doc.button.prop.loading': 'Loading',
  'example.doc.button.prop.disabled': 'Disabled',
  'example.doc.button.prop.link': 'Link style',
  'example.doc.button.prop.badge': 'Badge',
  'example.doc.button.prop.star': 'Star mark',
  'example.doc.floatButton.when':
    'Float buttons stay in a viewport corner for global shortcuts. Optional menu expands child actions.',
  'example.doc.floatButton.demo.basic': 'Basic',
  'example.doc.floatButton.demo.basicDesc': 'Defaults to bottom-right.',
  'example.doc.floatButton.demo.stageHint': 'Float button inside the preview stage.',
  'example.doc.floatButton.demo.menu': 'Expandable menu',
  'example.doc.floatButton.demo.menuDesc': 'Mount shortcuts via the #menu slot.',
  'example.doc.floatButton.demo.shape': 'Shape',
  'example.doc.floatButton.demo.shapeDesc': 'Circle or square trigger.',
  'example.doc.floatButton.prop.icon': 'Trigger icon',
  'example.doc.floatButton.prop.severity': 'Semantic color',
  'example.doc.floatButton.prop.shape': 'Shape',
  'example.doc.floatButton.prop.href': 'Optional href',
  'example.doc.floatButton.prop.position': 'Offset (top/right/bottom/left)',
  'example.doc.icon.when':
    'Icons express actions and status. Lucide names use PascalCase (e.g. Settings).',
  'example.doc.icon.demo.gallery': 'Common icons',
  'example.doc.icon.demo.galleryDesc': 'Icons used across chrome and toolbars.',
  'example.doc.icon.demo.size': 'Size',
  'example.doc.icon.demo.sizeDesc': 'xs through xl type scale.',
  'example.doc.icon.prop.name': 'Lucide icon name',
  'example.doc.icon.prop.size': 'Size or custom length',
  'example.doc.icon.prop.color': 'Color (prefer tokens / currentColor)',
  'example.doc.icon.prop.strokeWidth': 'Stroke width override'
}

const zhTW = {
  ...en,
  'nav.base.category.general': '通用',
  'nav.base.category.layout': '佈局',
  'nav.base.category.navigation': '導航',
  'nav.base.category.dataEntry': '資料錄入',
  'nav.base.category.dataDisplay': '資料展示',
  'nav.base.category.feedback': '回饋',
  'nav.base.category.other': '其他',
  'nav.base.category.industry': '行業套件',
  'page.base.component.title': '元件文件',
  'page.base.catalog.title': '元件總覽',
  'page.base.catalog.lead':
    '依 Ant Design 式分類瀏覽全部 base 元件；點擊進入用法說明、程式碼演示與 API。',
  'example.doc.whenToUse': '何時使用',
  'example.doc.demos': '程式碼演示',
  'example.doc.codeDemos': '程式碼演示',
  'example.doc.showCode': '顯示程式碼',
  'example.doc.hideCode': '收起程式碼',
  'example.doc.basicMount': '基礎掛載',
  'example.doc.fallbackHint': '該元件演示待深化；以下為 Catalog 探針掛載，保證側欄可點開。',
  'example.doc.apiDraft': '以下為草稿 Props 表，完整 API 將在元件深化時補齊。',
  'example.doc.propClass': '自訂根節點 class',
  'example.doc.propStyle': '自訂根節點行內樣式',
  'example.doc.propName': '屬性',
  'example.doc.propDesc': '說明',
  'example.doc.propType': '類型',
  'example.doc.propDefault': '預設值',
  'example.doc.whenFallback': '偵錯預覽 {name}。完整「何時使用」說明將在文件深化時補充。',
  'example.doc.overview': '元件總覽',
  'example.doc.fallbackLead': '元件偵錯預覽',
  'example.doc.demoPending': '文件演示待深化',
  'example.doc.basicMountDesc': '非同步掛載元件原始碼，便於快速冒煙。',
  'example.doc.button.when':
    '按鈕用於觸發即時操作。主操作使用實心主色，次操作用描邊或文字/連結形態；同一區域建議僅一個主按鈕。',
  'example.doc.button.demo.variant': '顏色與變體',
  'example.doc.button.demo.variantDesc': 'solid / outlined / link 覆蓋常見操作層級。',
  'example.doc.button.demo.size': '按鈕尺寸',
  'example.doc.button.demo.sizeDesc': 'xs → xl 五檔，對應密度 Token。',
  'example.doc.button.demo.icon': '圖示與形狀',
  'example.doc.button.demo.iconDesc': '圖示、圓形/方形、圖片按鈕。',
  'example.doc.button.demo.states': '狀態',
  'example.doc.button.demo.statesDesc': '載入、停用、角標、標星。',
  'example.doc.button.prop.label': '按鈕文案',
  'example.doc.button.prop.icon': 'Lucide 圖示名',
  'example.doc.button.prop.severity': '語意色',
  'example.doc.button.prop.variant': '變體：solid / outlined / text 等',
  'example.doc.button.prop.size': '尺寸',
  'example.doc.button.prop.shape': '形狀',
  'example.doc.button.prop.loading': '載入中',
  'example.doc.button.prop.disabled': '停用',
  'example.doc.button.prop.link': '連結形態',
  'example.doc.button.prop.badge': '角標',
  'example.doc.button.prop.star': '標星',
  'example.doc.floatButton.when':
    '懸浮按鈕固定在視口角落，適合全域快捷操作。可展開一組子操作。',
  'example.doc.floatButton.demo.basic': '基礎',
  'example.doc.floatButton.demo.basicDesc': '預設固定右下角。',
  'example.doc.floatButton.demo.stageHint': '預覽區內的懸浮按鈕（相對舞台定位）。',
  'example.doc.floatButton.demo.menu': '展開選單',
  'example.doc.floatButton.demo.menuDesc': '透過 #menu 插槽掛載一組快捷操作。',
  'example.doc.floatButton.demo.shape': '形狀',
  'example.doc.floatButton.demo.shapeDesc': '圓形 / 方形觸發器。',
  'example.doc.floatButton.prop.icon': '觸發器圖示',
  'example.doc.floatButton.prop.severity': '語意色',
  'example.doc.floatButton.prop.shape': '形狀',
  'example.doc.floatButton.prop.href': '可選連結',
  'example.doc.floatButton.prop.position': '定位偏移（top/right/bottom/left）',
  'example.doc.icon.when':
    '圖示用於表達操作與狀態。本庫基於 Lucide，name 使用 PascalCase。',
  'example.doc.icon.demo.gallery': '常用圖示',
  'example.doc.icon.demo.galleryDesc': '側欄與工具列常見圖示集合。',
  'example.doc.icon.demo.size': '尺寸',
  'example.doc.icon.demo.sizeDesc': 'xs → xl 字階尺寸。',
  'example.doc.icon.prop.name': 'Lucide 圖示名',
  'example.doc.icon.prop.size': '尺寸或自訂長度',
  'example.doc.icon.prop.color': '顏色（優先用 Token / currentColor）',
  'example.doc.icon.prop.strokeWidth': '描邊寬度覆蓋'
}

const ja = {
  ...en,
  'nav.base.category.general': '汎用',
  'nav.base.category.layout': 'レイアウト',
  'nav.base.category.navigation': 'ナビゲーション',
  'nav.base.category.dataEntry': 'データ入力',
  'nav.base.category.dataDisplay': 'データ表示',
  'nav.base.category.feedback': 'フィードバック',
  'nav.base.category.other': 'その他',
  'nav.base.category.industry': '業界向け',
  'page.base.catalog.title': 'コンポーネント一覧',
  'example.doc.whenToUse': 'いつ使うか',
  'example.doc.demos': 'コードデモ',
  'example.doc.showCode': 'コードを表示',
  'example.doc.hideCode': 'コードを隠す'
}

const ko = {
  ...en,
  'nav.base.category.general': '일반',
  'nav.base.category.layout': '레이아웃',
  'nav.base.category.navigation': '내비게이션',
  'nav.base.category.dataEntry': '데이터 입력',
  'nav.base.category.dataDisplay': '데이터 표시',
  'nav.base.category.feedback': '피드백',
  'nav.base.category.other': '기타',
  'nav.base.category.industry': '산업',
  'page.base.catalog.title': '컴포넌트 목록',
  'example.doc.whenToUse': '사용 시점',
  'example.doc.demos': '코드 데모',
  'example.doc.showCode': '코드 보기',
  'example.doc.hideCode': '코드 숨기기'
}

const ru = {
  ...en,
  'nav.base.category.general': 'Общие',
  'nav.base.category.layout': 'Макет',
  'nav.base.category.navigation': 'Навигация',
  'nav.base.category.dataEntry': 'Ввод данных',
  'nav.base.category.dataDisplay': 'Отображение данных',
  'nav.base.category.feedback': 'Обратная связь',
  'nav.base.category.other': 'Прочее',
  'nav.base.category.industry': 'Отрасль',
  'page.base.catalog.title': 'Компоненты',
  'example.doc.whenToUse': 'Когда использовать',
  'example.doc.demos': 'Примеры',
  'example.doc.showCode': 'Показать код',
  'example.doc.hideCode': 'Скрыть код'
}

const packs = {
  'zh-TW': zhTW,
  'en-US': en,
  'ja-JP': ja,
  'ko-KR': ko,
  'ko-KP': ko,
  'ru-RU': ru
}

function serialize(obj) {
  const body = Object.entries(obj)
    .map(([k, v]) => `  '${k}': ${JSON.stringify(v)}`)
    .join(',\n')
  return `/** Play Ant-style component doc chrome */\nexport default {\n${body}\n} as Record<string, string>\n`
}

function ensureIndex(loc) {
  const indexPath = path.join('packages', 'locale', loc, 'index.ts')
  let idx = fs.readFileSync(indexPath, 'utf8')
  if (!idx.includes('exampleDoc')) {
    idx = idx.replace(
      "import industry from './industry'",
      "import industry from './industry'\nimport exampleDoc from './exampleDoc'"
    )
    idx = idx.replace('...industry', '...industry,\n  ...exampleDoc')
    fs.writeFileSync(indexPath, idx)
  }
}

for (const [loc, pack] of Object.entries(packs)) {
  fs.writeFileSync(path.join('packages', 'locale', loc, 'exampleDoc.ts'), serialize(pack))
  ensureIndex(loc)
  console.log('wrote', loc)
}

ensureIndex('zh-CN')
console.log('zh-CN index ok')
