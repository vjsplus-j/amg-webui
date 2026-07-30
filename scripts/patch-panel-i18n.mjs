import fs from 'fs'
import path from 'path'

const root = path.resolve('packages/locale')

const componentKeys = {
  'zh-CN': {
    'component.template-select.placeholder': '选择模板',
    'component.template-select.search': '搜索模板',
    'component.template-select.empty': '暂无可用模板',
    'component.template-select.emptyFilter': '没有匹配的模板',
    'component.template-select.apply': '应用模板',
    'component.detail-panel.empty': '暂无详情数据',
    'component.login-panel.showPassword': '显示密码',
    'component.login-panel.hidePassword': '隐藏密码',
    'component.dashboard.empty': '暂无仪表盘数据',
    'component.flow-panel.status.pending': '待处理',
    'component.flow-panel.status.active': '进行中',
    'component.flow-panel.status.done': '已完成',
    'component.flow-panel.status.error': '异常'
  },
  'zh-TW': {
    'component.template-select.placeholder': '選擇範本',
    'component.template-select.search': '搜尋範本',
    'component.template-select.empty': '暫無可用範本',
    'component.template-select.emptyFilter': '沒有符合的範本',
    'component.template-select.apply': '套用範本',
    'component.detail-panel.empty': '暫無詳情資料',
    'component.login-panel.showPassword': '顯示密碼',
    'component.login-panel.hidePassword': '隱藏密碼',
    'component.dashboard.empty': '暫無儀表板資料',
    'component.flow-panel.status.pending': '待處理',
    'component.flow-panel.status.active': '進行中',
    'component.flow-panel.status.done': '已完成',
    'component.flow-panel.status.error': '異常'
  },
  'en-US': {
    'component.template-select.placeholder': 'Choose a template',
    'component.template-select.search': 'Search templates',
    'component.template-select.empty': 'No templates available',
    'component.template-select.emptyFilter': 'No templates match your search',
    'component.template-select.apply': 'Apply template',
    'component.detail-panel.empty': 'No detail data',
    'component.login-panel.showPassword': 'Show password',
    'component.login-panel.hidePassword': 'Hide password',
    'component.dashboard.empty': 'No dashboard data yet',
    'component.flow-panel.status.pending': 'Pending',
    'component.flow-panel.status.active': 'In progress',
    'component.flow-panel.status.done': 'Done',
    'component.flow-panel.status.error': 'Error'
  },
  'ja-JP': {
    'component.template-select.placeholder': 'テンプレートを選択',
    'component.template-select.search': 'テンプレートを検索',
    'component.template-select.empty': '利用可能なテンプレートがありません',
    'component.template-select.emptyFilter': '一致するテンプレートがありません',
    'component.template-select.apply': 'テンプレートを適用',
    'component.detail-panel.empty': '詳細データがありません',
    'component.login-panel.showPassword': 'パスワードを表示',
    'component.login-panel.hidePassword': 'パスワードを非表示',
    'component.dashboard.empty': 'ダッシュボードデータがありません',
    'component.flow-panel.status.pending': '待機中',
    'component.flow-panel.status.active': '進行中',
    'component.flow-panel.status.done': '完了',
    'component.flow-panel.status.error': 'エラー'
  },
  'ko-KR': {
    'component.template-select.placeholder': '템플릿 선택',
    'component.template-select.search': '템플릿 검색',
    'component.template-select.empty': '사용 가능한 템플릿이 없습니다',
    'component.template-select.emptyFilter': '일치하는 템플릿이 없습니다',
    'component.template-select.apply': '템플릿 적용',
    'component.detail-panel.empty': '상세 데이터가 없습니다',
    'component.login-panel.showPassword': '비밀번호 표시',
    'component.login-panel.hidePassword': '비밀번호 숨기기',
    'component.dashboard.empty': '대시보드 데이터가 없습니다',
    'component.flow-panel.status.pending': '대기',
    'component.flow-panel.status.active': '진행 중',
    'component.flow-panel.status.done': '완료',
    'component.flow-panel.status.error': '오류'
  },
  'ko-KP': {
    'component.template-select.placeholder': '탄본선택',
    'component.template-select.search': '탄본검색',
    'component.template-select.empty': '리용가능한 탄본이 없습니다',
    'component.template-select.emptyFilter': '맞는 탄본이 없습니다',
    'component.template-select.apply': '탄본적용',
    'component.detail-panel.empty': '상세자료가 없습니다',
    'component.login-panel.showPassword': '비밀번호 보이기',
    'component.login-panel.hidePassword': '비밀번호 감추기',
    'component.dashboard.empty': 'Dashboard 자료가 없습니다',
    'component.flow-panel.status.pending': '대기',
    'component.flow-panel.status.active': '진행중',
    'component.flow-panel.status.done': '완료',
    'component.flow-panel.status.error': '오류'
  },
  'ru-RU': {
    'component.template-select.placeholder': 'Выберите шаблон',
    'component.template-select.search': 'Поиск шаблонов',
    'component.template-select.empty': 'Нет доступных шаблонов',
    'component.template-select.emptyFilter': 'Нет шаблонов по запросу',
    'component.template-select.apply': 'Применить шаблон',
    'component.detail-panel.empty': 'Нет данных для просмотра',
    'component.login-panel.showPassword': 'Показать пароль',
    'component.login-panel.hidePassword': 'Скрыть пароль',
    'component.dashboard.empty': 'Нет данных для панели',
    'component.flow-panel.status.pending': 'Ожидание',
    'component.flow-panel.status.active': 'В процессе',
    'component.flow-panel.status.done': 'Готово',
    'component.flow-panel.status.error': 'Ошибка'
  }
}

