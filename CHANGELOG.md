# Changelog

## 0.1.0

试用发包（pre-1.0）。**API 可变**；正式 1.0 见 `docs/LIBRARY_PLAN.md` P4–P5。

### 组件包边界拆分（破坏性）

- 拆除扁平 `packages/components/base` 胖 barrel：按领域迁入 `core` / `form` / `data` / `overlay` / `charts` / `editor` / `media` / `gb28181` / `onvif`；lowcode UI → `packages/lowcode/ui/`
- 公开别名：`@amg-webui/core|form|data|overlay|charts|editor|media|gb28181|onvif|business`
- **硬切**：`@amg-webui/components/base` **仅再导出 core**；从旧路径导入 Gbs/Onvif/Video 等将失败
- 根 `amg-webui` barrel **不**再导出行业三包与 charts/editor（须显式子路径）
- SSOT：`scripts/component-package-map.mjs`；门禁：`npm run check:boundaries`
- **原则**：基础组件库不知道 GB28181；行业扩展可依赖 foundation，反向禁止

### CI 门禁加深（公开库骨架 → 可辩护覆盖）

- Workflow：`extract:i18n` schema drift · `test:ssr` · `check:dist`（on-demand 改写 / 六品牌 CSS / 粗体积）· consumer fixtures（已有）
- Playwright：Chromium 加深 Dialog focus trap / Escape / axe serious+ / RTL 截图附件 / 六品牌 `data-design`；Firefox · WebKit · Mobile Chrome 跑 smoke
- **诚实边界**：仍非像素全矩阵、全组件键盘、Nuxt hydration、Lighthouse 性能基准（见 `docs/ENGINEERING.md` § CI 覆盖）

### DataTable 虚拟滚动契约（本轮）

- **修根因**：`virtualHeight` 与硬编码 `containerHeight: 320` / `itemHeight: 44` 脱节 → 视口 fallback 改为 `virtualHeight × --spacing-xs`，行高走 `--theme-table-row-height` + 首行 `ResizeObserver`
- 横向列窗口（`useVirtualColumns`）· `Column.fixed` · 表头列宽测量 · ≥5k 本地排序 Worker
- example `perf/massive`：10k / 100k 实测 + DOM/FPS/堆内存采样
- **仍未交付**：逐行动态行高、分组/展开行虚拟化、分片内核；docs 已写明诚实口径

### Biz 异步内核（useBizAsync）

- 修复 users / orders / content：`Pagination @change` 双写 `page`+`pageSize` 导致 `setPageSize` 把页码打回 1、重复请求
- `useBizAsync`：请求序号 + Abort、`setPagination` 原子分页、keyword debounce、list cache、create/update/remove + mutation 状态 / optimistic、adapter `MaybeRefOrGetter` 可热切换
- `BizCrudAdapter` 方法支持可选 `BizRequestOptions.signal`；单测 `tests/unit/use-biz-async.spec.ts`

### 包发布契约（本轮主路径，未宣称完全解决全部架构债）

- `build:lib` 现串联：主库 → **runtime 分包**（security / telemetry / lowcode / **overlay runtime** / icons / hooks / utils / locale / …）→ on-demand → skill → theme → `generate:exports`
- 公共 `exports` **全部指向 `dist/**`**；`files` 不再打包 `packages/` 源码树
- 按需入口：`amg-webui/button` · `amg-webui/data-table` · …；深路径显式导出（如 `amg-webui/utils/env` · `amg-webui/hooks/useFocusTrap` · `amg-webui/runtime`）
- on-demand / runtime 产物将 `@amg-webui/*` **改写**为 `amg-webui/*`，避免干净消费者依赖仓库 alias
- Consumer fixtures：`tests/consumer-vite` · `consumer-webpack` · `consumer-nuxt` + CI `test:consumers`
- **诚实边界**：成熟度算法、E2E 深度、按需 CSS 独立入口 **仍未完全解决**（行业件已迁出 base）

### Overlay 统一内核（本轮交付）

