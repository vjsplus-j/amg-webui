/**
 * Element Plus parity map for example sidebar badges.
 *
 * Source of truth for “EP has a counterpart”:
 * - Element Plus export list (`packages/element-plus/component.ts` on EP `dev`)
 * - EP overview categories (Message / MessageBox / Notification / Loading / Infinite Scroll)
 *
 * Keys = AMG catalog PascalCase names.
 * Values = closest EP component / service name (documentation aid only).
 *
 * Catalog names **not** listed here are treated as AMG-exclusive → sidebar “New” badge.
 *
 * @see https://element-plus.org/en-US/component/overview
 */
export const EP_PARITY_MAP: Readonly<Record<string, string>> = {
  // Basic / config
  Affix: 'Affix',
  Alert: 'Alert',
  Anchor: 'Anchor',
  AutoComplete: 'Autocomplete',
  Avatar: 'Avatar',
  AvatarGroup: 'AvatarGroup',
  BackTop: 'Backtop',
  Badge: 'Badge',
  Breadcrumb: 'Breadcrumb',
  BreadcrumbItem: 'BreadcrumbItem',
  Button: 'Button',
  ButtonGroup: 'ButtonGroup',
  Calendar: 'Calendar',
  Card: 'Card',
  Carousel: 'Carousel',
  Cascader: 'Cascader',
  Checkbox: 'Checkbox',
  CheckboxGroup: 'CheckboxGroup',
  Col: 'Col',
  Collapse: 'Collapse',
  ColorPicker: 'ColorPicker',
  ConfigProvider: 'ConfigProvider',
  Container: 'Container',
  Layout: 'Container',
  Sider: 'Aside',
  Header: 'Header',
  Footer: 'Footer',
  Main: 'Main',
  // Form
  DatePicker: 'DatePicker',
  DateTimePicker: 'DatePicker',
  MonthPicker: 'DatePicker',
  YearPicker: 'DatePicker',
  WeekPicker: 'DatePicker',
  QuarterPicker: 'DatePicker',
  Descriptions: 'Descriptions',
  DescriptionsItem: 'DescriptionsItem',
  Dialog: 'Dialog',
  Divider: 'Divider',
  Drawer: 'Drawer',
  Dropdown: 'Dropdown',
  Empty: 'Empty',
  Form: 'Form',
  FormItem: 'FormItem',
  Icon: 'Icon',
  Image: 'Image',
  ImageViewer: 'ImageViewer',
  InputText: 'Input',
  Password: 'Input',
  Textarea: 'Input',
  InputNumber: 'InputNumber',
  TagInput: 'InputTag',
  InputOTP: 'InputOTP',
  Link: 'Link',
  Mention: 'Mention',
  Menu: 'Menu',
  MenuBar: 'Menu',
  PageHeader: 'PageHeader',
  Pagination: 'Pagination',
  Popconfirm: 'Popconfirm',
  Popover: 'Popover',
  Progress: 'Progress',
  Radio: 'Radio',
  RadioGroup: 'RadioGroup',
  Rate: 'Rate',
  Result: 'Result',
  Row: 'Row',
  Scrollbar: 'Scrollbar',
  Segmented: 'Segmented',
  Select: 'Select',
  Skeleton: 'Skeleton',
  Slider: 'Slider',
  Space: 'Space',
  Statistic: 'Statistic',
  Countdown: 'Countdown',
  Steps: 'Steps',
  StepItem: 'Step',
  Switch: 'Switch',
  DataTable: 'Table',
  VirtualTable: 'TableV2',
  Tabs: 'Tabs',
  TabsNav: 'Tabs',
  TabPane: 'TabPane',
  Tag: 'Tag',
  Typography: 'Text',
  TimePicker: 'TimePicker',
  TimeSelect: 'TimeSelect',
  Timeline: 'Timeline',
  TimelineItem: 'TimelineItem',
  Tooltip: 'Tooltip',
  Transfer: 'Transfer',
  Tree: 'Tree',
  TreeSelect: 'TreeSelect',
  VirtualTree: 'TreeV2',
  Upload: 'Upload',
  Watermark: 'Watermark',
  Tour: 'Tour',
  Split: 'Splitter',
  // Feedback / services (EP overview)
  Loading: 'Loading',
  Message: 'Message',
  MessageBox: 'MessageBox',
  Notification: 'Notification',
  InfiniteScroll: 'InfiniteScroll'
} as const

export type EpParityAmgName = keyof typeof EP_PARITY_MAP

/** AMG component has a clear Element Plus counterpart. */
export function hasEpParity(name: string): boolean {
  return Object.prototype.hasOwnProperty.call(EP_PARITY_MAP, name)
}

/** EP component / service name for docs (or null if exclusive). */
export function epCounterpartOf(name: string): string | null {
  return EP_PARITY_MAP[name] ?? null
}

/** Catalog component with no EP counterpart → exclusive / “New”. */
export function isAmgExclusive(name: string): boolean {
  return !hasEpParity(name)
}