const exampleDocEn = {
  'example.doc.templateSelect.when': 'Pick a form template from a dropdown or card grid; preview and apply payload.',
  'example.doc.templateSelect.demo.dropdown': 'Dropdown + apply',
  'example.doc.templateSelect.demo.dropdownDesc': 'v-model template id, preview slot, apply emit.',
  'example.doc.templateSelect.demo.cards': 'Card grid',
  'example.doc.templateSelect.demo.cardsDesc': 'layout=cards with search when templates >= searchableMin.',
  'example.doc.templateSelect.demo.empty': 'Empty state',
  'example.doc.templateSelect.demo.emptyDesc': 'Built-in Empty when templates is [].',
  'example.doc.templateSelect.prop.modelValue': 'Selected template id',
  'example.doc.templateSelect.prop.templates': 'Template catalog',
  'example.doc.templateSelect.prop.layout': 'dropdown or cards',
  'example.doc.templateSelect.prop.searchable': 'Enable search filter',
  'example.doc.templateSelect.sample.tplA': 'Admin preset',
  'example.doc.templateSelect.sample.tplADesc': 'Admin role + linear theme',
  'example.doc.templateSelect.sample.tplB': 'Compact layout',
  'example.doc.templateSelect.sample.tplBDesc': 'Compact density preset',
  'example.doc.templateSelect.sample.tplC': 'Wide layout',
  'example.doc.templateSelect.sample.tplCDesc': 'Wide dashboard shell',
  'example.doc.templateSelect.sample.tplD': 'Viewer preset',
  'example.doc.templateSelect.sample.applied': 'Applied: {data}',
  'example.doc.detailPanel.when': 'Read-only detail host with tabs or collapsible sections, Descriptions body, loading and empty states.',
  'example.doc.detailPanel.demo.tabs': 'Tabbed sections',
  'example.doc.detailPanel.demo.tabsDesc': 'title / extra / footer slots + Descriptions fields.',
  'example.doc.detailPanel.demo.stack': 'Collapsible stack',
  'example.doc.detailPanel.demo.stackDesc': 'layout=stack with optional collapsible sections.',
  'example.doc.detailPanel.demo.states': 'Loading & empty',
  'example.doc.detailPanel.demo.statesDesc': 'loading shows LoadingTip; empty shows Empty.',
  'example.doc.detailPanel.prop.sections': 'Section list with fields',
  'example.doc.detailPanel.prop.layout': 'tabs or stack layout',
  'example.doc.detailPanel.prop.loading': 'Loading overlay',
  'example.doc.detailPanel.sample.title': 'User detail',
  'example.doc.detailPanel.sample.sectionBasic': 'Basic',
  'example.doc.detailPanel.sample.sectionMeta': 'Metadata',
  'example.doc.detailPanel.sample.name': 'Name',
  'example.doc.detailPanel.sample.email': 'Email',
  'example.doc.detailPanel.sample.role': 'Role',
  'example.doc.detailPanel.sample.status': 'Status',
  'example.doc.detailPanel.sample.live': 'Live',
  'example.doc.detailPanel.sample.toggleLoading': 'Toggle loading',
  'example.doc.loginPanel.when': 'Login shell with Form validation, password visibility toggle, and forgot/register emits.',
  'example.doc.loginPanel.demo.basic': 'Sign in',
  'example.doc.loginPanel.demo.basicDesc': 'Built-in rules; showCaptcha=false for demo.',
  'example.doc.loginPanel.prop.modelValue': 'Login form model',
  'example.doc.loginPanel.prop.rules': 'Extra validation rules',
  'example.doc.loginPanel.prop.showCaptcha': 'Show captcha field',
  'example.doc.loginPanel.sample.submitted': 'Submit emitted',
  'example.doc.loginPanel.sample.forgot': 'Forgot password clicked',
  'example.doc.loginPanel.sample.register': 'Register clicked',
  'example.doc.dashboard.when': 'Responsive dashboard grid of stat cards or custom widget slots.',
  'example.doc.dashboard.demo.stats': 'Stat cards',
  'example.doc.dashboard.demo.statsDesc': 'stats prop with refresh and select-stat emits.',
  'example.doc.dashboard.demo.widgets': 'Widget slots',
  'example.doc.dashboard.demo.widgetsDesc': 'Named #widget-{id} slots with span columns.',
  'example.doc.dashboard.demo.empty': 'Empty dashboard',
  'example.doc.dashboard.demo.emptyDesc': 'Empty placeholder when no stats or widget slots.',
  'example.doc.dashboard.prop.stats': 'KPI stat cards',
  'example.doc.dashboard.prop.widgets': 'Widget layout metadata',
  'example.doc.dashboard.prop.columns': 'Grid column count',
  'example.doc.dashboard.sample.users': 'Users',
  'example.doc.dashboard.sample.orders': 'Orders',
  'example.doc.dashboard.sample.revenue': 'Revenue',
  'example.doc.dashboard.sample.selected': 'Selected: {label}',
  'example.doc.dashboard.sample.chart': 'Trend',
  'example.doc.dashboard.sample.chartBody': 'Custom widget slot content',
  'example.doc.settingPanel.when': 'Grouped settings with switch/select/text rows; save and reset emits.',
  'example.doc.settingPanel.demo.grouped': 'Grouped settings',
  'example.doc.settingPanel.demo.groupedDesc': 'groups + labelKey i18n + defaultValue reset.',
  'example.doc.settingPanel.prop.modelValue': 'Settings model',
  'example.doc.settingPanel.prop.groups': 'Grouped setting items',
  'example.doc.settingPanel.prop.defaultValue': 'Baseline for reset',
  'example.doc.settingPanel.sample.groupGeneral': 'General',
  'example.doc.settingPanel.sample.groupNotify': 'Notifications',
  'example.doc.settingPanel.sample.darkMode': 'Dark mode',
  'example.doc.settingPanel.sample.locale': 'Locale',
  'example.doc.settingPanel.sample.emailAlerts': 'Email alerts',
  'example.doc.settingPanel.sample.saved': 'Settings saved',
  'example.doc.settingPanel.sample.reset': 'Settings reset',
  'example.doc.flowPanel.when': 'Flow timeline with Steps header, current step highlight, and wizard prev/next nav.',
  'example.doc.flowPanel.demo.wizard': 'Wizard host',
  'example.doc.flowPanel.demo.wizardDesc': 'showNav + v-model:current + default body slot.',
  'example.doc.flowPanel.prop.steps': 'Flow steps with status',
  'example.doc.flowPanel.prop.current': 'Active step id',
  'example.doc.flowPanel.prop.showNav': 'Show prev/next controls',
  'example.doc.flowPanel.sample.s1': 'Draft',
  'example.doc.flowPanel.sample.d1': 'Create content',
  'example.doc.flowPanel.sample.s2': 'Review',
  'example.doc.flowPanel.sample.d2': 'Awaiting approval',
  'example.doc.flowPanel.sample.s3': 'Publish',
  'example.doc.flowPanel.sample.d3': 'Go live',
  'example.doc.flowPanel.sample.body': 'Step content for: {step}',
  'example.doc.flowPanel.sample.prev': 'Previous: {step}',
  'example.doc.flowPanel.sample.next': 'Next: {step}'
}

