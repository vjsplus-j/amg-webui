# AGENTS.md

## 愿景口号（锁定）

**对标 Element Plus，超越 Element Plus —— 成为最强的国产 WebUI 库。**

见 **`docs/VISION.md`** · **`docs/OVERTAKE_ELEMENT_PLUS.md`**（六大维度深度超车）。  
Cursor：`.cursor/rules/00-amg-webui-vision.mdc`。

## 大型组件库总计划（锁定）

见 **`docs/LIBRARY_PLAN.md`**。捷径：`docs/plan.md`。分期：P0 → P5（含 Theme Studio / 工程脚本强化）。

## 主题生成器 Theme Studio（锁定）

见 **`docs/THEME_STUDIO.md`** · 参照 [designmd Build](https://designmd.santiagoalonso.com/build?cat=Dev+Tools%2CSaaS&sort=popular)  
Cursor：`.cursor/rules/42-theme-runtime.mdc`（运行时契约）。  
目标：自定义主题可视化生成 + 现代质感，差异化传统后台。

## 工程与性能（锁定）

见 **`docs/ENGINEERING.md`** · Cursor：`.cursor/rules/11-component-engineering.mdc`。  
脚本：`create:component` · `generate:entry` · `extract:i18n`。  
性能：列表默认虚拟滚动 · 深度 Tree-Shaking · 更小包体积。  
完成定义：`docs/engineering/definition-of-done.md` · `.cursor/rules/02-verify-before-done.mdc`。

## 交互观测内核 Vp Telemetry（锁定）

见 **`docs/TELEMETRY.md`** · Cursor：`.cursor/rules/41-telemetry.mdc`。  
默认关闭；`trackEmit` 旁路 `emit`；习惯 / 告警 / 错误分析；Sink 可插拔。  
包：`@amg-webui/telemetry` · Provider：`TelemetryProvider` · example：`lab/telemetry`。

## 安全防护层（锁定）

见 **`docs/SECURITY.md`** · 包：`@amg-webui/security`。  
`sanitizeHtml` · `isSafeHref` / `sanitizeUrl` · `filterDangerousInput` · `SecurityService`。  
`RichText` / `Link` / `Button` 已接入；example：`lab/security`。

## 低代码 Schema（锁定）

见 **`docs/LOWCODE.md`** · 包：`@amg-webui/lowcode`。  
注册表 · Schema 渲染 · Studio 0.1（example：`lab/lowcode-studio`）· 与 Skill Pipeline 分离。

## 300 组件治理 Hardening（锁定执行）

见 **`docs/COMPONENT_HARDENING.md`** · SSOT：`component-hardening/`。  
`hardening:generate` · `audit:api` · `verify:component` · `hardening:evidence`。  
Stable ≠ score；example 文档化方向：`docs/EXAMPLE_DOCUMENTATION.md`。  
Cursor：`.cursor/rules/10-component-hardening.mdc`。

## Skill Runtime（实验性锁定）

见 **`docs/SKILL_RUNTIME.md`** · `packages/skill/README.md` · Cursor：`.cursor/rules/40-skill-runtime.mdc`。源码目录：`packages/skill/`。
公开可选子路径：`amg-webui/skill`（Core + Vue 集成）· `amg-webui/skill/core`（框架无关 Core）。
**根入口 `amg-webui` 禁止导出 Skill Runtime**；未显式导入子路径时不得引入运行时代码或初始化副作用。

状态口径：SR1 / SR2（最小 Core、Vue 接入、Scope、Pipeline JSON v1）experimental 基线已实现并通过当前基础门禁，但不得称 stable；稳定化 DoD 以 `docs/SKILL_RUNTIME.md` 为准。SR3 官方内置 Skill 与 example 调试页尚未实现，不得写成现有能力。

## 仓库结构（锁定）

见 `.cursor/rules/01-repository-structure.mdc` · [`README.md`](./README.md) · [`packages/README.md`](./packages/README.md) · [`example/README.md`](./example/README.md)。

组件按包拆分：`@amg-webui/core|form|data|overlay`（foundation）· `charts|editor` · 行业 `media|gb28181|onvif`（opt-in）· `business`。  
`@amg-webui/components/base` **仅再导出 core**。根 barrel **不**泄漏行业包。SSOT：`scripts/component-package-map.mjs` · 门禁：`npm run check:boundaries`。

## 视觉与布局规范（锁定）

见 **`packages/theme/SPEC.md`**（布局/密度）与 **`packages/theme/TOKENS.md`**（全局视觉 · Token · 变量）。

Cursor：`.cursor/rules/20-design-system.mdc`。

## 多语言规范（锁定）

见 **`packages/locale/I18N.md`** · `LocaleKeys` · `LocaleService` · `useLocale()`。

按钮 / 页标题 / 提示 / 错误文案统一走 key；**强类型 `LocaleKey`（缺 key 编译失败）** · 十语种含 **`ar-SA`（文案）** · 阅读方向 LTR/RTL **独立开关**；Cursor：`.cursor/rules/21-i18n-copy.mdc`。

## 应用工作流 / example ↔ docs（锁定）

见 **`docs/APP_WORKFLOW.md`**（§0）与 `.cursor/rules/30-official-docs.mdc`（对外 docs 边界）。

| | **example** | **docs** |
|--|----------|----------|
| 定位 | 开发调试工具（半成品 / 压测 / bug 复现） | 对外官方文档（标准示例 / API / 教程） |
| 部署 | **仅本地，不上线** | **可打包部署** |

专区仅存在于 example：`intro`（入门）· `base` · `biz` · `theme` · `i18n` · `perf` · `lab` · `dev`（+ `overview`）。

路由表：`example/router/routes.ts` · 页面：`example/pages/` · 文档站：`docs/`（VitePress）。

## Cursor rules 索引（编号）

| 文件 | 主题 |
|------|------|
| `00-amg-webui-vision.mdc` | 愿景与架构优先级 |
| `01-repository-structure.mdc` | 仓库分层 / 包边界 |
| `02-verify-before-done.mdc` | 完成必验 / DoD |
| `10-component-hardening.mdc` | 组件治理批次 |
| `11-component-engineering.mdc` | 可复用组件工程 |
| `20-design-system.mdc` | Token / 视觉 / 禁硬编码色值尺寸 |
| `21-i18n-copy.mdc` | 文案走 i18n |
| `30-official-docs.mdc` | 对外 docs 契约 |
| `40-skill-runtime.mdc` | Skill Runtime |
| `41-telemetry.mdc` | Telemetry |
| `42-theme-runtime.mdc` | Theme Runtime |

旧名 `vue3-amg-webui-*.mdc` 已废弃；以本表与 `docs/` 权威文档为准。

## 核心约定

0. **口号**：对标并超越 Element Plus —— 最强国产 WebUI；迭代走 `OVERTAKE_ELEMENT_PLUS.md` 独家赛道，禁止「EP 换皮」。
1. 源码主战场是 `packages/`；**example 仅本地调试不上线**；**docs 才是对外文档站**；禁止再加 `src/` / 根级 `demo/` 遗留层；npm 发包只出 `dist/`。
2. base/foundation ↔ business 隔离；business 只吃 foundation / hooks / theme / utils。行业包（gb28181/onvif/media）opt-in，不得进入 core。
3. 五大业务模块：`login` · `users` · `orders` · `content` · `settings`；biz 调试页在 `example/pages/biz/`。
4. example 用 **vue-router**（禁止 `currentPage` 字符串导航）。
5. 主题官方清单锁定于 `packages/theme`（designmd 六套 + WeChat / Alipay）。
6. UI 只消费语义 token；用户可见文案只走 i18n key。**禁止硬编码**文案 / 色值 / 尺寸（含 example）：见 `.cursor/rules/20-design-system.mdc` · `21-i18n-copy.mdc` · `I18N.md` · `TOKENS.md`。
7. 规范变更同步 LIBRARY_PLAN / THEME_STUDIO / ENGINEERING / TELEMETRY / SPEC / TOKENS / I18N / APP_WORKFLOW / CHANGELOG / Cursor rules / 相关 README。
8. 库 → `dist/`（发包）；docs VitePress 可部署；`example-dist/` 仅 example 本地冒烟、**禁止上线**；产物不进仓库。
9. 按 LIBRARY_PLAN 分期推进；不破坏分层、Token、`vp-`、**列表默认虚拟滚动**、Theme Studio 契约、**Telemetry 默认关闭**与 i18n 基线。
10. 视觉：现代产品感优先，拒绝传统灰底厚框后台套路。
11. **压测 / bug 复现只进 example**；docs 只保留简洁标准示例与 API。
12. **完成必验**：改完 `packages/` / `example/` 必须先跑通检查再宣称完成（至少 `npx vue-tsc --noEmit` + `npm run check:boundaries`）；见 `.cursor/rules/02-verify-before-done.mdc` · `docs/engineering/definition-of-done.md`。
13. **Telemetry**：交互组件旁路 `trackEmit`；`telemetry` prop 默认 `undefined`（勿依赖 Vue Boolean 省略）；纯展示件不伪造事件。
14. **example Demo 铺满**：`DemoBlock` / `DemoCode` / curated 演示铺满 `.ln-content` 内容列；禁止阅读栏 `max-width` 套在代码示例上、禁止 `DemoCode` 嵌套 `max-height`。见 `docs/APP_WORKFLOW.md` § Demo 铺满。
15. **Skill Runtime**：保持 experimental、独立可选、UI 零硬依赖；只从 `amg-webui/skill` 或 `amg-webui/skill/core` 接入，根入口禁止导出。SR1 / SR2 当前仅为已验证最小基线，不得冒充 stable；SR3 built-ins / example 未实现前禁止占位式宣传。
