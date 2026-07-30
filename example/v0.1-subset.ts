/**
 * AMG-WebUI publish subset — expanded by batches (gold curated demos).
 * Gallery filter uses the union of all locked batches.
 *
 * @see docs/V0_1_SUBSET.md
 */
export const V01_SUBSET_VERSION = '0.1.3'

/** Batch 0 — original core (66) */
export const V01_BATCH_CORE = [
  'Button',
  'ButtonGroup',
  'FloatButton',
  'Link',
  'Icon',
  'Typography',
  'Tag',
  'Badge',
  'Avatar',
  'AvatarGroup',
  'Divider',
  'Space',
  'Card',
  'Empty',
  'Skeleton',
  'Spin',
  'Progress',
  'Statistic',
  'Ellipsis',
  'CopyText',
  'Form',
  'FormItem',
  'FormGroup',
  'InputText',
  'InputNumber',
  'Password',
  'Textarea',
  'Select',
  'Checkbox',
  'Radio',
  'Switch',
  'DatePicker',
  'Slider',
  'Rate',
  'Upload',
  'DataTable',
  'Tree',
  'Pagination',
  'Descriptions',
  'Timeline',
  'Alert',
  'Dialog',
  'Drawer',
  'Message',
  'Notification',
  'Toast',
  'Popconfirm',
  'Popover',
  'Tooltip',
  'Result',
  'Loading',
  'Menu',
  'Tabs',
  'TabsNav',
  'Breadcrumb',
  'Dropdown',
  'Steps',
  'Anchor',
  'Layout',
  'Header',
  'Sider',
  'Main',
  'Footer',
  'Row',
  'Col',
  'Container'
] as const

/**
 * Batch 1 — thicken weak core + first expansion (forms / pickers / groups / tables adjacent)
 * Status: in progress → gold
 */
export const V01_BATCH_1 = [
  // core thicken
  'InputNumber',
  'Password',
  'DatePicker',
  'Slider',
  'Rate',
  'DataTable',
  'Timeline',
  'Menu',
  'Breadcrumb',
  'Dropdown',
  'Anchor',
  // expansion
  'AutoComplete',
  'Cascader',
  'CheckboxGroup',
  'RadioGroup',
  'TimePicker',
  'DateTimePicker',
  'TagInput',
  'Search',
  'FilterBar',
  'Carousel',
  'Transfer',
  'TreeSelect',
  'FormTabs',
  'ImageUpload',
  'ScrollNav'
] as const

/**
 * Batch 2 — second expansion (pickers / tables / chrome / misc display)
 * Status: locked in subset; thicken after B1
 */
export const V01_BATCH_2 = [
  'MonthPicker',
  'ColorPicker',
  'VirtualTable',
  'ProTable',
  'Confirm',
  'ConfirmDialog',
  'Exception',
  'Mask',
  'Scrollbar',
  'BackTop',
  'ContextMenu',
  'MenuBar',
  'StepForm',
  'NoticeBar',
  'Countdown',
  'Watermark',
  'Qrcode',
  'Calendar',
  'Split',
  'ResizeBox',
  'FloatNav',
  'Collapse',
  'Highlight',
  'CardWidgets'
] as const

/** Batch 3 — layout primitives + more date/form/table (unlocked in 0.1.2) */
export const V01_BATCH_3 = [
  'YearPicker',
  'WeekPicker',
  'QuarterPicker',
  'RangeInput',
  'TimeRangeInput',
  'ColorInput',
  'SmsCode',
  'DragSelect',
  'AdvancedSearch',
  'EditTable',
  'TreeTable',
  'LazyTree',
  'VirtualTree',
  'CardGrid',
  'FixedLayout',
  'StackLayout',
  'FlowLayout',
  'Spacer',
  'Block',
  'Center',
  'ScaleLayout',
  'EmbedLayout',
  'FormLayout'
] as const

/**
 * Batch 4 — EP gap fill (Config / MessageBox / Affix / form & media primitives)
 * Status: unlocked in 0.1.3
 */
export const V01_BATCH_4 = [
  'ConfigProvider',
  'MessageBox',
  'Affix',
  'PageHeader',
  'Segmented',
  'InputOTP',
  'TimeSelect',
  'Mention',
  'Image',
  'ImageViewer',
  'Tour',
  'InfiniteScroll'
] as const

/** Gallery "v0.1" filter = Core ∪ B1 ∪ B2 ∪ B3 ∪ B4 */
export const V01_COMPONENTS: string[] = Array.from(
  new Set<string>([
    ...V01_BATCH_CORE,
    ...V01_BATCH_1,
    ...V01_BATCH_2,
    ...V01_BATCH_3,
    ...V01_BATCH_4
  ])
).sort((a, b) => a.localeCompare(b))

/** Must pass gold curated-demo gate (= gallery subset once unlocked). */
export const V01_GOLD_REQUIRED: string[] = [...V01_COMPONENTS]

/**
 * In-scope components that do **not** yet meet strict gold DoD
 * (≥2 interactive DemoBlocks, no getSampleMountProps scaffold, PropsTable + i18n).
 * Maintain next to the subset — when a gap graduates, remove it here.
 */
export const V01_GOLD_GAPS = [
  'BackTop',
  'ContextMenu',
  'FloatNav',
  'Mask',
  'ResizeBox',
  'Sider',
  'Split'
] as const

/** v0.1 subset members that currently pass gold DoD (required minus gaps). */
export const V01_GOLD_PASSED: string[] = V01_GOLD_REQUIRED.filter(
  (name) => !(V01_GOLD_GAPS as readonly string[]).includes(name)
)

export type V01ComponentName = string
export type V01GoldGapName = (typeof V01_GOLD_GAPS)[number]

export function isV01Component(name: string): boolean {
  return V01_COMPONENTS.includes(name)
}

export function isV01GoldRequired(name: string): boolean {
  return V01_GOLD_REQUIRED.includes(name)
}

/** True when the component is in-scope and meets the current gold DoD bar. */
export function isV01GoldPassed(name: string): boolean {
  return V01_GOLD_PASSED.includes(name)
}

export function v01BatchOf(name: string): 'core' | 'b1' | 'b2' | 'b3' | 'b4' | null {
  if ((V01_BATCH_4 as readonly string[]).includes(name)) return 'b4'
  if ((V01_BATCH_3 as readonly string[]).includes(name)) return 'b3'
  if ((V01_BATCH_2 as readonly string[]).includes(name)) return 'b2'
  if ((V01_BATCH_1 as readonly string[]).includes(name)) return 'b1'
  if ((V01_BATCH_CORE as readonly string[]).includes(name)) return 'core'
  return null
}
