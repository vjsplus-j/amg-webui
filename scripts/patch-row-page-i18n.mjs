import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const localeRoot = join(dirname(fileURLToPath(import.meta.url)), '../packages/locale')

const zh = {
  'example.doc.row.when':
    '24 栅格用于真实页面编排：应用壳、仪表盘、复杂表单、主从详情、非对称内容区；支持 offset / 嵌套 / flex / push·pull。',
  'example.doc.row.demo.page': '复杂页面编排',
  'example.doc.row.demo.pageDesc':
    '五套可切换的页面级栅格：壳层导航、KPI+图+表、双栏表单、列表详情、非对称图文（含 offset / flex / push·pull）。',
  'example.doc.row.demo.offset': '偏移与错位',
  'example.doc.row.demo.offsetDesc': '居中条带与阶梯错位。',
  'example.doc.row.demo.nested': '三层嵌套',
  'example.doc.row.demo.nestedDesc': '工具条 + 双列叶子栅格 + 侧栏。',
  'example.doc.row.prop.spanFull': 'span / offset / push / pull / flex 组合编排',
  'example.doc.row.sample.page.shell': '应用壳',
  'example.doc.row.sample.page.dashboard': '仪表盘',
  'example.doc.row.sample.page.form': '复杂表单',
  'example.doc.row.sample.page.detail': '主从详情',
  'example.doc.row.sample.page.editorial': '非对称图文',
  'example.doc.row.sample.brand': 'AMG Console',
  'example.doc.row.sample.env': 'Staging',
  'example.doc.row.sample.actionPrimary': '发布',
  'example.doc.row.sample.navTitle': '导航',
  'example.doc.row.sample.nav.a': '总览',
  'example.doc.row.sample.nav.b': '资源',
  'example.doc.row.sample.nav.c': '审计',
  'example.doc.row.sample.searchPh': '搜索资源…',
  'example.doc.row.sample.filter': '筛选',
  'example.doc.row.sample.create': '新建',
  'example.doc.row.sample.mainTitle': '主区 · {nav}',
  'example.doc.row.sample.mainBody': '主内容由 16 栅格承载，内部再拆三列磁贴。',
  'example.doc.row.sample.asideTitle': '侧栏',
  'example.doc.row.sample.asideBody': '8 栅格辅助信息与快捷操作。',
  'example.doc.row.sample.asideCta': '查看全部',
  'example.doc.row.sample.tile': '磁贴 {n}',
  'example.doc.row.sample.kpiLabel': '指标 {n}',
  'example.doc.row.sample.kpiValue': '{n}28',
  'example.doc.row.sample.chartTitle': '趋势',
  'example.doc.row.sample.feedTitle': '动态',
  'example.doc.row.sample.feedTag': '事件 {n}',
  'example.doc.row.sample.feedLine': '流水说明条目 {n}',
  'example.doc.row.sample.tableTitle': '明细表（栅格表头）',
  'example.doc.row.sample.colName': '名称',
  'example.doc.row.sample.colStatus': '状态',
  'example.doc.row.sample.colAction': '操作',
  'example.doc.row.sample.rowName': '资源-{n}',
  'example.doc.row.sample.rowStatus': '正常',
  'example.doc.row.sample.open': '打开',
  'example.doc.row.sample.formTitle': '资料表单',
  'example.doc.row.sample.formHintTitle': '填写说明',
  'example.doc.row.sample.formHintBody': '标签 6 + 控件 18；城市行混排输入与按钮；底栏 offset 右对齐提交。',
  'example.doc.row.sample.fieldName': '名称',
  'example.doc.row.sample.fieldMail': '邮箱',
  'example.doc.row.sample.fieldCity': '城市',
  'example.doc.row.sample.fieldNamePh': '输入名称',
  'example.doc.row.sample.fieldMailPh': 'name@example.com',
  'example.doc.row.sample.fieldCityPh': '选择或输入',
  'example.doc.row.sample.pickCity': '地图选点',
  'example.doc.row.sample.halfA': '半区 A',
  'example.doc.row.sample.halfB': '半区 B',
  'example.doc.row.sample.halfC': '右侧整列',
  'example.doc.row.sample.cancel': '取消',
  'example.doc.row.sample.submit': '提交',
  'example.doc.row.sample.listTitle': '订单列表',
  'example.doc.row.sample.orderTitle': '订单 #{n}',
  'example.doc.row.sample.orderMeta': '客户 C-{n} · 今日',
  'example.doc.row.sample.detailTitle': '详情 #{n}',
  'example.doc.row.sample.edit': '编辑',
  'example.doc.row.sample.save': '保存',
  'example.doc.row.sample.metaStatus': '状态',
  'example.doc.row.sample.metaOwner': '负责人',
  'example.doc.row.sample.metaTime': '更新时间',
  'example.doc.row.sample.owner': '用户 {n}',
  'example.doc.row.sample.time': '14:0{n}',
  'example.doc.row.sample.detailBody': '详情正文占用 14 栅格，右侧 10 栅格放批注块；底部四等分附件槽。订单 {n}。',
  'example.doc.row.sample.sideNote': '批注',
  'example.doc.row.sample.sideNoteBody': '嵌套 Block，不打断外层栅格节奏。',
  'example.doc.row.sample.heroTitle': '非对称内容栅格',
  'example.doc.row.sample.heroLead': 'Hero 用 offset 居中条带；下方图文混排演示 flex / push·pull。',
  'example.doc.row.sample.heroCta': '开始',
  'example.doc.row.sample.heroSecondary': '文档',
  'example.doc.row.sample.feature': '特性 {n}',
  'example.doc.row.sample.featureBody': '三等分特性卡，栅格跨度均为 8。',
  'example.doc.row.sample.media': '媒体占位 10',
  'example.doc.row.sample.storyWide': '宽文案 16',
  'example.doc.row.sample.storyNarrow': '窄卡 8',
  'example.doc.row.sample.storyOffset': 'offset 错位',
  'example.doc.row.sample.storyFlex': 'flex 补齐',
  'example.doc.row.sample.col': '跨度 {n}',
  'example.doc.row.sample.offset': 'span {span} · offset {offset}',
  'example.doc.row.sample.push': 'push {n}',
  'example.doc.row.sample.pull': 'pull {n}',
  'example.doc.row.sample.nestedToolbar': '嵌套工具条 · span 24',
  'example.doc.row.sample.nestedSide': '侧栏说明',
  'example.doc.row.sample.nestedSideBody': '与左侧三层栅格并列的 8 列卡片。'
}

