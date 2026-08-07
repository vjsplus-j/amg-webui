/**
 * Family Map SSOT rules for the 300-component hardening program.
 * Every public component must map to exactly one family.
 */

/** @typedef {'foundation'|'input'|'selection'|'datetime'|'form'|'overlay'|'feedback'|'navigation'|'layout'|'tree'|'table'|'upload'|'editor'|'charts'|'lowcode'|'media'|'gb28181'|'onvif'|'vcr'|'special'} FamilyId */

/** @type {Record<FamilyId, { id: FamilyId, label: string, gateProfile: string, engines: string[] }>} */
export const FAMILIES = {
  foundation: {
    id: 'foundation',
    label: 'Foundation',
    gateProfile: 'general',
    engines: ['form-control']
  },
  input: {
    id: 'input',
    label: 'Input',
    gateProfile: 'form',
    engines: ['form-control']
  },
  selection: {
    id: 'selection',
    label: 'Selection',
    gateProfile: 'form',
    engines: ['form-control', 'selection', 'keyboard', 'floating', 'virtualizer']
  },
  datetime: {
    id: 'datetime',
    label: 'DateTime',
    gateProfile: 'form',
    engines: ['form-control', 'datetime', 'floating']
  },
  form: {
    id: 'form',
    label: 'Form',
    gateProfile: 'form',
    engines: ['form-control']
  },
  overlay: {
    id: 'overlay',
    label: 'Overlay',
    gateProfile: 'overlay',
    engines: ['floating']
  },
  feedback: {
    id: 'feedback',
    label: 'Feedback',
    gateProfile: 'general',
    engines: ['feedback-queue']
  },
  navigation: {
    id: 'navigation',
    label: 'Navigation',
    gateProfile: 'general',
    engines: ['keyboard', 'navigation']
  },
  layout: {
    id: 'layout',
    label: 'Layout',
    gateProfile: 'general',
    engines: []
  },
  tree: {
    id: 'tree',
    label: 'Tree',
    gateProfile: 'data',
    engines: ['tree', 'virtualizer', 'keyboard']
  },
  table: {
    id: 'table',
    label: 'Table',
    gateProfile: 'data',
    engines: ['table-column', 'virtualizer', 'tree']
  },
  upload: {
    id: 'upload',
    label: 'Upload',
    gateProfile: 'form',
    engines: ['upload']
  },
  editor: {
    id: 'editor',
    label: 'Editor',
    gateProfile: 'general',
    engines: []
  },
  charts: {
    id: 'charts',
    label: 'Charts',
    gateProfile: 'general',
    engines: []
  },
  lowcode: {
    id: 'lowcode',
    label: 'Lowcode',
    gateProfile: 'general',
    engines: []
  },
  media: {
    id: 'media',
    label: 'Media',
    gateProfile: 'media',
    engines: ['media-adapter']
  },
  gb28181: {
    id: 'gb28181',
    label: 'GB28181',
    gateProfile: 'domain',
    engines: ['media-adapter']
  },
  onvif: {
    id: 'onvif',
    label: 'ONVIF',
    gateProfile: 'domain',
    engines: ['media-adapter']
  },
  vcr: {
    id: 'vcr',
    label: 'VCR',
    gateProfile: 'domain',
    engines: ['media-adapter']
  },
  special: {
    id: 'special',
    label: 'Special',
    gateProfile: 'general',
    engines: []
  }
}

