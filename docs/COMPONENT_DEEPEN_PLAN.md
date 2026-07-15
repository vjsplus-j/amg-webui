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
- [ ] 产出 MVP 清单与波次 JSON
- [ ] 固化本计划文件

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
- Play：`/base/catalog` 全量检索 · `/base/industry` 行业套件
- 计划文件：`docs/COMPONENT_DEEPEN_PLAN.md` · 波次 JSON：`scripts/.component-waves.json`

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
