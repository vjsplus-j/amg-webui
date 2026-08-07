/**
 * i18n Lab page copy — example-only overlays via extendLocaleMessages.
 * Keeps lab strings out of the typed LocaleKey schema until promoted.
 */
import { extendLocaleMessages, LOCALE_CODES, type LocaleCode } from '@amg-webui/locale'

const zh: Record<string, string> = {
  'page.i18n.lab.leadDetail':
    '{locale} · {label} · {lang} / dir={dir}（语种自然方向提示 {natural}）',
  'page.i18n.lab.sectionSwitch': '语种切换（10 内置 + 自定义）',
  'page.i18n.lab.sectionSwitchDesc':
    '切换后侧栏、页头、按钮与下方词条应立即跟随。也可使用顶栏语言下拉或 ?lang=。',
  'page.i18n.lab.sectionDirection': '阅读方向（与语种解耦）',
  'page.i18n.lab.sectionDirectionDesc':
    'LTR/RTL 独立于语言包。阿语只换文案；要镜像布局须显式切 RTL。',
  'page.i18n.lab.dirIndependent': '方向与语种独立，不随 setLocale 自动切换',
  'page.i18n.lab.forceArRtl': '阿语 + RTL',
  'page.i18n.lab.mirrorSample': '这段文字会随 ConfigProvider direction 做起止对齐（start）。',
  'page.i18n.lab.sectionSamples': '内置文案抽样',
  'page.i18n.lab.sectionSamplesDesc': '按钮 / 通用 / 壳层 / 业务词条随当前 locale 解析。',
  'page.i18n.lab.groupButton': '按钮',
  'page.i18n.lab.groupCommon': '通用',
  'page.i18n.lab.groupChrome': '壳层方向',
  'page.i18n.lab.groupBiz': '业务 / 鉴权',
  'page.i18n.lab.sectionForm': '表单校验提示',
  'page.i18n.lab.sectionFormDesc': '校验 message 走当前语种；切换语种后重新提交可看到文案变化。',
  'page.i18n.lab.formName': '名称',
  'page.i18n.lab.formPlaceholder': '至少 2 个字符',
  'page.i18n.lab.formRequired': '请填写名称',
  'page.i18n.lab.formMin': '名称至少 2 个字符',
  'page.i18n.lab.formOk': '校验通过',
  'page.i18n.lab.sectionOverlay': '弹窗操作文案',
  'page.i18n.lab.sectionOverlayDesc': 'MessageBox 确认/取消标签跟随 button.* 词条。',
  'page.i18n.lab.openDialog': '打开确认框',
  'page.i18n.lab.dialogTitle': '确认操作',
  'page.i18n.lab.dialogBody': '此对话框按钮文案随当前语种变化。',
  'page.i18n.lab.dialogResult': '结果',
  'page.i18n.lab.sectionCustom': '自定义词条包 registerLocale',
  'page.i18n.lab.sectionCustomDesc':
    '基于完整 LocaleMessages 注册 lab-XX；切换后可见 [LAB] 前缀覆盖键。',
  'page.i18n.lab.customRegister': '注册并切换 lab-XX',
  'page.i18n.lab.customSwitch': '切换到 lab-XX',
  'page.i18n.lab.customActive': '已注册',
  'page.i18n.lab.sectionRemote': '远程动态加载（模拟）',
  'page.i18n.lab.sectionRemoteDesc':
    '模拟异步拉取后 registerLocale(lab-REMOTE)。真实项目可替换为 fetch JSON / 分包 import。',
  'page.i18n.lab.remoteLoad': '模拟远程加载',
  'page.i18n.lab.remoteLoaded': '已加载'
}

