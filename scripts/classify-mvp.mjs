import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const base = resolve(root, 'packages/components/base')
const industry = resolve(root, 'packages/components/industry')
const dirs = [
  ...readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name),
  ...(existsSync(industry)
    ? readdirSync(industry, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
    : [])
].sort()

const waves = {
  w1_form: [],
  w2_data: [],
  w3_feedback_nav_layout: [],
  w4_third_lowcode: [],
  w5_industry: [],
  solid: []
}

const formRe =
  /Picker|Form|Upload|Search|Select|Captcha|Sms|Editor|Range|ColorInput|Filter|Transfer|Crop|Template|Password|Checkbox|Radio|Switch|Rate|Slider|AutoComplete|TagInput|InputNumber|Cascader|TreeSelect|DragSelect|Quarter|Week|RichText|MdEditor|CodeEditor|Chunk|Batch|ImageUpload|DynamicForm|FormGroup|FormTabs|StepForm|TreeForm|TimeRange|AdvancedSearch/
const dataRe =
  /Table|Tree|Chart|HeatMap|WordCloud|Ranking|Carousel|Collapse|Waterfall|CardList|TimelineList|Thumbnail|ImageGroup|ScrollNotice|DataCard|Pivot|Drill|Virtual|ProTable|Merge|EditTable|Sticky|TableDrag|TableExport|TablePrint|FolderTree|TransferTree|LazyTree|VirtualTree/
const fbNavLayRe =
  /Modal|Toast|Popconfirm|Popover|Mask|Notice|Exception|StatusTip|ProgressTip|LoadingTip|Confirm|Notification|Menu|Dropdown|Nav|Anchor|Pager|Layout|Header|Sider|Main|Footer|Row|Col|Space|Center|Container|CardGrid|Column|Block|Spacer|FixedLayout|FlowLayout|StackLayout|ScaleLayout|EmbedLayout|FormLayout|Result|Alert|Drawer/
const thirdLowRe =
  /Preview|Print|Excel|Pdf|VideoPreview|AudioPlay|Crypto|Clipboard|Browser|DragCanvas|DragMaterial|Canvas|PropPanel|TemplateDrag|FreeLayout|GridLayout|DragVerify|CanvasIo|CanvasPreview|DragWrapper|DragRuler|DragSort|FilePreview|ImageCrop/
const industryRe = /404|Video|PTZ|AudioTalk|Onvif|Gbs|Vcr|SplitVideo|Barcode|Qrcode|MatrixCode|OcrScan/

function isMvp(vue) {
  // Only treat as MVP if it still matches the original generic scaffold pattern
  const scaffold =
    vue.includes('data-component=') &&
    vue.includes('__btn') &&
    /t\(['"]common\.search['"]\)/.test(vue) &&
    /t\(['"]button\.confirm['"]\)/.test(vue) &&
    vue.split('\n').length < 100
  if (scaffold) return true
  if (vue.includes('data-variant=') && vue.includes('letter-spacing:0.2em') && vue.split('\n').length < 60)
    return true
  if (/mode: string = 'bubbles'/.test(vue) && vue.split('\n').length < 80) return true
  return false
}

for (const name of dirs) {
  const vue = readFileSync(join(base, name, 'index.vue'), 'utf8')
  const mvp = isMvp(vue)
  if (!mvp) {
    waves.solid.push(name)
    continue
  }
  if (industryRe.test(name)) waves.w5_industry.push(name)
  else if (thirdLowRe.test(name)) waves.w4_third_lowcode.push(name)
  else if (dataRe.test(name)) waves.w2_data.push(name)
  else if (formRe.test(name)) waves.w1_form.push(name)
  else if (fbNavLayRe.test(name)) waves.w3_feedback_nav_layout.push(name)
  else waves.w1_form.push(name) // leftover generics → form-ish polish wave
}

const out = {
  total: dirs.length,
  solid: waves.solid.length,
  mvp: dirs.length - waves.solid.length,
  waves: {
    w1_form: waves.w1_form,
    w2_data: waves.w2_data,
    w3_feedback_nav_layout: waves.w3_feedback_nav_layout,
    w4_third_lowcode: waves.w4_third_lowcode,
    w5_industry: waves.w5_industry
  }
}
writeFileSync(resolve(root, 'scripts/.component-waves.json'), JSON.stringify(out, null, 2))
console.log(JSON.stringify({ total: out.total, solid: out.solid, mvp: out.mvp, counts: Object.fromEntries(Object.entries(out.waves).map(([k, v]) => [k, v.length])) }, null, 2))
