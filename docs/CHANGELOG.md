# Changelog（工程札记）

非 SemVer 发版记录；记录仓库内阶段性能力落地，便于文档与 Agent 对齐。正式发 npm 后再切独立 CHANGELOG 按版本切片。

---

## 2026-08-07 — 文档同步与根目录清理

- npm 仍为 **0.1.0**（未升 1.0）；README / AGENTS 对齐 Hardening、Lowcode Studio、~287 库存
- 权威治理：`docs/COMPONENT_HARDENING.md` + `component-hardening/`；Example 方向：`docs/EXAMPLE_DOCUMENTATION.md`
- 删除根目录过期 V1/V2/V3 计划草稿与任务 CSV；`COMPONENT_DEEPEN_PLAN` 改为历史指针
- example 窄屏：`≤768px` 侧栏隐藏后顶栏菜单 + Drawer 导航；APP_WORKFLOW / example README / DoD §23 已同步
- 废弃 `vue3-amg-webui-*.mdc`；繁体包迁 `zh-HK`（删除 `zh-TW` 实体目录）

## 2026-08-07 — 子系统成熟度冲刺（合格线 90）

合格标准：**子系统能力证明 ≥ 90**（类型检查 + 契约单测 / 关键 E2E + 文档诚实边界）；`score:maturity` 仍只是盘点启发式。

本轮已落地：

| 子系统 | 动作 |
|--------|------|
| Overlay/A11Y | StatusModal · GbsAlarmModal 迁入 `useOverlay`；嵌套 Dialog demo + `overlay-stack` E2E；runtime 单测 |
| DataTable | 虚拟列 / worker 排序契约单测；`native-large-data` 路径对齐 `data/` |
| Business Kits | mutation.error 表面化（Users/Orders/Content）+ 乐观回滚单测 |
| Security | `SECURE_*` 预设 + InputText sanitize 挂载单测 |
| Telemetry | 独立 `telemetry.spec.ts`（禁用早退 / redact / buffer / analyze / sink 隔离） |
| Form | `form-contract.spec.ts`（validate → aria-invalid / describedby） |
| Packaging | `check:dist` 兼容 `core`/`base` on-demand Button 路径；CI 加 `check:boundaries` |
| i18n | 嵌套 Dialog 文案八语种对齐；`extract:i18n` 绿 |
| Form System | 叶子/复合控件全面 `useFormItem`（含 Search/Upload/Picker/Group/ColorInput/SmsCode/TimeRange）；`form-contract` 单测；`skipFormItem` 防双重注入 |
| Lowcode | SchemaRenderer slot 类型修复；`vite.runtime` 接入 `@vitejs/plugin-vue`（lowcode/ui SFC 可编） |
| Theme Core | Scope 泄漏 / 宿主劫持 / dispose 清宿主：5 项修复 + `theme-scope.spec.ts`（20/20 含 core） |
| 迁移 | `rewrite-consumer-imports` 深路径改写；`vue-tsc --noEmit` 绿 |

仍未宣称全表 90：基础组件整体尾部、按需 CSS side-entry、Skill SR3、Theme Studio UI 导出门禁等见各文档诚实边界。

## 2026-08-07 — CI 覆盖加深（公开库骨架）

- Workflow 增补：`extract:i18n` schema drift · `test:ssr` · `check:dist`（on-demand 改写 / 六品牌 CSS / 粗体积）
- Playwright：Chromium Dialog focus trap / Escape / axe serious+ / RTL 截图附件 / 六品牌 `data-design`；Firefox · WebKit · Mobile Chrome smoke
- 诚实边界写明：仍非像素全矩阵、Nuxt hydration、Lighthouse（见 `docs/ENGINEERING.md` § CI 覆盖）

## 2026-08-07 — 成熟度评分：盘点工具 ≠ 质量证书

- 明确 `score:maturity` / `component-maturity.json` 角色为 **dev inventory / triage**（`role: "dev-inventory"` · `notACertificate: true`）。
- 契约文案补齐：静态启发式（行数 / Props / 字符串信号）不能证明键盘、多实例、竞态、SSR、泄漏、读屏、API 稳定或性能。
- 同步：`docs/ENGINEERING.md` · `docs/components/index.md` · `docs/RELEASE_0.1.md` · Gallery i18n lead · engineering rule。

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
- example：`/lab/telemetry` · 文档：`docs/TELEMETRY.md` · rule：`.cursor/rules/41-telemetry.mdc`
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
