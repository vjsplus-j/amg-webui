# Changelog（工程札记）

非 SemVer 发版记录；记录仓库内阶段性能力落地，便于文档与 Agent 对齐。正式发 npm 后再切独立 CHANGELOG 按版本切片。

---

## 2026-08-06 — Overlay 浮动统一 + industry 首批迁出（深度推进）

- `usePopover` / Teleport floating pickers；Popover/Tooltip/Popconfirm 经 `useOverlay` 收口（见上条细节）。
- 新增 `packages/components/industry/` 层；`Gbs*` 八件从 `base` 迁出；`generate:entry` / ondemand / exports / catalog / create:component 同步。
- 根 kebab（`amg-webui/gbs-*`）保持；新增子路径 `amg-webui/components/industry`。
- 单测：`floating-teleport-overflow`（Select/DatePicker 在 overflow:hidden 宿主外 Teleport）。
- **未完成**：Onvif / VCR / Video / 404 等仍在 base；深 E2E；逐组件 CSS side-entry。

---

## 2026-08-06 — Overlay / floating 面板统一（深度推进，未宣称完成）

- `usePopover` 改为 floating + 非模态 `useOverlay`，组件自行 `Teleport` 并绑定 `panelStyle`。
- Select / Cascader / TreeSelect / Date* / Time* / Color / Month / Year / TimeSelect / AutoComplete / Mention / Dropdown / TabsNav more 菜单统一 Teleport 定位；去掉面板 `position: absolute` 相对触发器布局。
- Popover / Tooltip / Popconfirm 外点与 Escape 收口到 `useOverlay`（不再手绑 document 监听）。
- 单测：`overlay-core` 补 outside-click + ignore；`vue-tsc` 通过。
- **未完成**：行业组件迁出 base、深 E2E、逐组件 CSS side-entry；Overlay 仍属内核加深，不作「完全解决」。

---

## 2026-08-05 — Skill Runtime SR1 / SR2（experimental）

- 新增独立可选 `packages/skill`，根 `amg-webui` 入口不导出；公开子路径为 `amg-webui/skill` 与 `amg-webui/skill/core`。
- 落地 Unit / Context / Runtime / Scope、Adapter / Observer、请求取消、有限重试、幂等 teardown 与异步卸载竞态处理。
- Pipeline JSON v1 支持顺序、并行、命名条件、重试与 fallback；禁止 `eval` / `new Function`，配置仅接收 JSON 值。
- Vue 层提供 `createSkillPlugin`、`AmgSkillScope` 与 `v-skill`；新增独立 ESM/CJS/types 构建与生命周期 / 隔离 / Pipeline / Vue 单测。
- 收紧迟到 setup 结果、并发 dispose、Scope 句柄释放、并行 retry、fallback 错误分类、显式 host 与默认错误脱敏边界；当前基础门禁记录见 `docs/SKILL_RUNTIME.md` §11。
- SR3 官方 built-ins、Telemetry bridge、DevTools 与 example Skill Lab 尚未实现，不纳入 0.1 稳定承诺。

---

## 2026-08-03 — example 样式收口与 shell 清零

