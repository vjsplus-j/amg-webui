/**
 * Generates curated demos + i18n for Mission A form/feedback components.
 * Run: node scripts/generate-form-feedback-demos.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const LOCALES = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']

/** @type {Record<string, Record<string, string>>} */
const COPY = {
  'zh-CN': {
    inputText: {
      when: '单行文本输入，适合姓名、标题、关键词等短文本采集。',
      'demo.basic': '基础用法',
      'demo.basicDesc': 'v-model 绑定字符串；placeholder / disabled / invalid 状态。',
      'prop.modelValue': '输入值（v-model）',
      'prop.placeholder': '占位提示',
      'prop.size': '尺寸 xs–xl',
      'sample.placeholder': '请输入内容'
    },
    inputNumber: {
      when: '数字输入与步进，适合数量、金额、阈值等数值字段。',
      'demo.basic': '基础用法',
      'demo.basicDesc': 'v-model 绑定 number；min / max / step 控制范围。',
      'prop.modelValue': '数值（v-model）',
      'prop.minMax': '最小值与最大值',
      'sample.label': '数量'
    },
    password: {
      when: '密码输入，支持显隐切换，适合登录与敏感字段。',
      'demo.basic': '基础用法',
      'demo.basicDesc': 'type=password 与切换可见；v-model 绑定。',
      'prop.modelValue': '密码值（v-model）',
      'sample.placeholder': '请输入密码'
    },
    textarea: {
      when: '多行文本，适合备注、描述、反馈等较长内容。',
      'demo.basic': '基础用法',
      'demo.basicDesc': 'v-model 绑定；rows / autoResize 控制高度。',
      'prop.modelValue': '文本（v-model）',
      'sample.placeholder': '请输入备注'
    },
    select: {
      when: '下拉选择，适合枚举、状态、分类等单选场景。',
      'demo.basic': '基础用法',
      'demo.basicDesc': 'options 声明选项；v-model 绑定 value。',
      'prop.modelValue': '选中值（v-model）',
      'prop.options': '选项列表 label/value',
      'sample.placeholder': '请选择',
      'sample.optA': '选项 A',
      'sample.optB': '选项 B',
      'sample.optC': '选项 C'
    },
    cascader: {
      when: '级联选择，适合省市区、分类树等多级枚举。',
      'demo.basic': '基础用法',
      'demo.basicDesc': 'options 树形 children；v-model 绑定叶子或路径值。',
      'prop.modelValue': '选中值（v-model）',
      'prop.options': '级联选项树',
      'sample.placeholder': '请选择地区',
      'sample.regionA': '华东',
      'sample.regionB': '华南',
      'sample.citySh': '上海',
      'sample.cityHz': '杭州',
      'sample.cityGz': '广州'
    },
    autoComplete: {
      when: '输入联想与补全，适合搜索框、邮箱域名提示等。',
      'demo.basic': '基础用法',
      'demo.basicDesc': 'suggestions 过滤匹配；选中写入 v-model。',
      'prop.modelValue': '输入值（v-model）',
      'prop.suggestions': '候选建议列表',
      'sample.placeholder': '输入关键词'
    },
    datePicker: {
      when: '日期选择，适合生日、截止日期等纯日期字段。',
      'demo.basic': '基础用法',
      'demo.basicDesc': 'v-model 绑定 Date 或 ISO 字符串。',
      'prop.modelValue': '日期值（v-model）',
      'sample.placeholder': '选择日期'
    },
    dateTimePicker: {
      when: '日期时间选择，适合预约、日志时间点等。',
      'demo.basic': '基础用法',
      'demo.basicDesc': '同时选择日期与时间；v-model 绑定。',
      'prop.modelValue': '日期时间（v-model）',
      'sample.placeholder': '选择日期时间'
    },
    timePicker: {
      when: '时间选择，适合每日时段、闹钟等。',
      'demo.basic': '基础用法',
      'demo.basicDesc': 'v-model 绑定时间字符串或 Date。',
      'prop.modelValue': '时间值（v-model）',
      'sample.placeholder': '选择时间'
    },
    search: {
      when: '搜索输入框，带搜索图标与 enter 触发。',
      'demo.basic': '基础用法',
      'demo.basicDesc': 'v-model + @search 提交关键词。',
      'prop.modelValue': '关键词（v-model）',
      'sample.placeholder': '搜索…'
    },
    slider: {
      when: '滑块调节数值或区间，适合音量、范围筛选等。',
      'demo.basic': '单值滑块',
      'demo.basicDesc': 'min / max / step；v-model 绑定 number。',
      'demo.range': '区间滑块',
      'demo.rangeDesc': 'range 模式绑定 [min, max] 元组。',
      'prop.modelValue': '当前值或区间（v-model）',
      'prop.range': '是否区间模式'
    },
    rate: {
      when: '星级评分，适合评价、满意度等。',
      'demo.basic': '基础用法',
      'demo.basicDesc': 'v-model 绑定 0–max 分值；allowHalf 半星。',
      'prop.modelValue': '分值（v-model）',
      'prop.max': '最大星数'
    },
    tagInput: {
      when: '标签输入，适合关键词、收件人等多值字符串。',
      'demo.basic': '基础用法',
      'demo.basicDesc': 'Enter 添加标签；v-model 绑定 string[]。',
      'prop.modelValue': '标签数组（v-model）',
      'sample.placeholder': '输入后回车添加'
    },
    upload: {
      when: '文件上传，支持点击与拖拽；展示文件列表。',
      'demo.basic': '基础上传',
      'demo.basicDesc': 'v-model 文件列表；multiple / drag 可配置。',
      'prop.modelValue': '文件列表（v-model）',
      'sample.hint': '拖拽文件到此处或点击上传'
    },
    imageUpload: {
      when: '图片上传与预览，适合头像、相册、附件缩略图。',
      'demo.basic': '图片上传',
      'demo.basicDesc': 'accept=image/*；maxCount 限制数量。',
      'prop.modelValue': '图片项列表（v-model）',
      'prop.maxCount': '最大张数'
    },
    filterBar: {
      when: '筛选条：多条件行 + 运算符，适合列表页快捷过滤。',
      'demo.basic': '条件筛选',
      'demo.basicDesc': 'fields 声明字段；v-model 绑定 FilterCondition[]。',
      'prop.modelValue': '条件数组（v-model）',
      'prop.fields': '可筛字段',
      'sample.fieldName': '名称',
      'sample.fieldStatus': '状态'
    },
    advancedSearch: {
      when: '高级搜索：多条件 + AND/OR 逻辑 + 模板保存。',
      'demo.basic': '高级搜索',
      'demo.basicDesc': 'logic 切换；fields / templates 声明。',
      'prop.modelValue': '条件数组（v-model）',
      'prop.logic': 'AND / OR 逻辑',
      'sample.fieldName': '名称',
      'sample.fieldTag': '标签'
    },
    alert: {
      when: '页面内静态提示，展示成功/警告/错误等信息。',
      'demo.basic': '类型',
      'demo.basicDesc': 'severity 控制样式；closable 可关闭。',
      'prop.severity': 'info / success / warning / danger',
      'prop.closable': '是否显示关闭按钮',
      'sample.info': '这是一条提示信息。',
      'sample.success': '操作已成功完成。',
      'sample.warning': '请注意相关风险。',
      'sample.danger': '发生错误，请重试。'
    },
    dialog: {
      when: '模态对话框，适合表单、详情、二次确认等。',
      'demo.basic': '基础对话框',
      'demo.basicDesc': 'v-model:visible 控制；header/footer 插槽。',
      'prop.visible': '是否可见（v-model:visible）',
      'prop.modal': '是否模态遮罩',
      'sample.open': '打开对话框',
      'sample.title': '对话框标题',
      'sample.body': '对话框内容区域。'
    },
    drawer: {
      when: '抽屉面板，从边缘滑出，适合筛选、设置、详情。',
      'demo.basic': '基础抽屉',
      'demo.basicDesc': 'placement 左/右；v-model:visible。',
      'prop.visible': '是否可见（v-model:visible）',
      'prop.placement': 'left / right',
      'sample.open': '打开抽屉',
      'sample.title': '抽屉标题',
      'sample.body': '抽屉内容区域。'
    },
    message: {
      when: '行内消息条，适合表单上方或区块内反馈。',
      'demo.basic': '消息类型',
      'demo.basicDesc': 'severity + text；autoHide 可自动消失。',
      'prop.severity': 'info / success / warning / danger',
      'prop.autoHide': '是否自动隐藏',
      'sample.info': '这是一条消息。',
      'sample.success': '保存成功。'
    },
    notification: {
      when: '通知提醒，角落浮层，适合系统级异步结果。',
      'demo.basic': '通知',
      'demo.basicDesc': 'title + message；duration 控制自动关闭。',
      'prop.visible': '是否可见（v-model:visible）',
      'prop.duration': '自动关闭毫秒，0 为不自动',
      'sample.show': '显示通知',
      'sample.title': '通知标题',
      'sample.body': '通知正文内容。'
    },
    toast: {
      when: '轻量 Toast，适合操作结果短提示。',
      'demo.basic': 'Toast',
      'demo.basicDesc': 'severity + message；position 控制角落。',
      'prop.visible': '是否可见（v-model:visible）',
      'prop.position': 'top-right 等位置',
      'sample.show': '显示 Toast',
      'sample.body': '操作已完成。'
    },
    popconfirm: {
      when: '气泡确认，删除等危险操作前的二次确认。',
      'demo.basic': '气泡确认',
      'demo.basicDesc': 'trigger 插槽触发；@confirm / @cancel。',
      'prop.visible': '是否展开（v-model:visible）',
      'prop.title': '确认文案',
      'sample.trigger': '删除',
      'sample.title': '确定删除此项？'
    },
    popover: {
      when: '气泡卡片，展示补充说明或轻量操作面板。',
      'demo.basic': '气泡卡片',
      'demo.basicDesc': 'trigger 点击切换；title + 默认插槽内容。',
      'prop.visible': '是否展开（v-model:visible）',
      'sample.trigger': '更多信息',
      'sample.title': '说明',
      'sample.body': '这里是补充说明内容。'
    },
    tooltip: {
      when: '文字提示，hover/focus 显示简短说明。',
      'demo.basic': '文字提示',
      'demo.basicDesc': 'content 或 #content 插槽；placement 方位。',
      'prop.content': '提示文案',
      'prop.placement': 'top / bottom / left / right',
      'sample.trigger': '悬停查看',
      'sample.content': '提示文字'
    },
    confirm: {
      when: '确认框，模态二次确认，替代原生 confirm。',
      'demo.basic': '确认框',
      'demo.basicDesc': 'v-model:visible；severity 与按钮文案。',
      'prop.visible': '是否可见（v-model:visible）',
      'sample.open': '打开确认',
      'sample.title': '确认操作',
      'sample.body': '此操作不可撤销，是否继续？'
    },
    confirmDialog: {
      when: '对话框式确认，带图标与确定/取消按钮。',
      'demo.basic': '确认对话框',
      'demo.basicDesc': 'icon 类型；v-model:visible。',
      'prop.visible': '是否可见（v-model:visible）',
      'prop.icon': 'success / warning / danger / info',
      'sample.open': '打开确认对话框',
      'sample.message': '确定要执行此操作吗？'
    },
    loading: {
      when: '加载指示，区块或全屏遮罩等待态。',
      'demo.basic': '区块加载',
      'demo.basicDesc': 'visible 控制；text 自定义文案。',
      'demo.fullscreen': '全屏加载',
      'demo.fullscreenDesc': 'fullscreen 覆盖视口。',
      'prop.visible': '是否显示',
      'prop.fullscreen': '是否全屏'
    },
    noticeBar: {
      when: '公告栏，滚动展示通知、活动、系统消息。',
      'demo.basic': '公告栏',
      'demo.basicDesc': 'scrollable 滚动；closable 可关闭。',
      'prop.message': '公告文案',
      'prop.scrollable': '是否滚动',
      'sample.message': '系统将于今晚 22:00 进行维护，请提前保存工作。'
    }
  }
}