const exampleDocZhCN = {
  ...exampleDocEn,
  'example.doc.templateSelect.when': '从下拉或卡片网格选择表单模板，预览并应用数据。',
  'example.doc.templateSelect.demo.dropdown': '下拉选择与应用',
  'example.doc.templateSelect.demo.dropdownDesc': 'v-model 模板 id，预览插槽，apply 事件。',
  'example.doc.templateSelect.demo.cards': '卡片网格',
  'example.doc.templateSelect.demo.cardsDesc': 'layout=cards，模板数达到阈值时启用搜索。',
  'example.doc.templateSelect.demo.empty': '空状态',
  'example.doc.templateSelect.demo.emptyDesc': 'templates 为空时显示 Empty。',
  'example.doc.templateSelect.prop.modelValue': '选中的模板 id',
  'example.doc.templateSelect.prop.templates': '模板列表',
  'example.doc.templateSelect.prop.layout': 'dropdown 或 cards',
  'example.doc.templateSelect.prop.searchable': '启用搜索过滤',
  'example.doc.templateSelect.sample.tplA': '管理员预设',
  'example.doc.templateSelect.sample.tplADesc': '管理员角色 + linear 主题',
  'example.doc.templateSelect.sample.tplB': '紧凑布局',
  'example.doc.templateSelect.sample.tplBDesc': '紧凑密度预设',
  'example.doc.templateSelect.sample.tplC': '宽屏布局',
  'example.doc.templateSelect.sample.tplCDesc': '宽屏仪表盘壳层',
  'example.doc.templateSelect.sample.tplD': '访客预设',
  'example.doc.templateSelect.sample.applied': '已应用：{data}',
  'example.doc.detailPanel.when': '只读详情面板：标签页或可折叠分区，Descriptions 主体，加载与空状态。',
  'example.doc.detailPanel.demo.tabs': '标签页分区',
  'example.doc.detailPanel.demo.tabsDesc': 'title / extra / footer 插槽 + Descriptions 字段。',
  'example.doc.detailPanel.demo.stack': '可折叠堆叠',
  'example.doc.detailPanel.demo.stackDesc': 'layout=stack，可选折叠分区。',
  'example.doc.detailPanel.demo.states': '加载与空态',
  'example.doc.detailPanel.demo.statesDesc': 'loading 显示 LoadingTip；empty 显示 Empty。',
  'example.doc.detailPanel.prop.sections': '分区及字段列表',
  'example.doc.detailPanel.prop.layout': 'tabs 或 stack 布局',
  'example.doc.detailPanel.prop.loading': '加载中',
  'example.doc.detailPanel.sample.title': '用户详情',
  'example.doc.detailPanel.sample.sectionBasic': '基本信息',
  'example.doc.detailPanel.sample.sectionMeta': '元数据',
  'example.doc.detailPanel.sample.name': '姓名',
  'example.doc.detailPanel.sample.email': '邮箱',
  'example.doc.detailPanel.sample.role': '角色',
  'example.doc.detailPanel.sample.status': '状态',
  'example.doc.detailPanel.sample.live': '在线',
  'example.doc.detailPanel.sample.toggleLoading': '切换加载',
  'example.doc.loginPanel.when': '登录面板：Form 校验、密码可见切换、忘记密码/注册事件。',
  'example.doc.loginPanel.demo.basic': '登录',
  'example.doc.loginPanel.demo.basicDesc': '内置校验规则；演示关闭验证码。',
  'example.doc.loginPanel.prop.modelValue': '登录表单模型',
  'example.doc.loginPanel.prop.rules': '额外校验规则',
  'example.doc.loginPanel.prop.showCaptcha': '显示验证码字段',
  'example.doc.loginPanel.sample.submitted': '已触发 submit',
  'example.doc.loginPanel.sample.forgot': '已点击忘记密码',
  'example.doc.loginPanel.sample.register': '已点击注册',
  'example.doc.dashboard.when': '响应式仪表盘网格：统计卡片或自定义 widget 插槽。',
  'example.doc.dashboard.demo.stats': '统计卡片',
  'example.doc.dashboard.demo.statsDesc': 'stats 属性，refresh 与 select-stat 事件。',
  'example.doc.dashboard.demo.widgets': 'Widget 插槽',
  'example.doc.dashboard.demo.widgetsDesc': '命名插槽 #widget-{id}，span 控制列宽。',
  'example.doc.dashboard.demo.empty': '空仪表盘',
  'example.doc.dashboard.demo.emptyDesc': '无 stats 或 widget 时显示 Empty。',
  'example.doc.dashboard.prop.stats': 'KPI 统计卡片',
  'example.doc.dashboard.prop.widgets': 'Widget 布局元数据',
  'example.doc.dashboard.prop.columns': '网格列数',
  'example.doc.dashboard.sample.users': '用户',
  'example.doc.dashboard.sample.orders': '订单',
  'example.doc.dashboard.sample.revenue': '营收',
  'example.doc.dashboard.sample.selected': '已选择：{label}',
  'example.doc.dashboard.sample.chart': '趋势',
  'example.doc.dashboard.sample.chartBody': '自定义 widget 插槽内容',
  'example.doc.settingPanel.when': '分组设置：开关/选择/文本行；保存与重置事件。',
  'example.doc.settingPanel.demo.grouped': '分组设置',
  'example.doc.settingPanel.demo.groupedDesc': 'groups + labelKey 国际化 + defaultValue 重置。',
  'example.doc.settingPanel.prop.modelValue': '设置模型',
  'example.doc.settingPanel.prop.groups': '分组设置项',
  'example.doc.settingPanel.prop.defaultValue': '重置基线值',
  'example.doc.settingPanel.sample.groupGeneral': '常规',
  'example.doc.settingPanel.sample.groupNotify': '通知',
  'example.doc.settingPanel.sample.darkMode': '深色模式',
  'example.doc.settingPanel.sample.locale': '语言',
  'example.doc.settingPanel.sample.emailAlerts': '邮件提醒',
  'example.doc.settingPanel.sample.saved': '设置已保存',
  'example.doc.settingPanel.sample.reset': '设置已重置',
  'example.doc.flowPanel.when': '流程时间线：Steps 头部、当前步骤高亮、向导 prev/next 导航。',
  'example.doc.flowPanel.demo.wizard': '向导宿主',
  'example.doc.flowPanel.demo.wizardDesc': 'showNav + v-model:current + 默认 body 插槽。',
  'example.doc.flowPanel.prop.steps': '带状态的流程步骤',
  'example.doc.flowPanel.prop.current': '当前步骤 id',
  'example.doc.flowPanel.prop.showNav': '显示上一步/下一步',
  'example.doc.flowPanel.sample.s1': '草稿',
  'example.doc.flowPanel.sample.d1': '创建内容',
  'example.doc.flowPanel.sample.s2': '审核',
  'example.doc.flowPanel.sample.d2': '等待审批',
  'example.doc.flowPanel.sample.s3': '发布',
  'example.doc.flowPanel.sample.d3': '正式上线',
  'example.doc.flowPanel.sample.body': '步骤内容：{step}',
  'example.doc.flowPanel.sample.prev': '上一步：{step}',
  'example.doc.flowPanel.sample.next': '下一步：{step}'
}

