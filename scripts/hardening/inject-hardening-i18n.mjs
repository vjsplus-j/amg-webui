/**
 * One-shot: inject page.lab.hardening.* into non-zh-CN locale packs.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..')

const en = {
  title: 'Lab · Hardening Evidence',
  lead: 'Mount real components by Family for axe / keyboard / visual evidence (local debug).',
  foundation: 'Foundation (B01)',
  input: 'Input (B02)',
  form: 'Form (B03)',
  selection: 'Selection / DateTime (B04-B06)',
  overlay: 'Overlay (B08)',
  primary: 'Primary',
  disabled: 'Disabled',
  link: 'Link sample',
  tag: 'Tag',
  badge: 'Badge',
  status: 'Status tip sample',
  focus: 'Focus target',
  tooltip: 'Tooltip',
  placeholder: 'Enter text',
  password: 'Enter password',
  textarea: 'Enter multiline text',
  fieldName: 'Name',
  fieldNote: 'Note',
  submit: 'Submit',
  select: 'Select an option',
  date: 'Pick a date',
  openDialog: 'Open dialog',
  openDrawer: 'Open drawer',
  popover: 'Popover',
  dialogTitle: 'Dialog',
  dialogBody: 'Dialog body for focus and axe scanning.',
  drawerTitle: 'Drawer',
  drawerBody: 'Drawer body for focus and axe scanning.',
  close: 'Close'
}

const packs = {
  'en-US': en,
  'zh-HK': {
    ...en,
    title: '實驗 · 組件治理證據',
    lead: '依 Family 掛載真實組件，供 axe / 鍵盤 / 視覺門禁採集證據（本地除錯）。',
    primary: '主按鈕',
    disabled: '停用',
    link: '連結樣例',
    tag: '標籤',
    badge: '徽標',
    status: '狀態提示樣例',
    focus: '焦點目標',
    tooltip: '提示',
    placeholder: '請輸入文字',
    password: '請輸入密碼',
    textarea: '請輸入多行文字',
    fieldName: '名稱',
    fieldNote: '備註',
    submit: '提交',
    select: '請選擇',
    date: '請選擇日期',
    openDialog: '開啟對話框',
    openDrawer: '開啟抽屜',
    popover: '氣泡',
    dialogTitle: '對話框',
    dialogBody: '對話框內容用於焦點與 axe 掃描。',
    drawerTitle: '抽屜',
    drawerBody: '抽屜內容用於焦點與 axe 掃描。',
    close: '關閉',
    foundation: 'Foundation（B01）',
    input: 'Input（B02）',
    form: 'Form（B03）',
    selection: 'Selection / DateTime（B04–B06）',
    overlay: 'Overlay（B08）'
  },
  'ja-JP': {
    ...en,
    title: 'Lab · コンポーネント証跡',
    lead: 'Family 単位で実コンポーネントをマウントし、axe / キーボード / 視覚ゲートの証跡を収集（ローカル）。',
    primary: 'プライマリ',
    disabled: '無効',
    submit: '送信',
    close: '閉じる'
  },
  'ko-KR': {
    ...en,
    title: 'Lab · 거버넌스 증거',
    lead: 'Family별 실제 컴포넌트를 마운트하여 axe / 키보드 / 시각 게이트 증거를 수집합니다(로컬).',
    primary: '기본',
    disabled: '비활성',
    submit: '제출',
    close: '닫기'
  },
  'ko-KP': {
    ...en,
    title: 'Lab · 거버넌스 증거',
    lead: 'Family별 실제 컴포넌트를 마운트하여 axe / 키보드 / 시각 게이트 증거를 수집합니다(로컬).',
    primary: '기본',
    disabled: '비활성',
    submit: '제출',
    close: '닫기'
  },
  'ru-RU': {
    ...en,
    title: 'Lab · Hardening Evidence',
    lead: 'Монтирует реальные компоненты по Family для axe / клавиатуры / визуальных гейтов (локально).',
    primary: 'Основная',
    disabled: 'Откл.',
    submit: 'Отправить',
    close: 'Закрыть'
  },
  'ar-SA': {
    ...en,
    title: 'المختبر · أدلة الحوكمة',
    lead: 'تركيب مكوّنات حقيقية حسب العائلة لجمع أدلة axe / لوحة المفاتيح / البصري (محلي).',
    primary: 'أساسي',
    disabled: 'معطّل',
    submit: 'إرسال',
    close: 'إغلاق'
  }
}

function block(p, quote) {
  const q = quote
  const line = (k, v) => `  ${q}${k}${q}: ${q}${v.replace(/"/g, '\\"')}${q},`
  return [
    line('page.lab.hardening.title', p.title),
    line('page.lab.hardening.lead', p.lead),
    line('page.lab.hardening.family.foundation', p.foundation),
    line('page.lab.hardening.family.input', p.input),
    line('page.lab.hardening.family.form', p.form),
    line('page.lab.hardening.family.selection', p.selection),
    line('page.lab.hardening.family.overlay', p.overlay),
    line('page.lab.hardening.sample.primary', p.primary),
    line('page.lab.hardening.sample.disabled', p.disabled),
    line('page.lab.hardening.sample.link', p.link),
    line('page.lab.hardening.sample.tag', p.tag),
    line('page.lab.hardening.sample.badge', p.badge),
    line('page.lab.hardening.sample.status', p.status),
    line('page.lab.hardening.sample.focus', p.focus),
    line('page.lab.hardening.sample.tooltip', p.tooltip),
    line('page.lab.hardening.sample.placeholder', p.placeholder),
    line('page.lab.hardening.sample.password', p.password),
    line('page.lab.hardening.sample.textarea', p.textarea),
    line('page.lab.hardening.sample.fieldName', p.fieldName),
    line('page.lab.hardening.sample.fieldNote', p.fieldNote),
    line('page.lab.hardening.sample.submit', p.submit),
    line('page.lab.hardening.sample.select', p.select),
    line('page.lab.hardening.sample.date', p.date),
    line('page.lab.hardening.sample.openDialog', p.openDialog),
    line('page.lab.hardening.sample.openDrawer', p.openDrawer),
    line('page.lab.hardening.sample.popover', p.popover),
    line('page.lab.hardening.sample.dialogTitle', p.dialogTitle),
    line('page.lab.hardening.sample.dialogBody', p.dialogBody),
    line('page.lab.hardening.sample.drawerTitle', p.drawerTitle),
    line('page.lab.hardening.sample.drawerBody', p.drawerBody),
    line('page.lab.hardening.sample.close', p.close),
    ''
  ].join('\n')
}

for (const [loc, p] of Object.entries(packs)) {
  const path = join(root, 'packages/locale', loc, 'page.ts')
  let src = readFileSync(path, 'utf8')
  if (src.includes('page.lab.hardening.title')) {
    console.log('skip', loc)
    continue
  }
  const useDouble = loc === 'ar-SA'
  const needle = useDouble
    ? '"page.lab.lowcodeStudio.lead"'
    : "'page.lab.lowcodeStudio.lead'"
  const idx = src.lastIndexOf(needle)
  if (idx < 0) {
    console.error('missing anchor', loc)
    continue
  }
  const lineEnd = src.indexOf('\n', idx)
  const insert = '\n' + block(p, useDouble ? '"' : "'")
  src = src.slice(0, lineEnd + 1) + insert + src.slice(lineEnd + 1)
  writeFileSync(path, src)
  console.log('updated', loc)
}
