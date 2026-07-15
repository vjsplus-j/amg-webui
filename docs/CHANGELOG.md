# Changelog（工程札记）

非 SemVer 发版记录；记录仓库内阶段性能力落地，便于文档与 Agent 对齐。正式发 npm 后再切独立 CHANGELOG 按版本切片。

---

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
