# example ↔ docs

权威全文：[APP_WORKFLOW.md](./APP_WORKFLOW.md)（§0 核心区分）

| | **example** | **docs** |
|--|----------|----------|
| 是什么 | 开发调试工具 | 对外官方文档站（VitePress） |
| 给谁用 | 库作者 | 业务开发者 |
| 环境 | **仅本地** `npm run dev` | 可打包部署线上 + `docs:dev` |
| 允许 | 半成品、压测、日志、bug 复现、边界/性能排查 | 标准示例、API、教程 |
| 禁止 | 部署线上当 demo | 压测 / bug 复现页 |

## example 七大专区

| 专区 | 目录 | group |
|------|------|-------|
| 通用基础 | `example/pages/base/` | `base` |
| 业务复合 | `example/pages/biz/` | `biz` |
| 多主题 | `example/pages/theme/` | `theme` |
| 国际化 | `example/pages/i18n/` | `i18n` |
| 性能边界 | `example/pages/perf/` | `perf` |
| 公共能力 | `example/pages/lab/`（含 `/lab/telemetry`） | `lab` |
| 开发辅助 | `example/pages/dev/` | `dev` |

## 常用命令

- example：`npm run dev`（本地-only）
- docs：`npm run docs:dev` · 部署用 VitePress build
- 库：`npm run build` → `dist/`
- `build:example` → `example-dist/` 仅本地冒烟，**不上线**
