/**
 * Lab · Micro-frontend — honest copy for UI-infra MFE contracts (not a MF framework).
 */
import { extendLocaleMessages, LOCALE_CODES, type LocaleCode } from '@amg-webui/locale'

const zh: Record<string, string> = {
  'page.lab.microFe.whatTitle': '这页在验证什么（先读）',
  'page.lab.microFe.whatBody':
    'AMG-WebUI 不是 qiankun / wujie / Module Federation。微前端框架负责子应用加载与路由；本页验证的是：多个子应用同页共存时，UI 库必须提供的隔离契约——主题 Runtime、Overlay Runtime、Teleport 根、卸载 dispose。没有这些，子应用会抢 document、弹窗穿透主应用、卸载泄漏滚动锁。',
  'page.lab.microFe.hostTitle': '宿主（Host）状态',
  'page.lab.microFe.hostDesc':
    '真实主应用根。观察 documentElement 上的 data-design / data-scheme。正确做法：子应用不得改写宿主根属性。',
  'page.lab.microFe.hostDesign': 'document data-design',
  'page.lab.microFe.hostScheme': 'document data-scheme',
  'page.lab.microFe.shellATitle': '子应用 A',
  'page.lab.microFe.shellBTitle': '子应用 B',
  'page.lab.microFe.shellMeta': 'namespace={ns} · zIndexBase={z} · teleport → 本壳根',
  'page.lab.microFe.openDialog': '在本子应用内打开 Dialog',
  'page.lab.microFe.dialogTitle': '{name} 内 Dialog',
  'page.lab.microFe.dialogBody':
    '此 Dialog 应 Teleport 到当前子应用根，而不是 document.body / 宿主。打开两边 Dialog 可对照 z-index 与挂载点。',
  'page.lab.microFe.toggleLocalTheme': '切换本子应用主题（局部 Runtime）',
  'page.lab.microFe.localDesign': '子应用 design',
  'page.lab.microFe.conflictTitle': '全局单例冲突（反例 vs 正例）',
  'page.lab.microFe.conflictDesc':
    '反例：子应用调用 ThemeService.setStyle 会打到宿主 document。正例：只改 Scoped ThemeProvider / ConfigProvider Runtime。',
  'page.lab.microFe.badSingleton': '反例：ThemeService 打宿主',
  'page.lab.microFe.goodScoped': '正例：仅改子应用 A 局部主题',
  'page.lab.microFe.conflictLog': '操作日志',
  'page.lab.microFe.logBad': 'ThemeService.setStyle → 宿主 document 被改写',
  'page.lab.microFe.logGood': '子应用 A 局部 Runtime 变更；宿主 data-design 应保持不变',
  'page.lab.microFe.lifecycleTitle': '子应用挂载 / 卸载清理',
  'page.lab.microFe.lifecycleDesc':
    '挂载临时子应用 C（独立 Overlay Runtime）。卸载时必须 runtime.dispose()，Dialog 与滚动锁不得残留到宿主。',
  'page.lab.microFe.mountC': '挂载子应用 C',
  'page.lab.microFe.unmountC': '卸载并 dispose',
  'page.lab.microFe.openCDialog': '在 C 内打开 Dialog',
  'page.lab.microFe.cTitle': '子应用 C（临时）',
  'page.lab.microFe.metricMounted': 'C 已挂载',
  'page.lab.microFe.metricHostDialogs': '宿主 body 下 Dialog 节点',
  'page.lab.microFe.metricShellDialogs': '子应用壳内 Dialog 节点',
  'page.lab.microFe.yes': '是',
  'page.lab.microFe.no': '否',
  'page.lab.microFe.shadowTitle': 'Shadow DOM 子树（可选增强）',
  'page.lab.microFe.shadowDesc':
    '部分微前端容器用 Shadow 隔离样式。Theme Core 可写入 Shadow 宿主，而不污染 light DOM 根。',
  'page.lab.microFe.checklistTitle': '契约清单',
  'page.lab.microFe.refreshMetrics': '刷新计量'
}

