# packages/components

Vue 3 组件源码。按**包边界**隔离；行业扩展不得进入 core。

```
components/
├── core/          # @amg-webui/core — 真正的 UI 原语
├── form/          # @amg-webui/form
├── data/          # @amg-webui/data
├── overlay/       # @amg-webui/overlay（浮层 UI；内核在 packages/runtime）
├── charts/        # @amg-webui/charts
├── editor/        # @amg-webui/editor
├── media/         # @amg-webui/media（opt-in）
├── gb28181/       # @amg-webui/gb28181（opt-in）
├── onvif/         # @amg-webui/onvif（opt-in）
├── business/      # @amg-webui/business — login · users · orders · content · settings
├── base/          # 废弃薄入口：仅 re-export core
├── internal/      # 包内共享实现（非公开 API）
└── index.ts       # foundation + business；不含行业三包
```

Lowcode Vue UI（`SchemaRenderer` / `Canvas*`）在 `packages/lowcode/ui/`，由 `@amg-webui/lowcode` 导出。

归属 SSOT：`scripts/component-package-map.mjs`（`npm run generate:entry` / `check:boundaries`）。

## foundation

| 包 | 别名 | 要点 |
|----|------|------|
| core | `@amg-webui/core` | Button / Icon / Layout / Empty / `*404` / Providers… |
| form | `@amg-webui/form` | Form / Input* / Select / Upload / Date*… |
| data | `@amg-webui/data` | DataTable / Tree / Pagination / Dashboard… |
| overlay | `@amg-webui/overlay` | Dialog / Drawer / Message* / Toast… |

- 类名：`vp-*`
- 新组件：`npm run create:component -- <core|form|data|overlay|…> Name`
- **禁止** foundation import `@amg-webui/{gb28181,onvif,media}`

### 通用区（example catalog `general`）

| 组件 | 要点 |
|------|------|
| Button / Link / Tag / Badge / Avatar* / Card / FloatButton | 交互 + `trackEmit` |
| Typography / Ellipsis / Progress / Statistic | 展示 + 关键回调/遥测 |
| Space / Spin / Skeleton / Divider / Empty / Highlight / Icon | 展示/布局为主 |
| **CopyText** | 独立复制控件；`copy` / `copyError` |
| **Collapse** | 轻量折叠；`expand` / `collapse` |
| **CardWidgets** | ABCD 槽位 HTML5 DnD 互换；`v-model` 顺序；`swap` / `change` |

## business

只依赖 foundation + hooks + theme + utils（+ locale）。调试页在 `example/pages/biz/`，不在本目录放 `*Page.vue`。

## 行业包（opt-in）

`media` · `gb28181` · `onvif` — 显式 `import from '@amg-webui/…'`；**不进根 barrel**。基础库不知道 GB28181。

## 相关

- Catalog：`example/component-catalog.json`（`npm run validate:catalog`）
- 成熟度：`npm run score:maturity`（v2：**capability** thin/form/interaction/composite 为主，目录数不是成熟度）· 覆盖：`node scripts/check-coverage.mjs`
- 对外 stub：[`docs/components/`](../../docs/components/) · 深化计划：[`docs/COMPONENT_DEEPEN_PLAN.md`](../../docs/COMPONENT_DEEPEN_PLAN.md)
- Telemetry：[`../telemetry/README.md`](../telemetry/README.md)
- Skill Runtime（独立包，非本目录）：[`../skill/README.md`](../skill/README.md)