// Mirror en-US from zh-CN structure with English text
COPY['en-US'] = {
  inputText: {
    when: 'Single-line text for names, titles, keywords, and other short fields.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'v-model string binding; placeholder, disabled, and invalid states.',
    'prop.modelValue': 'Input value (v-model)',
    'prop.placeholder': 'Placeholder text',
    'prop.size': 'Size xs–xl',
    'sample.placeholder': 'Enter text'
  },
  inputNumber: {
    when: 'Numeric input with stepping for quantity, amount, and thresholds.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'v-model number; min / max / step constrain range.',
    'prop.modelValue': 'Number (v-model)',
    'prop.minMax': 'Minimum and maximum',
    'sample.label': 'Quantity'
  },
  password: {
    when: 'Password field with show/hide toggle for login and sensitive data.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'Password type with visibility toggle; v-model binding.',
    'prop.modelValue': 'Password (v-model)',
    'sample.placeholder': 'Enter password'
  },
  textarea: {
    when: 'Multi-line text for notes, descriptions, and longer content.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'v-model binding; rows and autoResize control height.',
    'prop.modelValue': 'Text (v-model)',
    'sample.placeholder': 'Enter notes'
  },
  select: {
    when: 'Dropdown select for enums, status, and single-choice fields.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'Declarative options; v-model binds option value.',
    'prop.modelValue': 'Selected value (v-model)',
    'prop.options': 'Options list label/value',
    'sample.placeholder': 'Select',
    'sample.optA': 'Option A',
    'sample.optB': 'Option B',
    'sample.optC': 'Option C'
  },
  cascader: {
    when: 'Cascading select for regions, category trees, and multi-level enums.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'Tree options with children; v-model binds selected value.',
    'prop.modelValue': 'Selected value (v-model)',
    'prop.options': 'Cascader option tree',
    'sample.placeholder': 'Select region',
    'sample.regionA': 'East',
    'sample.regionB': 'South',
    'sample.citySh': 'Shanghai',
    'sample.cityHz': 'Hangzhou',
    'sample.cityGz': 'Guangzhou'
  },
  autoComplete: {
    when: 'Autocomplete suggestions for search and email domains.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'Filter suggestions; selection writes v-model.',
    'prop.modelValue': 'Input value (v-model)',
    'prop.suggestions': 'Suggestion list',
    'sample.placeholder': 'Type keyword'
  },
  datePicker: {
    when: 'Date picker for birthdays, deadlines, and date-only fields.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'v-model binds Date or ISO string.',
    'prop.modelValue': 'Date (v-model)',
    'sample.placeholder': 'Pick date'
  },
  dateTimePicker: {
    when: 'Date and time picker for appointments and timestamps.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'Combined date/time; v-model binding.',
    'prop.modelValue': 'DateTime (v-model)',
    'sample.placeholder': 'Pick date & time'
  },
  timePicker: {
    when: 'Time picker for daily slots and schedules.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'v-model binds time string or Date.',
    'prop.modelValue': 'Time (v-model)',
    'sample.placeholder': 'Pick time'
  },
  search: {
    when: 'Search input with icon and enter-to-submit.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'v-model plus @search on submit.',
    'prop.modelValue': 'Keyword (v-model)',
    'sample.placeholder': 'Search…'
  },
  slider: {
    when: 'Slider for numeric values or ranges such as volume and filters.',
    'demo.basic': 'Single value',
    'demo.basicDesc': 'min / max / step; v-model number.',
    'demo.range': 'Range',
    'demo.rangeDesc': 'range mode binds [min, max] tuple.',
    'prop.modelValue': 'Value or range (v-model)',
    'prop.range': 'Range mode'
  },
  rate: {
    when: 'Star rating for reviews and satisfaction.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'v-model 0–max; allowHalf for half stars.',
    'prop.modelValue': 'Score (v-model)',
    'prop.max': 'Max stars'
  },
  tagInput: {
    when: 'Tag input for keywords, recipients, and multi-value strings.',
    'demo.basic': 'Basic',
    'demo.basicDesc': 'Enter adds tag; v-model string[].',
    'prop.modelValue': 'Tags (v-model)',
    'sample.placeholder': 'Press Enter to add'
  },
  upload: {
    when: 'File upload with click and drag; shows file list.',
    'demo.basic': 'Upload',
    'demo.basicDesc': 'v-model file list; multiple and drag options.',
    'prop.modelValue': 'File list (v-model)',
    'sample.hint': 'Drag files here or click to upload'
  },
  imageUpload: {
    when: 'Image upload with preview for avatars and galleries.',
    'demo.basic': 'Image upload',
    'demo.basicDesc': 'accept=image/*; maxCount limits items.',
    'prop.modelValue': 'Image items (v-model)',
    'prop.maxCount': 'Max count'
  },
  filterBar: {
    when: 'Filter bar with condition rows for list pages.',
    'demo.basic': 'Conditions',
    'demo.basicDesc': 'fields declare columns; v-model FilterCondition[].',
    'prop.modelValue': 'Conditions (v-model)',
    'prop.fields': 'Filter fields',
    'sample.fieldName': 'Name',
    'sample.fieldStatus': 'Status'
  },
  advancedSearch: {
    when: 'Advanced search with AND/OR logic and templates.',
    'demo.basic': 'Advanced search',
    'demo.basicDesc': 'logic toggle; fields and templates.',
    'prop.modelValue': 'Conditions (v-model)',
    'prop.logic': 'AND / OR logic',
    'sample.fieldName': 'Name',
    'sample.fieldTag': 'Tag'
  },
  alert: {
    when: 'Inline alert for success, warning, and error feedback.',
    'demo.basic': 'Types',
    'demo.basicDesc': 'severity styles; closable dismiss.',
    'prop.severity': 'info / success / warning / danger',
    'prop.closable': 'Show close button',
    'sample.info': 'This is an informational alert.',
    'sample.success': 'Operation completed successfully.',
    'sample.warning': 'Please review the risks.',
    'sample.danger': 'An error occurred. Try again.'
  },
  dialog: {
    when: 'Modal dialog for forms, details, and confirmations.',
    'demo.basic': 'Dialog',
    'demo.basicDesc': 'v-model:visible; header and footer slots.',
    'prop.visible': 'Visible (v-model:visible)',
    'prop.modal': 'Modal overlay',
    'sample.open': 'Open dialog',
    'sample.title': 'Dialog title',
    'sample.body': 'Dialog body content.'
  },
  drawer: {
    when: 'Drawer panel sliding from screen edge.',
    'demo.basic': 'Drawer',
    'demo.basicDesc': 'placement left/right; v-model:visible.',
    'prop.visible': 'Visible (v-model:visible)',
    'prop.placement': 'left / right',
    'sample.open': 'Open drawer',
    'sample.title': 'Drawer title',
    'sample.body': 'Drawer body content.'
  },
  message: {
    when: 'Inline message bar for form or section feedback.',
    'demo.basic': 'Messages',
    'demo.basicDesc': 'severity + text; autoHide optional.',
    'prop.severity': 'info / success / warning / danger',
    'prop.autoHide': 'Auto hide',
    'sample.info': 'This is a message.',
    'sample.success': 'Saved successfully.'
  },
  notification: {
    when: 'Corner notification for async system results.',
    'demo.basic': 'Notification',
    'demo.basicDesc': 'title + message; duration auto-close.',
    'prop.visible': 'Visible (v-model:visible)',
    'prop.duration': 'Auto-close ms, 0 = manual',
    'sample.show': 'Show notification',
    'sample.title': 'Notification title',
    'sample.body': 'Notification body text.'
  },
  toast: {
    when: 'Lightweight toast for quick action feedback.',
    'demo.basic': 'Toast',
    'demo.basicDesc': 'severity + message; position corners.',
    'prop.visible': 'Visible (v-model:visible)',
    'prop.position': 'top-right etc.',
    'sample.show': 'Show toast',
    'sample.body': 'Action completed.'
  },
  popconfirm: {
    when: 'Popconfirm before destructive actions like delete.',
    'demo.basic': 'Popconfirm',
    'demo.basicDesc': 'trigger slot; @confirm / @cancel.',
    'prop.visible': 'Open (v-model:visible)',
    'prop.title': 'Confirm text',
    'sample.trigger': 'Delete',
    'sample.title': 'Delete this item?'
  },
  popover: {
    when: 'Popover card for extra info or light actions.',
    'demo.basic': 'Popover',
    'demo.basicDesc': 'Click trigger toggles; title + default slot.',
    'prop.visible': 'Open (v-model:visible)',
    'sample.trigger': 'More info',
    'sample.title': 'Details',
    'sample.body': 'Supplementary content here.'
  },
  tooltip: {
    when: 'Tooltip on hover/focus for short hints.',
    'demo.basic': 'Tooltip',
    'demo.basicDesc': 'content or #content slot; placement.',
    'prop.content': 'Tooltip text',
    'prop.placement': 'top / bottom / left / right',
    'sample.trigger': 'Hover me',
    'sample.content': 'Tooltip text'
  },
  confirm: {
    when: 'Modal confirm replacing native confirm().',
    'demo.basic': 'Confirm',
    'demo.basicDesc': 'v-model:visible; severity and labels.',
    'prop.visible': 'Visible (v-model:visible)',
    'sample.open': 'Open confirm',
    'sample.title': 'Confirm action',
    'sample.body': 'This cannot be undone. Continue?'
  },
  confirmDialog: {
    when: 'Dialog-style confirm with icon and actions.',
    'demo.basic': 'Confirm dialog',
    'demo.basicDesc': 'icon type; v-model:visible.',
    'prop.visible': 'Visible (v-model:visible)',
    'prop.icon': 'success / warning / danger / info',
    'sample.open': 'Open confirm dialog',
    'sample.message': 'Are you sure you want to proceed?'
  },
  loading: {
    when: 'Loading indicator for blocks or fullscreen wait states.',
    'demo.basic': 'Inline loading',
    'demo.basicDesc': 'visible toggle; custom text.',
    'demo.fullscreen': 'Fullscreen',
    'demo.fullscreenDesc': 'fullscreen covers viewport.',
    'prop.visible': 'Visible',
    'prop.fullscreen': 'Fullscreen mode'
  },
  noticeBar: {
    when: 'Notice bar for scrolling announcements and alerts.',
    'demo.basic': 'Notice bar',
    'demo.basicDesc': 'scrollable marquee; closable.',
    'prop.message': 'Notice text',
    'prop.scrollable': 'Scroll animation',
    'sample.message': 'Maintenance tonight at 22:00. Save your work early.'
  }
}

