/**
 * Lab · Telemetry (interaction observation) — example-only locale overlays.
 */
import { extendLocaleMessages, LOCALE_CODES, type LocaleCode } from '@amg-webui/locale'

const zh: Record<string, string> = {
  'page.lab.telemetry.whatTitle': '交互观测是什么',
  'page.lab.telemetry.whatBody':
    'Vp Telemetry 把组件交互（click / change / copy…）旁路收成结构化事件，供习惯频次、异常告警、错误聚类分析。它不是埋点 SDK 全家桶、不是日志平台、也不是 Skill Observer。默认关闭；开启后失败不得影响 UI。',
  'page.lab.telemetry.pipelineTitle': '观测链路',
  'page.lab.telemetry.pipelineStep1': '组件 emit + trackEmit（旁路）',
  'page.lab.telemetry.pipelineStep2': 'TelemetryService（开关 / 采样 / 脱敏）',
  'page.lab.telemetry.pipelineStep3': 'Ring buffer + Sink（console / 自定义）',
  'page.lab.telemetry.pipelineStep4': 'summarizeHabits / findAlerts / findErrors',
  'page.lab.telemetry.controlsTitle': '控制面',
  'page.lab.telemetry.statusOff': '默认关闭：点击采样组件也不会入缓冲',
  'page.lab.telemetry.statusOn': '已开启：交互写入 buffer，并经 consoleSink 输出',
  'page.lab.telemetry.enable': '开启观测',
  'page.lab.telemetry.disable': '关闭观测',
  'page.lab.telemetry.payloadMeta': '仅元数据（推荐）',
  'page.lab.telemetry.payloadFull': '携带 payload（已脱敏规则）',
  'page.lab.telemetry.clear': '清空缓冲',
  'page.lab.telemetry.export': '导出 JSON',
  'page.lab.telemetry.metricBuffer': '缓冲条数',
  'page.lab.telemetry.metricHabits': '习惯键',
  'page.lab.telemetry.metricAlerts': '告警',
  'page.lab.telemetry.metricErrors': '错误',
  'page.lab.telemetry.playgroundTitle': '交互采样台',
  'page.lab.telemetry.playgroundDesc':
    '真实组件带 trackId。对比：正常追踪 / 显式 telemetry=false 退出 / 手动注入 alert·error / 连点触发 rapidClick。',
  'page.lab.telemetry.actionTracked': '追踪点击（trackId）',
  'page.lab.telemetry.actionOptOut': '退出观测（telemetry=false）',
  'page.lab.telemetry.actionCopy': 'CopyText 采样',
  'page.lab.telemetry.actionBurst': '连点突发（测 rapidClick）',
  'page.lab.telemetry.actionAlert': '注入 alert 事件',
  'page.lab.telemetry.actionError': '注入 error 事件',
  'page.lab.telemetry.copyText': '观测样本文案',
  'page.lab.telemetry.streamTitle': '事件流',
  'page.lab.telemetry.filterAll': '全部',
  'page.lab.telemetry.inspectorTitle': '事件检视',
  'page.lab.telemetry.inspectorEmpty': '点选左侧事件查看完整结构（id / category / trackId / context…）',
  'page.lab.telemetry.analysisTitle': '分析侧',
  'page.lab.telemetry.habitsTitle': '习惯频次（summarizeHabits）',
  'page.lab.telemetry.habitsDesc': '按 trackId（优先）或 component:type 聚合 interaction。',
  'page.lab.telemetry.alertsTitle': '告警（findAlerts）',
  'page.lab.telemetry.alertsDesc': '含显式 alert，以及 400ms 内同键 ≥3 次 click 的 rapidClick。',
  'page.lab.telemetry.errorsTitle': '错误（findErrors）',
  'page.lab.telemetry.errorsDesc': 'category=error 的事件列表（如 copyError / 注入的 error）。',
  'page.lab.telemetry.empty': '暂无数据',
  'page.lab.telemetry.checklistTitle': '契约清单',
  'page.lab.telemetry.c1': '默认关闭；未 enable 时近零成本',
  'page.lab.telemetry.c2': 'trackEmit 旁路 emit；失败不打断 UI',
  'page.lab.telemetry.c3': 'trackId / telemetry=false 实例级控制',
  'page.lab.telemetry.c4': '习惯 / 告警 / 错误可从 buffer 分析；Sink 可插拔'
}

