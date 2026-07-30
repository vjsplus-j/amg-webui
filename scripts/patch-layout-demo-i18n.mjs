import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const localeRoot = join(root, 'packages/locale')

const packs = {
  'zh-CN': {
    'example.doc.split.when': '可拖拽分割面板：左右或上下分栏，编辑器 / IDE 布局常用。',
    'example.doc.split.demo.basic': '拖拽分割',
    'example.doc.split.demo.basicDesc': '拖动中间分隔条；可用按钮切换方向与初始比例。',
    'example.doc.split.prop.direction': '水平或垂直分割',
    'example.doc.split.prop.size': '首屏尺寸（px 或 %），支持 v-model:size',
    'example.doc.split.prop.minMax': '拖拽最小 / 最大尺寸（px）',
    'example.doc.split.sample.horizontal': '水平',
    'example.doc.split.sample.vertical': '垂直',
    'example.doc.split.sample.paneA': '面板 A',
    'example.doc.split.sample.paneB': '面板 B',
    'example.doc.split.sample.size': '当前尺寸：{size}',

    'example.doc.resizeBox.when': '可调整宽高的容器，用于侧栏、浮动面板、画布草稿区。',
    'example.doc.resizeBox.demo.basic': '拖拽缩放',
    'example.doc.resizeBox.demo.basicDesc': '拖动边缘 / 角点；下方显示最近一次尺寸。',
    'example.doc.resizeBox.prop.size': '初始宽高',
    'example.doc.resizeBox.prop.minMax': '最小 / 最大约束',
    'example.doc.resizeBox.prop.directions': '可拖拽方向集合',
    'example.doc.resizeBox.sample.body': '拖动边缘调整大小',
    'example.doc.resizeBox.sample.reset': '重置',
    'example.doc.resizeBox.sample.resized': '尺寸 {size}',

    'example.doc.row.when': '24 栅格 Row / Col，页面分栏与表单栅格。',
    'example.doc.row.demo.basic': '交互栅格',
    'example.doc.row.demo.basicDesc': '切换跨度组合，观察 gutter 与响应式列宽。',
    'example.doc.row.prop.gutter': '列间距（Token 或 spacing 倍数）',
    'example.doc.row.prop.align': '对齐与是否换行',
    'example.doc.row.prop.span': 'Col 跨度与偏移',
    'example.doc.row.sample.col': '跨度 {n}',

    'example.doc.container.when': '内容最大宽度容器，居中阅读栏或全宽流体布局。',
    'example.doc.container.demo.basic': '尺寸切换',
    'example.doc.container.demo.basicDesc': '切换 size / fluid，观察 max-width 变化。',
    'example.doc.container.prop.size': '最大宽度档位',
    'example.doc.container.prop.fluid': '是否铺满 / 是否左右内边距',
    'example.doc.container.sample.body': 'Container 内容区',
    'example.doc.container.sample.fluid': '流体',

    'example.doc.center.when': '单轴或双轴居中，空态 / 启动页 / 对话框体。',
    'example.doc.center.demo.basic': '轴向切换',
    'example.doc.center.demo.basicDesc': 'both / horizontal / vertical。',
    'example.doc.center.prop.axis': '居中轴向',
    'example.doc.center.sample.body': '居中内容',

    'example.doc.spacer.when': '弹性占位：把操作按钮推到两端或固定间距。',
    'example.doc.spacer.demo.basic': '弹性占位',
    'example.doc.spacer.demo.basicDesc': 'flex 占满剩余空间；关闭后使用固定 size。',
    'example.doc.spacer.prop.flex': '是否 flex:1 占满',
    'example.doc.spacer.prop.size': '固定间距 Token 与轴向',
    'example.doc.spacer.sample.left': '左侧',
    'example.doc.spacer.sample.right': '右侧',
    'example.doc.spacer.sample.flexOn': '弹性：开',
    'example.doc.spacer.sample.flexOff': '弹性：关',

    'example.doc.block.when': '语义块容器：内边距 / 边框 / 子项间距，页面分区。',
    'example.doc.block.demo.basic': '边框与内边距',
    'example.doc.block.demo.basicDesc': '切换 bordered / padded。',
    'example.doc.block.prop.flags': 'padded / bordered / gap',
    'example.doc.block.sample.body': '块级内容第一行',
    'example.doc.block.sample.body2': '块级内容第二行',
    'example.doc.block.sample.border': '边框',
    'example.doc.block.sample.pad': '内边距',

    'example.doc.stackLayout.when': '单向堆叠布局（纵 / 横），统一 gap Token。',
    'example.doc.stackLayout.demo.basic': '方向与间距',
    'example.doc.stackLayout.demo.basicDesc': '切换 direction 与 gap。',
    'example.doc.stackLayout.prop.direction': '堆叠方向',
    'example.doc.stackLayout.prop.gap': '间距与对齐',
    'example.doc.stackLayout.sample.a': '条目 A',
    'example.doc.stackLayout.sample.b': '条目 B',
    'example.doc.stackLayout.sample.c': '条目 C',

    'example.doc.flowLayout.when': '自动换行流式布局，标签云 / 筛选芯片。',
    'example.doc.flowLayout.demo.basic': '增减芯片',
    'example.doc.flowLayout.demo.basicDesc': '增减 Tag 数量并切换 gap。',
    'example.doc.flowLayout.prop.gap': '子项间距',
    'example.doc.flowLayout.sample.chip': '标签 {n}',

    'example.doc.columnLayout.when': '等宽多列网格，仪表盘分区。',
    'example.doc.columnLayout.demo.basic': '列数切换',
    'example.doc.columnLayout.demo.basicDesc': '1–4 列等分。',
    'example.doc.columnLayout.prop.columns': '列数（1–6）',
    'example.doc.columnLayout.prop.gap': '网格间距',
    'example.doc.columnLayout.sample.cell': '单元格 {n}',

    'example.doc.cardGrid.when': '自适应卡片网格（auto-fill + minTrack）。',
    'example.doc.cardGrid.demo.basic': '轨道与数量',
    'example.doc.cardGrid.demo.basicDesc': '切换最小轨道宽度并增减卡片。',
    'example.doc.cardGrid.prop.minTrack': '最小轨道宽度档',
    'example.doc.cardGrid.prop.gap': '卡片间距',
    'example.doc.cardGrid.sample.card': '卡片 {n}',

    'example.doc.fixedLayout.when': '固定定位条：顶栏 / 底栏 / 侧贴；演示可用 absolute 模式。',
    'example.doc.fixedLayout.demo.basic': '边位切换',
    'example.doc.fixedLayout.demo.basicDesc': '在框架内用 absolute 模拟四边贴边。',
    'example.doc.fixedLayout.prop.mode': 'fixed 视口 / absolute 相对宿主',
    'example.doc.fixedLayout.prop.position': '贴边位置与偏移',
    'example.doc.fixedLayout.sample.bar': '固定条',
    'example.doc.fixedLayout.sample.body': '宿主内容区',

    'example.doc.embedLayout.when': '固定宽高比嵌入区：视频 / iframe / 预览图。',
    'example.doc.embedLayout.demo.basic': '宽高比',
    'example.doc.embedLayout.demo.basicDesc': '切换 16:9 / 4:3 / 1:1。',
    'example.doc.embedLayout.prop.ratio': 'CSS aspect-ratio',
    'example.doc.embedLayout.prop.chrome': '圆角与边框',
    'example.doc.embedLayout.sample.body': '嵌入内容',

    'example.doc.scaleLayout.when': '整体缩放预览（设计稿缩略、大屏适配草稿）。',
    'example.doc.scaleLayout.demo.basic': '缩放控制',
    'example.doc.scaleLayout.demo.basicDesc': '增减 scale，观察内容整体缩放。',
    'example.doc.scaleLayout.prop.scale': '缩放倍率',
    'example.doc.scaleLayout.prop.origin': '变换原点',
    'example.doc.scaleLayout.sample.scale': '缩放 {n}',
    'example.doc.scaleLayout.sample.body': '被缩放的面板内容',

    'example.doc.formLayout.when': '标签 + 控件两列表单排版（非校验逻辑）。',
    'example.doc.formLayout.demo.basic': '标签宽度',
    'example.doc.formLayout.demo.basicDesc': '切换 labelWidth，输入后下方回显。',
    'example.doc.formLayout.prop.labelWidth': '标签列宽档',
    'example.doc.formLayout.prop.gap': '行间距',
    'example.doc.formLayout.sample.name': '名称',
    'example.doc.formLayout.sample.mail': '邮箱',
    'example.doc.formLayout.sample.namePh': '输入名称',
    'example.doc.formLayout.sample.mailPh': 'name@example.com',
    'example.doc.formLayout.sample.echo': '名称 {name} · 邮箱 {mail}'
  },
  'en-US': {}
}

