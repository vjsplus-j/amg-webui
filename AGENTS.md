# AGENTS.md

## 愿景口号（锁定）

**对标 Element Plus，超越 Element Plus —— 成为最强的国产 WebUI 库。**

见 **`docs/VISION.md`** · **`docs/OVERTAKE_ELEMENT_PLUS.md`**（六大维度深度超车）。  
Cursor：`vue3-amg-webui-vision.mdc` · `vue3-amg-webui-overtake.mdc`。

## 大型组件库总计划（锁定）

见 **`docs/LIBRARY_PLAN.md`** 与 `.cursor/rules/vue3-amg-webui-library-plan.mdc`。  
捷径：`docs/plan.md`。分期：P0 → P5（含 Theme Studio / 工程脚本强化）。

## 主题生成器 Theme Studio（锁定）

见 **`docs/THEME_STUDIO.md`** · 参照 [designmd Build](https://designmd.santiagoalonso.com/build?cat=Dev+Tools%2CSaaS&sort=popular)  
Cursor：`vue3-amg-webui-theme-studio.mdc`。  
目标：自定义主题可视化生成 + 现代质感，差异化传统后台。

## 工程与性能（锁定）

见 **`docs/ENGINEERING.md`** · Cursor：`vue3-amg-webui-engineering.mdc`。  
脚本：`create:component` · `generate:entry` · `extract:i18n`。  
性能：列表默认虚拟滚动 · 深度 Tree-Shaking · 更小包体积。

## 交互观测内核 Vp Telemetry（锁定）

见 **`docs/TELEMETRY.md`** · Cursor：`vue3-amg-webui-telemetry.mdc`。  
默认关闭；`trackEmit` 旁路 `emit`；习惯 / 告警 / 错误分析；Sink 可插拔。  
包：`@amg-webui/telemetry` · Provider：`TelemetryProvider` · example：`lab/telemetry`。

## 安全防护层（锁定）

见 **`docs/SECURITY.md`** · 包：`@amg-webui/security`。  
`sanitizeHtml` · `isSafeHref` / `sanitizeUrl` · `filterDangerousInput` · `SecurityService`。  
`RichText` / `Link` / `Button` 已接入；example：`lab/security`。

## 低代码 Schema（锁定）

见 **`docs/LOWCODE.md`** · 包：`@amg-webui/lowcode`。  
注册表 · Schema 渲染（`SchemaRenderer` / `CanvasPreview`）· 校验/迁移 · `generateVueSfc`。  
example：`lab/lowcode`。与 Skill Pipeline（逻辑编排）分离。

## Skill Runtime（实验性锁定）

见 **`docs/SKILL_RUNTIME.md`** · `packages/skill/README.md` · Cursor：`vue3-amg-webui-skill-runtime.mdc`。源码目录：`packages/skill/`。
公开可选子路径：`amg-webui/skill`（Core + Vue 集成）· `amg-webui/skill/core`（框架无关 Core）。
**根入口 `amg-webui` 禁止导出 Skill Runtime**；未显式导入子路径时不得引入运行时代码或初始化副作用。

状态口径：SR1 / SR2（最小 Core、Vue 接入、Scope、Pipeline JSON v1）experimental 基线已实现并通过当前基础门禁，但不得称 stable；稳定化 DoD 以 `docs/SKILL_RUNTIME.md` 为准。SR3 官方内置 Skill 与 example 调试页尚未实现，不得写成现有能力。

## 仓库结构（锁定）

见 `.cursor/rules/vue3-amg-webui-structure.mdc` · [`README.md`](./README.md) · [`packages/README.md`](./packages/README.md) · [`example/README.md`](./example/README.md)。

## 视觉与布局规范（锁定）

见 **`packages/theme/SPEC.md`**（布局/密度）与 **`packages/theme/TOKENS.md`**（全局视觉 · Token · 变量）。

Cursor：`vue3-amg-webui-design-specs.mdc` · `vue3-amg-webui-tokens.mdc`。

## 多语言规范（锁定）

见 **`packages/locale/I18N.md`** · `LocaleKeys` · `LocaleService` · `useLocale()`。

按钮 / 页标题 / 提示 / 错误文案统一走 key；**强类型 `LocaleKey`（缺 key 编译失败）** · 八语种含 **`ar-SA` RTL**；Cursor：`vue3-amg-webui-i18n.mdc`。

## 应用工作流 / example ↔ docs（锁定）

见 **`docs/APP_WORKFLOW.md`**（§0）与 `.cursor/rules/vue3-amg-webui-app-workflow.mdc`。

| | **example** | **docs** |
|--|----------|----------|
| 定位 | 开发调试工具（半成品 / 压测 / bug 复现） | 对外官方文档（标准示例 / API / 教程） |
| 部署 | **仅本地，不上线** | **可打包部署** |

专区仅存在于 example：`intro`（入门）· `base` · `biz` · `theme` · `i18n` · `perf` · `lab` · `dev`（+ `overview`）。

路由表：`example/router/routes.ts` · 页面：`example/pages/` · 文档站：`docs/`（VitePress）。

## 核心约定

0. **口号**：对标并超越 Element Plus —— 最强国产 WebUI；迭代走 `OVERTAKE_ELEMENT_PLUS.md` 独家赛道，禁止「EP 换皮」。
1. 源码主战场是 `packages/`；**example 仅本地调试不上线**；**docs 才是对外文档站**；禁止再加 `src/` / 根级 `demo/` 遗留层；npm 发包只出 `dist/`。
2. base ↔ industry ↔ business 隔离；business 只吃 base / hooks / theme / utils；industry 可吃 base，禁止互相污染 business。
3. 五大业务模块：`login` · `users` · `orders` · `content` · `settings`；biz 调试页在 `example/pages/biz/`。行业套件在 `packages/components/industry/`（首批 `Gbs*`）。
4. example 用 **vue-router**（禁止 `currentPage` 字符串导航）。
5. 主题六套锁定于 `packages/theme`（designmd）。
6. UI 只消费语义 token；用户可见文案只走 i18n key。**禁止硬编码**文案 / 色值 / 尺寸（含 example）：见 `.cursor/rules/vue3-amg-webui-no-hardcode.mdc` · `I18N.md` · `TOKENS.md`。
7. 规范变更同步 LIBRARY_PLAN / THEME_STUDIO / ENGINEERING / TELEMETRY / SPEC / TOKENS / I18N / APP_WORKFLOW / CHANGELOG / Cursor rules / 相关 README。
8. 库 → `dist/`（发包）；docs VitePress 可部署；`example-dist/` 仅 example 本地冒烟、**禁止上线**；产物不进仓库。
9. 按 LIBRARY_PLAN 分期推进；不破坏分层、Token、`vp-`、**列表默认虚拟滚动**、Theme Studio 契约、**Telemetry 默认关闭**与 i18n 基线。
10. 视觉：现代产品感优先，拒绝传统灰底厚框后台套路。
11. **压测 / bug 复现只进 example**；docs 只保留简洁标准示例与 API。
12. **完成必验**：改完 `packages/` / `example/` 必须先跑通检查再宣称完成（至少 `npx vue-tsc --noEmit`）；见 `.cursor/rules/vue3-amg-webui-verify-before-done.mdc`。
13. **Telemetry**：交互组件旁路 `trackEmit`；`telemetry` prop 默认 `undefined`（勿依赖 Vue Boolean 省略）；纯展示件不伪造事件。
14. **example Demo 铺满**：`DemoBlock` / `DemoCode` / curated 演示铺满 `.ln-content` 内容列；禁止阅读栏 `max-width` 套在代码示例上、禁止 `DemoCode` 嵌套 `max-height`。见 `.cursor/rules/vue3-amg-webui-example-demo-layout.mdc`。
15. **Skill Runtime**：保持 experimental、独立可选、UI 零硬依赖；只从 `amg-webui/skill` 或 `amg-webui/skill/core` 接入，根入口禁止导出。SR1 / SR2 当前仅为已验证最小基线，不得冒充 stable；SR3 built-ins / example 未实现前禁止占位式宣传。