/** Explicit name → family overrides (before package heuristics). */
export const FAMILY_BY_NAME = {
  // Foundation
  Button: 'foundation',
  ButtonGroup: 'foundation',
  Icon: 'foundation',
  Link: 'foundation',
  Tag: 'foundation',
  Badge: 'foundation',
  Avatar: 'foundation',
  AvatarGroup: 'foundation',
  Divider: 'foundation',
  Skeleton: 'foundation',
  StatusTip: 'foundation',
  Empty: 'foundation',
  Ellipsis: 'foundation',
  Highlight: 'foundation',
  Typography: 'foundation',
  Spin: 'foundation',
  Progress: 'foundation',
  ProgressTip: 'foundation',
  Statistic: 'foundation',
  Countdown: 'foundation',
  CopyText: 'foundation',
  Image: 'foundation',
  ImageGroup: 'foundation',
  Thumbnail: 'foundation',
  Card: 'foundation',
  CardGrid: 'foundation',
  CardWidgets: 'foundation',
  Block: 'foundation',
  Spacer: 'foundation',
  Scrollbar: 'foundation',
  Affix: 'foundation',
  BackTop: 'foundation',
  Watermark: 'foundation',
  FloatButton: 'foundation',
  Segmented: 'foundation',
  Collapse: 'foundation',
  Carousel: 'foundation',
  Clipboard: 'foundation',
  ConfigProvider: 'foundation',
  ThemeProvider: 'foundation',
  TelemetryProvider: 'foundation',
  NoticeBar: 'foundation',
  ScrollNotice: 'foundation',
  UserInfoCard: 'foundation',
  PageHeader: 'foundation',
  Preview: 'foundation',
  FilePreview: 'foundation',
  PdfPreview: 'foundation',
  Print: 'foundation',
  ResizeBox: 'foundation',
  Split: 'foundation',
  DragVerify: 'foundation',
  CryptoBox: 'foundation',
  BrowserDetect: 'foundation',

  // Input
  InputText: 'input',
  Textarea: 'input',
  Password: 'input',
  InputNumber: 'input',
  InputOTP: 'input',
  InputCaptcha: 'input',
  RangeInput: 'input',
  SmsCode: 'input',
  Search: 'input',
  TagInput: 'input',
  ColorInput: 'input',
  ColorPicker: 'input',
  Slider: 'input',
  Rate: 'input',
  Switch: 'input',
  Checkbox: 'input',
  CheckboxGroup: 'input',
  Radio: 'input',
  RadioGroup: 'input',

  // Selection
  Select: 'selection',
  AutoComplete: 'selection',
  Mention: 'selection',
  Cascader: 'selection',
  TreeSelect: 'selection',
  SelectNav: 'selection',
  Transfer: 'selection',
  TemplateSelect: 'selection',
  DragSelect: 'selection',

  // DateTime
  DatePicker: 'datetime',
  DateTimePicker: 'datetime',
  MonthPicker: 'datetime',
  YearPicker: 'datetime',
  WeekPicker: 'datetime',
  QuarterPicker: 'datetime',
  TimePicker: 'datetime',
  TimeSelect: 'datetime',
  TimeRangeInput: 'datetime',
  Calendar: 'datetime',

  // Form
  Form: 'form',
  FormItem: 'form',
  FormGroup: 'form',
  FormTabs: 'form',
  StepForm: 'form',
  DynamicForm: 'form',
  TreeForm: 'form',
  AdvancedSearch: 'form',
  FilterBar: 'form',
  SearchFilterPanel: 'form',
  LoginPanel: 'form',
  PermissionPanel: 'form',
  SettingPanel: 'form',

  // Overlay
  Dialog: 'overlay',
  Drawer: 'overlay',
  Popover: 'overlay',
  Tooltip: 'overlay',
  Dropdown: 'overlay',
  Popconfirm: 'overlay',
  MessageBox: 'overlay',
  ImageViewer: 'overlay',
  Tour: 'overlay',
  Mask: 'overlay',
  ConfirmDialog: 'overlay',
  ErrorModal: 'overlay',
  InfoModal: 'overlay',
  SuccessModal: 'overlay',
  WarnModal: 'overlay',

  // Feedback
  Alert: 'feedback',
  Message: 'feedback',
  Toast: 'feedback',
  Notification: 'feedback',
  Confirm: 'feedback',
  Loading: 'feedback',
  LoadingTip: 'feedback',
  Result: 'feedback',
  Exception: 'feedback',

  // Navigation
  Menu: 'navigation',
  MenuBar: 'navigation',
  Tabs: 'navigation',
  TabPane: 'navigation',
  TabsNav: 'navigation',
  Breadcrumb: 'navigation',
  BreadcrumbItem: 'navigation',
  Pagination: 'navigation',
  Anchor: 'navigation',
  ContextMenu: 'navigation',
  RouterNav: 'navigation',
  StepNav: 'navigation',
  Steps: 'navigation',
  StepItem: 'navigation',
  FloatNav: 'navigation',
  FooterNav: 'navigation',
  TopNav: 'navigation',
  MiniNav: 'navigation',
  QuickNav: 'navigation',
  IndexNav: 'navigation',
  GroupNav: 'navigation',
  CategoryNav: 'navigation',
  CardNav: 'navigation',
  PagerNav: 'navigation',
  ScrollNav: 'navigation',
  VerticalStepNav: 'navigation',

  // Layout
  Layout: 'layout',
  Header: 'layout',
  Footer: 'layout',
  Main: 'layout',
  Sider: 'layout',
  Row: 'layout',
  Col: 'layout',
  Space: 'layout',
  Center: 'layout',
  Container: 'layout',
  StackLayout: 'layout',
  FlowLayout: 'layout',
  ColumnLayout: 'layout',
  FixedLayout: 'layout',
  EmbedLayout: 'layout',
  ScaleLayout: 'layout',
  FormLayout: 'layout',

  // Tree
  Tree: 'tree',
  VirtualTree: 'tree',
  LazyTree: 'tree',
  EditTree: 'tree',
  FolderTree: 'tree',
  TransferTree: 'tree',
  TreeTransfer: 'tree',

  // Table
  DataTable: 'table',
  VirtualTable: 'table',
  ProTable: 'table',
  TreeTable: 'table',
  EditTable: 'table',
  DrillTable: 'table',
  MergeTable: 'table',
  StickyTable: 'table',
  PivotTable: 'table',
  TableAction: 'table',
  TableDrag: 'table',
  TableExport: 'table',
  TablePrint: 'table',
  Descriptions: 'table',
  DescriptionsItem: 'table',
  CardList: 'table',
  DataCard: 'table',
  DetailPanel: 'table',
  BatchPanel: 'table',
  FlowPanel: 'table',
  Dashboard: 'table',
  Ranking: 'table',
  Timeline: 'table',
  TimelineItem: 'table',
  TimelineList: 'table',
  InfiniteScroll: 'table',
  Waterfall: 'table',
  ExcelIo: 'table',

  // Upload
  Upload: 'upload',
  ImageUpload: 'upload',
  ChunkUpload: 'upload',
  BatchUpload: 'upload',
  ImageCrop: 'upload',

  // Editor
  RichText: 'editor',
  MdEditor: 'editor',
  CodeEditor: 'editor',

  // Charts — package heuristic
  // Lowcode — package heuristic

  // Media (non-Vcr)
  VideoPlayer: 'media',
  VideoPreview: 'media',
  VideoSnapshot: 'media',
  VideoVolume: 'media',
  VideoAdjust: 'media',
  VideoWatermark: 'media',
  AudioTalk: 'media',
  AudioPlay: 'media',
  PTZControl: 'media',
  SplitVideoWall: 'media',

  // Special
  Qrcode: 'special',
  Barcode: 'special',
  OcrScan: 'special',
  MatrixCode: 'special',
  Business404: 'special',
  Cartoon404: 'special',
  Doodle404: 'special',
  Ink404: 'special',
  Machine404: 'special',
  Pixel404: 'special',
  Plant404: 'special',
  Simple404: 'special',
  Space404: 'special',
  Tech404: 'special'
}

