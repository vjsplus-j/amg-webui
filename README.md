# AMG-WebUI / Vue3-AMG-WebUI

> **对标 Element Plus，超越 Element Plus —— 成为最强的国产 WebUI 库。**

Vue 3 组件库 — packages 单体架构；六套 designmd 锁定主题；base / business 分层隔离；可选 **Vp Telemetry** 交互观测内核。  
愿景：[`docs/VISION.md`](./docs/VISION.md) · 深度超车：[`docs/OVERTAKE_ELEMENT_PLUS.md`](./docs/OVERTAKE_ELEMENT_PLUS.md)

## 根目录

```
VUE3-AMG-WEBUI/
├── build/                      # 库打包脚本
├── docs/                       # 对外官方文档（VitePress，可部署）
├── packages/                   # 组件库源码（无路由）
│   ├── components/base/        # 纯 UI（含通用区 Button / CardWidgets / CopyText …）
│   ├── components/business/  # 五大业务域
│   ├── telemetry/              # Vp Telemetry 交互观测内核（默认关闭）
│   ├── theme/ · hooks/ · locale/ · icons/ · animations/ · utils/ · types/
├── example/                       # 开发调试工具（仅本地，不上线）
│   ├── pages/                  # 七大专区：base / biz / theme / i18n / perf / lab / dev
│   ├── demos/                  # curated 组件演示
│   ├── layouts/ · router/ · stores/ · mock/
├── scripts/                    # create / entry / i18n / catalog / maturity …
├── dist/                       # npm run build → 库发包（不入库）
├── example-dist/                  # build:example 本地冒烟（不入库、不上线）
└── …
```

> **example ≠ docs**：example 给库作者排障（压测 / 复现 OK）；docs 给业务方查阅（仅标准示例 + API）。见 [`docs/APP_WORKFLOW.md`](./docs/APP_WORKFLOW.md) §0。

## 启动

```bash
npm install
npm run dev          # example · 本地调试（不上线）
npm run docs:dev     # 官方文档本地编写
npm run build        # 库 → dist/
npm run build:example   # 本地冒烟 → example-dist/（禁止部署线上）
```

深链示例：`/base/button` · `/lab/telemetry` · `/biz/users` · `/?design=porsche` · `?lang=ja-JP`

## 使用库

```ts
import 'amg-webui/dist/style.css'
import { Button, BizUsers, ThemeService } from 'amg-webui'
import { TelemetryService, consoleSink } from 'amg-webui/telemetry'

// 可选：显式开启交互观测（默认关闭）
TelemetryService.configure({
  enabled: true,
  appId: 'my-app',
  sinks: [consoleSink()]
})
```

子路径导出见 `package.json` → `exports`：`.` · `./telemetry` · `./theme` · `./icons` · `./components/base` · `./components/business`。

## 近期能力（摘要）

| 能力 | 说明 | 文档 |
|------|------|------|
| **Vp Telemetry** | 默认关闭的交互事件缓冲 + Sink + 习惯/告警/错误分析 | [`docs/TELEMETRY.md`](./docs/TELEMETRY.md) |
| **通用区组件** | Button / Link / Tag / Avatar… + Space / Spin / CopyText / Collapse / Statistic / CardWidgets（ABCD 拖拽互换）等 | example `base` 目录 · catalog |
| **事件契约** | 交互组件旁路 `trackEmit`；业务 `emit` 保留（Badge click、FloatButton openChange、Progress finish…） | TELEMETRY · 各组件 types |
| **工程脚本** | `create:component` · `generate:entry` · `extract:i18n` · `validate:catalog` · `score:maturity` … | [`docs/ENGINEERING.md`](./docs/ENGINEERING.md) |

## 规范文档

| 主题 | 文档 | Cursor 记忆 |
|------|------|-------------|
| **愿景口号** | [`docs/VISION.md`](./docs/VISION.md) | `vue3-amg-webui-vision.mdc` |
| **六大维度深度超车 EP** | [`docs/OVERTAKE_ELEMENT_PLUS.md`](./docs/OVERTAKE_ELEMENT_PLUS.md) | `vue3-amg-webui-overtake.mdc` |
| **总计划（200+ 库必备条件）** | [`docs/LIBRARY_PLAN.md`](./docs/LIBRARY_PLAN.md) | `vue3-amg-webui-library-plan.mdc` |
| **交互观测 Vp Telemetry** | [`docs/TELEMETRY.md`](./docs/TELEMETRY.md) | `vue3-amg-webui-telemetry.mdc` |
| **Theme Studio（自定义主题工具）** | [`docs/THEME_STUDIO.md`](./docs/THEME_STUDIO.md) | `vue3-amg-webui-theme-studio.mdc` |
| **工程脚本 · 性能默认** | [`docs/ENGINEERING.md`](./docs/ENGINEERING.md) | `vue3-amg-webui-engineering.mdc` |
| 目录与包边界 | README / [`packages/README.md`](./packages/README.md) | `vue3-amg-webui-structure.mdc` |
| 布局·密度·卡片·按钮 | [`packages/theme/SPEC.md`](./packages/theme/SPEC.md) | `vue3-amg-webui-design-specs.mdc` |
| 全局视觉·Token·变量 | [`packages/theme/TOKENS.md`](./packages/theme/TOKENS.md) | `vue3-amg-webui-tokens.mdc` |
| 多语言（按钮/标题/提示/错误） | [`packages/locale/I18N.md`](./packages/locale/I18N.md) | `vue3-amg-webui-i18n.mdc` |
| 页面·路由·启动·部署 | [`docs/APP_WORKFLOW.md`](./docs/APP_WORKFLOW.md) | `vue3-amg-webui-app-workflow.mdc` |
| Agent 总入口 | [`AGENTS.md`](./AGENTS.md) | — |
