/**
 * SSOT: component directory name → package id.
 * Used by generate-entry, create-component, catalog, migrate, boundary checks.
 *
 * Package ids:
 *   core | form | data | overlay | charts | editor | media | gb28181 | onvif | lowcode
 *
 * Physical dirs:
 *   packages/components/<id>/…   for all except lowcode
 *   packages/lowcode/ui/…        for lowcode UI cluster
 */
export const COMPONENT_PACKAGES = [
  'core',
  'form',
  'data',
  'overlay',
  'charts',
  'editor',
  'media',
  'gb28181',
  'onvif',
  'lowcode'
]

/** Foundation packages re-exported from root / components barrel */
export const FOUNDATION_PACKAGES = ['core', 'form', 'data', 'overlay']

/** Industry — opt-in only; never from root barrel or core */
export const INDUSTRY_PACKAGES = ['media', 'gb28181', 'onvif']

/** Packages that must never import INDUSTRY_PACKAGES */
export const FOUNDATION_BOUNDARY_PACKAGES = ['core', 'form', 'data', 'overlay', 'charts', 'editor']

/**
 * Explicit ownership. Anything not listed is an error at migrate/validate time
 * (callers must assign every scanned dir).
 * @type {Record<string, string[]>}
 */
export const PACKAGE_COMPONENTS = {
  gb28181: [
    'GbsAlarmModal',
    'GbsCascadePanel',
    'GbsDeviceTree',
    'GbsGatewayForm',
    'GbsRegisterForm',
    'GbsSignMonitor',
    'GbsStatusCard',
    'GbsTimeSync'
  ],
  onvif: [
    'OnvifAlarmPanel',
    'OnvifChannelManage',
    'OnvifDeviceList',
    'OnvifGroupTree',
    'OnvifRecordPlan',
    'OnvifSearch',
    'OnvifSettingPanel',
    'OnvifUrlForm'
  ],
  media: [
    'AudioPlay',
    'AudioTalk',
    'PTZControl',
    'SplitVideoWall',
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
  ],
  charts: [
    'BarChart',
    'GaugeChart',
    'GraphChart',
    'HeatMap',
    'LineChart',
    'PieChart',
    'RadarChart',
    'TreeChart',
    'WordCloud'
  ],
  editor: ['CodeEditor', 'MdEditor', 'RichText'],
  lowcode: [
    'CanvasIo',
    'CanvasLayer',
    'CanvasNode',
    'CanvasPreview',
    'CanvasShortcut',
    'DragCanvas',
    'DragMaterial',
    'DragRuler',
    'DragSelect',
    'DragSortNode',
    'DragWrapper',
    'FreeLayoutDrag',
    'GridLayoutDrag',
    'PropPanel',
    'SchemaRenderer',
    'TemplateDrag',
    'TemplateSelect'
  ],
  overlay: [
    'Confirm',
    'ConfirmDialog',
    'ContextMenu',
    'Dialog',
    'Drawer',
    'Dropdown',
    'ErrorModal',
    'InfoModal',
    'Mask',
    'Message',
    'MessageBox',
    'Notification',
    'Popover',
    'SuccessModal',
    'Toast',
    'Tour',
    'WarnModal'
  ],
  form: [
    'AdvancedSearch',
    'AutoComplete',
    'BatchUpload',
    'Cascader',
    'Checkbox',
    'CheckboxGroup',
    'ChunkUpload',
    'ColorInput',
    'ColorPicker',
    'DatePicker',
    'DateTimePicker',
    'DynamicForm',
    'FilterBar',
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
    'Mention',
    'MonthPicker',
    'Password',
    'PermissionPanel',
    'QuarterPicker',
    'Radio',
    'RadioGroup',
    'RangeInput',
    'Rate',
    'Search',
    'SearchFilterPanel',
    'Select',
    'SelectNav',
    'SettingPanel',
    'Slider',
    'SmsCode',
    'StepForm',
    'Switch',
    'TagInput',
    'Textarea',
    'TimePicker',
    'TimeRangeInput',
    'TimeSelect',
    'Transfer',
    'TreeForm',
    'Upload',
    'WeekPicker',
    'YearPicker'
  ],
  data: [
    'BatchPanel',
    'Calendar',
    'CardList',
    'Dashboard',
    'DataCard',
    'DataTable',
    'DetailPanel',
    'Descriptions',
    'DescriptionsItem',
    'DrillTable',
    'EditTable',
    'EditTree',
    'ExcelIo',
    'FlowPanel',
    'FolderTree',
    'InfiniteScroll',
    'LazyTree',
    'MergeTable',
    'Pagination',
    'PivotTable',
    'ProTable',
    'Ranking',
    'StickyTable',
    'TableAction',
    'TableDrag',
    'TableExport',
    'TablePrint',
    'Timeline',
    'TimelineItem',
    'TimelineList',
    'TransferTree',
    'Tree',
    'TreeSelect',
    'TreeTable',
    'TreeTransfer',
    'VirtualTable',
    'VirtualTree',
    'Waterfall'
  ],
  /** Remainder of former base — primitives, layout, nav, page states, providers.
   * Popconfirm stays in core (Button confirm prop) to avoid core↔overlay cycles. */
  core: [
    'Affix',
    'Alert',
    'Anchor',
    'Avatar',
    'AvatarGroup',
    'BackTop',
    'Badge',
    'Barcode',
    'Block',
    'Breadcrumb',
    'BreadcrumbItem',
    'BrowserDetect',
    'Business404',
    'Button',
    'ButtonGroup',
    'Card',
    'CardGrid',
    'CardNav',
    'CardWidgets',
    'Carousel',
    'Cartoon404',
    'CategoryNav',
    'Center',
    'Clipboard',
    'Col',
    'Collapse',
    'ColumnLayout',
    'ConfigProvider',
    'Container',
    'CopyText',
    'Countdown',
    'CryptoBox',
    'Divider',
    'Doodle404',
    'DragVerify',
    'Ellipsis',
    'EmbedLayout',
    'Empty',
    'Exception',
    'FilePreview',
    'FixedLayout',
    'FloatButton',
    'FloatNav',
    'FlowLayout',
    'Footer',
    'FooterNav',
    'FormLayout',
    'GroupNav',
    'Header',
    'Highlight',
    'Icon',
    'Image',
    'ImageCrop',
    'ImageGroup',
    'ImageViewer',
    'IndexNav',
    'Ink404',
    'Layout',
    'Link',
    'Loading',
    'LoadingTip',
    'Machine404',
    'Main',
    'MatrixCode',
    'Menu',
    'MenuBar',
    'MiniNav',
    'NoticeBar',
    'OcrScan',
    'PageHeader',
    'PagerNav',
    'PdfPreview',
    'Pixel404',
    'Plant404',
    'Popconfirm',
    'Preview',
    'Print',
    'Progress',
    'ProgressTip',
    'Qrcode',
    'QuickNav',
    'ResizeBox',
    'Result',
    'RouterNav',
    'Row',
    'ScaleLayout',
    'ScrollNav',
    'ScrollNotice',
    'Scrollbar',
    'Segmented',
    'Sider',
    'Simple404',
    'Skeleton',
    'Space',
    'Space404',
    'Spacer',
    'Spin',
    'Split',
    'StackLayout',
    'Statistic',
    'StatusTip',
    'StepItem',
    'StepNav',
    'Steps',
    'TabPane',
    'Tabs',
    'TabsNav',
    'Tag',
    'Tech404',
    'TelemetryProvider',
    'ThemeProvider',
    'Thumbnail',
    'Tooltip',
    'TopNav',
    'Typography',
    'UserInfoCard',
    'VerticalStepNav',
    'Watermark'
  ]
}