- 新增 `packages/runtime`（`amg-webui/runtime`）：栈 · ZIndex · ScrollLock（引用计数）· FocusTrap · Escape LIFO · Teleport · ClickOutside · Positioning
- Vue：`useOverlay`；`useFocusTrap` / `useBodyScrollLock` 委托 runtime
- 已接入：Dialog / Drawer / Mask / Confirm / ConfirmDialog / MessageBox / ImageViewer / Popover / Tooltip / Dropdown / Menu(popup) / Popconfirm / Tour / ContextMenu
- Dialog 修复：唯一 title id、trap/restore/autofocus、`aria-modal` 随 modal、栈内 z-index、Escape 与 scroll lock 走内核
- 文档：`docs/OVERLAY.md`

### Theme 运行时（多实例 / 色阶 / SSR / Shadow）

- Theme Core：`generatePrimaryScale` · `createShadowHost` · `serializeThemeStyle` / `toStyleTag` · `runtime.setPrimary` · **`replaceCustom`（全量替换 overlay，删除缺失 key）**
- Vue：`ThemeProvider` + `THEME_RUNTIME_KEY` + `useThemeRuntime()`（inject 优先）；`ConfigProvider` 支持 `design` / `scheme` / `tokens` / `primary` 局部 Runtime
- 修复局部主题生命周期：`createThemeScope` 在 setup 同步 `inject`；`ThemeProvider` `change` 经 `runtime.subscribe` 稳定触发；`tokens` 收缩走 `replaceCustom`
- `ThemeService` 仍为应用默认单例；同页多主题勿用 `configure` 抢单例
- example：`lab/micro-fe` 双 ThemeProvider + ConfigProvider + Shadow host 演示
- 文档：`docs/theme/index.md` · `packages/theme/README.md` · OVERTAKE / TOKENS 诚实边界（Teleport / adoptedStyleSheets / Studio UI 未交付）

### 安全防护层 / 低代码 Schema（本轮补齐）

- 新增 `@amg-webui/security`：`sanitizeHtml` · `isSafeHref` / `sanitizeUrl` · `filterDangerousInput` · `SecurityService`（见 `docs/SECURITY.md`）
- `RichText`：读写/粘贴白名单消毒；**移除** `document.execCommand`；链接走协议拦截
- `Link` / `Button`：协议策略统一到 security 包
- 新增 `@amg-webui/lowcode`：注册表 · `validateCanvasSchema` / `migrateCanvasSchema` · `generateVueSfc`
- 新增 `SchemaRenderer`；`CanvasPreview` 支持 `registry` + `renderMode: component`
- `useCanvasEditor`：undo / redo / copy / paste；`CanvasShortcut` 接线
- example：`lab/security` · `lab/lowcode`；文档：`docs/SECURITY.md` · `docs/LOWCODE.md`

### 安全 / 低代码硬化（续）

- 修复 `unescapeHtml` DOM XSS；协议折叠抗 mXSS；扩充安全单测语料
- `DragCanvas`/`CanvasNode` 支持 registry WYSIWYG；`PropPanel` 读取 `propsSchema`
- Schema/Preview 组件模式 a11y（避免嵌套 `role=button`）；Shortcut 输入框焦点守卫
- `CanvasIo` 导入走校验；RichText 扩展标题/有序列表/引用/代码 + 历史合并
- 文档诚实边界：SSR 不等价、codegen 草图、未交付清单写明
- **Schema 运行时闭环**：`SchemaNodeRenderer` 任意深度递归；`resolveRuntimeRender` 对齐 `__bindings`/`__events`（路径白名单、v-model 写回、handlers）；与 `generateVueSfc` 共用 `splitMetaProps`
- **严格 Validator**：重复 id / parent / 循环 / 尺寸坐标 / props 类型与枚举 / Binding·Event·Handler / 节点数·深度·体积上限
- **Registry 冲突**：默认 `throw`（`skip` / `replace` 可选）；`RegistryConflictError`
- **PropPanel 实时更新**：消除 layout `label` 与 `props.label` 键冲突；`updateNode` 不可变替换 + DragCanvas 发出新数组引用
- **嵌套布局**：`CanvasPreview` / `DragCanvas` / `SchemaRenderer` 按 `parentId` 树渲染；子节点流式排布，不再把局部 x/y 当画布绝对坐标堆叠

### 安全层设计纠正