// zh-TW: copy zh-CN with minor traditional tweaks
COPY['zh-TW'] = JSON.parse(JSON.stringify(COPY['zh-CN']))
COPY['zh-TW'].inputText.when = '單行文字輸入，適合姓名、標題、關鍵詞等短文字採集。'
COPY['zh-TW'].select.when = '下拉選擇，適合列舉、狀態、分類等單選場景。'

// ja / ko / ru: use en-US as base (existing packs often localize later)
for (const loc of ['ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']) {
  COPY[loc] = JSON.parse(JSON.stringify(COPY['en-US']))
}

const REGISTRY_ENTRIES = [
  'InputText', 'InputNumber', 'Password', 'Textarea', 'Select', 'Cascader', 'AutoComplete',
  'DatePicker', 'DateTimePicker', 'TimePicker', 'Search', 'Slider', 'Rate', 'TagInput',
  'Upload', 'ImageUpload', 'FilterBar', 'AdvancedSearch',
  'Alert', 'Dialog', 'Drawer', 'Message', 'Notification', 'Toast', 'Popconfirm', 'Popover',
  'Tooltip', 'Confirm', 'ConfirmDialog', 'Loading', 'NoticeBar'
]

function camelCase(name) {
  return name.charAt(0).toLowerCase() + name.slice(1).replace(/Dialog$/, 'Dialog').replace(/^ConfirmDialog$/, 'confirmDialog')
}