const en = {
  'example.doc.row.when':
    '24-col grids for real pages: app shell, dashboard, dense forms, master-detail, asymmetric editorial — with offset / nest / flex / push·pull.',
  'example.doc.row.demo.page': 'Complex page grids',
  'example.doc.row.demo.pageDesc':
    'Five switchable page-grade layouts: shell, KPI+chart+table, dual-pane form, list/detail, asymmetric media (offset / flex / push·pull).',
  'example.doc.row.demo.offset': 'Offset & stagger',
  'example.doc.row.demo.offsetDesc': 'Centered band and stepped columns.',
  'example.doc.row.demo.nested': 'Three-level nest',
  'example.doc.row.demo.nestedDesc': 'Toolbar + dual leaf grids + side card.',
  'example.doc.row.prop.spanFull': 'Compose with span / offset / push / pull / flex',
  'example.doc.row.sample.page.shell': 'App shell',
  'example.doc.row.sample.page.dashboard': 'Dashboard',
  'example.doc.row.sample.page.form': 'Dense form',
  'example.doc.row.sample.page.detail': 'Master-detail',
  'example.doc.row.sample.page.editorial': 'Editorial',
  'example.doc.row.sample.brand': 'AMG Console',
  'example.doc.row.sample.env': 'Staging',
  'example.doc.row.sample.actionPrimary': 'Publish',
  'example.doc.row.sample.navTitle': 'Nav',
  'example.doc.row.sample.nav.a': 'Overview',
  'example.doc.row.sample.nav.b': 'Assets',
  'example.doc.row.sample.nav.c': 'Audit',
  'example.doc.row.sample.searchPh': 'Search assets…',
  'example.doc.row.sample.filter': 'Filter',
  'example.doc.row.sample.create': 'Create',
  'example.doc.row.sample.mainTitle': 'Main · {nav}',
  'example.doc.row.sample.mainBody': 'Main pane spans 16 cols with a nested 3-tile row.',
  'example.doc.row.sample.asideTitle': 'Aside',
  'example.doc.row.sample.asideBody': '8-col helper copy and quick action.',
  'example.doc.row.sample.asideCta': 'View all',
  'example.doc.row.sample.tile': 'Tile {n}',
  'example.doc.row.sample.kpiLabel': 'Metric {n}',
  'example.doc.row.sample.kpiValue': '{n}28',
  'example.doc.row.sample.chartTitle': 'Trend',
  'example.doc.row.sample.feedTitle': 'Feed',
  'example.doc.row.sample.feedTag': 'Event {n}',
  'example.doc.row.sample.feedLine': 'Feed line {n}',
  'example.doc.row.sample.tableTitle': 'Table (grid header)',
  'example.doc.row.sample.colName': 'Name',
  'example.doc.row.sample.colStatus': 'Status',
  'example.doc.row.sample.colAction': 'Action',
  'example.doc.row.sample.rowName': 'Asset-{n}',
  'example.doc.row.sample.rowStatus': 'OK',
  'example.doc.row.sample.open': 'Open',
  'example.doc.row.sample.formTitle': 'Profile form',
  'example.doc.row.sample.formHintTitle': 'Hints',
  'example.doc.row.sample.formHintBody': 'Label 6 + control 18; city row mixes input+button; footer uses offset for right-aligned actions.',
  'example.doc.row.sample.fieldName': 'Name',
  'example.doc.row.sample.fieldMail': 'Email',
  'example.doc.row.sample.fieldCity': 'City',
  'example.doc.row.sample.fieldNamePh': 'Enter name',
  'example.doc.row.sample.fieldMailPh': 'name@example.com',
  'example.doc.row.sample.fieldCityPh': 'Pick or type',
  'example.doc.row.sample.pickCity': 'Map pick',
  'example.doc.row.sample.halfA': 'Half A',
  'example.doc.row.sample.halfB': 'Half B',
  'example.doc.row.sample.halfC': 'Full right',
  'example.doc.row.sample.cancel': 'Cancel',
  'example.doc.row.sample.submit': 'Submit',
  'example.doc.row.sample.listTitle': 'Orders',
  'example.doc.row.sample.orderTitle': 'Order #{n}',
  'example.doc.row.sample.orderMeta': 'Customer C-{n} · Today',
  'example.doc.row.sample.detailTitle': 'Detail #{n}',
  'example.doc.row.sample.edit': 'Edit',
  'example.doc.row.sample.save': 'Save',
  'example.doc.row.sample.metaStatus': 'Status',
  'example.doc.row.sample.metaOwner': 'Owner',
  'example.doc.row.sample.metaTime': 'Updated',
  'example.doc.row.sample.owner': 'User {n}',
  'example.doc.row.sample.time': '14:0{n}',
  'example.doc.row.sample.detailBody': 'Detail copy spans 14 cols; note block spans 10; attachment slots are 6×4. Order {n}.',
  'example.doc.row.sample.sideNote': 'Notes',
  'example.doc.row.sample.sideNoteBody': 'Nested Block without breaking outer rhythm.',
  'example.doc.row.sample.heroTitle': 'Asymmetric content grid',
  'example.doc.row.sample.heroLead': 'Hero uses offset centering; media row shows flex / push·pull.',
  'example.doc.row.sample.heroCta': 'Start',
  'example.doc.row.sample.heroSecondary': 'Docs',
  'example.doc.row.sample.feature': 'Feature {n}',
  'example.doc.row.sample.featureBody': 'Equal feature cards at span 8.',
  'example.doc.row.sample.media': 'Media · 10',
  'example.doc.row.sample.storyWide': 'Wide · 16',
  'example.doc.row.sample.storyNarrow': 'Narrow · 8',
  'example.doc.row.sample.storyOffset': 'Offset stagger',
  'example.doc.row.sample.storyFlex': 'Flex fill',
  'example.doc.row.sample.col': 'Span {n}',
  'example.doc.row.sample.offset': 'span {span} · offset {offset}',
  'example.doc.row.sample.push': 'push {n}',
  'example.doc.row.sample.pull': 'pull {n}',
  'example.doc.row.sample.nestedToolbar': 'Nested toolbar · span 24',
  'example.doc.row.sample.nestedSide': 'Side note',
  'example.doc.row.sample.nestedSideBody': '8-col card beside a three-level nest.'
}

