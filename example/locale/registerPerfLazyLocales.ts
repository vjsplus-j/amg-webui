/**
 * Perf · Lazy-load lab copy (example-only via extendLocaleMessages).
 */
import { extendLocaleMessages, LOCALE_CODES, type LocaleCode } from '@amg-webui/locale'

const zh: Record<string, string> = {
  'page.perf.lazy.checklistTitle': '能力清单',
  'page.perf.lazy.reset': '重置计数',
  'page.perf.lazy.sectionRoute': '路由级 import() 分包',
  'page.perf.lazy.sectionRouteDesc':
    '本页本身通过路由 () => import(...) 懒加载。下方可再次动态拉取重型 chunk，并查看 Resource Timing。',
  'page.perf.lazy.loadHeavy': '动态加载重型 chunk',
  'page.perf.lazy.loadingHeavy': '加载中…',
  'page.perf.lazy.heavyReady': '已加载',
  'page.perf.lazy.metricChunkMs': 'chunk 耗时',
  'page.perf.lazy.metricChunkBytes': '传输大小',
  'page.perf.lazy.metricChunkRows': 'chunk 行数',
  'page.perf.lazy.bytesUnknown': '未知（需 DevTools / 支持 transferSize）',
  'page.perf.lazy.bytesValue': '{kb} KB',
  'page.perf.lazy.msValue': '{ms} ms',
  'page.perf.lazy.sectionOverlay': 'Dialog / Drawer 内容懒挂载',
  'page.perf.lazy.sectionOverlayDesc':
    'Overlay 关闭时用 v-if 卸内容；对比「打开才挂载」的探针计数。关闭后挂载次数不应继续增加。',
  'page.perf.lazy.openDialog': '打开 Dialog',
  'page.perf.lazy.openDrawer': '打开 Drawer',
  'page.perf.lazy.close': '关闭',
  'page.perf.lazy.dialogTitle': '懒挂载 Dialog',
  'page.perf.lazy.drawerTitle': '懒挂载 Drawer',
  'page.perf.lazy.metricDialogMounts': 'Dialog 内容挂载',
  'page.perf.lazy.metricDrawerMounts': 'Drawer 内容挂载',
  'page.perf.lazy.probeLive': '内容已挂载 · 累计 {n} 次',
  'page.perf.lazy.sectionBiz': '业务模块按需加载',
  'page.perf.lazy.sectionBizDesc':
    '动态 import 业务调试页模块，观察分包耗时与体积（本地调试，不上线）。',
  'page.perf.lazy.loadUsers': '加载 Users 业务页模块',
  'page.perf.lazy.loadOrders': '加载 Orders 业务页模块',
  'page.perf.lazy.metricBizMs': '业务模块耗时',
  'page.perf.lazy.metricBizName': '模块',
  'page.perf.lazy.sectionTiming': '首屏与切页时序',
  'page.perf.lazy.sectionTimingDesc':
    '记录进入本页的 navigation / 模块求值时刻，并可跳到其他懒路由后返回对照。',
  'page.perf.lazy.metricNavType': 'navigation.type',
  'page.perf.lazy.metricDomReady': 'domContentLoaded',
  'page.perf.lazy.metricPageEval': '本页 setup 时刻',
  'page.perf.lazy.goMassive': '前往海量数据（懒路由）',
  'page.perf.lazy.goHighFreq': '前往高频交互（懒路由）',
  'page.perf.lazy.sinceNav': '距 navigationStart {ms} ms'
}

const en: Record<string, string> = {
  'page.perf.lazy.checklistTitle': 'Checklist',
  'page.perf.lazy.reset': 'Reset counters',
  'page.perf.lazy.sectionRoute': 'Route-level import() chunks',
  'page.perf.lazy.sectionRouteDesc':
    'This page is itself lazy via route import(). Dynamically fetch a heavy chunk and inspect Resource Timing.',
  'page.perf.lazy.loadHeavy': 'Load heavy chunk',
  'page.perf.lazy.loadingHeavy': 'Loading…',
  'page.perf.lazy.heavyReady': 'Loaded',
  'page.perf.lazy.metricChunkMs': 'Chunk time',
  'page.perf.lazy.metricChunkBytes': 'Transfer size',
  'page.perf.lazy.metricChunkRows': 'Chunk rows',
  'page.perf.lazy.bytesUnknown': 'n/a (needs transferSize)',
  'page.perf.lazy.bytesValue': '{kb} KB',
  'page.perf.lazy.msValue': '{ms} ms',
  'page.perf.lazy.sectionOverlay': 'Dialog / Drawer lazy content',
  'page.perf.lazy.sectionOverlayDesc':
    'Overlays unmount content with v-if when closed. Watch probe mount counts; they should not grow while closed.',
  'page.perf.lazy.openDialog': 'Open Dialog',
  'page.perf.lazy.openDrawer': 'Open Drawer',
  'page.perf.lazy.close': 'Close',
  'page.perf.lazy.dialogTitle': 'Lazy Dialog',
  'page.perf.lazy.drawerTitle': 'Lazy Drawer',
  'page.perf.lazy.metricDialogMounts': 'Dialog content mounts',
  'page.perf.lazy.metricDrawerMounts': 'Drawer content mounts',
  'page.perf.lazy.probeLive': 'Content mounted · total {n}',
  'page.perf.lazy.sectionBiz': 'On-demand business modules',
  'page.perf.lazy.sectionBizDesc':
    'Dynamic-import biz debug pages and measure chunk time/size (local only).',
  'page.perf.lazy.loadUsers': 'Load Users biz module',
  'page.perf.lazy.loadOrders': 'Load Orders biz module',
  'page.perf.lazy.metricBizMs': 'Biz module time',
  'page.perf.lazy.metricBizName': 'Module',
  'page.perf.lazy.sectionTiming': 'First paint & navigation timing',
  'page.perf.lazy.sectionTimingDesc':
    'Capture navigation / page-eval timestamps; jump to other lazy routes and compare.',
  'page.perf.lazy.metricNavType': 'navigation.type',
  'page.perf.lazy.metricDomReady': 'domContentLoaded',
  'page.perf.lazy.metricPageEval': 'Page setup time',
  'page.perf.lazy.goMassive': 'Go Massive (lazy route)',
  'page.perf.lazy.goHighFreq': 'Go High-frequency (lazy route)',
  'page.perf.lazy.sinceNav': '{ms} ms since navigationStart'
}

const packs: Partial<Record<LocaleCode, Record<string, string>>> = {
  'zh-CN': zh,
  'zh-HK': {
    ...en,
    'page.perf.lazy.sectionRoute': '路由級 import() 分包',
    'page.perf.lazy.sectionOverlay': 'Dialog / Drawer 內容懶掛載',
    'page.perf.lazy.sectionBiz': '業務模組按需載入',
    'page.perf.lazy.sectionTiming': '首屏與切頁時序'
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

export function registerPerfLazyLocales(): void {
  for (const code of LOCALE_CODES) {
    extendLocaleMessages(code, packs[code] ?? en)
  }
}
