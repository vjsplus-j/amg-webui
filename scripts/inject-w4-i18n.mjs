/**
 * Inject w4 component action keys into all locale packs.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']

const translations = {
  'zh-CN': {
    'component.browser-detect.browser': '浏览器',
    'component.browser-detect.os': '系统',
    'component.browser-detect.device': '设备',
    'component.crypto-box.encrypt': '加密',
    'component.crypto-box.decrypt': '解密',
    'component.crypto-box.reveal': '显示',
    'component.crypto-box.mask': '隐藏',
    'component.excel-io.import': '导入',
    'component.image-crop.export': '导出裁剪',
    'component.preview.fullscreen': '全屏',
    'component.drag-canvas.empty': '拖拽物料到画布',
    'component.prop-panel.empty': '选中节点以编辑属性',
    'component.drag-wrapper.hint': '拖入子组件',
    'component.canvas-layer.show': '显示',
    'component.canvas-layer.hide': '隐藏',
    'component.canvas-io.import': '导入'
  },
  'zh-TW': {
    'component.browser-detect.browser': '瀏覽器',
    'component.browser-detect.os': '系統',
    'component.browser-detect.device': '裝置',
    'component.crypto-box.encrypt': '加密',
    'component.crypto-box.decrypt': '解密',
    'component.crypto-box.reveal': '顯示',
    'component.crypto-box.mask': '隱藏',
    'component.excel-io.import': '匯入',
    'component.image-crop.export': '匯出裁剪',
    'component.preview.fullscreen': '全螢幕',
    'component.drag-canvas.empty': '拖曳物料到畫布',
    'component.prop-panel.empty': '選中節點以編輯屬性',
    'component.drag-wrapper.hint': '拖入子元件',
    'component.canvas-layer.show': '顯示',
    'component.canvas-layer.hide': '隱藏',
    'component.canvas-io.import': '匯入'
  },
  'en-US': {
    'component.browser-detect.browser': 'Browser',
    'component.browser-detect.os': 'OS',
    'component.browser-detect.device': 'Device',
    'component.crypto-box.encrypt': 'Encrypt',
    'component.crypto-box.decrypt': 'Decrypt',
    'component.crypto-box.reveal': 'Reveal',
    'component.crypto-box.mask': 'Mask',
    'component.excel-io.import': 'Import',
    'component.image-crop.export': 'Export crop',
    'component.preview.fullscreen': 'Fullscreen',
    'component.drag-canvas.empty': 'Drag materials onto canvas',
    'component.prop-panel.empty': 'Select a node to edit props',
    'component.drag-wrapper.hint': 'Drop child components here',
    'component.canvas-layer.show': 'Show',
    'component.canvas-layer.hide': 'Hide',
    'component.canvas-io.import': 'Import'
  },
  'ja-JP': {
    'component.browser-detect.browser': 'ブラウザ',
    'component.browser-detect.os': 'OS',
    'component.browser-detect.device': 'デバイス',
    'component.crypto-box.encrypt': '暗号化',
    'component.crypto-box.decrypt': '復号',
    'component.crypto-box.reveal': '表示',
    'component.crypto-box.mask': '非表示',
    'component.excel-io.import': 'インポート',
    'component.image-crop.export': '切り抜きを出力',
    'component.preview.fullscreen': '全画面',
    'component.drag-canvas.empty': '素材をキャンバスにドラッグ',
    'component.prop-panel.empty': 'ノードを選択して属性を編集',
    'component.drag-wrapper.hint': '子コンポーネントをドロップ',
    'component.canvas-layer.show': '表示',
    'component.canvas-layer.hide': '非表示',
    'component.canvas-io.import': 'インポート'
  },
  'ko-KR': {
    'component.browser-detect.browser': '브라우저',
    'component.browser-detect.os': 'OS',
    'component.browser-detect.device': '기기',
    'component.crypto-box.encrypt': '암호화',
    'component.crypto-box.decrypt': '복호화',
    'component.crypto-box.reveal': '표시',
    'component.crypto-box.mask': '숨기기',
    'component.excel-io.import': '가져오기',
    'component.image-crop.export': '자르기보내기',
    'component.preview.fullscreen': '전체 화면',
    'component.drag-canvas.empty': '캔버스에 자재를 드래그',
    'component.prop-panel.empty': '노드를 선택하여 속성 편집',
    'component.drag-wrapper.hint': '하위 컴포넌트 드롭',
    'component.canvas-layer.show': '표시',
    'component.canvas-layer.hide': '숨기기',
    'component.canvas-io.import': '가져오기'
  },
  'ko-KP': {
    'component.browser-detect.browser': '탐색기',
    'component.browser-detect.os': '체계',
    'component.browser-detect.device': '기기',
    'component.crypto-box.encrypt': '암호화',
    'component.crypto-box.decrypt': '해독',
    'component.crypto-box.reveal': '보이기',
    'component.crypto-box.mask': '감추기',
    'component.excel-io.import': '들여오기',
    'component.image-crop.export': '오리기보내기',
    'component.preview.fullscreen': '전체화면',
    'component.drag-canvas.empty': '캔버스에 자재를 끌어다 놓으십시오',
    'component.prop-panel.empty': '노드를 선택하여 속성을 편집하십시오',
    'component.drag-wrapper.hint': '하위 구성요소를 놓으십시오',
    'component.canvas-layer.show': '보이기',
    'component.canvas-layer.hide': '감추기',
    'component.canvas-io.import': '들여오기'
  },
  'ru-RU': {
    'component.browser-detect.browser': 'Браузер',
    'component.browser-detect.os': 'ОС',
    'component.browser-detect.device': 'Устройство',
    'component.crypto-box.encrypt': 'Шифровать',
    'component.crypto-box.decrypt': 'Расшифровать',
    'component.crypto-box.reveal': 'Показать',
    'component.crypto-box.mask': 'Скрыть',
    'component.excel-io.import': 'Импорт',
    'component.image-crop.export': 'Экспорт обрезки',
    'component.preview.fullscreen': 'Полный экран',
    'component.drag-canvas.empty': 'Перетащите материалы на холст',
    'component.prop-panel.empty': 'Выберите узел для редактирования',
    'component.drag-wrapper.hint': 'Перетащите дочерние компоненты',
    'component.canvas-layer.show': 'Показать',
    'component.canvas-layer.hide': 'Скрыть',
    'component.canvas-io.import': 'Импорт'
  }
}

for (const code of locales) {
  const file = resolve(root, 'packages/locale', code, 'component.ts')
  let src = readFileSync(file, 'utf8')
  const map = translations[code]
  for (const [key, val] of Object.entries(map)) {
    if (src.includes(`'${key}'`)) continue
    const escaped = val.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
    src = src.replace(
      '} as Record<string, string>',
      `  '${key}': '${escaped}',\n} as Record<string, string>`
    )
  }
  writeFileSync(file, src, 'utf8')
}

console.log('[inject-w4-i18n] done')
