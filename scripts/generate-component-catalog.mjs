/**
 * Regenerate Ant-style example/component-catalog.json (base dirs × 8 categories, no missing/extra).
 * node scripts/generate-component-catalog.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const baseDir = path.join(root, 'packages', 'components', 'base')
const names = fs
  .readdirSync(baseDir, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort()

function toKebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

/** @type {Record<string, Set<string>>} */
const cats = {
  general: new Set([
    'Button',
    'ButtonGroup',
    'FloatButton',
    'Icon',
    'Typography',
    'Link',
    'Highlight',
    'Ellipsis',
    // Checklist 5–8: keep with general primitives for example discoverability
    'Tag',
    'Avatar',
    'AvatarGroup',
    'Badge',
    // Feedback/layout primitives promoted to general (example 通用)
    'Divider',
    'Empty',
    'Progress',
    'Skeleton',
    // Space / loading / copy / collapse / stats
    'Space',
    'Spin',
    'CopyText',
    'Collapse',
    'Statistic',
    'Card',
    'CardWidgets',
    'ConfigProvider',
    'Segmented'
  ]),
  layout: new Set([
    'Row',
    'Col',
    'Spacer',
    'Split',
    'Layout',
    'Sider',
    'Header',
    'Main',
    'Footer',
    'Container',
    'Center',
    'Block',
    'ColumnLayout',
    'EmbedLayout',
    'FixedLayout',
    'FlowLayout',
    'ScaleLayout',
    'StackLayout',
    'ResizeBox',
    'CardGrid',
    'FormLayout',
    'Affix',
    'PageHeader'
  ]),
  navigation: new Set([
    'Anchor',
    'Breadcrumb',
    'BreadcrumbItem',
    'Dropdown',
    'Menu',
    'MenuBar',
    'Pagination',
    'PagerNav',
    'Steps',
    'StepItem',
    'StepNav',
    'Tabs',
    'TabPane',
    'TabsNav',
    'BackTop',
    'ContextMenu',
    'FloatNav',
    'FooterNav',
    'GroupNav',
    'IndexNav',
    'MiniNav',
    'QuickNav',
    'RouterNav',
    'ScrollNav',
    'SelectNav',
    'TopNav',
    'VerticalStepNav',
    'CardNav',
    'CategoryNav',
    'Tour'
  ]),
  'data-entry': new Set([
    'AdvancedSearch',
    'AutoComplete',
    'BatchPanel',
    'BatchUpload',
    'Cascader',
    'Checkbox',
    'CheckboxGroup',
    'ChunkUpload',
    'CodeEditor',
    'ColorInput',
    'ColorPicker',
    'Dashboard',
    'DatePicker',
    'DateTimePicker',
    'DetailPanel',
    'DragSelect',
    'DynamicForm',
    'FilterBar',
    'FlowPanel',
    'Form',
    'FormGroup',
    'FormItem',
    'FormTabs',
    'ImageUpload',
    'InputCaptcha',
    'InputNumber',
    'InputOTP',
    'InputText',
    'LoginPanel',
    'MdEditor',
    'Mention',
    'MonthPicker',
    'Password',
    'PermissionPanel',
    'QuarterPicker',
    'Radio',
    'RadioGroup',
    'RangeInput',
    'Rate',
    'RichText',
    'Search',
    'SearchFilterPanel',
    'Select',
    'SettingPanel',
    'Slider',
    'SmsCode',
    'StepForm',
    'Switch',
    'TagInput',
    'TemplateSelect',
    'Textarea',
    'TimePicker',
    'TimeRangeInput',
    'TimeSelect',
    'Transfer',
    'Upload',
    'UserInfoCard',
    'WeekPicker',
    'YearPicker'
  ]),
  'data-display': new Set([
    'BarChart',
    'Calendar',
    'CardList',
    'Carousel',
    'DataCard',
    'DataTable',
    'DrillTable',
    'EditTable',
    'EditTree',
    'FolderTree',
    'GaugeChart',
    'GraphChart',
    'HeatMap',
    'Image',
    'ImageGroup',
    'ImageViewer',
    'InfiniteScroll',
    'LazyTree',
    'LineChart',
    'MergeTable',
    'PieChart',
    'PivotTable',
    'ProTable',
    'RadarChart',
    'Ranking',
    'ScrollNotice',
    'StickyTable',
    'TableAction',
    'TableDrag',
    'TableExport',
    'Thumbnail',
    'Timeline',
    'TimelineList',
    'TransferTree',
    'Tree',
    'TreeChart',
    'TreeForm',
    'TreeSelect',
    'TreeTable',
    'TreeTransfer',
    'VirtualTable',
    'VirtualTree',
    'Waterfall',
    'WordCloud',
    'Countdown',
    'Descriptions',
    'DescriptionsItem',
    'TimelineItem',
    'Tooltip',
    'Watermark',
    'Scrollbar'
  ]),
  feedback: new Set([
    'Alert',
    'Confirm',
    'ConfirmDialog',
    'Dialog',
    'MessageBox',
    'Drawer',
    'ErrorModal',
    'Exception',
    'InfoModal',
    'Loading',
    'LoadingTip',
    'Mask',
    'Message',
    'NoticeBar',
    'Notification',
    'Popconfirm',
    'Popover',
    'ProgressTip',
    'Result',
    'StatusTip',
    'SuccessModal',
    'Toast',
    'WarnModal'
  ]),
  other: new Set([
    'AudioPlay',
    'Barcode',
    'BrowserDetect',
    'CanvasIo',
    'CanvasLayer',
    'CanvasNode',
    'CanvasPreview',
    'CanvasShortcut',
    'Clipboard',
    'CryptoBox',
    'DragCanvas',
    'DragMaterial',
    'DragRuler',
    'DragSortNode',
    'DragVerify',
    'DragWrapper',
    'ExcelIo',
    'FilePreview',
    'FreeLayoutDrag',
    'GridLayoutDrag',
    'ImageCrop',
    'OcrScan',
    'PdfPreview',
    'Preview',
    'Print',
    'PropPanel',
    'Qrcode',
    'TablePrint',
    'TelemetryProvider',
    'TemplateDrag'
  ]),
  industry: new Set([
    'AudioTalk',
    'Business404',
    'Cartoon404',
    'Doodle404',
    'GbsAlarmModal',
    'GbsCascadePanel',
    'GbsDeviceTree',
    'GbsGatewayForm',
    'GbsRegisterForm',
    'GbsSignMonitor',
    'GbsStatusCard',
    'GbsTimeSync',
    'Ink404',
    'Machine404',
    'OnvifAlarmPanel',
    'OnvifChannelManage',
    'OnvifDeviceList',
    'OnvifGroupTree',
    'OnvifRecordPlan',
    'OnvifSearch',
    'OnvifSettingPanel',
    'OnvifUrlForm',
    'PTZControl',
    'Pixel404',
    'Plant404',
    'Simple404',
    'Space404',
    'SplitVideoWall',
    'Tech404',
    'VcrBackupTask',
    'VcrClipCut',
    'VcrDownloadPanel',
    'VcrMarkPoint',
    'VcrSearchPanel',
    'VcrSpeedControl',
    'VcrStorageDashboard',
    'VcrTimelinePlayer',
    'VideoAdjust',
    'VideoPlayer',
    'VideoPreview',
    'VideoSnapshot',
    'VideoVolume',
    'VideoWatermark'
  ])
}

