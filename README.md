# AMG-WebUI / Vue3-AMG-WebUI

Vue 3 组件库 — packages 单体架构；六套 designmd 锁定主题；**foundation / industry / business** 包边界隔离；统一 **Overlay Runtime**；可选 **Vp Telemetry**；实验性、独立可选的 **Skill Runtime**。  
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

全量样式：

```ts
import 'amg-webui/style.css'
import { Button, ThemeService } from 'amg-webui'
```

按需组件 + 独立 CSS（不必拉根 `style.css`）：

```ts
import 'amg-webui/button/style.css'
import Button from 'amg-webui/button'
```

本地打库：`npm run build:lib` → `dist/`（主库 · runtime 分包 · on-demand · skill · theme · `generate:exports`）。

### Skill Runtime（experimental）

- `amg-webui/skill`：Core + Vue 集成（插件、`AmgSkillScope`、`v-skill`）。
- `amg-webui/skill/core`：框架无关 Core 与 Pipeline JSON v1。
- 根入口 `amg-webui` **不导出** Skill Runtime；只有显式导入上述子路径时才进入应用依赖图。
- SR1 / SR2 experimental 最小基线已实现并通过当前类型、单测、构建与包形基础门禁；这不等于 stable。SR3 官方内置 Skill 与 example 调试页尚未实现。

权威规范见 [`docs/SKILL_RUNTIME.md`](./docs/SKILL_RUNTIME.md)，使用说明见 [`packages/skill/README.md`](./packages/skill/README.md)。

## 根目录

```
VUE3-AMG-WEBUI/
├── build/                      # 库打包脚本（含按需 style.css 稳定化插件）
├── docs/                       # 对外官方文档（VitePress，可部署）
├── packages/                   # 组件库源码（无路由）
│   ├── components/core|form|data|overlay/  # foundation（@amg-webui/*）
│   ├── components/charts|editor|media|gb28181|onvif/  # 专用 / 行业 opt-in
│   ├── components/business/    # 五大业务域
│   ├── lowcode/                # Schema 引擎 + ui/
│   ├── runtime/                # Overlay 内核（Document Coordinator）
│   ├── telemetry/              # Vp Telemetry（默认关闭）
│   ├── skill/                  # Skill Runtime（experimental；独立可选子路径）
│   ├── security/ · theme/ · hooks/ · locale/ · icons/ · animations/ · utils/ · types/
├── example/                    # 开发调试工具（仅本地，不上线）
│   ├── pages/                  # 七大专区：base / biz / theme / i18n / perf / lab / dev
│   ├── demos/                  # curated 组件演示
│   ├── layouts/ · router/ · stores/ · mock/
├── scripts/                    # 长期工程脚本（见 ENGINEERING；一次性 patch 勿入库）
├── dist/                       # npm run build:lib → 库发包（不入库）
├── example-dist/               # build:example 本地冒烟（不入库、不上线）
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
npm run check:dist   # 发包产物契约（含按需 CSS / 品牌主题 / 体积预算）
npm run check:boundaries  # foundation↛industry + 组件包依赖 DAG
npm run build:example   # 本地冒烟 → example-dist/（禁止部署线上）
```

深链示例：`/base/button` · `/lab/telemetry` · `/biz/users` · `/?design=porsche` · `?lang=ja-JP`

## 使用库（0.1）

详见 [`docs/RELEASE_0.1.md`](./docs/RELEASE_0.1.md)。摘要：

```ts
import 'amg-webui/style.css'
import { Button, BizUsers, ThemeService } from 'amg-webui'
import { TelemetryService, consoleSink } from 'amg-webui/telemetry'
import { createOverlayRuntime } from 'amg-webui/runtime'

TelemetryService.configure({
  enabled: true,
  appId: 'my-app',
  sinks: [consoleSink()]
})

// 微前端：独立 Overlay Runtime（dispose 不会误伤其他 MFE 的 scroll lock）
const overlayRt = createOverlayRuntime({ zIndexBase: 3000, namespace: 'mfe-a' })
```

子路径导出见 `package.json` → `exports`（**allowlist**，非所有源码 `.ts` 永生 API）：

| 路径 | 说明 |
|------|------|
| `.` · `./style.css` | 全量入口 / 全量样式 |
| `./button` · `./button/style.css` · … | 按需组件 JS + **稳定**侧载 CSS |
| `./core` · `./form` · `./data` · `./overlay` | foundation 包 barrel |
| `./media` · `./gb28181` · `./onvif` | 行业包（opt-in，根 `.` 不泄漏） |
| `./runtime` | Overlay 内核（Document Coordinator） |
| `./telemetry` · `./security` · `./lowcode` · `./theme` · `./icons` | 平台能力 |
| `./hooks` · `./utils/env` · … | 白名单深路径 |
| `./components/base` | legacy → **仅再导出 core** |
| `./skill` · `./skill/core` | Skill Runtime（experimental） |

