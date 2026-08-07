/**
 * Perf · High-frequency lab copy (example-only via extendLocaleMessages).
 */
import { extendLocaleMessages, LOCALE_CODES, type LocaleCode } from '@amg-webui/locale'

const zh: Record<string, string> = {
  'page.perf.highFrequency.checklistTitle': '能力清单',
  'page.perf.highFrequency.metricFps': 'FPS',
  'page.perf.highFrequency.metricMemory': '堆内存',
  'page.perf.highFrequency.memoryUnavailable': '不可用',
  'page.perf.highFrequency.memoryValue': '{mb} MB',
  'page.perf.highFrequency.sectionDialog': 'Dialog 高频开闭',
  'page.perf.highFrequency.sectionDialogDesc':
    '连续开闭 Dialog，观察残留宿主节点与 FPS。结束后应回到 0 个 vp-dialog 宿主。',
  'page.perf.highFrequency.burstDialog': '突发开闭 ×{n}',
  'page.perf.highFrequency.stopBurst': '停止',
  'page.perf.highFrequency.openOnce': '打开一次',
  'page.perf.highFrequency.closeOnce': '关闭',
  'page.perf.highFrequency.metricCycles': '开闭次数',
  'page.perf.highFrequency.metricHosts': '残留 Dialog 节点',
  'page.perf.highFrequency.dialogTitle': '高频 Dialog #{n}',
  'page.perf.highFrequency.dialogBody': '用于压测挂载 / 卸载；关闭后 DOM 应清理干净。',
  'page.perf.highFrequency.sectionInput': '受控输入 thrashing',
  'page.perf.highFrequency.sectionInputDesc':
    '以 rAF 高频写入 v-model，统计子组件更新次数；停止后计数应不再上涨。',
  'page.perf.highFrequency.startInput': '开始 thrash',
  'page.perf.highFrequency.stopInput': '停止 thrash',
  'page.perf.highFrequency.clearInput': '清空',
  'page.perf.highFrequency.metricUpdates': '子组件更新',
  'page.perf.highFrequency.metricChars': '字符数',
  'page.perf.highFrequency.inputPlaceholder': '实时输入或启动 thrash…',
  'page.perf.highFrequency.sectionScroll': 'scroll / resize 监听',
  'page.perf.highFrequency.sectionScrollDesc':
    '对比「泄漏模式」与「正确清理」。离开页面前务必点停止；泄漏模式会故意保留监听供对照。',
  'page.perf.highFrequency.attachClean': '挂载（正确清理）',
  'page.perf.highFrequency.attachLeak': '挂载（泄漏模式）',
  'page.perf.highFrequency.detach': '卸载监听',
  'page.perf.highFrequency.metricListeners': '活跃监听',
  'page.perf.highFrequency.metricScrollEvents': 'scroll 事件',
  'page.perf.highFrequency.metricResizeEvents': 'resize 事件',
  'page.perf.highFrequency.scrollHint': '在下方区域滚动或缩放窗口以触发计数。',
  'page.perf.highFrequency.sectionRender': '重复渲染审计',
  'page.perf.highFrequency.sectionRenderDesc':
    '坏依赖：父级每帧换新对象；好依赖：稳定引用。对比探针 render 次数。',
  'page.perf.highFrequency.startBad': '坏依赖脉冲',
  'page.perf.highFrequency.startGood': '好依赖脉冲',
  'page.perf.highFrequency.stopPulse': '停止脉冲',
  'page.perf.highFrequency.metricBadRenders': '坏依赖 render',
  'page.perf.highFrequency.metricGoodRenders': '好依赖 render',
  'page.perf.highFrequency.probeBad': '坏依赖探针',
  'page.perf.highFrequency.probeGood': '好依赖探针',
  'page.perf.highFrequency.resetCounters': '重置计数'
}