/**
 * @param {string} name
 * @param {string} pkg
 * @returns {FamilyId}
 */
export function resolveFamily(name, pkg) {
  if (FAMILY_BY_NAME[name]) return FAMILY_BY_NAME[name]
  if (pkg === 'charts') return 'charts'
  if (pkg === 'lowcode') return 'lowcode'
  if (pkg === 'gb28181') return 'gb28181'
  if (pkg === 'onvif') return 'onvif'
  if (pkg === 'media' && name.startsWith('Vcr')) return 'vcr'
  if (pkg === 'media') return 'media'
  if (pkg === 'editor') return 'editor'
  if (pkg === 'overlay') return 'overlay'
  // fallbacks
  if (/Tree/.test(name)) return 'tree'
  if (/Table|Descriptions|Timeline|Dashboard/.test(name)) return 'table'
  if (/Nav|Menu|Tab|Breadcrumb|Pagination|Anchor|Steps/.test(name)) return 'navigation'
  if (/Layout|Header|Footer|Main|Sider|Row|Col|Space|Center|Container/.test(name))
    return 'layout'
  if (/Upload|Crop/.test(name)) return 'upload'
  if (/404|Qrcode|Barcode|Ocr|Matrix/.test(name)) return 'special'
  if (pkg === 'form') return 'input'
  if (pkg === 'data') return 'table'
  if (pkg === 'core') return 'foundation'
  return 'foundation'
}

