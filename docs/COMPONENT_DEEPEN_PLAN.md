# AMG-WebUI 组件深化多任务计划（锁定执行）

> 目标：文档 **257** 组件从「目录齐全 / MVP」升级为「文档级可交互成品」。  
> 口号与规范：`VISION` · `OVERTAKE` · Token · i18n · `vp-` · 列表默认虚拟滚动。  
> **规则：不完成不停；每波必须 `vue-tsc` + `npm run build` 绿；演示进 example。**

---

## 总策略

| 原则 | 做法 |
|------|------|
| 多波并行 | W1–W5 按域拆分；同波内多个 agent / 脚本并行改组件 |
| 验收优先 | 每个组件：types 完整 · `modelValue` 约定 · Token SCSS · i18n · unmount 清理 · example 可见 |
| 禁止换皮 | 不做 Element 皮肤；能力对齐文档「核心功能 + 开发标准」 |
| 硬化 | 硬编码文案/色值/尺寸 = bug |
| 列表 | Tree / Table / Select 类默认虚拟滚动 |

波次清单由 `node scripts/classify-mvp.mjs` → `scripts/.component-waves.json` 生成。

---

## 波次计划

### W0 — 盘点（本步）
- [x] 文档 257 名全覆盖目录
- [x] 产出 MVP 清单与波次 JSON
- [x] 固化本计划文件

### W1 — 表单深化
组件域：`QuarterPicker` `WeekPicker` `DynamicForm` `FormGroup` `ImageUpload` `ChunkUpload` `DragSelect` `FilterBar` `AdvancedSearch` `InputCaptcha` `SmsCode` `RichText` `MdEditor` `CodeEditor` `ColorInput` `RangeInput` `TimeRangeInput` `TreeForm` `FormTabs` `StepForm` `ImageCrop` `BatchUpload` `TemplateSelect` …
- 验收：可 v-model；校验/插槽齐；FormsPage 或 Catalog 可点通

### W2 — 数据展示深化
组件域：`Tree` `VirtualTree` `LazyTree` `ProTable` `VirtualTable` `TreeTable` `EditTable` `Carousel` `Collapse` 各 Chart …
- 验收：≥1k 行不卡（虚拟表/树）；图表有数据驱动；Data 专区演示

### W3 — 反馈 / 导航 / 布局深化
组件域：`Notification` 队列 · `Toast` · `Popconfirm` · `Dropdown` · `Menu` · `Row/Col/Space` · 各 Nav …
- 验收：服务式 API 或 provide；Focus trap；LayoutNavPage 齐

### W4 — 第三方 + 低代码深化
组件域：`Preview` `Print` `ExcelIo` `PdfPreview` `DragCanvas` `PropPanel` …
- 验收：无强制外网依赖的可用本地实现；ThirdPartyPage / Lab 演示

### W5 — 行业套件深化
组件域：10×404 · Video* · ONVIF* · GB28181* · VCR*
- 验收：面板可操作（mock 数据）；专区 example 页；文案全 i18n

### W6 — 收口
- example 七区演示闭环
- `generate:entry` · 全语种 key
- `vue-tsc` · `npm run build` 绿
- `scripts/check-coverage.mjs` missing=0

---

## 并行执行方式

1. 同时启动 **最多 4** 个深化 agent（按波次分包）
2. 宿主负责：冲突合并、tsc/build 绿线、example / i18n 接线
3. 每完成一波：更新 `.component-waves.json`、勾选本计划 checkbox
4. 失败重试同波，不跳到「宣称完成」

---

## Definition of Done（单组件）

1. 文档该条「核心功能」≥80% 可演示  
2. Props/Emits 有 TS；默认值合理  
3. 样式仅 Token；类名 `vp-*`  
4. 用户可见文案走 `t()` / LocaleKeys（七语种）  
5. 监听/定时器 `onUnmounted` 清理  
6. 对应 example 页或 Catalog 可渲染无报错  

---

## 当前状态

