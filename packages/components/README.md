# packages/components

Vue 3 组件源码。**base** · **industry** · **business** 强制隔离。

```
components/
├── base/          # 纯 UI 原语
├── industry/      # 行业套件（首批：Gbs* GB28181；后续 Onvif / VCR / Video / 404）
├── business/      # login · users · orders · content · settings
└── index.ts       # generate:entry 维护；禁止手改巨型 barrel
```

## base

- 路径别名：`@amg-webui/components/base`
- 类名：`vp-*`（遗留 `p-*` 分批迁移）
- 新组件：`npm run create:component -- base Name`
- **禁止**依赖 business / industry

## industry

- 路径别名：`@amg-webui/components/industry`
- 可消费 base + hooks + theme + utils + locale + telemetry
- **禁止**依赖 business；base **禁止**反向依赖 industry
- 根 kebab 子路径保持稳定（如 `amg-webui/gbs-alarm-modal` → `dist/es/components/industry/...`）
- 新组件：`npm run create:component -- industry Name`
- 首批已迁：catalog `industry` **全部 43 件**（`Gbs*` · `Onvif*` · `Vcr*` · `Video*` · `PTZControl` · `AudioTalk` · `SplitVideoWall` · `*404`）
- base 不再存放行业套件目录；新增行业件一律进 `industry/`

## business

只依赖 base + hooks + theme + utils（+ locale）。调试页在 `example/pages/biz/`，不在本目录放 `*Page.vue`。

## 相关

- Catalog：`example/component-catalog.json`（`npm run validate:catalog`；覆盖 base + industry）
- 成熟度：`npm run score:maturity` · 覆盖：`node scripts/check-coverage.mjs`
- 对外 stub：[`docs/components/`](../../docs/components/) · 深化计划：[`docs/COMPONENT_DEEPEN_PLAN.md`](../../docs/COMPONENT_DEEPEN_PLAN.md)
- Telemetry：[`../telemetry/README.md`](../telemetry/README.md)
- Skill Runtime（独立包，非本目录）：[`../skill/README.md`](../skill/README.md)
