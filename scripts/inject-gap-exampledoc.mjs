/**
 * Inject Gap Batch example.doc keys (all 7 locales) after scaffold demos.
 * node scripts/inject-gap-exampledoc.mjs
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const locales = ['zh-CN', 'zh-TW', 'en-US', 'ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']

/** @type {Record<string, Record<string, string>>} */
const packs = {
  'zh-CN': {
    'example.doc.configProvider.when': '全局配置注入：默认尺寸 / zIndex / 嵌套 Button·Tag 配置。',
    'example.doc.configProvider.demo.basic': '嵌套默认尺寸',
    'example.doc.configProvider.demo.basicDesc': 'ConfigProvider 向下提供 button/tag 全局默认。',
    'example.doc.configProvider.prop.size': '默认控件尺寸',
    'example.doc.configProvider.prop.zIndex': '浮层基准 z-index（CSS 变量）',
    'example.doc.configProvider.prop.nested': '嵌套组件全局配置',
    'example.doc.configProvider.prop.base': '透传 class / style',
    'example.doc.configProvider.sample.btn': '主按钮',
    'example.doc.configProvider.sample.tag': '标签',

    'example.doc.messageBox.when': '命令式确认 / 提示 / 输入框。',
    'example.doc.messageBox.demo.basic': 'confirm / alert / prompt',
    'example.doc.messageBox.demo.basicDesc': 'Promise API，可与业务逻辑 await。',
    'example.doc.messageBox.prop.confirm': '确认对话框',
    'example.doc.messageBox.prop.alert': '仅确认提示',
    'example.doc.messageBox.prop.prompt': '带输入确认',
    'example.doc.messageBox.prop.base': '透传 class / style',
    'example.doc.messageBox.sample.title': '确认操作',
    'example.doc.messageBox.sample.body': '是否继续执行此操作？',
    'example.doc.messageBox.sample.alertTitle': '提示',
    'example.doc.messageBox.sample.alertBody': '操作已完成。',
    'example.doc.messageBox.sample.promptTitle': '请输入',
    'example.doc.messageBox.sample.promptBody': '请输入备注后继续。',
    'example.doc.messageBox.sample.openConfirm': '打开确认',
    'example.doc.messageBox.sample.openAlert': '打开提示',
    'example.doc.messageBox.sample.openPrompt': '打开输入',
    'example.doc.messageBox.sample.result': '结果',

    'example.doc.affix.when': '滚动容器内固定元素。',
    'example.doc.affix.demo.basic': '容器内吸顶',
    'example.doc.affix.demo.basicDesc': '向下滚动，观察 Affix 固定状态。',
    'example.doc.affix.prop.offsetTop': '距顶部偏移',
    'example.doc.affix.prop.target': '滚动容器',
    'example.doc.affix.prop.base': '透传 class / style',
    'example.doc.affix.sample.fixed': '已固定',
    'example.doc.affix.sample.static': '未固定',
    'example.doc.affix.sample.hint': '滚动内容',

    'example.doc.pageHeader.when': '页头：返回、标题、额外操作。',
    'example.doc.pageHeader.demo.basic': '基础页头',
    'example.doc.pageHeader.demo.basicDesc': '带返回按钮与右侧操作区。',
    'example.doc.pageHeader.prop.title': '标题 / 副标题',
    'example.doc.pageHeader.prop.back': '是否显示返回',
    'example.doc.pageHeader.prop.base': '透传 class / style',
    'example.doc.pageHeader.sample.title': '订单详情',
    'example.doc.pageHeader.sample.subtitle': '只读查看',
    'example.doc.pageHeader.sample.extra': '编辑',
    'example.doc.pageHeader.sample.body': '页头下方可放置说明或筛选。',
    'example.doc.pageHeader.sample.backFired': '已触发返回',

    'example.doc.segmented.when': '分段控制器，适合视图切换。',
    'example.doc.segmented.demo.basic': '基础分段',
    'example.doc.segmented.demo.basicDesc': '支持 block 铺满与尺寸。',
    'example.doc.segmented.prop.modelValue': '当前选中值',
    'example.doc.segmented.prop.options': '选项列表',
    'example.doc.segmented.prop.block': '是否铺满宽度',
    'example.doc.segmented.prop.base': '透传 class / style',
    'example.doc.segmented.sample.day': '日',
    'example.doc.segmented.sample.week': '周',
    'example.doc.segmented.sample.month': '月',

    'example.doc.inputOTP.when': '一次性验证码格子输入。',
    'example.doc.inputOTP.demo.basic': '六位验证码',
    'example.doc.inputOTP.demo.basicDesc': '支持粘贴、自动跳格与遮罩。',
    'example.doc.inputOTP.prop.modelValue': '绑定值',
    'example.doc.inputOTP.prop.length': '位数',
    'example.doc.inputOTP.prop.mask': '是否遮罩显示',
    'example.doc.inputOTP.prop.base': '透传 class / style',
    'example.doc.inputOTP.sample.value': '当前值',
    'example.doc.inputOTP.sample.complete': '已完成',

    'example.doc.timeSelect.when': '按步长选择固定时间点。',
    'example.doc.timeSelect.demo.basic': '半小时步长',
    'example.doc.timeSelect.demo.basicDesc': 'start / end / step 生成选项。',
    'example.doc.timeSelect.prop.modelValue': '选中时间 HH:mm',
    'example.doc.timeSelect.prop.range': '起止与步长',
    'example.doc.timeSelect.prop.base': '透传 class / style',

    'example.doc.mention.when': '@ 提及输入。',
    'example.doc.mention.demo.basic': '基础提及',
    'example.doc.mention.demo.basicDesc': '输入 @ 弹出候选项。',
    'example.doc.mention.prop.modelValue': '文本内容',
    'example.doc.mention.prop.options': '候选项',
    'example.doc.mention.prop.prefix': '触发前缀',
    'example.doc.mention.prop.base': '透传 class / style',
    'example.doc.mention.sample.hint': '输入 @ 试试',

    'example.doc.image.when': '图片展示与预览。',
    'example.doc.image.demo.basic': '封面 / 包含',
    'example.doc.image.demo.basicDesc': '点击可打开预览层。',
    'example.doc.image.prop.src': '图片地址',
    'example.doc.image.prop.fit': 'object-fit',
    'example.doc.image.prop.preview': '是否可预览',
    'example.doc.image.prop.base': '透传 class / style',

    'example.doc.imageViewer.when': '全屏图片预览器。',
    'example.doc.imageViewer.demo.basic': '打开预览',
    'example.doc.imageViewer.demo.basicDesc': '支持切换、缩放与旋转。',
    'example.doc.imageViewer.prop.visible': '是否可见',
    'example.doc.imageViewer.prop.urlList': '图片列表',
    'example.doc.imageViewer.prop.base': '透传 class / style',
    'example.doc.imageViewer.sample.open': '打开查看器',

    'example.doc.tour.when': '新手引导步骤。',
    'example.doc.tour.demo.basic': '三步引导',
    'example.doc.tour.demo.basicDesc': '高亮目标并逐步说明。',
    'example.doc.tour.prop.open': '是否打开',
    'example.doc.tour.prop.steps': '步骤配置',
    'example.doc.tour.prop.base': '透传 class / style',
    'example.doc.tour.sample.start': '开始引导',
    'example.doc.tour.sample.card': '目标卡片',
    'example.doc.tour.sample.action': '操作按钮',
    'example.doc.tour.sample.s1Title': '第一步',
    'example.doc.tour.sample.s1Desc': '从这里开始。',
    'example.doc.tour.sample.s2Title': '第二步',
    'example.doc.tour.sample.s2Desc': '查看卡片区域。',
    'example.doc.tour.sample.s3Title': '第三步',
    'example.doc.tour.sample.s3Desc': '完成操作。',

    'example.doc.infiniteScroll.when': '滚动到底自动加载。',
    'example.doc.infiniteScroll.demo.basic': '列表加载',
    'example.doc.infiniteScroll.demo.basicDesc': '触底触发 load 事件。',
    'example.doc.infiniteScroll.prop.loading': '加载中 / 已结束',
    'example.doc.infiniteScroll.prop.distance': '触发距离',
    'example.doc.infiniteScroll.prop.base': '透传 class / style',
    'example.doc.infiniteScroll.sample.row': '列表项'
  }
}