/** @type {Map<string, string>} */
export const componentToPackage = new Map()
for (const [pkg, names] of Object.entries(PACKAGE_COMPONENTS)) {
  for (const name of names) {
    if (componentToPackage.has(name)) {
      throw new Error(
        `[component-package-map] duplicate ${name}: ${componentToPackage.get(name)} vs ${pkg}`
      )
    }
    componentToPackage.set(name, pkg)
  }
}

/** Absolute-ish relative path from repo root for a component dir */
export function componentDirRel(name) {
  const pkg = componentToPackage.get(name)
  if (!pkg) throw new Error(`[component-package-map] unknown component: ${name}`)
  if (pkg === 'lowcode') return `packages/lowcode/ui/${name}`
  return `packages/components/${pkg}/${name}`
}

/** Import alias for a package */
export function packageAlias(pkg) {
  if (pkg === 'lowcode') return '@amg-webui/lowcode'
  return `@amg-webui/${pkg}`
}

/** Special barrel lines (non-default-only exports) */
export const SPECIAL_BARREL_EXPORTS = {
  SchemaRenderer:
    "export { default as SchemaRenderer, SchemaNodeRenderer } from './SchemaRenderer'"
}

export function listComponentsForPackage(pkg) {
  return [...(PACKAGE_COMPONENTS[pkg] || [])].sort()
}

export function allMappedComponentNames() {
  return [...componentToPackage.keys()].sort()
}