- 目录覆盖：257/257（base 文件夹 267，含配套 Item/Group）
- W1–W5 深化波次已全部跑完；`vue-tsc` + `npm run build` 绿
- **A1.1 壳层质量波（2026-07-30）**：Breadcrumb / Steps / Scrollbar / Result / Mask / Exception / TabPane(lazy) 升 beta+；DataTable **默认虚拟滚动** + `vp-datatable` + i18n；curated demos 入 registry
- **A1.2 表单/描述/提示波（2026-07-30）**：Form 校验 i18n（`error.maxLength`/`pattern`）+ clearValidate；FormItem/FormGroup/FormTabs 接线；Descriptions(+Item)；LoadingTip（size/delay）/ StatusTip / ProgressTip；curated：`/base/Form` `/base/Descriptions` `/base/LoadingTip`
- **L0 布局导航地基（2026-07-30）**：库 Layout 套件 + Menu/TabsNav；example `AppShell` 改为组合库组件；curated：`/base/Layout` `/base/TabsNav`
- **L1 导航深化（2026-07-30）**：`packages/utils/nav`（NavItem / useNavSelection）；Breadcrumb `items`+`maxCount`+`#separator`；*Nav/Dropdown 收敛共享选择契约 + lean SCSS；Dropdown 外点/Esc；curated：TopNav/Dropdown；LayoutNavPage 导航 live 条
- **L2 导航成品能力（2026-07-30）**：TabsNav 溢出箭头+更多菜单；Dropdown Teleport+键盘；Anchor 滚动高亮/平滑跳转；RouterNav 软依赖 `$router` 路径高亮；curated Anchor/RouterNav
- **L3 导航打磨（2026-07-30）**：TabsNav `draggable` 排序（AppShell 接线）；`useFocusTrap` + Dropdown Tab 陷阱；Anchor `affix` sticky
- **L4 导航收口（2026-07-30）**：Menu 水平/popup 浮层；MenuBar→Menu 薄封装；ContextMenu Teleport+vp；Dropdown 分割线/图标/嵌套；ScrollNav 真滚动；*Nav 克隆薄封装；Pagination i18n
- **L5 布局导航扫尾（2026-07-30）**：TabPane lazy/forceRender；SelectNav/FloatNav/StepNav/PagerNav/BackTop；布局原语 Block/Center/Container/Spacer/Stack/Flow/Column/Embed + Header/Footer/Main/Row/Col/Sider 升维；**布局+导航轨闭环**；可恢复 A1 表单轨
- **A1.3 + 全库收口波（2026-07-30）**：表单/反馈 curated；行业+预览+拖拽壳层升 beta/ready；数据展示/图表/低代码 demos；**curated demos ≈ 全量目录**；shell **8**（仅故意薄封装）；`vue-tsc` / `validate:catalog` 绿
- **质量止血波（2026-07-30）**：exampleDoc FFFD→0；薄 demo + `DemoSafeHost`/`getSampleMountProps`；低分 beta≥50；SFC Emits 内联修复 Loading/Result 等页面编译；页面模块 transform 冒烟绿
- **v0.1 子集锁定（2026-07-30）**：`docs/V0_1_SUBSET.md` · `example/v0.1-subset.ts`（66）；精选 Demo 金标；Gallery `v0.1` 筛选 + 文档徽章
- **v0.1.1 扩大分批（2026-07-30）**：Core∪B1∪B2 ≈105；B1/B2 精选加厚；B3 立项未解锁；integrity 金标门禁
- **v0.1.2 B3 解锁（2026-07-30）**：Core∪B1∪B2∪B3 ≈128；B3 布局/日期/树表精选加厚；金标脚手架 0
- **Gap Batch B4（2026-07-30）**：P0→P2 常用面缺口 12 件落地；子集 **0.1.3** = Core∪B1∪B2∪B3∪B4；catalog **284**
- Play：`/base/catalog` 全量检索 · `/base/industry` 行业套件 · curated：几乎全部 `/base/:name` · **v0.1 筛选项（含 B4）**
- 计划文件：`docs/COMPONENT_DEEPEN_PLAN.md` · 波次 JSON：`scripts/.component-waves.json`
- **未纳入本波（LIBRARY_PLAN P4–P5）**：完整 Vitest/E2E、VitePress API 全表、SSR、公开 npm/商标决策 —— 仍属上架就绪轨，非组件深化轨