// English defaults for non-zh-CN
const en = {
  'example.doc.configProvider.when': 'Global defaults: size / zIndex / nested Button·Tag config.',
  'example.doc.configProvider.demo.basic': 'Nested default size',
  'example.doc.configProvider.demo.basicDesc': 'ConfigProvider injects button/tag defaults.',
  'example.doc.configProvider.prop.size': 'Default control size',
  'example.doc.configProvider.prop.zIndex': 'Overlay base z-index (CSS var)',
  'example.doc.configProvider.prop.nested': 'Nested component global configs',
  'example.doc.configProvider.prop.base': 'Forward class / style',
  'example.doc.configProvider.sample.btn': 'Primary',
  'example.doc.configProvider.sample.tag': 'Tag',

  'example.doc.messageBox.when': 'Imperative confirm / alert / prompt.',
  'example.doc.messageBox.demo.basic': 'confirm / alert / prompt',
  'example.doc.messageBox.demo.basicDesc': 'Promise API for business awaits.',
  'example.doc.messageBox.prop.confirm': 'Confirm dialog',
  'example.doc.messageBox.prop.alert': 'Alert (confirm only)',
  'example.doc.messageBox.prop.prompt': 'Prompt with input',
  'example.doc.messageBox.prop.base': 'Forward class / style',
  'example.doc.messageBox.sample.title': 'Confirm',
  'example.doc.messageBox.sample.body': 'Continue with this action?',
  'example.doc.messageBox.sample.alertTitle': 'Notice',
  'example.doc.messageBox.sample.alertBody': 'Done.',
  'example.doc.messageBox.sample.promptTitle': 'Input',
  'example.doc.messageBox.sample.promptBody': 'Enter a note to continue.',
  'example.doc.messageBox.sample.openConfirm': 'Confirm',
  'example.doc.messageBox.sample.openAlert': 'Alert',
  'example.doc.messageBox.sample.openPrompt': 'Prompt',
  'example.doc.messageBox.sample.result': 'Result',

  'example.doc.affix.when': 'Pin content inside a scroll container.',
  'example.doc.affix.demo.basic': 'Affix in container',
  'example.doc.affix.demo.basicDesc': 'Scroll to see affixed state.',
  'example.doc.affix.prop.offsetTop': 'Top offset',
  'example.doc.affix.prop.target': 'Scroll container',
  'example.doc.affix.prop.base': 'Forward class / style',
  'example.doc.affix.sample.fixed': 'Affixed',
  'example.doc.affix.sample.static': 'Static',
  'example.doc.affix.sample.hint': 'Scroll content',

  'example.doc.pageHeader.when': 'Page header with back, title, extra.',
  'example.doc.pageHeader.demo.basic': 'Basic header',
  'example.doc.pageHeader.demo.basicDesc': 'Back button and extra actions.',
  'example.doc.pageHeader.prop.title': 'Title / subtitle',
  'example.doc.pageHeader.prop.back': 'Show back button',
  'example.doc.pageHeader.prop.base': 'Forward class / style',
  'example.doc.pageHeader.sample.title': 'Order detail',
  'example.doc.pageHeader.sample.subtitle': 'Read only',
  'example.doc.pageHeader.sample.extra': 'Edit',
  'example.doc.pageHeader.sample.body': 'Place filters or notes under the header.',
  'example.doc.pageHeader.sample.backFired': 'Back fired',

  'example.doc.segmented.when': 'Segmented control for view switching.',
  'example.doc.segmented.demo.basic': 'Basic segmented',
  'example.doc.segmented.demo.basicDesc': 'Supports block and sizes.',
  'example.doc.segmented.prop.modelValue': 'Selected value',
  'example.doc.segmented.prop.options': 'Options',
  'example.doc.segmented.prop.block': 'Full width',
  'example.doc.segmented.prop.base': 'Forward class / style',
  'example.doc.segmented.sample.day': 'Day',
  'example.doc.segmented.sample.week': 'Week',
  'example.doc.segmented.sample.month': 'Month',

  'example.doc.inputOTP.when': 'One-time password cell input.',
  'example.doc.inputOTP.demo.basic': '6-digit OTP',
  'example.doc.inputOTP.demo.basicDesc': 'Paste, auto-advance, and mask.',
  'example.doc.inputOTP.prop.modelValue': 'Bound value',
  'example.doc.inputOTP.prop.length': 'Length',
  'example.doc.inputOTP.prop.mask': 'Mask digits',
  'example.doc.inputOTP.prop.base': 'Forward class / style',
  'example.doc.inputOTP.sample.value': 'Value',
  'example.doc.inputOTP.sample.complete': 'Complete',

  'example.doc.timeSelect.when': 'Pick fixed time slots by step.',
  'example.doc.timeSelect.demo.basic': '30-minute step',
  'example.doc.timeSelect.demo.basicDesc': 'Options from start / end / step.',
  'example.doc.timeSelect.prop.modelValue': 'Selected HH:mm',
  'example.doc.timeSelect.prop.range': 'Start / end / step',
  'example.doc.timeSelect.prop.base': 'Forward class / style',

  'example.doc.mention.when': '@ mention input.',
  'example.doc.mention.demo.basic': 'Basic mention',
  'example.doc.mention.demo.basicDesc': 'Type @ to open suggestions.',
  'example.doc.mention.prop.modelValue': 'Text',
  'example.doc.mention.prop.options': 'Suggestions',
  'example.doc.mention.prop.prefix': 'Trigger prefix',
  'example.doc.mention.prop.base': 'Forward class / style',
  'example.doc.mention.sample.hint': 'Type @ to try',

  'example.doc.image.when': 'Image display with preview.',
  'example.doc.image.demo.basic': 'Cover / contain',
  'example.doc.image.demo.basicDesc': 'Click to open viewer.',
  'example.doc.image.prop.src': 'Image URL',
  'example.doc.image.prop.fit': 'object-fit',
  'example.doc.image.prop.preview': 'Enable preview',
  'example.doc.image.prop.base': 'Forward class / style',

  'example.doc.imageViewer.when': 'Fullscreen image viewer.',
  'example.doc.imageViewer.demo.basic': 'Open viewer',
  'example.doc.imageViewer.demo.basicDesc': 'Switch, zoom, and rotate.',
  'example.doc.imageViewer.prop.visible': 'Visible',
  'example.doc.imageViewer.prop.urlList': 'URL list',
  'example.doc.imageViewer.prop.base': 'Forward class / style',
  'example.doc.imageViewer.sample.open': 'Open viewer',

  'example.doc.tour.when': 'Onboarding tour steps.',
  'example.doc.tour.demo.basic': '3-step tour',
  'example.doc.tour.demo.basicDesc': 'Highlight targets step by step.',
  'example.doc.tour.prop.open': 'Open state',
  'example.doc.tour.prop.steps': 'Step config',
  'example.doc.tour.prop.base': 'Forward class / style',
  'example.doc.tour.sample.start': 'Start tour',
  'example.doc.tour.sample.card': 'Target card',
  'example.doc.tour.sample.action': 'Action',
  'example.doc.tour.sample.s1Title': 'Step 1',
  'example.doc.tour.sample.s1Desc': 'Start here.',
  'example.doc.tour.sample.s2Title': 'Step 2',
  'example.doc.tour.sample.s2Desc': 'Inspect the card.',
  'example.doc.tour.sample.s3Title': 'Step 3',
  'example.doc.tour.sample.s3Desc': 'Finish the action.',

  'example.doc.infiniteScroll.when': 'Load more when scrolling to bottom.',
  'example.doc.infiniteScroll.demo.basic': 'List load',
  'example.doc.infiniteScroll.demo.basicDesc': 'Emits load near the bottom.',
  'example.doc.infiniteScroll.prop.loading': 'Loading / finished',
  'example.doc.infiniteScroll.prop.distance': 'Trigger distance',
  'example.doc.infiniteScroll.prop.base': 'Forward class / style',
  'example.doc.infiniteScroll.sample.row': 'Row'
}