行业包与 Skill **不**从根 `.` 隐式泄漏。

## 近期能力（摘要）

| 能力 | 说明 | 文档 |
|------|------|------|
| **Overlay Runtime** | Document 级 Escape / FocusTrap / ClickOutside / ScrollLock 协调；多 Runtime / MFE 隔离；嵌套焦点恢复 | [`docs/OVERLAY.md`](./docs/OVERLAY.md) |
| **按需 CSS** | `amg-webui/<kebab>/style.css` 稳定入口；`check:dist` + consumer 冒烟 | [`docs/ENGINEERING.md`](./docs/ENGINEERING.md) |
| **包边界 / DAG** | foundation↛industry；core↛form/data/overlay；`check:boundaries` | [`packages/README.md`](./packages/README.md) |
| **发包契约** | `exports` → `dist/**` only；allowlist；`npm pack` → Vite/Webpack/Nuxt consumer | [`docs/RELEASE_0.1.md`](./docs/RELEASE_0.1.md) |
| **Vp Telemetry** | 默认关闭的交互事件缓冲 + Sink + 习惯/告警/错误分析 | [`docs/TELEMETRY.md`](./docs/TELEMETRY.md) |
| **Skill Runtime（experimental）** | 独立子路径、实例隔离、Scope 与 Pipeline JSON v1；SR3 未实现 | [`docs/SKILL_RUNTIME.md`](./docs/SKILL_RUNTIME.md) |
| **强类型 i18n** | 八语种 + `ar-SA` RTL；locale pack `satisfies LocaleMessages` | [`packages/locale/I18N.md`](./packages/locale/I18N.md) |
| **工程脚本** | `create:component` · `generate:entry` · `extract:i18n` · `generate:exports` · `check:boundaries` · `build:skill` | [`docs/ENGINEERING.md`](./docs/ENGINEERING.md) |

## 规范文档

| 主题 | 文档 | Cursor 记忆 |
|------|------|-------------|
| **愿景口号** | [`docs/VISION.md`](./docs/VISION.md) | `vue3-amg-webui-vision.mdc` |
| **六大维度深度超车 EP** | [`docs/OVERTAKE_ELEMENT_PLUS.md`](./docs/OVERTAKE_ELEMENT_PLUS.md) | `vue3-amg-webui-overtake.mdc` |
| **总计划（200+ 库必备条件）** | [`docs/LIBRARY_PLAN.md`](./docs/LIBRARY_PLAN.md) | `vue3-amg-webui-library-plan.mdc` |
| **Overlay 弹层内核** | [`docs/OVERLAY.md`](./docs/OVERLAY.md) | `vue3-amg-webui-engineering.mdc` |
| **交互观测 Vp Telemetry** | [`docs/TELEMETRY.md`](./docs/TELEMETRY.md) | `vue3-amg-webui-telemetry.mdc` |
| **Skill Runtime（experimental）** | [`docs/SKILL_RUNTIME.md`](./docs/SKILL_RUNTIME.md) · [`packages/skill/README.md`](./packages/skill/README.md) | `vue3-amg-webui-skill-runtime.mdc` |
| **Theme Studio（自定义主题工具）** | [`docs/THEME_STUDIO.md`](./docs/THEME_STUDIO.md) | `vue3-amg-webui-theme-studio.mdc` |
| **工程脚本 · 性能默认 · 发包** | [`docs/ENGINEERING.md`](./docs/ENGINEERING.md) | `vue3-amg-webui-engineering.mdc` |
| 目录与包边界 | README / [`packages/README.md`](./packages/README.md) | `vue3-amg-webui-structure.mdc` |
| 布局·密度·卡片·按钮 | [`packages/theme/SPEC.md`](./packages/theme/SPEC.md) | `vue3-amg-webui-design-specs.mdc` |
| 全局视觉·Token·变量 | [`packages/theme/TOKENS.md`](./packages/theme/TOKENS.md) | `vue3-amg-webui-tokens.mdc` |
| 多语言（按钮/标题/提示/错误） | [`packages/locale/I18N.md`](./packages/locale/I18N.md) | `vue3-amg-webui-i18n.mdc` |
| 页面·路由·启动·部署 | [`docs/APP_WORKFLOW.md`](./docs/APP_WORKFLOW.md) | `vue3-amg-webui-app-workflow.mdc` |
| Agent 总入口 | [`AGENTS.md`](./AGENTS.md) | — |