const assigned = new Map()
for (const [cat, set] of Object.entries(cats)) {
  for (const n of set) {
    if (assigned.has(n)) {
      console.error(`DUP ${n}: ${assigned.get(n)} vs ${cat}`)
      process.exit(1)
    }
    assigned.set(n, cat)
  }
}

const missing = names.filter((n) => !assigned.has(n))
const extra = [...assigned.keys()].filter((n) => !names.includes(n))
if (missing.length || extra.length) {
  console.error({ missing, extra })
  process.exit(1)
}

const categories = Object.keys(cats)
const byCategory = Object.fromEntries(categories.map((c) => [c, []]))
const components = {}
for (const n of names) {
  const category = assigned.get(n)
  byCategory[category].push(n)
  components[n] = {
    category,
    titleKey: `component.${toKebab(n)}.title`,
    leadKey: `component.${toKebab(n)}.lead`
  }
}
for (const c of categories) byCategory[c].sort((a, b) => a.localeCompare(b))

const out = {
  version: 1,
  generatedAt: new Date().toISOString(),
  total: names.length,
  categories,
  byCategory,
  components
}

fs.writeFileSync(path.join(root, 'example', 'component-catalog.json'), JSON.stringify(out, null, 2) + '\n')
console.log(`Wrote catalog: ${names.length} components`)
console.log(Object.fromEntries(categories.map((c) => [c, byCategory[c].length])))