// English + other locales from zh structure with EN strings
const en = {
  'example.doc.split.when': 'Draggable split panes for editor / IDE-style layouts.',
  'example.doc.split.demo.basic': 'Drag to split',
  'example.doc.split.demo.basicDesc': 'Drag the sash; toggle direction and seed size.',
  'example.doc.split.prop.direction': 'Horizontal or vertical',
  'example.doc.split.prop.size': 'First pane size (px or %), v-model:size',
  'example.doc.split.prop.minMax': 'Drag min / max in px',
  'example.doc.split.sample.horizontal': 'Horizontal',
  'example.doc.split.sample.vertical': 'Vertical',
  'example.doc.split.sample.paneA': 'Pane A',
  'example.doc.split.sample.paneB': 'Pane B',
  'example.doc.split.sample.size': 'Size: {size}',

  'example.doc.resizeBox.when': 'Resizable box for side panels, float panels, canvas drafts.',
  'example.doc.resizeBox.demo.basic': 'Drag resize',
  'example.doc.resizeBox.demo.basicDesc': 'Drag edges / corner; last size shown below.',
  'example.doc.resizeBox.prop.size': 'Initial width / height',
  'example.doc.resizeBox.prop.minMax': 'Min / max constraints',
  'example.doc.resizeBox.prop.directions': 'Active resize handles',
  'example.doc.resizeBox.sample.body': 'Drag edges to resize',
  'example.doc.resizeBox.sample.reset': 'Reset',
  'example.doc.resizeBox.sample.resized': 'Size {size}',

  'example.doc.row.when': '24-column Row / Col grid for page and form layouts.',
  'example.doc.row.demo.basic': 'Interactive grid',
  'example.doc.row.demo.basicDesc': 'Switch span presets and watch gutters.',
  'example.doc.row.prop.gutter': 'Column gap (token or spacing multiple)',
  'example.doc.row.prop.align': 'Align / justify / wrap',
  'example.doc.row.prop.span': 'Col span and offset',
  'example.doc.row.sample.col': 'Span {n}',

  'example.doc.container.when': 'Max-width content container — reading column or fluid.',
  'example.doc.container.demo.basic': 'Size switch',
  'example.doc.container.demo.basicDesc': 'Toggle size / fluid and watch max-width.',
  'example.doc.container.prop.size': 'Max-width tier',
  'example.doc.container.prop.fluid': 'Fluid fill / horizontal padding',
  'example.doc.container.sample.body': 'Container body',
  'example.doc.container.sample.fluid': 'Fluid',

  'example.doc.center.when': 'Axis centering for empty / splash / dialog bodies.',
  'example.doc.center.demo.basic': 'Axis switch',
  'example.doc.center.demo.basicDesc': 'both / horizontal / vertical.',
  'example.doc.center.prop.axis': 'Centering axis',
  'example.doc.center.sample.body': 'Centered content',

  'example.doc.spacer.when': 'Flex spacer — push actions apart or fixed gaps.',
  'example.doc.spacer.demo.basic': 'Flex spacer',
  'example.doc.spacer.demo.basicDesc': 'flex fills remainder; off uses fixed size.',
  'example.doc.spacer.prop.flex': 'Whether flex:1',
  'example.doc.spacer.prop.size': 'Fixed spacing token and axis',
  'example.doc.spacer.sample.left': 'Left',
  'example.doc.spacer.sample.right': 'Right',
  'example.doc.spacer.sample.flexOn': 'Flex: on',
  'example.doc.spacer.sample.flexOff': 'Flex: off',

  'example.doc.block.when': 'Semantic block: padding / border / child gap.',
  'example.doc.block.demo.basic': 'Border & pad',
  'example.doc.block.demo.basicDesc': 'Toggle bordered / padded.',
  'example.doc.block.prop.flags': 'padded / bordered / gap',
  'example.doc.block.sample.body': 'Block line one',
  'example.doc.block.sample.body2': 'Block line two',
  'example.doc.block.sample.border': 'Border',
  'example.doc.block.sample.pad': 'Padding',

  'example.doc.stackLayout.when': 'One-axis stack with token gaps.',
  'example.doc.stackLayout.demo.basic': 'Direction & gap',
  'example.doc.stackLayout.demo.basicDesc': 'Toggle direction and gap.',
  'example.doc.stackLayout.prop.direction': 'Stack direction',
  'example.doc.stackLayout.prop.gap': 'Gap and alignment',
  'example.doc.stackLayout.sample.a': 'Item A',
  'example.doc.stackLayout.sample.b': 'Item B',
  'example.doc.stackLayout.sample.c': 'Item C',

  'example.doc.flowLayout.when': 'Wrapping flow for tag clouds / filter chips.',
  'example.doc.flowLayout.demo.basic': 'Add / remove chips',
  'example.doc.flowLayout.demo.basicDesc': 'Change Tag count and gap.',
  'example.doc.flowLayout.prop.gap': 'Child gap',
  'example.doc.flowLayout.sample.chip': 'Tag {n}',

  'example.doc.columnLayout.when': 'Equal-width multi-column grid.',
  'example.doc.columnLayout.demo.basic': 'Column count',
  'example.doc.columnLayout.demo.basicDesc': '1–4 equal columns.',
  'example.doc.columnLayout.prop.columns': 'Column count (1–6)',
  'example.doc.columnLayout.prop.gap': 'Grid gap',
  'example.doc.columnLayout.sample.cell': 'Cell {n}',

  'example.doc.cardGrid.when': 'Responsive card grid (auto-fill + minTrack).',
  'example.doc.cardGrid.demo.basic': 'Track & count',
  'example.doc.cardGrid.demo.basicDesc': 'Change min track and card count.',
  'example.doc.cardGrid.prop.minTrack': 'Min track tier',
  'example.doc.cardGrid.prop.gap': 'Card gap',
  'example.doc.cardGrid.sample.card': 'Card {n}',

  'example.doc.fixedLayout.when': 'Fixed bars; demos use absolute mode inside a frame.',
  'example.doc.fixedLayout.demo.basic': 'Edge switch',
  'example.doc.fixedLayout.demo.basicDesc': 'Pin to four edges with absolute mode.',
  'example.doc.fixedLayout.prop.mode': 'fixed viewport / absolute host',
  'example.doc.fixedLayout.prop.position': 'Edge and offset',
  'example.doc.fixedLayout.sample.bar': 'Pinned bar',
  'example.doc.fixedLayout.sample.body': 'Host content',

  'example.doc.embedLayout.when': 'Aspect-ratio embed for video / iframe / preview.',
  'example.doc.embedLayout.demo.basic': 'Aspect ratio',
  'example.doc.embedLayout.demo.basicDesc': 'Switch 16:9 / 4:3 / 1:1.',
  'example.doc.embedLayout.prop.ratio': 'CSS aspect-ratio',
  'example.doc.embedLayout.prop.chrome': 'Radius and border',
  'example.doc.embedLayout.sample.body': 'Embed body',

  'example.doc.scaleLayout.when': 'Uniform scale preview for drafts / large screens.',
  'example.doc.scaleLayout.demo.basic': 'Scale control',
  'example.doc.scaleLayout.demo.basicDesc': 'Nudge scale and watch the panel.',
  'example.doc.scaleLayout.prop.scale': 'Scale factor',
  'example.doc.scaleLayout.prop.origin': 'Transform origin',
  'example.doc.scaleLayout.sample.scale': 'Scale {n}',
  'example.doc.scaleLayout.sample.body': 'Scaled panel content',

  'example.doc.formLayout.when': 'Label + control form rows (layout only, no validation).',
  'example.doc.formLayout.demo.basic': 'Label width',
  'example.doc.formLayout.demo.basicDesc': 'Toggle labelWidth; echo inputs below.',
  'example.doc.formLayout.prop.labelWidth': 'Label column tier',
  'example.doc.formLayout.prop.gap': 'Row gap',
  'example.doc.formLayout.sample.name': 'Name',
  'example.doc.formLayout.sample.mail': 'Email',
  'example.doc.formLayout.sample.namePh': 'Enter name',
  'example.doc.formLayout.sample.mailPh': 'name@example.com',
  'example.doc.formLayout.sample.echo': 'Name {name} · Email {mail}'
}