- example 删除未使用的 `styles/layout.scss`；全局入口只加载库动画，不再维护第二套布局组件样式。
- AppHeader / AppShell / ComponentGallery / DemoBlock / MotionLivePanel 改用库内 Search、Select、Button、Avatar，移除输入、下拉、按钮的重复样式和深层覆盖。
- CategoryNav、FooterNav、IndexNav、MiniNav、QuickNav、VerticalStepNav 从 TopNav/StepNav 薄转发升级为独立 API、交互、Token 样式、A11Y 与 Telemetry 实现。
- Tabs/TabPane 改为面板注册机制，修复多 Tabs ID 冲突及销毁后槽内容丢失；补 `destroyInactive`、生命周期事件和唯一 ARIA 关联。
- TelemetryProvider 支持响应式配置、卸载恢复和生命周期追踪；MessageBox 补焦点陷阱、自动聚焦、异步 validator/beforeClose、关闭原因及命令式 Promise 收口。
- Barcode 从伪 Code128 条纹升级为标准编码内核，新增 EAN/UPC、GS1-128、ITF-14、ISBN/ISSN、GS1 DataBar 及工业码等 17 种一维码制；example 同屏展示国标与国际码制并校验非法内容。
- Qrcode 从伪矩阵升级为标准 QR Code 编码，新增国标 GB/T 18284、国际 ISO/IEC 18004、日本 JIS X 0510 与美标 AIM ISS QR Code profile；example 同屏展示四类二维码并支持纠错等级切换。
- 新增 MatrixCode 二维条码组件，覆盖 QR/Micro QR/rMQR/GS1/HIBC/Swiss QR、Data Matrix/DMRE/GS1/HIBC、PDF417/MicroPDF417/HIBC、Aztec、MaxiCode、Han Xin、Code One、DotCode、Code 49、Code 16K、Codablock F、Ultracode 等 34 种矩阵式、堆叠式与行业 profile 码制；example 同屏展示完整格式族。
- 成熟度：stub **0** / shell **0** / beta **140** / ready **145**；新增 shell、条码与二维码标准测试。

## 2026-07-15（晚）— play → example 更名

- 调试壳目录：`play/` → **`example/`**
- 配置：`vite.example.config.ts` · `npm run build:example` · `sync:example-zones`
- 冒烟产物：`demo-dist/` → **`example-dist/`**
- i18n：`playDoc.ts` → `exampleDoc.ts` · keys `example.doc.*` · `LocaleKeys.exampleDoc`
- 组件：`ExampleZoneStub` · `BusinessExampleSandbox`
- 文档 / Cursor rules / AGENTS / README 同步「example ↔ docs」
- **未改**：`playwright`、媒体 API `@play` / `.play()`、Lucide `Play`、`AudioPlay`、`common.play` 播放文案

## 2026-07-15

### Vp Telemetry（交互观测内核）

- 新增包 `packages/telemetry`（`@amg-webui/telemetry` / `amg-webui/telemetry`）
- `TelemetryService`（`globalThis` 单例）· `trackEmit` · redact · ring buffer · sinks（console / buffer / custom）· `summarizeHabits` / `findAlerts` / `findErrors`
- `TelemetryProvider`（base）· `BaseProps.trackId` / `telemetry`
- example：`/lab/telemetry` · 文档：`docs/TELEMETRY.md` · rule：`vue3-amg-webui-telemetry.mdc`
- 第一期挂钩：Button / Link / Tag / Badge / Avatar / AvatarGroup / Card / FloatButton / Collapse / CopyText / Progress / Statistic / Ellipsis / Typography / CardWidgets
- 修正：Vue Boolean 省略导致 `telemetry===false` 跳过全部 track → 组件 `withDefaults` 默认 `undefined`

### 通用区组件与事件

- **CardWidgets**：ABCD 槽位 HTML5 DnD 互换；`v-model` 顺序；`swap` / `change` / `dragEnd`
- **CopyText** / **Spin** / **Space** / **Collapse** / **Statistic** 等归入 catalog `general`
- Emit 补齐：Badge `click`；FloatButton `openChange` / `update:open`；Progress `change`/`finish`；Collapse `expand`/`collapse`；Statistic `finish`；Ellipsis `overflowChange`；CopyText `copyError`

### 工程与文档

- Catalog 规模约 **272**；脚本：`validate:catalog` · `score:maturity` · `generate:icons` · `sync:example-zones`
- README 体系：根 · `packages/` · `packages/telemetry` · `packages/components` · `example/`
- 同步：`ENGINEERING.md` · `LIBRARY_PLAN.md` · `APP_WORKFLOW.md` · `AGENTS.md` · structure rule