packs['en-US'] = en
packs['zh-TW'] = { ...en, ...Object.fromEntries(Object.entries(packs['zh-CN']).map(([k, v]) => [k, v.replace(/组件/g, '元件').replace(/确认/g, '確認').replace(/输入/g, '輸入').replace(/打开/g, '開啟').replace(/列表/g, '清單')])) }
for (const loc of ['ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']) {
  packs[loc] = { ...en }
}

function upsert(filePath, map) {
  if (!existsSync(filePath)) return 0
  let src = readFileSync(filePath, 'utf8')
  let added = 0
  const lines = []
  for (const [k, v] of Object.entries(map)) {
    const needle = `'${k}':`
    if (src.includes(needle)) {
      src = src.replace(
        new RegExp(`^\\s*'${k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}':\\s*.+,$`, 'm'),
        `  '${k}': ${JSON.stringify(v)},`
      )
    } else {
      lines.push(`  '${k}': ${JSON.stringify(v)},`)
      added++
    }
  }
  if (lines.length) {
    src = src.replace(/\n\}\s*$/, `\n${lines.join('\n')}\n}\n`)
  }
  writeFileSync(filePath, src, 'utf8')
  return added
}

for (const loc of locales) {
  const n = upsert(join(root, `packages/locale/${loc}/exampleDoc.ts`), packs[loc])
  console.log(loc, 'added', n)
}