const en: Record<string, string> = {
  'page.lab.telemetry.whatTitle': 'What interaction observation is',
  'page.lab.telemetry.whatBody':
    'Vp Telemetry side-channels component interactions (click / change / copy…) into structured events for habit frequency, anomaly alerts, and error clustering. It is not a full analytics SDK, not a log platform, and not Skill Observer. Default off; failures must never break UI.',
  'page.lab.telemetry.pipelineTitle': 'Observation pipeline',
  'page.lab.telemetry.pipelineStep1': 'Component emit + trackEmit (side path)',
  'page.lab.telemetry.pipelineStep2': 'TelemetryService (gate / sample / redact)',
  'page.lab.telemetry.pipelineStep3': 'Ring buffer + Sink (console / custom)',
  'page.lab.telemetry.pipelineStep4': 'summarizeHabits / findAlerts / findErrors',
  'page.lab.telemetry.controlsTitle': 'Control plane',
  'page.lab.telemetry.statusOff': 'Default off: sampling clicks do not enter the buffer',
  'page.lab.telemetry.statusOn': 'Enabled: interactions write the buffer and consoleSink',
  'page.lab.telemetry.enable': 'Enable',
  'page.lab.telemetry.disable': 'Disable',
  'page.lab.telemetry.payloadMeta': 'Metadata only (recommended)',
  'page.lab.telemetry.payloadFull': 'Include payload (redacted)',
  'page.lab.telemetry.clear': 'Clear buffer',
  'page.lab.telemetry.export': 'Export JSON',
  'page.lab.telemetry.metricBuffer': 'Buffered',
  'page.lab.telemetry.metricHabits': 'Habit keys',
  'page.lab.telemetry.metricAlerts': 'Alerts',
  'page.lab.telemetry.metricErrors': 'Errors',
  'page.lab.telemetry.playgroundTitle': 'Interaction playground',
  'page.lab.telemetry.playgroundDesc':
    'Real components with trackId. Compare: tracked / telemetry=false opt-out / inject alert·error / burst clicks for rapidClick.',
  'page.lab.telemetry.actionTracked': 'Tracked click (trackId)',
  'page.lab.telemetry.actionOptOut': 'Opt out (telemetry=false)',
  'page.lab.telemetry.actionCopy': 'CopyText sample',
  'page.lab.telemetry.actionBurst': 'Burst clicks (rapidClick)',
  'page.lab.telemetry.actionAlert': 'Inject alert event',
  'page.lab.telemetry.actionError': 'Inject error event',
  'page.lab.telemetry.copyText': 'Telemetry sample text',
  'page.lab.telemetry.streamTitle': 'Event stream',
  'page.lab.telemetry.filterAll': 'All',
  'page.lab.telemetry.inspectorTitle': 'Event inspector',
  'page.lab.telemetry.inspectorEmpty': 'Select an event to inspect the full shape (id / category / trackId / context…)',
  'page.lab.telemetry.analysisTitle': 'Analysis',
  'page.lab.telemetry.habitsTitle': 'Habits (summarizeHabits)',
  'page.lab.telemetry.habitsDesc': 'Aggregate interactions by trackId (preferred) or component:type.',
  'page.lab.telemetry.alertsTitle': 'Alerts (findAlerts)',
  'page.lab.telemetry.alertsDesc': 'Explicit alerts plus rapidClick (≥3 clicks on same key within 400ms).',
  'page.lab.telemetry.errorsTitle': 'Errors (findErrors)',
  'page.lab.telemetry.errorsDesc': 'Events with category=error (e.g. copyError / injected error).',
  'page.lab.telemetry.empty': 'No data',
  'page.lab.telemetry.checklistTitle': 'Contract checklist',
  'page.lab.telemetry.c1': 'Default off; near-zero cost when disabled',
  'page.lab.telemetry.c2': 'trackEmit beside emit; failures never break UI',
  'page.lab.telemetry.c3': 'trackId / telemetry=false per instance',
  'page.lab.telemetry.c4': 'Habits / alerts / errors from buffer; pluggable sinks'
}

const packs: Partial<Record<LocaleCode, Record<string, string>>> = {
  'zh-CN': zh,
  'zh-HK': { ...en, 'page.lab.telemetry.whatTitle': '交互觀測是什麼' },
  'en-US': en,
  'ja-JP': en,
  'ko-KR': en,
  'ko-KP': en,
  'ru-RU': en,
  'ar-SA': en,
  'hi-IN': en,
  'ug-CN': en
}

export function registerLabTelemetryLocales(): void {
  for (const code of LOCALE_CODES) {
    extendLocaleMessages(code, packs[code] ?? en)
  }
  extendLocaleMessages('zh-CN', {
    'page.lab.telemetry.lead':
      'Vp Telemetry：默认关闭的交互旁路观测。开启后看事件流、习惯聚合与告警/错误分析——不是埋点大盘。',
    'page.lab.telemetry.hint':
      '先开启观测，再在采样台操作；关闭时应确认缓冲不再增长。'
  })
  for (const code of LOCALE_CODES) {
    if (code === 'zh-CN') continue
    extendLocaleMessages(code, {
      'page.lab.telemetry.lead':
        'Vp Telemetry: opt-in side-channel observation. Inspect the stream, habits, and alerts/errors — not an analytics dashboard.',
      'page.lab.telemetry.hint':
        'Enable first, then use the playground; when disabled the buffer must stop growing.'
    })
  }
}