function toCamel(name) {
  if (name === 'ConfirmDialog') return 'confirmDialog'
  if (name === 'AutoComplete') return 'autoComplete'
  if (name === 'DatePicker') return 'datePicker'
  if (name === 'DateTimePicker') return 'dateTimePicker'
  if (name === 'TimePicker') return 'timePicker'
  if (name === 'TagInput') return 'tagInput'
  if (name === 'ImageUpload') return 'imageUpload'
  if (name === 'FilterBar') return 'filterBar'
  if (name === 'AdvancedSearch') return 'advancedSearch'
  if (name === 'NoticeBar') return 'noticeBar'
  if (name === 'InputText') return 'inputText'
  if (name === 'InputNumber') return 'inputNumber'
  return name.charAt(0).toLowerCase() + name.slice(1)
}

function i18nBlock(camel) {
  const lines = []
  const zh = COPY['zh-CN'][camel]
  if (!zh) return lines
  for (const [k, v] of Object.entries(zh)) {
    lines.push(`  "example.doc.${camel}.${k.replace(/\./g, '.')}": ${JSON.stringify(v)},`)
  }
  return lines
}

function buildI18nAppend() {
  const allLines = []
  for (const name of REGISTRY_ENTRIES) {
    const camel = toCamel(name)
    allLines.push(...i18nBlock(camel))
  }
  return allLines.join('\n')
}