const tw = {
  ...zh,
  'example.doc.row.when':
    '24 柵格用於真實頁面編排：應用殼、儀表板、複雜表單、主從詳情、非對稱內容區；支援 offset / 巢狀 / flex / push·pull。',
  'example.doc.row.demo.page': '複雜頁面編排',
  'example.doc.row.demo.pageDesc':
    '五套可切換的頁面級柵格：殼層導航、KPI+圖+表、雙欄表單、列表詳情、非對稱圖文（含 offset / flex / push·pull）。',
  'example.doc.row.sample.page.shell': '應用殼',
  'example.doc.row.sample.page.dashboard': '儀表板',
  'example.doc.row.sample.page.form': '複雜表單',
  'example.doc.row.sample.page.detail': '主從詳情',
  'example.doc.row.sample.page.editorial': '非對稱圖文'
}

const packs = {
  'zh-CN': zh,
  'zh-TW': tw,
  'en-US': en,
  'ja-JP': en,
  'ko-KR': en,
  'ko-KP': en,
  'ru-RU': en
}

for (const locale of readdirSync(localeRoot)) {
  const map = packs[locale]
  if (!map) continue
  const file = join(localeRoot, locale, 'exampleDoc.ts')
  let text = readFileSync(file, 'utf8')
  for (const [k, v] of Object.entries(map)) {
    const keyJson = JSON.stringify(k)
    const valJson = JSON.stringify(v)
    if (text.includes(keyJson)) {
      text = text.replace(
        new RegExp(`${keyJson.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*"[^"]*"`),
        `${keyJson}: ${valJson}`
      )
    } else {
      const before = text.slice(0, text.lastIndexOf('}')).replace(/\s+$/, '')
      const needsComma = !before.endsWith(',')
      text = `${before}${needsComma ? ',\n' : '\n'}  ${keyJson}: ${valJson},\n${text.slice(text.lastIndexOf('}'))}`
    }
  }
  writeFileSync(file, text, 'utf8')
  console.log('patched', locale)
}