const en: Record<string, string> = {
  'page.lab.microFe.whatTitle': 'What this lab verifies',
  'page.lab.microFe.whatBody':
    'AMG-WebUI is not qiankun / wujie / Module Federation. Those load and route sub-apps. This lab verifies UI-library isolation contracts when multiple sub-apps share one page: scoped ThemeRuntime, OverlayRuntime, Teleport roots, and dispose on unmount. Without them, sub-apps fight document, dialogs pierce the host, and scroll locks leak.',
  'page.lab.microFe.hostTitle': 'Host status',
  'page.lab.microFe.hostDesc':
    'The real shell root. Watch documentElement data-design / data-scheme. Sub-apps must not rewrite host root attrs.',
  'page.lab.microFe.hostDesign': 'document data-design',
  'page.lab.microFe.hostScheme': 'document data-scheme',
  'page.lab.microFe.shellATitle': 'Sub-app A',
  'page.lab.microFe.shellBTitle': 'Sub-app B',
  'page.lab.microFe.shellMeta': 'namespace={ns} · zIndexBase={z} · teleport → this shell root',
  'page.lab.microFe.openDialog': 'Open Dialog inside this sub-app',
  'page.lab.microFe.dialogTitle': 'Dialog in {name}',
  'page.lab.microFe.dialogBody':
    'This Dialog should teleport into the current sub-app root — not document.body / host. Open both to compare mount points and z-index.',
  'page.lab.microFe.toggleLocalTheme': 'Toggle local theme (scoped runtime)',
  'page.lab.microFe.localDesign': 'Sub-app design',
  'page.lab.microFe.conflictTitle': 'Global singleton conflict (anti-pattern vs correct)',
  'page.lab.microFe.conflictDesc':
    'Anti-pattern: ThemeService.setStyle from a “sub-app” mutates the host document. Correct: change only scoped ThemeProvider / ConfigProvider runtime.',
  'page.lab.microFe.badSingleton': 'Anti-pattern: ThemeService → host',
  'page.lab.microFe.goodScoped': 'Correct: change sub-app A only',
  'page.lab.microFe.conflictLog': 'Action log',
  'page.lab.microFe.logBad': 'ThemeService.setStyle → host document rewritten',
  'page.lab.microFe.logGood': 'Sub-app A scoped runtime changed; host data-design should stay',
  'page.lab.microFe.lifecycleTitle': 'Mount / unmount cleanup',
  'page.lab.microFe.lifecycleDesc':
    'Mount temporary sub-app C with its own OverlayRuntime. On unmount you must dispose(); dialogs and scroll locks must not leak to the host.',
  'page.lab.microFe.mountC': 'Mount sub-app C',
  'page.lab.microFe.unmountC': 'Unmount + dispose',
  'page.lab.microFe.openCDialog': 'Open Dialog in C',
  'page.lab.microFe.cTitle': 'Sub-app C (ephemeral)',
  'page.lab.microFe.metricMounted': 'C mounted',
  'page.lab.microFe.metricHostDialogs': 'Dialog nodes under body (host)',
  'page.lab.microFe.metricShellDialogs': 'Dialog nodes inside MFE shells',
  'page.lab.microFe.yes': 'yes',
  'page.lab.microFe.no': 'no',
  'page.lab.microFe.shadowTitle': 'Shadow DOM subtree (optional)',
  'page.lab.microFe.shadowDesc':
    'Some MFE containers isolate styles with Shadow DOM. Theme Core can write the shadow host without polluting the light DOM root.',
  'page.lab.microFe.checklistTitle': 'Contract checklist',
  'page.lab.microFe.refreshMetrics': 'Refresh metrics'
}

const packs: Partial<Record<LocaleCode, Record<string, string>>> = {
  'zh-CN': zh,
  'zh-HK': { ...en, 'page.lab.microFe.whatTitle': '這頁在驗證什麼（先讀）' },
  'en-US': en,
  'ja-JP': en,
  'ko-KR': en,
  'ko-KP': en,
  'ru-RU': en,
  'ar-SA': en,
  'hi-IN': en,
  'ug-CN': en
}

export function registerLabMicroFeLocales(): void {
  for (const code of LOCALE_CODES) {
    extendLocaleMessages(code, packs[code] ?? en)
  }
  // Clarify lead for all packs (overrides stub marketing tone)
  extendLocaleMessages('zh-CN', {
    'page.lab.microFe.lead':
      '同页多子应用：Scoped Theme / Overlay Runtime、Teleport 根隔离、单例冲突与卸载 dispose——不是主题换皮演示。',
    'page.lab.microFe.note':
      '框架层（加载/路由）≠ UI 隔离层。本页只打 UI 契约；qiankun/wujie 需自行接入这些 Runtime。',
    'page.lab.microFe.c1': '子应用独立 ConfigProvider + OverlayRuntime',
    'page.lab.microFe.c2': 'Dialog Teleport 到子应用根（不穿透宿主）',
    'page.lab.microFe.c3': 'ThemeService 单例打宿主 vs 局部 Runtime',
    'page.lab.microFe.c4': '卸载时 overlayRuntime.dispose() 无泄漏'
  })
  for (const code of LOCALE_CODES) {
    if (code === 'zh-CN') continue
    extendLocaleMessages(code, {
      'page.lab.microFe.lead':
        'Same-page sub-apps: scoped Theme/Overlay runtimes, teleport roots, singleton conflicts, dispose — not a theme gallery.',
      'page.lab.microFe.note':
        'Loader/router frameworks ≠ UI isolation. This lab only exercises AMG UI contracts; wire qiankun/wujie yourself.',
      'page.lab.microFe.c1': 'Per-sub-app ConfigProvider + OverlayRuntime',
      'page.lab.microFe.c2': 'Dialog teleports into sub-app root (not host body)',
      'page.lab.microFe.c3': 'ThemeService host pollution vs scoped runtime',
      'page.lab.microFe.c4': 'overlayRuntime.dispose() on unmount — no leaks'
    })
  }
}
