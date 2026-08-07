/**
 * Lab · A11y page copy (example-only via extendLocaleMessages).
 */
import { extendLocaleMessages, LOCALE_CODES, type LocaleCode } from '@amg-webui/locale'

const zh: Record<string, string> = {
  'page.lab.a11y.checklistTitle': '能力清单',
  'page.lab.a11y.sectionKeyboard': 'Tab / Esc / Arrow 键盘路径',
  'page.lab.a11y.sectionKeyboardDesc':
    '工具栏支持 Arrow 漫游；Esc 清空焦点日志。用键盘走一遍，不要只点鼠标。',
  'page.lab.a11y.lastKey': '最近按键',
  'page.lab.a11y.focusLog': '焦点日志',
  'page.lab.a11y.clearLog': '清空日志',
  'page.lab.a11y.toolbarLabel': '键盘工具栏',
  'page.lab.a11y.item': '项 {n}',
  'page.lab.a11y.sectionTrap': '焦点陷阱与还原',
  'page.lab.a11y.sectionTrapDesc':
    'useFocusTrap：激活后 Tab 困在面板内；关闭后焦点回到触发按钮。',
  'page.lab.a11y.openTrap': '打开焦点陷阱',
  'page.lab.a11y.closeTrap': '关闭并还原焦点',
  'page.lab.a11y.trapTitle': '陷阱面板',
  'page.lab.a11y.trapBody': 'Tab / Shift+Tab 应循环停留在此面板内的控件上。',
  'page.lab.a11y.trapField': '面板内输入',
  'page.lab.a11y.trapActive': '陷阱状态',
  'page.lab.a11y.trapOn': '已激活',
  'page.lab.a11y.trapOff': '未激活',
  'page.lab.a11y.sectionAria': 'aria / 读屏文案',
  'page.lab.a11y.sectionAriaDesc':
    '演示 aria-label、aria-describedby、aria-live。打开读屏或看状态区变化。',
  'page.lab.a11y.iconOnly': '仅图标按钮（有 aria-label）',
  'page.lab.a11y.described': '带描述的字段',
  'page.lab.a11y.describedHint': '此字段说明会通过 aria-describedby 关联。',
  'page.lab.a11y.announce': '朗读状态更新',
  'page.lab.a11y.announceMsg': '状态已更新：{n}',
  'page.lab.a11y.liveRegion': '实时区域',
  'page.lab.a11y.srOnly': '读屏专用提示：此文本对视觉隐藏，但可读。',
  'page.lab.a11y.sectionContrast': '高对比与强制色彩',
  'page.lab.a11y.sectionContrastDesc':
    '切换高对比预览（模拟 forced-colors / 高对比皮肤）。核对正文与主色对比是否可读。',
  'page.lab.a11y.enableHc': '启用高对比预览',
  'page.lab.a11y.disableHc': '关闭高对比预览',
  'page.lab.a11y.contrastSample': '正文示例：主色按钮与次级文案应保持可读。',
  'page.lab.a11y.contrastRatio': '估算对比度',
  'page.lab.a11y.forcedNote': '也可在系统「强制颜色 / 高对比」下复查本页。'
}

const en: Record<string, string> = {
  'page.lab.a11y.checklistTitle': 'Checklist',
  'page.lab.a11y.sectionKeyboard': 'Tab / Esc / Arrow keyboard paths',
  'page.lab.a11y.sectionKeyboardDesc':
    'Toolbar supports arrow roving; Esc clears the focus log. Walk it with the keyboard.',
  'page.lab.a11y.lastKey': 'Last key',
  'page.lab.a11y.focusLog': 'Focus log',
  'page.lab.a11y.clearLog': 'Clear log',
  'page.lab.a11y.toolbarLabel': 'Keyboard toolbar',
  'page.lab.a11y.item': 'Item {n}',
  'page.lab.a11y.sectionTrap': 'Focus trap & restore',
  'page.lab.a11y.sectionTrapDesc':
    'useFocusTrap: Tab stays inside the panel; closing restores focus to the trigger.',
  'page.lab.a11y.openTrap': 'Open focus trap',
  'page.lab.a11y.closeTrap': 'Close & restore focus',
  'page.lab.a11y.trapTitle': 'Trap panel',
  'page.lab.a11y.trapBody': 'Tab / Shift+Tab should cycle among controls in this panel.',
  'page.lab.a11y.trapField': 'In-panel input',
  'page.lab.a11y.trapActive': 'Trap state',
  'page.lab.a11y.trapOn': 'Active',
  'page.lab.a11y.trapOff': 'Inactive',
  'page.lab.a11y.sectionAria': 'aria / screen-reader copy',
  'page.lab.a11y.sectionAriaDesc':
    'Demo aria-label, aria-describedby, and aria-live. Use a screen reader or watch the live region.',
  'page.lab.a11y.iconOnly': 'Icon-only button (aria-label)',
  'page.lab.a11y.described': 'Field with description',
  'page.lab.a11y.describedHint': 'This hint is wired via aria-describedby.',
  'page.lab.a11y.announce': 'Announce status update',
  'page.lab.a11y.announceMsg': 'Status updated: {n}',
  'page.lab.a11y.liveRegion': 'Live region',
  'page.lab.a11y.srOnly': 'Screen-reader-only hint: visually hidden but readable.',
  'page.lab.a11y.sectionContrast': 'High contrast & forced colors',
  'page.lab.a11y.sectionContrastDesc':
    'Toggle a high-contrast preview (forced-colors style). Check body/primary readability.',
  'page.lab.a11y.enableHc': 'Enable HC preview',
  'page.lab.a11y.disableHc': 'Disable HC preview',
  'page.lab.a11y.contrastSample': 'Sample body: primary button and secondary text should stay readable.',
  'page.lab.a11y.contrastRatio': 'Estimated contrast',
  'page.lab.a11y.forcedNote': 'Also re-check under OS forced-colors / high contrast.'
}

const packs: Partial<Record<LocaleCode, Record<string, string>>> = {
  'zh-CN': zh,
  'zh-HK': {
    ...en,
    'page.lab.a11y.sectionKeyboard': 'Tab / Esc / Arrow 鍵盤路徑',
    'page.lab.a11y.sectionTrap': '焦點陷阱與還原',
    'page.lab.a11y.sectionAria': 'aria / 讀屏文案',
    'page.lab.a11y.sectionContrast': '高對比與強制色彩'
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

export function registerLabA11yLocales(): void {
  for (const code of LOCALE_CODES) {
    extendLocaleMessages(code, packs[code] ?? en)
  }
}