### 执行日志

| 时间 | 波次 | 结果 |
|------|------|------|
| 启动 | W0 | 计划锁定，分类 JSON：MVP≈173 |
| 并行 | W1 | 31 表单/面板组件深化完成 |
| 并行 | W2 | 38 数据展示（树/表/图）深化；共享 `data-display` utils |
| 并行 | W3 | 32 反馈/导航组件深化（Teleport/队列/ESC） |
| 并行 | W4 | 30 第三方+低代码画布深化 |
| 并行 | W5 | 43 行业套件（404/Video/ONVIF/GB/VCR）深化 + industry i18n |
| 收口 | W6 | example：`/base/catalog` · `/base/industry`；`vue-tsc`/`build` 绿；覆盖 257/257 |
| 2026-07-30 | A1.1 | 导航/反馈壳层 + DataTable 虚拟默认；maturity shell 56→48；`vue-tsc` 绿 |
| 2026-07-30 | A1.2 | Form/FormItem/FormGroup/FormTabs + Descriptions(+Item) + Loading/Status/ProgressTip；校验 i18n；curated demos；shell 48→42 / ready 88→95；`vue-tsc` 绿 |
| 2026-07-30 | **L0** | **布局+导航地基**：Layout/Sider/Header/Main/Footer + Menu + TabsNav + Row/Col；**AppShell 迁库组件**；A1.x 表单轨暂停 |
| 2026-07-30 | **L1** | **导航深化**：utils/nav；Breadcrumb items/maxCount/separator slot；*Nav+Dropdown 共享契约；curated TopNav/Dropdown；`vue-tsc` |
| 2026-07-30 | **L2** | **导航成品**：TabsNav 溢出；Dropdown Teleport+键盘；Anchor scroll-spy；RouterNav `$router`；`vue-tsc` |
| 2026-07-30 | **L3** | **导航打磨**：TabsNav 拖拽；useFocusTrap；Anchor affix；`vue-tsc` |
| 2026-07-30 | **L4** | **导航收口**：Menu popup；MenuBar/ContextMenu；Dropdown 嵌套；ScrollNav；Pagination i18n；克隆薄封装；`vue-tsc` |
| 2026-07-30 | **L5** | **布局导航扫尾**：TabPane/SelectNav/FloatNav/StepNav/PagerNav/BackTop；布局原语升维；shell 55→48；布局+导航闭环；`vue-tsc` |
| 2026-07-30 | **A1.3/收口** | 行业/预览/拖拽出壳；表单反馈+数据展示 curated；demos≈267；shell **8**；catalog OK；`vue-tsc` |
| 2026-07-30 | **质量止血** | FFFD=0；DemoSafeHost；低 beta≥50；Emits SFC 修复；模块 transform 冒烟；`vue-tsc` |
| 2026-07-30 | **v0.1** | 锁定 66 组件精选 Demo；Gallery 筛选 + 徽章；integrity 单测；`vue-tsc` |
| 2026-07-30 | **v0.1.2** | 解锁 B3；子集 ≈128；B3 精选加厚；金标脚手架 0；`vue-tsc` |
| 2026-07-30 | **发版步1+2** | `0.1.0` 试用合同；peerDeps；`build:lib`→dist；`RELEASE_0.1.md` |
| 2026-07-30 | **Gap B4** | P0→P2：ConfigProvider/MessageBox/Affix/PageHeader/Segmented/InputOTP/TimeSelect/Mention/Image/ImageViewer/Tour/InfiniteScroll；子集 0.1.3；catalog 284；`vue-tsc` + integrity 绿 |