function demoVue(name) {
  const camel = toCamel(name)
  const key = (suffix) => `example.doc.${camel}.${suffix}`

  const templates = {
    InputText: () => `<script setup lang="ts">
import { computed, ref } from 'vue'
import { InputText, Space } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const value = ref('')
const codeBasic = demoSfc({
  imports: [\`import { ref } from 'vue'\`, \`import { InputText } from '@amg-webui/components/base'\`],
  script: ['const value = ref(\\'\\')'],
  template: [
    \`  <InputText v-model="value" :placeholder="t('${key('sample.placeholder')}')" />\`,
    \`  <InputText v-model="value" disabled />\`
  ]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'string', defaultValue: "''", description: t('${key('prop.modelValue')}') },
  { name: 'placeholder', type: 'string', description: t('${key('prop.placeholder')}') },
  { name: 'size', type: 'Size', defaultValue: "'md'", description: t('${key('prop.size')}') }
])
</script>

<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('${key('when')}') }}</p>
    <DemoBlock :title="t('${key('demo.basic')}')" :description="t('${key('demo.basicDesc')}')" :code="codeBasic" default-open>
      <div class="vp-curated-row">
        <InputText v-model="value" :placeholder="t('${key('sample.placeholder')}')" />
        <InputText v-model="value" disabled />
      </div>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>

<style scoped>
.vp-curated-row { display: flex; flex-wrap: wrap; gap: var(--spacing-md); width: 100%; min-width: 0; }
.vp-curated-row :deep(.p-inputtext-wrapper) { flex: 1 1 calc(var(--spacing-2xl) * 6); min-width: 0; }
</style>
`,
    InputNumber: () => inputDemo(name, 'number', '0', ':min="0" :max="100" :step="1"'),
    Password: () => inputDemo(name, 'string', "''", `type="password" :placeholder="t('${key('sample.placeholder')}')"`),
    Textarea: () => inputDemo(name, 'string', "''", `:placeholder="t('${key('sample.placeholder')}')" :rows="3"`),
    Select: () => `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Select } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const value = ref<string | undefined>()
const options = computed(() => [
  { label: t('${key('sample.optA')}'), value: 'a' },
  { label: t('${key('sample.optB')}'), value: 'b' },
  { label: t('${key('sample.optC')}'), value: 'c' }
])
const codeBasic = demoSfc({
  imports: [\`import { ref } from 'vue'\`, \`import { Select } from '@amg-webui/components/base'\`],
  script: ['const value = ref()', 'const options = [{ label: \\'A\\', value: \\'a\\' }]'],
  template: [\`  <Select v-model="value" :options="options" :placeholder="t('${key('sample.placeholder')}')" />\`]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'unknown', description: t('${key('prop.modelValue')}') },
  { name: 'options', type: 'SelectOption[]', description: t('${key('prop.options')}') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('${key('when')}') }}</p>
    <DemoBlock :title="t('${key('demo.basic')}')" :description="t('${key('demo.basicDesc')}')" :code="codeBasic" default-open>
      <Select v-model="value" :options="options" :placeholder="t('${key('sample.placeholder')}')" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`,
    Cascader: () => `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Cascader } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const value = ref<unknown>()
const options = computed(() => [
  { label: t('${key('sample.regionA')}'), value: 'east', children: [
    { label: t('${key('sample.citySh')}'), value: 'sh' },
    { label: t('${key('sample.cityHz')}'), value: 'hz' }
  ]},
  { label: t('${key('sample.regionB')}'), value: 'south', children: [
    { label: t('${key('sample.cityGz')}'), value: 'gz' }
  ]}
])
const codeBasic = demoSfc({
  imports: [\`import { Cascader } from '@amg-webui/components/base'\`],
  template: [\`  <Cascader v-model="value" :options="options" />\`]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'unknown', description: t('${key('prop.modelValue')}') },
  { name: 'options', type: 'CascaderOption[]', description: t('${key('prop.options')}') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('${key('when')}') }}</p>
    <DemoBlock :title="t('${key('demo.basic')}')" :description="t('${key('demo.basicDesc')}')" :code="codeBasic" default-open>
      <Cascader v-model="value" :options="options" :placeholder="t('${key('sample.placeholder')}')" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`,
    AutoComplete: () => `<script setup lang="ts">
import { ref } from 'vue'
import { AutoComplete } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const value = ref('')
const suggestions = ['alpha', 'beta', 'gamma', 'dashboard', 'data']
const codeBasic = demoSfc({
  imports: [\`import { AutoComplete } from '@amg-webui/components/base'\`],
  template: [\`  <AutoComplete v-model="value" :suggestions="suggestions" />\`]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'string', description: t('${key('prop.modelValue')}') },
  { name: 'suggestions', type: 'string[]', description: t('${key('prop.suggestions')}') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('${key('when')}') }}</p>
    <DemoBlock :title="t('${key('demo.basic')}')" :description="t('${key('demo.basicDesc')}')" :code="codeBasic" default-open>
      <AutoComplete v-model="value" :suggestions="suggestions" :placeholder="t('${key('sample.placeholder')}')" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`.replace('const propRows = computed', 'import { computed } from \'vue\'\nconst propRows = computed'),
    Alert: () => feedbackInline(name),
    Message: () => feedbackInline(name),
    NoticeBar: () => `<script setup lang="ts">
import { computed } from 'vue'
import { NoticeBar } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const codeBasic = demoSfc({
  imports: [\`import { NoticeBar } from '@amg-webui/components/base'\`],
  template: [\`  <NoticeBar :message="t('${key('sample.message')}')" />\`]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'message', type: 'string', description: t('${key('prop.message')}') },
  { name: 'scrollable', type: 'boolean', defaultValue: 'true', description: t('${key('prop.scrollable')}') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('${key('when')}') }}</p>
    <DemoBlock :title="t('${key('demo.basic')}')" :description="t('${key('demo.basicDesc')}')" :code="codeBasic" default-open>
      <NoticeBar :message="t('${key('sample.message')}')" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`,
    Loading: () => `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Loading, Button } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const on = ref(true)
const codeBasic = demoSfc({
  imports: [\`import { Loading } from '@amg-webui/components/base'\`],
  template: [\`  <Loading :visible="true" />\`]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'visible', type: 'boolean', defaultValue: 'true', description: t('${key('prop.visible')}') },
  { name: 'fullscreen', type: 'boolean', defaultValue: 'false', description: t('${key('prop.fullscreen')}') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('${key('when')}') }}</p>
    <DemoBlock :title="t('${key('demo.basic')}')" :description="t('${key('demo.basicDesc')}')" :code="codeBasic" default-open>
      <div class="vp-loading-stage">
        <Loading :visible="on" />
        <Button severity="secondary" :label="t('button.edit')" @click="on = !on" />
      </div>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
<style scoped>
.vp-loading-stage { position: relative; min-height: calc(var(--spacing-2xl) * 4); width: 100%; border: 1px solid var(--ds-border); border-radius: var(--theme-card-radius); padding: var(--theme-card-pad); }
</style>
`
  }

  if (templates[name]) return templates[name]()

  // Generic handlers
  if (['DatePicker', 'DateTimePicker', 'TimePicker', 'Search'].includes(name)) {
    return pickerDemo(name)
  }
  if (name === 'Slider') return sliderDemo()
  if (name === 'Rate') return rateDemo()
  if (name === 'TagInput') return tagInputDemo()
  if (name === 'Upload') return uploadDemo(false)
  if (name === 'ImageUpload') return uploadDemo(true)
  if (name === 'FilterBar') return filterDemo(name)
  if (name === 'AdvancedSearch') return filterDemo(name)
  if (['Dialog', 'Drawer', 'Confirm', 'ConfirmDialog'].includes(name)) return modalDemo(name)
  if (['Notification', 'Toast'].includes(name)) return portalFeedbackDemo(name)
  if (['Popconfirm', 'Popover'].includes(name)) return triggerDemo(name)
  if (name === 'Tooltip') return tooltipDemo()

  throw new Error(`No template for ${name}`)
}