/** Batch definitions aligned to CSV B01–B24 */
export const BATCH_DEFS = [
  {
    id: 'B01',
    family: 'foundation',
    title: 'Foundation Core',
    priority: 'P0',
    components: [
      'Button',
      'Icon',
      'Link',
      'Tag',
      'Badge',
      'Divider',
      'Avatar',
      'StatusTip'
    ]
  },
  {
    id: 'B02',
    family: 'input',
    title: 'Input Core',
    priority: 'P0',
    components: [
      'InputText',
      'Textarea',
      'Password',
      'InputNumber',
      'RangeInput',
      'InputOTP'
    ]
  },
  {
    id: 'B03',
    family: 'form',
    title: 'Form Family',
    priority: 'P0',
    components: ['Form', 'FormItem', 'FormGroup', 'FormTabs', 'StepForm', 'DynamicForm']
  },
  {
    id: 'B04',
    family: 'selection',
    title: 'Selection Core',
    priority: 'P0',
    components: ['Select', 'AutoComplete', 'Mention', 'TemplateSelect']
  },
  {
    id: 'B05',
    family: 'selection',
    title: 'Selection Advanced',
    priority: 'P0',
    components: ['TreeSelect', 'Cascader', 'SelectNav', 'DragSelect']
  },
  {
    id: 'B06',
    family: 'datetime',
    title: 'Date Family',
    priority: 'P0',
    components: [
      'DatePicker',
      'DateTimePicker',
      'MonthPicker',
      'YearPicker',
      'WeekPicker',
      'QuarterPicker'
    ]
  },
  {
    id: 'B07',
    family: 'datetime',
    title: 'Time Family',
    priority: 'P0',
    components: ['TimePicker', 'TimeSelect', 'TimeRangeInput', 'Calendar']
  },
  {
    id: 'B08',
    family: 'overlay',
    title: 'Overlay Family',
    priority: 'P0',
    components: ['Dialog', 'Drawer', 'Popover', 'Tooltip', 'Dropdown', 'Popconfirm']
  },
  {
    id: 'B09',
    family: 'feedback',
    title: 'Feedback Family',
    priority: 'P1',
    components: [
      'Message',
      'Toast',
      'Notification',
      'Alert',
      'Confirm',
      'Loading',
      'Result'
    ]
  },
  {
    id: 'B10',
    family: 'navigation',
    title: 'Navigation Family',
    priority: 'P1',
    components: [
      'Menu',
      'Tabs',
      'Breadcrumb',
      'Pagination',
      'Anchor',
      'ContextMenu',
      'RouterNav'
    ]
  },
  {
    id: 'B11',
    family: 'layout',
    title: 'Layout Family',
    priority: 'P1',
    components: [
      'Layout',
      'Header',
      'Footer',
      'Main',
      'Sider',
      'Row',
      'Col',
      'Space',
      'StackLayout',
      'FlowLayout'
    ]
  },
  {
    id: 'B12',
    family: 'tree',
    title: 'Tree Core',
    priority: 'P1',
    components: ['Tree', 'VirtualTree', 'LazyTree']
  },
  {
    id: 'B13',
    family: 'table',
    title: 'Table Core',
    priority: 'P1',
    components: ['DataTable', 'VirtualTable', 'ProTable', 'Descriptions']
  },
  {
    id: 'B14',
    family: 'table',
    title: 'Table Advanced',
    priority: 'P1',
    components: ['TreeTable', 'EditTable', 'DrillTable', 'StickyTable', 'PivotTable']
  },
  {
    id: 'B15',
    family: 'upload',
    title: 'Upload Family',
    priority: 'P1',
    components: ['Upload', 'ImageUpload', 'ChunkUpload', 'BatchUpload', 'ImageCrop']
  },
  {
    id: 'B16',
    family: 'editor',
    title: 'Editor Family',
    priority: 'P1',
    components: ['RichText', 'MdEditor', 'CodeEditor']
  },
  {
    id: 'B17',
    family: 'charts',
    title: 'Charts Family',
    priority: 'P2',
    components: [
      'BarChart',
      'LineChart',
      'PieChart',
      'GaugeChart',
      'RadarChart',
      'HeatMap',
      'GraphChart',
      'TreeChart',
      'WordCloud'
    ]
  },
  {
    id: 'B18',
    family: 'lowcode',
    title: 'Lowcode Family',
    priority: 'P2',
    components: [
      'DragCanvas',
      'CanvasPreview',
      'PropPanel',
      'SchemaRenderer',
      'CanvasNode',
      'CanvasLayer'
    ]
  },
  {
    id: 'B19',
    family: 'media',
    title: 'Media Core',
    priority: 'P1',
    components: [
      'VideoPlayer',
      'VideoPreview',
      'VideoSnapshot',
      'VideoVolume',
      'VideoAdjust',
      'VideoWatermark',
      'AudioTalk'
    ]
  },
  {
    id: 'B20',
    family: 'media',
    title: 'Media Control',
    priority: 'P1',
    components: ['PTZControl', 'SplitVideoWall', 'AudioPlay']
  },
  {
    id: 'B21',
    family: 'gb28181',
    title: 'GB28181 Domain',
    priority: 'P2',
    components: [
      'GbsAlarmModal',
      'GbsCascadePanel',
      'GbsDeviceTree',
      'GbsGatewayForm',
      'GbsRegisterForm',
      'GbsSignMonitor',
      'GbsStatusCard',
      'GbsTimeSync'
    ]
  },
  {
    id: 'B22',
    family: 'onvif',
    title: 'ONVIF Domain',
    priority: 'P2',
    components: [
      'OnvifAlarmPanel',
      'OnvifChannelManage',
      'OnvifDeviceList',
      'OnvifGroupTree',
      'OnvifRecordPlan',
      'OnvifSearch',
      'OnvifSettingPanel',
      'OnvifUrlForm'
    ]
  },
  {
    id: 'B23',
    family: 'vcr',
    title: 'VCR Domain',
    priority: 'P2',
    components: [
      'VcrBackupTask',
      'VcrClipCut',
      'VcrDownloadPanel',
      'VcrMarkPoint',
      'VcrSearchPanel',
      'VcrSpeedControl',
      'VcrStorageDashboard',
      'VcrTimelinePlayer'
    ]
  },
  {
    id: 'B24',
    family: 'special',
    title: 'Special Components',
    priority: 'P2',
    components: [
      'Qrcode',
      'Barcode',
      'OcrScan',
      'Business404',
      'Simple404',
      'Tech404'
    ]
  }
]