- **输入默认不改写**：`InputText` / `Textarea` / `Password` 的 `sanitizeInput` 默认改为 `false`；`undefined` → `off`。`filterDangerousInput` 仅为可配置字段过滤器，不是 XSS 防御
- **告警脱敏**：`SecurityService` 默认只存 `detailHash` / `detailLength` / `matchedRule`，不落原文；`includeDetail: true` 才保留截断 `detail`
- **RichText**：sync / commit / paste / history / read 统一走 `sanitizeHtml(value, sanitizeOptions)`

### 安全 / 低代码继续超越

- 表单：`InputText`/`Textarea`/`Password` `sanitizeInput`；`Form.sanitizeOnSubmit`
- RichText：去链接、粘贴纯文本、`aria-pressed` 格式态；CodeEditor 高亮消毒
- 低代码：`parentId` 树 + 循环检测 + PropPanel 仅容器可选 + codegen 嵌套/事件 stubs
- `applySanitizeInput` / `sanitizeModelStrings`；example `lab/lowcode` 嵌套 Card 演示

### 仓库卫生

- 移除根目录组件规范草稿、阶段验收报告与杂项产物（`exampleDoc.ts` / `missing-components.txt` / `test-results`）。
- 精简 `scripts/`：仅保留长期工程工具（create / entry / i18n / catalog / maturity / vitepress-api / classify-mvp / check-coverage）；一次性 patch/upgrade/fix 脚本已删除。
- 同步更新 `README` · `docs/ENGINEERING.md` · `docs/components/index.md` · `packages/*/README.md`。

### 合同

- 承诺组件：v0.1 子集（Core∪B1∪B2∪B3∪**B4**），见 `docs/V0_1_SUBSET.md` · `example/v0.1-subset.ts`
- **B4 Gap Batch**：ConfigProvider · MessageBox · Affix · PageHeader · Segmented · InputOTP · TimeSelect · Mention · Image · ImageViewer · Tour · InfiniteScroll
- 子集外组件：experimental，不作稳定承诺
- 发包说明：`docs/RELEASE_0.1.md`

### 包形

- `version` 修正为 `0.1.0`（原占位 `1.0.0` 撤销）
- `peerDependencies`: `vue@^3.4` · `@lucide/vue@^1.0`
- 主入口：`dist` ESM + UMD + `style.css` + types
- 子路径（**dist 编译产物**）：`theme` · `security` · `telemetry` · `lowcode` · `icons` · `hooks` · `utils` · kebab 组件（`button`…）· `components/base|business` barrels · experimental `skill` · `es/*` · `themes/*`
- `files` 仅 `dist` + 合同文档（不再发布 `packages/` 源码树）

### 构建模式（名义 → 实能力）

- `build/index.mjs` 按 mode **真分支**：`full` · `on-demand` · `multi-theme` · `dts` · `skill` · `theme`；未知 mode 非 0 退出
- **on-demand**：`vite.ondemand.config.ts` → `dist/es/**` 多入口 ESM（`npm run build:ondemand`）
- **multi-theme**：`vite.themes.config.ts` → `dist/themes/<brand>.css` 六品牌（`npm run build:themes`）
- **dts**：`build/emit-dts.mjs` 仅类型（`npm run build:dts`）
- 详见 `docs/ENGINEERING.md` 构建模式表

### 业务模块 DoD

- 共享契约 `business/_shared`：`BizPageQuery` · `BizCrudAdapter` · `useBizAsync` · 标准槽名（含 `loading`）
- **users**：Avatar、详情/编辑 Dialog、权限区、分页（无 adapter 时客户端切片）、`#loading`/`empty`/`error`、插槽、可选 adapter
- **orders**：详情 Drawer、退款、批量取消、分页切片、`#loading`、插槽、可选 adapter
- **content**：分类 Tree + 列表、`#editor` 槽、草稿/发布/归档、分页切片、`#loading`
- **settings**：locale / 改密 / 全局 params；profile 由 props 注入
- **login**：password + sms；`#qr` / `#oauth` 槽；必填校验
- example：`example/mock/biz/adapters.ts` + `BusinessExampleSandbox` 真联调（非仅 Toast）
- 对外对照：`docs/business/index.md` DoD 表 + 验收清单

### 表单 FormItem 闭环（能力诚实）

