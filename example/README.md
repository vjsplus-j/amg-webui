# example/

**本地开发调试壳** —— 给库作者用，**禁止部署上线**（产物 `example-dist/` 同样不上线）。

对外文档站是仓库根下的 VitePress：`docs/` · `npm run docs:dev`。

## 启动

```bash
npm run dev          # vite.example.config.ts · 默认 localhost:5173
npm run build:example   # 本地冒烟 → example-dist/（勿当官网）
```

可选：`?design=linear` · `?lang=ja-JP`

## 七大专区 + 入门（`meta.group`）

| group | 路径示例 | 用途 |
|-------|----------|------|
| overview | `/` · dashboard | 调试总览 |
| intro | `/intro/quick-start` · design · theme · font · icon | 快速入门与设计/主题/字体/图标介绍 |
| base | `/base/overview` · `/base/:name` | Ant 式组件目录 + DemoBlock |
| biz | `/biz/users` … | 五大业务页 |
| theme | `/theme` · `/theme/custom` | 六套主题 + Theme Studio |
| i18n | `/i18n` | 多语言专项 |
| perf | `/perf/*` | 压测 / 泄漏（仅 example） |
| lab | `/lab/hooks` · `/lab/telemetry` … | hooks / utils / a11y / 微前端 / **Telemetry** |
| dev | `/dev/*` | 配置、扩展、bug 复现 |

路由表唯一源：`example/router/routes.ts`（按 `name` 导航）。

## 目录

```
example/
├── pages/           # *Page.vue
├── demos/           # curated 演示（Button / CardWidgets / CopyText …）
├── layouts/         # AppShell（倒 L）
├── router/
├── stores/          # auth mock
├── mock/
├── component-catalog.json
└── main.ts
```

## 约定

- 半成品 / 压测 / bug 复现 **只放 example**，勿迁入 `docs/`
- 文案 / 色值 / 尺寸禁止硬编码（同库规则）
- 组件实现在 `packages/`；本目录只写薄页面与演示
- **Demo 铺满：** `DemoBlock` / `DemoCode` / curated 演示横向铺满内容区，勿套 `max-width` 阅读栏或给代码区加 `max-height` 嵌套滚动（见 `.cursor/rules/vue3-amg-webui-example-demo-layout.mdc`）

详见 [`docs/APP_WORKFLOW.md`](../docs/APP_WORKFLOW.md)。
