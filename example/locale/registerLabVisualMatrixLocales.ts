/**
 * Lab · Visual theme matrix — example-only locale overlays.
 */
import { extendLocaleMessages, LOCALE_CODES, type LocaleCode } from '@amg-webui/locale'

const zh: Record<string, string> = {
  'page.lab.visualMatrix.whatTitle': '这是什么矩阵',
  'page.lab.visualMatrix.whatBody':
    '视觉矩阵 = 官方主题 × 亮暗（支持时）× LTR/RTL × 核心夹具，用于肉眼扫差异 + Playwright 截图基线。不是随便丢几个组件的 demo 页。',
  'page.lab.visualMatrix.dimsTitle': '矩阵维度（SSOT）',
  'page.lab.visualMatrix.dimDesign': '设计主题',
  'page.lab.visualMatrix.dimScheme': '亮 / 暗',
  'page.lab.visualMatrix.dimDir': '阅读方向',
  'page.lab.visualMatrix.dimFixture': '截图夹具',
  'page.lab.visualMatrix.caseCount': '组合用例',
  'page.lab.visualMatrix.schemeNote': '仅 linear / apple / wechat / alipay 测 light+dark；其余主题固定 dark 外观。',
  'page.lab.visualMatrix.controlsTitle': '活动坐标（写宿主根）',
  'page.lab.visualMatrix.controlsDesc':
    '切换会同步 ThemeService / LocaleService，并写 URL ?design&scheme&dir，供 Playwright 全页定位。下方「截图夹具」跟宿主根走。',
  'page.lab.visualMatrix.activeCoord': '当前坐标',
  'page.lab.visualMatrix.liveTitle': '主题并排矩阵',
  'page.lab.visualMatrix.liveDesc':
    '每个格子是独立 ThemeProvider（不污染宿主）。同一套微型夹具横扫 8 套官方主题，这才叫视觉矩阵。',
  'page.lab.visualMatrix.cellScheme': '格内 scheme',
  'page.lab.visualMatrix.harnessTitle': '截图夹具条（Playwright）',
  'page.lab.visualMatrix.harnessDesc':
    '固定尺寸区块 + data-visual-matrix；npm run test:visual:matrix 按坐标截这些节点。改主题/组件后需 update 基线。',
  'page.lab.visualMatrix.fixtureButton': 'Button',
  'page.lab.visualMatrix.fixtureInput': 'InputText',
  'page.lab.visualMatrix.fixtureSelect': 'Select',
  'page.lab.visualMatrix.fixtureTable': 'DataTable',
  'page.lab.visualMatrix.fixtureDialog': 'Dialog',
  'page.lab.visualMatrix.samplePrimary': '主要',
  'page.lab.visualMatrix.sampleOutlined': '描边',
  'page.lab.visualMatrix.sampleDashed': '虚线',
  'page.lab.visualMatrix.samplePlaceholder': '占位',
  'page.lab.visualMatrix.openDialog': '打开对话框',
  'page.lab.visualMatrix.dialogTitle': '矩阵 Dialog 夹具',
  'page.lab.visualMatrix.dialogBody': '截图目标是 dialog 面板，不是触发按钮。',
  'page.lab.visualMatrix.close': '关闭',
  'page.lab.visualMatrix.applyHost': '应用到宿主夹具',
  'page.lab.visualMatrix.unsupportedScheme': '无独立亮暗'
}

const en: Record<string, string> = {
  'page.lab.visualMatrix.whatTitle': 'What this matrix is',
  'page.lab.visualMatrix.whatBody':
    'Visual matrix = official designs × light/dark (when supported) × LTR/RTL × core fixtures — for human scan + Playwright baselines. Not a page that dumps a few components.',
  'page.lab.visualMatrix.dimsTitle': 'Matrix dimensions (SSOT)',
  'page.lab.visualMatrix.dimDesign': 'Design themes',
  'page.lab.visualMatrix.dimScheme': 'Light / dark',
  'page.lab.visualMatrix.dimDir': 'Reading direction',
  'page.lab.visualMatrix.dimFixture': 'Screenshot fixtures',
  'page.lab.visualMatrix.caseCount': 'Combinations',
  'page.lab.visualMatrix.schemeNote':
    'Only linear / apple / wechat / alipay run light+dark; other themes use dark appearance only.',
  'page.lab.visualMatrix.controlsTitle': 'Active coordinate (writes host root)',
  'page.lab.visualMatrix.controlsDesc':
    'Updates ThemeService / LocaleService and URL ?design&scheme&dir for Playwright. The capture strip below follows the host root.',
  'page.lab.visualMatrix.activeCoord': 'Active',
  'page.lab.visualMatrix.liveTitle': 'Side-by-side theme matrix',
  'page.lab.visualMatrix.liveDesc':
    'Each cell is an isolated ThemeProvider (host untouched). Same micro-fixture across 8 official themes — that is the visual matrix.',
  'page.lab.visualMatrix.cellScheme': 'Cell scheme',
  'page.lab.visualMatrix.harnessTitle': 'Capture strip (Playwright)',
  'page.lab.visualMatrix.harnessDesc':
    'Fixed-size blocks + data-visual-matrix; npm run test:visual:matrix screenshots these nodes. Update baselines after intentional visual changes.',
  'page.lab.visualMatrix.fixtureButton': 'Button',
  'page.lab.visualMatrix.fixtureInput': 'InputText',
  'page.lab.visualMatrix.fixtureSelect': 'Select',
  'page.lab.visualMatrix.fixtureTable': 'DataTable',
  'page.lab.visualMatrix.fixtureDialog': 'Dialog',
  'page.lab.visualMatrix.samplePrimary': 'Primary',
  'page.lab.visualMatrix.sampleOutlined': 'Outlined',
  'page.lab.visualMatrix.sampleDashed': 'Dashed',
  'page.lab.visualMatrix.samplePlaceholder': 'Placeholder',
  'page.lab.visualMatrix.openDialog': 'Open dialog',
  'page.lab.visualMatrix.dialogTitle': 'Matrix Dialog fixture',
  'page.lab.visualMatrix.dialogBody': 'Screenshot target is the dialog panel, not the trigger.',
  'page.lab.visualMatrix.close': 'Close',
  'page.lab.visualMatrix.applyHost': 'Apply to host strip',
  'page.lab.visualMatrix.unsupportedScheme': 'No light/dark pair'
}

const packs: Partial<Record<LocaleCode, Record<string, string>>> = {
  'zh-CN': zh,
  'zh-HK': {
    ...en,
    'page.lab.visualMatrix.whatTitle': '這是什麼矩陣',
    'page.lab.visualMatrix.liveTitle': '主題並排矩陣'
  },
  'en-US': en,
  'ja-JP': en,
  'ko-KR': en,
  'ko-KP': en,
  'ru-RU': en,
  'ar-SA': en,
  'hi-IN': en,
  'ug-CN': en
}

export function registerLabVisualMatrixLocales(): void {
  for (const code of LOCALE_CODES) {
    extendLocaleMessages(code, packs[code] ?? en)
  }
  extendLocaleMessages('zh-CN', {
    'page.lab.visualMatrix.lead':
      '8 套官方主题并排扫一眼 + 宿主坐标驱动 Playwright 截图夹具（主题 × 亮暗 × LTR/RTL × 核心组件）。'
  })
  for (const code of LOCALE_CODES) {
    if (code === 'zh-CN') continue
    extendLocaleMessages(code, {
      'page.lab.visualMatrix.lead':
        'Scan 8 official themes side-by-side, then drive Playwright capture fixtures via host design × scheme × LTR/RTL.'
    })
  }
}