packs['en-US'] = en
packs['zh-TW'] = { ...packs['zh-CN'] } // Traditional: keep Simplified for now for layout lab keys — better than missing
// mild TW overrides
Object.assign(packs['zh-TW'], {
  'example.doc.split.sample.horizontal': '水平',
  'example.doc.split.sample.vertical': '垂直',
  'example.doc.container.sample.fluid': '流體',
  'example.doc.block.sample.border': '邊框',
  'example.doc.block.sample.pad': '內邊距'
})

for (const code of ['ja-JP', 'ko-KR', 'ko-KP', 'ru-RU']) {
  packs[code] = { ...en }
}

function patchFile(locale) {
  const file = join(localeRoot, locale, 'exampleDoc.ts')
  let text = readFileSync(file, 'utf8')
  const map = packs[locale]
  const missing = Object.entries(map).filter(([k]) => !text.includes(`"${k}"`))
  if (!missing.length) {
    console.log(locale, 'already has keys')
    return
  }
  const insert = missing.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join('\n')
  // insert before final closing brace
  const idx = text.lastIndexOf('}')
  if (idx < 0) throw new Error('no closing brace ' + locale)
  // ensure previous line ends with comma
  const before = text.slice(0, idx).replace(/\s+$/, '')
  const needsComma = !before.endsWith(',')
  text = before + (needsComma ? ',\n' : '\n') + insert + '\n' + text.slice(idx)
  writeFileSync(file, text, 'utf8')
  console.log(locale, 'added', missing.length)
}

for (const locale of readdirSync(localeRoot).filter((d) => packs[d])) {
  patchFile(locale)
}