const exampleDocKeys = {
  'en-US': exampleDocEn,
  'zh-CN': exampleDocZhCN,
  'zh-TW': { ...exampleDocZhCN, 'example.doc.detailPanel.sample.live': '線上', 'example.doc.settingPanel.sample.locale': '語系' },
  'ja-JP': {
    ...exampleDocEn,
    'example.doc.templateSelect.when': 'ドロップダウンまたはカードからテンプレートを選択し、プレビューと適用。',
    'example.doc.detailPanel.when': '読み取り専用詳細：タブ/折りたたみ、Descriptions、ロード/空状態。',
    'example.doc.loginPanel.when': 'ログイン：バリデーション、パスワード表示切替、リンク emit。',
    'example.doc.dashboard.when': 'レスポンシブダッシュボード：KPI カードまたは widget スロット。',
    'example.doc.settingPanel.when': 'グループ設定：switch/select/text、保存/リセット。',
    'example.doc.flowPanel.when': 'フロー：Steps ヘッダー、現在ステップ、prev/next ナビ。'
  },
  'ko-KR': {
    ...exampleDocEn,
    'example.doc.templateSelect.when': '드롭다운 또는 카드 그리드에서 템플릿을 선택하고 미리보기 및 적용.',
    'example.doc.detailPanel.when': '읽기 전용 상세: 탭/접기, Descriptions, 로딩/빈 상태.',
    'example.doc.loginPanel.when': '로그인: Form 검증, 비밀번호 표시 전환, 링크 emit.',
    'example.doc.dashboard.when': '반응형 대시보드: KPI 카드 또는 widget 슬롯.',
    'example.doc.settingPanel.when': '그룹 설정: switch/select/text, 저장/초기화.',
    'example.doc.flowPanel.when': '플로우: Steps 헤더, 현재 단계, prev/next 내비.'
  },
  'ko-KP': {
    ...exampleDocEn,
    'example.doc.templateSelect.when': 'Dropdown이나 카드그리드에서 탄본을 고르고 미리보기·적용.',
    'example.doc.detailPanel.when': '읽기전용 상세: 탭/접기, Descriptions, 로드/공백.',
    'example.doc.loginPanel.when': 'Login: Form검증, 비밀번호표시전환, 링크 emit.',
    'example.doc.dashboard.when': '반응형 Dashboard: KPI카드 또는 widget꽂개.',
    'example.doc.settingPanel.when': '그룹설정: switch/select/text, 저장/초기화.',
    'example.doc.flowPanel.when': 'Flow: Steps머리, 현재단계, prev/next.'
  },
  'ru-RU': {
    ...exampleDocEn,
    'example.doc.templateSelect.when': 'Выбор шаблона из списка или карточек; предпросмотр и применение.',
    'example.doc.detailPanel.when': 'Детали только для чтения: вкладки/сворачивание, Descriptions, загрузка/пусто.',
    'example.doc.loginPanel.when': 'Вход: валидация Form, показ пароля, события ссылок.',
    'example.doc.dashboard.when': 'Адаптивная панель: KPI-карточки или слоты widget.',
    'example.doc.settingPanel.when': 'Групповые настройки: switch/select/text; save/reset.',
    'example.doc.flowPanel.when': 'Поток: Steps, текущий шаг, prev/next.'
  }
}