const en: Record<string, string> = {
  'page.i18n.lab.leadDetail':
    '{locale} · {label} · {lang} / dir={dir} (natural script dir {natural})',
  'page.i18n.lab.sectionSwitch': 'Locale switch (10 built-ins + custom)',
  'page.i18n.lab.sectionSwitchDesc':
    'Sidebar, titles, and samples follow immediately. Header select and ?lang= also work.',
  'page.i18n.lab.sectionDirection': 'Reading direction (decoupled from locale)',
  'page.i18n.lab.sectionDirectionDesc':
    'LTR/RTL is independent of language packs. Arabic changes copy only; mirror layout needs explicit RTL.',
  'page.i18n.lab.dirIndependent': 'Direction does not auto-follow setLocale',
  'page.i18n.lab.forceArRtl': 'Arabic + RTL',
  'page.i18n.lab.mirrorSample': 'This block aligns to inline-start via ConfigProvider direction.',
  'page.i18n.lab.sectionSamples': 'Built-in key samples',
  'page.i18n.lab.sectionSamplesDesc': 'Button / common / chrome / biz keys resolve for the active locale.',
  'page.i18n.lab.groupButton': 'Buttons',
  'page.i18n.lab.groupCommon': 'Common',
  'page.i18n.lab.groupChrome': 'Chrome direction',
  'page.i18n.lab.groupBiz': 'Biz / auth',
  'page.i18n.lab.sectionForm': 'Form validation copy',
  'page.i18n.lab.sectionFormDesc': 'Validation messages use the active locale; switch language and re-submit.',
  'page.i18n.lab.formName': 'Name',
  'page.i18n.lab.formPlaceholder': 'At least 2 characters',
  'page.i18n.lab.formRequired': 'Name is required',
  'page.i18n.lab.formMin': 'Name must be at least 2 characters',
  'page.i18n.lab.formOk': 'Validation passed',
  'page.i18n.lab.sectionOverlay': 'Overlay action labels',
  'page.i18n.lab.sectionOverlayDesc': 'MessageBox confirm/cancel labels follow button.* keys.',
  'page.i18n.lab.openDialog': 'Open confirm',
  'page.i18n.lab.dialogTitle': 'Confirm',
  'page.i18n.lab.dialogBody': 'Dialog button labels follow the active locale.',
  'page.i18n.lab.dialogResult': 'Result',
  'page.i18n.lab.sectionCustom': 'Custom pack via registerLocale',
  'page.i18n.lab.sectionCustomDesc':
    'Registers lab-XX from a full LocaleMessages clone; covered keys show a [LAB] prefix.',
  'page.i18n.lab.customRegister': 'Register & switch lab-XX',
  'page.i18n.lab.customSwitch': 'Switch to lab-XX',
  'page.i18n.lab.customActive': 'Registered',
  'page.i18n.lab.sectionRemote': 'Remote dynamic load (simulated)',
  'page.i18n.lab.sectionRemoteDesc':
    'Simulates async fetch then registerLocale(lab-REMOTE). Replace with fetch/import in apps.',
  'page.i18n.lab.remoteLoad': 'Simulate remote load',
  'page.i18n.lab.remoteLoaded': 'Loaded'
}

const zhHK: Record<string, string> = {
  ...en,
  'page.i18n.lab.leadDetail':
    '{locale} · {label} · {lang} / dir={dir}（語種自然方向提示 {natural}）',
  'page.i18n.lab.sectionSwitch': '語種切換（10 內建 + 自訂）',
  'page.i18n.lab.sectionDirection': '閱讀方向（與語種解耦）',
  'page.i18n.lab.formName': '名稱',
  'page.i18n.lab.formRequired': '請填寫名稱',
  'page.i18n.lab.openDialog': '開啟確認框',
  'page.i18n.lab.customRegister': '註冊並切換 lab-XX',
  'page.i18n.lab.remoteLoad': '模擬遠端載入'
}

const packs: Partial<Record<LocaleCode, Record<string, string>>> = {
  'zh-CN': zh,
  'zh-HK': zhHK,
  'en-US': en,
  'ja-JP': en,
  'ko-KR': en,
  'ko-KP': en,
  'ru-RU': en,
  'ar-SA': en,
  'hi-IN': en,
  'ug-CN': en
}

export function registerI18nLabLocales(): void {
  for (const code of LOCALE_CODES) {
    extendLocaleMessages(code, packs[code] ?? en)
  }
}
