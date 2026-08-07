# AMG-WebUI / Vue3-AMG-WebUI

> **对标 Element Plus，超越 Element Plus —— 成为最强的国产 WebUI 库。**

Vue 3 组件库 — packages 单体架构；六套 designmd 锁定主题；base / business 分层隔离；可选 **Vp Telemetry** 交互观测内核；实验性、独立可选的 **Skill Runtime**。
愿景：[`docs/VISION.md`](./docs/VISION.md) · 深度超车：[`docs/OVERTAKE_ELEMENT_PLUS.md`](./docs/OVERTAKE_ELEMENT_PLUS.md)

## 当前版本：0.1.0（试用）

| 项 | 说明 |
|----|------|
| npm SemVer | **`0.1.0`** — **不是**正式 1.0 |
| 承诺范围 | **v0.1.3 精选子集**（Core∪B1–B4 去重 **140** 组件）· [`docs/V0_1_SUBSET.md`](./docs/V0_1_SUBSET.md) |
| API | **可变**；破坏性变更记 CHANGELOG |
| 子集外 | experimental，不作稳定承诺 |
| 发包说明 | [`docs/RELEASE_0.1.md`](./docs/RELEASE_0.1.md) |

```bash
npm install amg-webui@0.1.0
npm install vue@^3.4.0 @lucide/vue@^1.0.0   # peers
```

```ts
import 'amg-webui/style.css'
import { Button, ThemeService } from 'amg-webui'
```

本地打库：`npm run build:lib` → `dist/`。

### Skill Runtime（experimental）

- `amg-webui/skill`：Core + Vue 集成（插件、`AmgSkillScope`、`v-skill`）。
- `amg-webui/skill/core`：框架无关 Core 与 Pipeline JSON v1。
- 根入口 `amg-webui` **不导出** Skill Runtime；只有显式导入上述子路径时才进入应用依赖图。
- SR1 / SR2 experimental 最小基线已实现并通过当前类型、单测、构建与包形基础门禁；这不等于 stable，稳定化 DoD 继续按规范推进。SR3 官方内置 Skill 与 example 调试页尚未实现。

当前 API 不属于 0.1 稳定承诺，1.0 前可能调整。权威规范见 [`docs/SKILL_RUNTIME.md`](./docs/SKILL_RUNTIME.md)，使用说明见 [`packages/skill/README.md`](./packages/skill/README.md)。

## 根目录

```
VUE3-AMG-WEBUI/
├── build/                      # 库打包脚本
├── docs/                       # 对外官方文档（VitePress，可部署）
├── packages/                   # 组件库源码（无路由）
│   ├── components/core|form|data|overlay/  # foundation（@amg-webui/*）
│   ├── components/charts|editor|media|gb28181|onvif/  # 专用 / 行业 opt-in
│   ├── components/business/    # 五大业务域
│   ├── lowcode/                # Schema 引擎 + ui/
│   ├── runtime/                # Overlay 内核
│   ├── telemetry/              # Vp Telemetry（默认关闭）
│   ├── skill/                  # Skill Runtime（experimental；独立可选子路径）
│   ├── theme/ · hooks/ · locale/ · icons/ · animations/ · utils/ · types/
├── example/                       # 开发调试工具（仅本地，不上线）
│   ├── pages/                  # 七大专区：base / biz / theme / i18n / perf / lab / dev
│   ├── demos/                  # curated 组件演示
│   ├── layouts/ · router/ · stores/ · mock/
├── scripts/                    # 长期工程脚本（见 ENGINEERING；一次性 patch 勿入库）
├── dist/                       # npm run build → 库发包（不入库）
├── example-dist/                  # build:example 本地冒烟（不入库、不上线）
└── …
```

根目录只保留产品入口文档（`README` · `AGENTS` · `CHANGELOG` · `LICENSE`）。组件规范 / 验收草稿不放仓库根；权威文档在 `docs/` 与 `packages/*/README.md`。

> **example ≠ docs**：example 给库作者排障（压测 / 复现 OK）；docs 给业务方查阅（仅标准示例 + API）。见 [`docs/APP_WORKFLOW.md`](./docs/APP_WORKFLOW.md) §0。

## 启动

```bash
npm install
npm run dev          # example · 本地调试（不上线）
npm run docs:dev     # 官方文档本地编写
npm run build:lib    # 库发包产物 → dist/（0.1 试用）
npm run build        # vue-tsc + vite build（与库配置一致时）
npm run build:example   # 本地冒烟 → example-dist/（禁止部署线上）
```