function escSingle(s) {
  return s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

function escDouble(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
}

function appendComponentKeys(locale, keys) {
  const file = path.join(root, locale, 'component.ts')
  let text = fs.readFileSync(file, 'utf8')
  if (text.includes('component.template-select.placeholder')) return
  const lines = Object.entries(keys)
    .map(([k, v]) => `  '${k}': '${escSingle(v)}',`)
    .join('\n')
  text = text.replace('} as Record<string, string>', `${lines}\n} as Record<string, string>`)
  fs.writeFileSync(file, text)
}

function appendExampleDocKeys(locale, keys) {
  const file = path.join(root, locale, 'exampleDoc.ts')
  let text = fs.readFileSync(file, 'utf8')
  if (text.includes('example.doc.templateSelect.when')) return
  const lines = Object.entries(keys)
    .map(([k, v]) => `  "${k}": "${escDouble(v)}",`)
    .join('\n')
  text = text.replace(/\n}\s*$/, `\n${lines}\n}\n`)
  fs.writeFileSync(file, text)
}

for (const loc of Object.keys(componentKeys)) appendComponentKeys(loc, componentKeys[loc])
for (const loc of Object.keys(exampleDocKeys)) appendExampleDocKeys(loc, exampleDocKeys[loc])
console.log('done')
