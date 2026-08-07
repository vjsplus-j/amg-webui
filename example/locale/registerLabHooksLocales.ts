/**
 * Lab · Hooks page copy (example-only via extendLocaleMessages).
 */
import { extendLocaleMessages, LOCALE_CODES, type LocaleCode } from '@amg-webui/locale'

const zh: Record<string, string> = {
  'page.lab.hooks.checklistTitle': '能力清单',
  'page.lab.hooks.sectionThemeLocale': 'useTheme / useLocale',
  'page.lab.hooks.sectionThemeLocaleDesc':
    '切换设计风格、亮暗与语种；状态来自 ThemeService / LocaleService 订阅。',
  'page.lab.hooks.currentStyle': '当前设计',
  'page.lab.hooks.currentScheme': '当前方案',
  'page.lab.hooks.currentLocale': '当前语种',
  'page.lab.hooks.currentDir': '阅读方向',
  'page.lab.hooks.toggleScheme': '切换亮/暗',
  'page.lab.hooks.nextLocale': '下一语种',
  'page.lab.hooks.toggleDir': '切换 LTR/RTL',
  'page.lab.hooks.applyMercedes': 'Mercedes',
  'page.lab.hooks.applyLinear': 'Linear',
  'page.lab.hooks.sampleCopy': '示例文案：{text}',
  'page.lab.hooks.sectionToast': '弹窗 / Toast 控制',
  'page.lab.hooks.sectionToastDesc':
    'useToast 与 useConfirm（ConfirmService）命令式调用；文案跟随当前语种。',
  'page.lab.hooks.toastSuccess': '成功 Toast',
  'page.lab.hooks.toastInfo': '信息 Toast',
  'page.lab.hooks.toastWarn': '警告 Toast',
  'page.lab.hooks.toastError': '错误 Toast',
  'page.lab.hooks.toastSummary': 'Hooks Lab',
  'page.lab.hooks.toastDetail': '来自 useToast().{kind}',
  'page.lab.hooks.confirmOpen': '打开 Confirm',
  'page.lab.hooks.confirmHeader': '确认操作',
  'page.lab.hooks.confirmMessage': '这是 useConfirm().require 演示。',
  'page.lab.hooks.confirmAccepted': '已接受',
  'page.lab.hooks.confirmRejected': '已取消',
  'page.lab.hooks.lastConfirm': '最近结果',
  'page.lab.hooks.sectionSize': '尺寸 / 断点监听',
  'page.lab.hooks.sectionSizeDesc':
    'useSize 解析组件尺寸 token；下方用 matchMedia 监听视口断点（lab 辅助，非独立 hook）。',
  'page.lab.hooks.sizeProp': 'useSize.size',
  'page.lab.hooks.sizeHeight': 'token 高度',
  'page.lab.hooks.breakpoint': '视口断点',
  'page.lab.hooks.viewport': '视口宽度',
  'page.lab.hooks.sectionForm': '表单处理与校验组合',
  'page.lab.hooks.sectionFormDesc':
    'useVModel 绑定字段 + Form / FormItem 规则校验；提交走 validate。',
  'page.lab.hooks.formEmail': '邮箱',
  'page.lab.hooks.formEmailPh': 'name@example.com',
  'page.lab.hooks.formRequired': '请填写邮箱',
  'page.lab.hooks.formInvalid': '邮箱格式不正确',
  'page.lab.hooks.formSubmit': '校验并提交',
  'page.lab.hooks.formOk': '校验通过：{value}',
  'page.lab.hooks.vmodelMirror': 'useVModel 镜像'
}

const en: Record<string, string> = {
  'page.lab.hooks.checklistTitle': 'Checklist',
  'page.lab.hooks.sectionThemeLocale': 'useTheme / useLocale',
  'page.lab.hooks.sectionThemeLocaleDesc':
    'Toggle design style, scheme, and locale; state comes from ThemeService / LocaleService.',
  'page.lab.hooks.currentStyle': 'Style',
  'page.lab.hooks.currentScheme': 'Scheme',
  'page.lab.hooks.currentLocale': 'Locale',
  'page.lab.hooks.currentDir': 'Direction',
  'page.lab.hooks.toggleScheme': 'Toggle light/dark',
  'page.lab.hooks.nextLocale': 'Next locale',
  'page.lab.hooks.toggleDir': 'Toggle LTR/RTL',
  'page.lab.hooks.applyMercedes': 'Mercedes',
  'page.lab.hooks.applyLinear': 'Linear',
  'page.lab.hooks.sampleCopy': 'Sample: {text}',
  'page.lab.hooks.sectionToast': 'Overlay / Toast hooks',
  'page.lab.hooks.sectionToastDesc':
    'Imperative useToast and useConfirm; copy follows the active locale.',
  'page.lab.hooks.toastSuccess': 'Success toast',
  'page.lab.hooks.toastInfo': 'Info toast',
  'page.lab.hooks.toastWarn': 'Warn toast',
  'page.lab.hooks.toastError': 'Error toast',
  'page.lab.hooks.toastSummary': 'Hooks Lab',
  'page.lab.hooks.toastDetail': 'From useToast().{kind}',
  'page.lab.hooks.confirmOpen': 'Open Confirm',
  'page.lab.hooks.confirmHeader': 'Confirm',
  'page.lab.hooks.confirmMessage': 'Demo for useConfirm().require.',
  'page.lab.hooks.confirmAccepted': 'Accepted',
  'page.lab.hooks.confirmRejected': 'Rejected',
  'page.lab.hooks.lastConfirm': 'Last result',
  'page.lab.hooks.sectionSize': 'Size / breakpoint watch',
  'page.lab.hooks.sectionSizeDesc':
    'useSize resolves component size tokens; matchMedia tracks viewport breakpoints (lab helper).',
  'page.lab.hooks.sizeProp': 'useSize.size',
  'page.lab.hooks.sizeHeight': 'Token height',
  'page.lab.hooks.breakpoint': 'Breakpoint',
  'page.lab.hooks.viewport': 'Viewport width',
  'page.lab.hooks.sectionForm': 'Form + validation combo',
  'page.lab.hooks.sectionFormDesc':
    'useVModel field binding with Form / FormItem rules; submit runs validate().',
  'page.lab.hooks.formEmail': 'Email',
  'page.lab.hooks.formEmailPh': 'name@example.com',
  'page.lab.hooks.formRequired': 'Email is required',
  'page.lab.hooks.formInvalid': 'Invalid email',
  'page.lab.hooks.formSubmit': 'Validate & submit',
  'page.lab.hooks.formOk': 'Valid: {value}',
  'page.lab.hooks.vmodelMirror': 'useVModel mirror'
}

const packs: Partial<Record<LocaleCode, Record<string, string>>> = {
  'zh-CN': zh,
  'zh-HK': {
    ...en,
    'page.lab.hooks.sectionThemeLocale': 'useTheme / useLocale',
    'page.lab.hooks.sectionToast': '彈窗 / Toast 控制',
    'page.lab.hooks.sectionSize': '尺寸 / 斷點監聽',
    'page.lab.hooks.sectionForm': '表單處理與校驗組合'
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

export function registerLabHooksLocales(): void {
  for (const code of LOCALE_CODES) {
    extendLocaleMessages(code, packs[code] ?? en)
  }
}