深链示例：`/base/button` · `/lab/telemetry` · `/biz/users` · `/?design=porsche` · `?lang=ja-JP`

## 使用库（0.1）

详见 [`docs/RELEASE_0.1.md`](./docs/RELEASE_0.1.md)。摘要：

```ts
import 'amg-webui/style.css'
import { Button, BizUsers, ThemeService } from 'amg-webui'
import { TelemetryService, consoleSink } from 'amg-webui/telemetry'

TelemetryService.configure({
  enabled: true,
  appId: 'my-app',
  sinks: [consoleSink()]
})
```

子路径导出见 `package.json` → `exports`：`.` · `./style.css` · `./core` · `./form` · `./data` · `./overlay` · `./media` · `./gb28181` · `./onvif` · `./telemetry` · `./theme` · `./icons` · `./components/base`（legacy→core）· `./components/business` · experimental `./skill` · `./skill/core`。行业包与 Skill 不从根 `.` 隐式泄漏。

## 近期能力（摘要）

| 能力 | 说明 | 文档 |
|------|------|------|
| **Vp Telemetry** | 默认关闭的交互事件缓冲 + Sink + 习惯/告警/错误分析 | [`docs/TELEMETRY.md`](./docs/TELEMETRY.md) |
| **Skill Runtime（experimental）** | 独立子路径、实例隔离、Scope 与 Pipeline JSON v1；SR3 built-ins / example 尚未实现 | [`docs/SKILL_RUNTIME.md`](./docs/SKILL_RUNTIME.md) |
| **通用区组件** | Button / Link / Tag / Avatar… + Space / Spin / CopyText / Collapse / Statistic / CardWidgets（ABCD 拖拽互换）等 | example `base` 目录 · catalog |
| **事件契约** | 交互组件旁路 `trackEmit`；业务 `emit` 保留（Badge click、FloatButton openChange、Progress finish…） | TELEMETRY · 各组件 types |
| **工程脚本** | `create:component` · `generate:entry` · `extract:i18n` · `validate:catalog` · `score:maturity` · `generate:vitepress-api` · `build:skill` | [`docs/ENGINEERING.md`](./docs/ENGINEERING.md) |

## 规范文档

| 主题 | 文档 | Cursor 记忆 |
|------|------|-------------|
| **愿景口号** | [`docs/VISION.md`](./docs/VISION.md) | `vue3-amg-webui-vision.mdc` |
| **六大维度深度超车 EP** | [`docs/OVERTAKE_ELEMENT_PLUS.md`](./docs/OVERTAKE_ELEMENT_PLUS.md) | `vue3-amg-webui-overtake.mdc` |
| **总计划（200+ 库必备条件）** | [`docs/LIBRARY_PLAN.md`](./docs/LIBRARY_PLAN.md) | `vue3-amg-webui-library-plan.mdc` |
| **交互观测 Vp Telemetry** | [`docs/TELEMETRY.md`](./docs/TELEMETRY.md) | `vue3-amg-webui-telemetry.mdc` |
| **Skill Runtime（experimental）** | [`docs/SKILL_RUNTIME.md`](./docs/SKILL_RUNTIME.md) · [`packages/skill/README.md`](./packages/skill/README.md) | `vue3-amg-webui-skill-runtime.mdc` |
| **Theme Studio（自定义主题工具）** | [`docs/THEME_STUDIO.md`](./docs/THEME_STUDIO.md) | `vue3-amg-webui-theme-studio.mdc` |
| **工程脚本 · 性能默认** | [`docs/ENGINEERING.md`](./docs/ENGINEERING.md) | `vue3-amg-webui-engineering.mdc` |
| 目录与包边界 | README / [`packages/README.md`](./packages/README.md) | `vue3-amg-webui-structure.mdc` |
| 布局·密度·卡片·按钮 | [`packages/theme/SPEC.md`](./packages/theme/SPEC.md) | `vue3-amg-webui-design-specs.mdc` |
| 全局视觉·Token·变量 | [`packages/theme/TOKENS.md`](./packages/theme/TOKENS.md) | `vue3-amg-webui-tokens.mdc` |
| 多语言（按钮/标题/提示/错误） | [`packages/locale/I18N.md`](./packages/locale/I18N.md) | `vue3-amg-webui-i18n.mdc` |
| 页面·路由·启动·部署 | [`docs/APP_WORKFLOW.md`](./docs/APP_WORKFLOW.md) | `vue3-amg-webui-app-workflow.mdc` |
| Agent 总入口 | [`AGENTS.md`](./AGENTS.md) | — |
