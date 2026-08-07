/**
 * Shared display names and related-component maps for docs / metadata generation.
 * Imported by generate-vitepress-api.mjs and generate-component-metadata.mjs.
 */

/** P0 foundation docs set — metadata-driven regen priority */
export const P0_COMPONENTS = [
  'Button',
  'InputText',
  'Select',
  'Checkbox',
  'Radio',
  'Switch',
  'DatePicker',
  'Form',
  'DataTable',
  'Tree',
  'Dialog',
  'Drawer',
  'Tabs',
  'Menu',
  'Pagination',
  'Upload'
]

export const DISPLAY_NAMES = {
  Button: 'Button 按钮',
  InputText: 'InputText 文本输入',
  Select: 'Select 选择器',
  Checkbox: 'Checkbox 复选框',
  Radio: 'Radio 单选框',
  Switch: 'Switch 开关',
  DatePicker: 'DatePicker 日期选择',
  Form: 'Form 表单',
  DataTable: 'DataTable 数据表格',
  Tree: 'Tree 树形控件',
  Dialog: 'Dialog 对话框',
  Drawer: 'Drawer 抽屉',
  Tabs: 'Tabs 标签页',
  Menu: 'Menu 菜单',
  Pagination: 'Pagination 分页',
  Upload: 'Upload 上传',
  MessageBox: 'MessageBox 命令式对话框',
  ConfigProvider: 'ConfigProvider 全局配置',
  ButtonGroup: 'ButtonGroup 按钮组',
  AutoComplete: 'AutoComplete 自动完成',
  DateTimePicker: 'DateTimePicker 日期时间',
  TimePicker: 'TimePicker 时间选择',
  ColorPicker: 'ColorPicker 颜色选择',
  TreeSelect: 'TreeSelect 树形选择',
  DynamicForm: 'DynamicForm 动态表单',
  StepForm: 'StepForm 分步表单'
}

export const RELATED = {
  Form: ['FormItem', 'FormGroup', 'FormTabs', 'DynamicForm', 'StepForm', 'InputText'],
  FormItem: ['Form', 'InputText', 'Select', 'Checkbox'],
  FormGroup: ['Form', 'FormItem'],
  FormTabs: ['Form', 'FormItem', 'Tabs'],
  DynamicForm: ['Form', 'FormItem'],
  StepForm: ['Form', 'FormItem'],
  InputText: ['Form', 'FormItem', 'Textarea', 'Password', 'InputNumber'],
  Textarea: ['Form', 'FormItem', 'InputText'],
  Password: ['Form', 'FormItem', 'InputText'],
  InputNumber: ['Form', 'FormItem', 'InputText'],
  InputOTP: ['Form', 'FormItem'],
  Mention: ['Form', 'FormItem', 'InputText'],
  Select: ['Form', 'FormItem', 'SelectNav', 'TreeSelect', 'Cascader'],
  AutoComplete: ['Form', 'FormItem', 'InputText', 'Select'],
  Cascader: ['Form', 'FormItem', 'Select'],
  TreeSelect: ['Form', 'FormItem', 'Select', 'Tree'],
  DatePicker: ['Form', 'FormItem', 'DateTimePicker', 'TimePicker', 'Calendar'],
  DateTimePicker: ['Form', 'FormItem', 'DatePicker', 'TimePicker'],
  TimePicker: ['Form', 'FormItem', 'DateTimePicker', 'TimeSelect'],
  TimeSelect: ['Form', 'FormItem', 'TimePicker'],
  TimeRangeInput: ['Form', 'FormItem', 'TimePicker', 'RangeInput'],
  RangeInput: ['Form', 'FormItem', 'InputNumber'],
  ColorPicker: ['Form', 'FormItem'],
  Calendar: ['DatePicker', 'DateTimePicker'],
  SelectNav: ['Select', 'Menu'],
  Button: ['ButtonGroup', 'Dialog'],
  Dialog: ['Button', 'Form'],
  DataTable: ['Pagination', 'Form'],
  Tree: ['TreeSelect', 'TreeTable'],
  Drawer: ['Dialog', 'Form'],
  Tabs: ['TabPane', 'Menu'],
  Menu: ['MenuBar', 'SelectNav'],
  Pagination: ['DataTable'],
  Upload: ['Form', 'FormItem'],
  Checkbox: ['CheckboxGroup', 'Form'],
  Radio: ['RadioGroup', 'Form'],
  Switch: ['Form', 'FormItem']
}

export function parseDisplayTitle(name, fallbackTitle) {
  const display = DISPLAY_NAMES[name] || fallbackTitle || name
  const m = String(display).match(/^(\S+)\s+(.+)$/)
  if (m) return { title: m[1], titleZh: m[2] }
  return { title: display, titleZh: '' }
}

export function consumerImportFrom(pkg) {
  if (pkg === 'lowcode') return 'amg-webui/lowcode'
  return `amg-webui/${pkg}`
}

/** Re-exported by generate-vitepress-api.mjs for backward compatibility */
export { DISPLAY_NAMES as default }
