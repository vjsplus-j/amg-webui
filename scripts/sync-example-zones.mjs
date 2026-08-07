/**
 * Partition mapped UI components into example zone lists → example/component-zones.json
 */
import { writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFileSync } from 'node:child_process'
import { allMappedComponentNames } from './component-package-map.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const names = allMappedComponentNames()

const zones = {
  atoms: [],
  forms: [],
  data: [],
  feedback: [],
  layout: [],
  third: [],
  industry: []
}

const re = {
  industry: /404$|Video|PTZ|AudioTalk|Onvif|Gbs|Vcr|SplitVideo/,
  third:
    /Preview|Print|Excel|Pdf|AudioPlay|Ocr|Crypto|Clipboard|Browser|DragCanvas|DragMaterial|Canvas|PropPanel|TemplateDrag|FreeLayout|GridLayout|DragVerify|CanvasIo|DragWrapper|DragRuler|DragSort|Qrcode|Barcode|MatrixCode|FilePreview|ImageCrop/,
  data: /Table|Tree|Chart|HeatMap|WordCloud|Ranking|Carousel|Collapse|Waterfall|CardList|TimelineList|Thumbnail|ImageGroup|ScrollNotice|DataCard|Pivot|Drill|Virtual|ProTable|Merge|EditTable|Sticky|TableDrag|TableExport|Calendar|Timeline$/,
  forms:
    /Picker|Form|Upload|Search|Select|Captcha|Sms|Editor|Range|Color|Filter|Transfer|Crop|Template|Password|Checkbox|Radio|Switch|Rate|Slider|AutoComplete|TagInput|Input|Textarea|Cascader|TreeSelect|DragSelect|Quarter|Week|RichText|MdEditor|CodeEditor|Chunk|Batch|Dynamic|StepForm|FormTabs|FormGroup|TimeRange|AdvancedSearch|LoginPanel|UserInfoCard|PermissionPanel|SettingPanel|DetailPanel|FlowPanel|BatchPanel|Dashboard|SearchFilter/,
  feedback:
    /^(Alert|Drawer|Result|Dialog|ConfirmDialog|Notification|Toast|Popconfirm|Popover|Mask|NoticeBar|Exception|StatusTip|ProgressTip|LoadingTip|Confirm|SuccessModal|ErrorModal|WarnModal|InfoModal|Message|Loading|Skeleton|Progress|Empty)$/,
  layout:
    /^(Layout|Header|Sider|Main|Footer|Row|Col|Space|Center|Container|CardGrid|ColumnLayout|Block|Spacer|FixedLayout|FlowLayout|StackLayout|ScaleLayout|EmbedLayout|FormLayout|Split|ResizeBox|MenuBar|ContextMenu|Breadcrumb|BreadcrumbItem|Steps|StepItem|Tabs|TabPane|Menu|Dropdown|Anchor)$|Nav$/,
  atoms:
    /^(Button|Icon|Link|Tag|Badge|Avatar|AvatarGroup|Typography|Ellipsis|Divider|Tooltip|BackTop|FloatButton|Watermark|Scrollbar|Highlight|Statistic|Countdown|Descriptions|DescriptionsItem|TimelineItem|Card)$/
}

for (const n of names) {
  if (re.industry.test(n)) zones.industry.push(n)
  else if (re.third.test(n)) zones.third.push(n)
  else if (re.data.test(n)) zones.data.push(n)
  else if (re.forms.test(n)) zones.forms.push(n)
  else if (re.feedback.test(n)) zones.feedback.push(n)
  else if (re.layout.test(n)) zones.layout.push(n)
  else if (re.atoms.test(n)) zones.atoms.push(n)
  else zones.atoms.push(n)
}

for (const k of Object.keys(zones)) {
  zones[k] = [...new Set(zones[k])].sort()
}

const assigned = new Set(Object.values(zones).flat())
const missing = names.filter((n) => !assigned.has(n))
if (missing.length) {
  console.warn('unassigned → atoms:', missing.join(', '))
  zones.atoms.push(...missing)
  zones.atoms.sort()
}

writeFileSync(resolve(root, 'example/component-zones.json'), `${JSON.stringify(zones, null, 2)}\n`)
const counts = Object.fromEntries(Object.entries(zones).map(([k, v]) => [k, v.length]))
console.log('[sync-example-zones]', counts, 'total', Object.values(counts).reduce((a, b) => a + b, 0))

execFileSync(process.execPath, [resolve(root, 'scripts/score-component-maturity.mjs')], {
  stdio: 'inherit'
})
