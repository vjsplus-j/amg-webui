# packages/components

Vue 3 组件源码。**base** 与 **business** 强制隔离。

```
components/
├── base/          # 纯 UI · 目录库存 ~280+（含行业扩展；库存 ≠ 成熟度）
├── business/      # login · users · orders · content · settings
└── index.ts       # generate:entry 维护；禁止手改巨型 barrel
```

## base

- 路径别名：`@amg-webui/components/base`
- 类名：`vp-*`（遗留 `p-*` 分批迁移）
- 新组件：`npm run create:component -- base Name`
- Provider 类：`TelemetryProvider`（配置遥测，后续可并入 `VpConfigProvider`）

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

只依赖 base + hooks + theme + utils（+ locale）。调试页在 `example/pages/biz/`，不在本目录放 `*Page.vue`。

## 相关

- Catalog：`example/component-catalog.json`（`npm run validate:catalog`）
- 成熟度：`npm run score:maturity`（v2：**capability** thin/form/interaction/composite 为主，目录数不是成熟度）· 覆盖：`node scripts/check-coverage.mjs`
- 对外 stub：[`docs/components/`](../../docs/components/) · 深化计划：[`docs/COMPONENT_DEEPEN_PLAN.md`](../../docs/COMPONENT_DEEPEN_PLAN.md)
- Telemetry：[`../telemetry/README.md`](../telemetry/README.md)
- Skill Runtime（独立包，非本目录）：[`../skill/README.md`](../skill/README.md)