- `FormItem` provide + `useFormItem` / `useNativeInputAttrs`
- 文本/布尔：`InputText` · `Textarea` · `InputNumber` · `Password` · `Checkbox` · `Radio` · `Switch`
- 复合表单族：`Select` · `Cascader` · `DatePicker` · `DateTimePicker` · `TimePicker` · `TimeSelect` · `TreeSelect` · `ColorPicker` · `Slider` · `Rate` · `Transfer` · `Mention` · `InputOTP` · `InputCaptcha`
- `score:maturity` v2：`thinFormGaps` 清空；目录库存 ≠ 成熟度；**非 1.0**

### 强类型 i18n + 原生 RTL

- `LocaleKey` / `LocaleMessages` 由 zh-CN 生成（`message-schema.ts`）；`t()` 仅接受 `LocaleKey`；语种包 `satisfies LocaleMessages`（缺 key 编译失败）
- 内置八语种含 **`ar-SA`（RTL，独立阿语包）** · `LocaleService.setDirection` · `ConfigProvider` 跟随 `getDir()` · 主题 `rtl.scss` + chrome 逻辑属性
- `ja-JP` / `ko-*` / `ru-RU` `biz.ts` 正文本地化；`npm run generate:locale-types` / `extract:i18n` 对齐校验；动态 key 用 `tDyn`

### Theme Core

- 主题运行时拆为 **Core（无 DOM）+ Host / Storage 适配器**：`createThemeRuntime`、`createNullHost` / `createDocumentHost`、`createMemoryStorage` / `createWebStorage`
- `ThemeService` / `FontService` / `IconStyleService` 改为默认单例门面；支持 `configure({ root, storageNamespace })` 微前端隔离、`applyCustom` CSS 变量热更新
- 发包：`npm run build:theme` → `dist/theme/`（对齐 skill）；`amg-webui/theme` 不再指向源码 `.ts`
- 无闪屏：`createThemeBootScript` / `themeBootScriptTag`；example `index.html` 内联 boot 脚本

### Skill Runtime（experimental）

- 新增独立可选 `packages/skill`：Unit / Context / Runtime / Scope、Adapter、Observer 与幂等资源回收。
- 新增 Pipeline JSON v1：顺序、并行、注册条件、有限重试与 fallback；禁止执行配置字符串。
- 新增 Vue 接入：`createSkillPlugin`、`AmgSkillScope`、`v-skill`；根入口不导出 Skill。
- 新增 `build:skill` 与 `dist/skill` ESM/CJS/types 产物；官方 built-ins、DevTools 与 example Skill Lab 留待 SR3。
- 补齐迟到 setup 抑制、并发 dispose、Scope 释放、并行 retry 隔离、fallback 错误分类与默认日志脱敏；当前仍为 experimental 最小基线。

### 实验组件补强

- Barcode 支持 17 种标准一维码制：EAN-13/EAN-8、UPC-A/UPC-E、ITF-14、GS1-128、ISBN/ISSN、GS1 DataBar、Code 128/39/93、Interleaved 2 of 5、Codabar、MSI 与 Pharmacode。
- Qrcode 从伪矩阵升级为标准 QR Code 编码，新增国标 GB/T 18284、国际 ISO/IEC 18004、日本 JIS X 0510 与美标 AIM ISS QR Code profile，支持纠错等级与静区控制。
- MatrixCode 新增 34 种二维/堆叠式码制：QR/Micro QR/rMQR/GS1/HIBC/Swiss QR、Data Matrix/DMRE/GS1/HIBC、PDF417/MicroPDF417/HIBC、Aztec、MaxiCode、Han Xin、Code One、DotCode、Code 49、Code 16K、Codablock F、Ultracode 等，补齐矩阵式、堆叠式与行业 profile 条码演示。

### 能力摘要

- packages 根架构：base / business · hooks · theme · locale · icons · telemetry · optional skill
- 六套锁定主题；example 本地调试壳；精选 Demo 覆盖子集

---

## 历史占位（归档）

以下为仓库早期脚手架纪要，**不是** npm 1.0 发版记录。

### 脚手架纪要

- packages 根架构与业务五域
- 六套锁定主题
- example / build / scripts / docs 脚手架