const en: Record<string, string> = {
  'page.perf.highFrequency.checklistTitle': 'Checklist',
  'page.perf.highFrequency.metricFps': 'FPS',
  'page.perf.highFrequency.metricMemory': 'Heap',
  'page.perf.highFrequency.memoryUnavailable': 'n/a',
  'page.perf.highFrequency.memoryValue': '{mb} MB',
  'page.perf.highFrequency.sectionDialog': 'Dialog open/close thrash',
  'page.perf.highFrequency.sectionDialogDesc':
    'Burst open/close Dialog and watch leftover hosts + FPS. Host count should return to 0.',
  'page.perf.highFrequency.burstDialog': 'Burst ×{n}',
  'page.perf.highFrequency.stopBurst': 'Stop',
  'page.perf.highFrequency.openOnce': 'Open once',
  'page.perf.highFrequency.closeOnce': 'Close',
  'page.perf.highFrequency.metricCycles': 'Cycles',
  'page.perf.highFrequency.metricHosts': 'Leftover dialog nodes',
  'page.perf.highFrequency.dialogTitle': 'HF Dialog #{n}',
  'page.perf.highFrequency.dialogBody': 'Mount/unmount stress; DOM should clean up after close.',
  'page.perf.highFrequency.sectionInput': 'Controlled input thrashing',
  'page.perf.highFrequency.sectionInputDesc':
    'Write v-model every rAF and count child updates; counts should stop after halt.',
  'page.perf.highFrequency.startInput': 'Start thrash',
  'page.perf.highFrequency.stopInput': 'Stop thrash',
  'page.perf.highFrequency.clearInput': 'Clear',
  'page.perf.highFrequency.metricUpdates': 'Child updates',
  'page.perf.highFrequency.metricChars': 'Chars',
  'page.perf.highFrequency.inputPlaceholder': 'Type or start thrash…',
  'page.perf.highFrequency.sectionScroll': 'scroll / resize listeners',
  'page.perf.highFrequency.sectionScrollDesc':
    'Compare leak vs cleanup. Stop before leaving; leak mode keeps listeners on purpose.',
  'page.perf.highFrequency.attachClean': 'Attach (cleanup)',
  'page.perf.highFrequency.attachLeak': 'Attach (leak)',
  'page.perf.highFrequency.detach': 'Detach',
  'page.perf.highFrequency.metricListeners': 'Active listeners',
  'page.perf.highFrequency.metricScrollEvents': 'scroll events',
  'page.perf.highFrequency.metricResizeEvents': 'resize events',
  'page.perf.highFrequency.scrollHint': 'Scroll the pane or resize the window to tick counters.',
  'page.perf.highFrequency.sectionRender': 'Re-render audit',
  'page.perf.highFrequency.sectionRenderDesc':
    'Bad deps: new object every frame. Good deps: stable ref. Compare probe render counts.',
  'page.perf.highFrequency.startBad': 'Pulse bad deps',
  'page.perf.highFrequency.startGood': 'Pulse good deps',
  'page.perf.highFrequency.stopPulse': 'Stop pulse',
  'page.perf.highFrequency.metricBadRenders': 'Bad-dep renders',
  'page.perf.highFrequency.metricGoodRenders': 'Good-dep renders',
  'page.perf.highFrequency.probeBad': 'Bad-dep probe',
  'page.perf.highFrequency.probeGood': 'Good-dep probe',
  'page.perf.highFrequency.resetCounters': 'Reset counters'
}

const packs: Partial<Record<LocaleCode, Record<string, string>>> = {
  'zh-CN': zh,
  'zh-HK': {
    ...en,
    'page.perf.highFrequency.sectionDialog': 'Dialog 高頻開關',
    'page.perf.highFrequency.sectionInput': '受控輸入 thrashing',
    'page.perf.highFrequency.sectionScroll': 'scroll / resize 監聽',
    'page.perf.highFrequency.sectionRender': '重複渲染審計'
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

export function registerPerfHighFrequencyLocales(): void {
  for (const code of LOCALE_CODES) {
    extendLocaleMessages(code, packs[code] ?? en)
  }
}