function inputDemo(name, type, def, extra) {
  const camel = toCamel(name)
  const key = (s) => `example.doc.${camel}.${s}`
  return `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ${name} } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const value = ref(${type === 'number' ? '12' : "''"})
const codeBasic = demoSfc({
  imports: [\`import { ref } from 'vue'\`, \`import { ${name} } from '@amg-webui/components/base'\`],
  script: [\`const value = ref(${type === 'number' ? '0' : "''"})\`],
  template: [\`  <${name} v-model="value" ${extra.replace(/t\('[^']+'\)/g, (m) => m)} />\`]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: '${type}', description: t('${key('prop.modelValue')}') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('${key('when')}') }}</p>
    <DemoBlock :title="t('${key('demo.basic')}')" :description="t('${key('demo.basicDesc')}')" :code="codeBasic" default-open>
      <${name} v-model="value" ${extra} />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

function feedbackInline(name) {
  const camel = toCamel(name)
  const key = (s) => `example.doc.${camel}.${s}`
  const closableKey = name === 'Message' ? 'prop.autoHide' : 'prop.closable'
  return `<script setup lang="ts">
import { computed } from 'vue'
import { ${name} } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const codeBasic = demoSfc({
  imports: [\`import { ${name} } from '@amg-webui/components/base'\`],
  template: [
    \`  <${name} severity="info">{{ t('${key('sample.info')}') }}</${name}>\`,
    \`  <${name} severity="success">{{ t('${key('sample.success')}') }}</${name}>\`
  ]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'severity', type: 'string', description: t('${key('prop.severity')}') },
  { name: 'closable', type: 'boolean', defaultValue: 'true', description: t('${key(closableKey)}') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('${key('when')}') }}</p>
    <DemoBlock :title="t('${key('demo.basic')}')" :description="t('${key('demo.basicDesc')}')" :code="codeBasic" default-open>
      <div class="vp-curated-stack">
        <${name} severity="info">{{ t('${key('sample.info')}') }}</${name}>
        <${name} severity="success">{{ t('${key('sample.success')}') }}</${name}>
        <${name} severity="warning">{{ t('${key('sample.warning') || key('sample.info')}') }}</${name}>
        <${name} severity="danger">{{ t('${key('sample.danger') || key('sample.info')}') }}</${name}>
      </div>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
<style scoped>
.vp-curated-stack { display: flex; flex-direction: column; gap: var(--spacing-md); width: 100%; }
</style>
`
}

function pickerDemo(name) {
  const camel = toCamel(name)
  const key = (s) => `example.doc.${camel}.${s}`
  return `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ${name} } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const value = ref<string | Date | undefined>()
const codeBasic = demoSfc({
  imports: [\`import { ${name} } from '@amg-webui/components/base'\`],
  template: [\`  <${name} v-model="value" />\`]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'unknown', description: t('${key('prop.modelValue')}') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('${key('when')}') }}</p>
    <DemoBlock :title="t('${key('demo.basic')}')" :description="t('${key('demo.basicDesc')}')" :code="codeBasic" default-open>
      <${name} v-model="value" :placeholder="t('${key('sample.placeholder')}')" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

function sliderDemo() {
  return `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Slider } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const single = ref(40)
const range = ref<[number, number]>([20, 70])
const codeBasic = demoSfc({
  imports: [\`import { Slider } from '@amg-webui/components/base'\`],
  template: [\`  <Slider v-model="single" :min="0" :max="100" />\`]
})
const codeRange = demoSfc({
  imports: [\`import { Slider } from '@amg-webui/components/base'\`],
  template: [\`  <Slider v-model="range" range :min="0" :max="100" />\`]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'number | [number, number]', description: t('example.doc.slider.prop.modelValue') },
  { name: 'range', type: 'boolean', defaultValue: 'false', description: t('example.doc.slider.prop.range') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.slider.when') }}</p>
    <DemoBlock :title="t('example.doc.slider.demo.basic')" :description="t('example.doc.slider.demo.basicDesc')" :code="codeBasic" default-open>
      <Slider v-model="single" :min="0" :max="100" />
    </DemoBlock>
    <DemoBlock :title="t('example.doc.slider.demo.range')" :description="t('example.doc.slider.demo.rangeDesc')" :code="codeRange">
      <Slider v-model="range" range :min="0" :max="100" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

function rateDemo() {
  return `<script setup lang="ts">
import { computed, ref } from 'vue'
import { Rate } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const score = ref(3)
const codeBasic = demoSfc({ imports: [\`import { Rate } from '@amg-webui/components/base'\`], template: [\`  <Rate v-model="score" />\`] })
const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'number', description: t('example.doc.rate.prop.modelValue') },
  { name: 'max', type: 'number', defaultValue: '5', description: t('example.doc.rate.prop.max') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.rate.when') }}</p>
    <DemoBlock :title="t('example.doc.rate.demo.basic')" :description="t('example.doc.rate.demo.basicDesc')" :code="codeBasic" default-open>
      <Rate v-model="score" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

function tagInputDemo() {
  return `<script setup lang="ts">
import { computed, ref } from 'vue'
import { TagInput } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const tags = ref<string[]>(['vue', 'amg'])
const codeBasic = demoSfc({ imports: [\`import { TagInput } from '@amg-webui/components/base'\`], template: [\`  <TagInput v-model="tags" />\`] })
const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'string[]', description: t('example.doc.tagInput.prop.modelValue') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.tagInput.when') }}</p>
    <DemoBlock :title="t('example.doc.tagInput.demo.basic')" :description="t('example.doc.tagInput.demo.basicDesc')" :code="codeBasic" default-open>
      <TagInput v-model="tags" :placeholder="t('example.doc.tagInput.sample.placeholder')" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

function uploadDemo(image) {
  const comp = image ? 'ImageUpload' : 'Upload'
  const camel = image ? 'imageUpload' : 'upload'
  return `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ${comp} } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const files = ref([])
const codeBasic = demoSfc({ imports: [\`import { ${comp} } from '@amg-webui/components/base'\`], template: [\`  <${comp} v-model="files" />\`] })
const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'array', description: t('example.doc.${camel}.prop.modelValue') }${image ? `,\n  { name: 'maxCount', type: 'number', defaultValue: '9', description: t('example.doc.${camel}.prop.maxCount') }` : ''}
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.${camel}.when') }}</p>
    <DemoBlock :title="t('example.doc.${camel}.demo.basic')" :description="t('example.doc.${camel}.demo.basicDesc')" :code="codeBasic" default-open>
      <${comp} v-model="files" ${image ? ':max-count="3"' : ''} />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

function filterDemo(name) {
  const camel = toCamel(name)
  const fieldKey = camel === 'filterBar' ? 'sample.fieldStatus' : 'sample.fieldTag'
  return `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ${name} } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const conditions = ref([])
const fields = computed(() => [
  { label: t('example.doc.${camel}.sample.fieldName'), value: 'name' },
  { label: t('example.doc.${camel}.${fieldKey}'), value: 'tag' }
])
const codeBasic = demoSfc({ imports: [\`import { ${name} } from '@amg-webui/components/base'\`], template: [\`  <${name} v-model="conditions" :fields="fields" />\`] })
const propRows = computed<PropRow[]>(() => [
  { name: 'modelValue', type: 'FilterCondition[]', description: t('example.doc.${camel}.prop.modelValue') },
  { name: 'fields', type: 'array', description: t('example.doc.${camel}.prop.fields') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.${camel}.when') }}</p>
    <DemoBlock :title="t('example.doc.${camel}.demo.basic')" :description="t('example.doc.${camel}.demo.basicDesc')" :code="codeBasic" default-open>
      <${name} v-model="conditions" :fields="fields" />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

function modalDemo(name) {
  const camel = toCamel(name)
  let bodyBlock = ''
  if (name === 'ConfirmDialog') {
    bodyBlock = `<${name} v-model:visible="open" :message="t('example.doc.${camel}.sample.message')" icon="warning" />`
  } else if (name === 'Confirm') {
    bodyBlock = `<Confirm
        v-model:visible="open"
        :title="t('example.doc.${camel}.sample.title')"
        :message="t('example.doc.${camel}.sample.body')"
      />`
  } else {
    bodyBlock = `<${name} v-model:visible="open" :title="t('example.doc.${camel}.sample.title')">
        {{ t('example.doc.${camel}.sample.body') }}
      </${name}>`
  }
  return `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ${name}, Button } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const open = ref(false)
const codeBasic = demoSfc({
  imports: [\`import { ref } from 'vue'\`, \`import { ${name}, Button } from '@amg-webui/components/base'\`],
  script: ['const open = ref(false)'],
  template: [
    \`  <Button @click="open = true">{{ t('example.doc.${camel}.sample.open') }}</Button>\`,
    \`  <${name} v-model:visible="open" />\`
  ]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'visible', type: 'boolean', description: t('example.doc.${camel}.prop.visible') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.${camel}.when') }}</p>
    <DemoBlock :title="t('example.doc.${camel}.demo.basic')" :description="t('example.doc.${camel}.demo.basicDesc')" :code="codeBasic" default-open>
      <Button severity="primary" :label="t('example.doc.${camel}.sample.open')" @click="open = true" />
      ${bodyBlock}
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

function portalFeedbackDemo(name) {
  const camel = toCamel(name)
  const titleAttr = name === 'Toast' ? '' : `:title="t('example.doc.${camel}.sample.title')"`
  const msgAttr = name === 'Toast'
    ? `:message="t('example.doc.${camel}.sample.body')"`
    : `:message="t('example.doc.${camel}.sample.body')"`
  return `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ${name}, Button } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const visible = ref(false)
const codeBasic = demoSfc({
  imports: [\`import { ${name} } from '@amg-webui/components/base'\`],
  template: [\`  <${name} v-model:visible="visible" :duration="0" />\`]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'visible', type: 'boolean', description: t('example.doc.${camel}.prop.visible') },
  { name: 'duration', type: 'number', description: t('example.doc.${camel}.prop.duration') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.${camel}.when') }}</p>
    <DemoBlock :title="t('example.doc.${camel}.demo.basic')" :description="t('example.doc.${camel}.demo.basicDesc')" :code="codeBasic" default-open>
      <Button severity="primary" :label="t('example.doc.${camel}.sample.show')" @click="visible = true" />
      <${name}
        v-model:visible="visible"
        ${titleAttr}
        ${msgAttr}
        :duration="0"
      />
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

function triggerDemo(name) {
  const camel = toCamel(name)
  return `<script setup lang="ts">
import { computed, ref } from 'vue'
import { ${name}, Button } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const visible = ref(false)
const codeBasic = demoSfc({
  imports: [\`import { ${name}, Button } from '@amg-webui/components/base'\`],
  template: [
    \`  <${name} v-model:visible="visible">\`,
    \`    <template #trigger><Button /></template>\`,
    \`  </${name}>\`
  ]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'visible', type: 'boolean', description: t('example.doc.${camel}.prop.visible') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.${camel}.when') }}</p>
    <DemoBlock :title="t('example.doc.${camel}.demo.basic')" :description="t('example.doc.${camel}.demo.basicDesc')" :code="codeBasic" default-open>
      <${name} v-model:visible="visible" :title="t('example.doc.${camel}.sample.title')">
        <template #trigger>
          <Button severity="${name === 'Popconfirm' ? 'danger' : 'secondary'}" :label="t('example.doc.${camel}.sample.trigger')" @click="visible = true" />
        </template>
        ${name === 'Popover' ? `{{ t('example.doc.${camel}.sample.body') }}` : ''}
      </${name}>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

function tooltipDemo() {
  return `<script setup lang="ts">
import { computed } from 'vue'
import { Tooltip, Button } from '@amg-webui/components/base'
import { useLocale } from '@amg-webui/hooks'
import DemoBlock from '../../components/demo/DemoBlock.vue'
import PropsTable from '../../components/demo/PropsTable.vue'
import { demoSfc } from '../../components/demo/demoCode'
import type { PropRow } from '../../components/demo/types'
import '../../components/demo/curatedDemo.scss'

const { t } = useLocale()
const codeBasic = demoSfc({
  imports: [\`import { Tooltip, Button } from '@amg-webui/components/base'\`],
  template: [\`  <Tooltip :content="t('example.doc.tooltip.sample.content')"><Button /></Tooltip>\`]
})
const propRows = computed<PropRow[]>(() => [
  { name: 'content', type: 'string', description: t('example.doc.tooltip.prop.content') },
  { name: 'placement', type: 'string', defaultValue: "'top'", description: t('example.doc.tooltip.prop.placement') }
])
</script>
<template>
  <div class="vp-curated">
    <p class="vp-curated__lead">{{ t('example.doc.tooltip.when') }}</p>
    <DemoBlock :title="t('example.doc.tooltip.demo.basic')" :description="t('example.doc.tooltip.demo.basicDesc')" :code="codeBasic" default-open>
      <Tooltip :content="t('example.doc.tooltip.sample.content')">
        <Button severity="secondary" :label="t('example.doc.tooltip.sample.trigger')" />
      </Tooltip>
    </DemoBlock>
    <PropsTable :rows="propRows" />
  </div>
</template>
`
}

// Write demos
for (const name of REGISTRY_ENTRIES) {
  const dir = path.join(root, 'example', 'demos', name)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.vue'), demoVue(name), 'utf8')
  console.log('demo', name)
}

// Append i18n to locale packs
const i18nLines = buildI18nAppend()
for (const loc of LOCALES) {
  const file = path.join(root, 'packages', 'locale', loc, 'exampleDoc.ts')
  let content = fs.readFileSync(file, 'utf8')
  // Build locale-specific block
  const lines = []
  for (const name of REGISTRY_ENTRIES) {
    const camel = toCamel(name)
    const pack = COPY[loc][camel]
    if (!pack) continue
    for (const [k, v] of Object.entries(pack)) {
      lines.push(`  "example.doc.${camel}.${k}": ${JSON.stringify(v)},`)
    }
  }
  const block = lines.join('\n')
  content = content.replace(/\n}\s*$/, `\n${block}\n}\n`)
  fs.writeFileSync(file, content, 'utf8')
  console.log('locale', loc)
}

// Patch registry.ts
const regPath = path.join(root, 'example', 'demos', 'registry.ts')
let reg = fs.readFileSync(regPath, 'utf8')
const insertLines = REGISTRY_ENTRIES.map((name) => {
  const camel = toCamel(name)
  return `  ${name}: { whenKey: 'example.doc.${camel}.when', Demo: loadDemo('${name}') },`
}).join('\n')
if (!reg.includes('InputText:')) {
  reg = reg.replace(
    /  FlowPanel: \{ whenKey: 'example\.doc\.flowPanel\.when', Demo: loadDemo\('FlowPanel'\) \}\n\}/,
    `  FlowPanel: { whenKey: 'example.doc.flowPanel.when', Demo: loadDemo('FlowPanel') },\n${insertLines}\n}`
  )
  fs.writeFileSync(regPath, reg, 'utf8')
  console.log('registry updated')
}

console.log('Done.')
