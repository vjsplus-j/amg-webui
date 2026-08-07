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
| theme | `/theme` · `/theme/custom` | 官方主题（含 WeChat / Alipay）+ Theme Studio |
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

## AppShell chrome（倒 L）

| 区域 | 实现 | 约定 |
|------|------|------|
| 侧栏品牌 | `layouts/AppShell.vue` `#header` | VP 标 + 名称；收起仅标 |
| 侧栏筛选 | 品牌下 `Search` | **无「筛选组」可见标题**；`aria-label` + placeholder 走 `example.doc.catalog.navFilter*` |
| 侧栏菜单 | `Menu` + `component-catalog` / routes | 按 `meta.group` 与 catalog 分类 |
| 窄屏导航 | 顶栏菜单按钮 + 左侧 `Drawer` | `≤768px` docked 侧栏隐藏；Drawer 内复用筛选 / Menu / 用户区，点选或换路由后关闭 |
| 顶栏 actions | `components/AppHeaderActions.vue` | 搜索 / 语种 / design / 明暗 / **LTR·RTL 方向** / 图标描边 / 字体；窄屏按断点隐藏 |
| 顶栏溢出 | `.header-actions` | 允许横向平移，**不展示原生滚动条轨道**（避免误读成进度条） |
| 语种 vs 方向 | `LocaleService` | **解耦**：`?lang=` 只换文案；`?dir=rtl\|ltr` / 顶栏方向钮控制镜像；阿语不自动 RTL |
| 右键菜单 | `AppContextMenu` | 系统风格菜单；仅：复制 / 粘贴 / 选择 / 全选 / 检查；组件 Demo 的 `ContextMenu` 优先 |

## 约定

- 半成品 / 压测 / bug 复现 **只放 example**，勿迁入 `docs/`
- 文案 / 色值 / 尺寸禁止硬编码（同库规则）
- 组件实现在 `packages/`；本目录只写薄页面与演示
- **Demo 铺满：** `DemoBlock` / `DemoCode` / curated 演示横向铺满内容区，勿套 `max-width` 阅读栏或给代码区加 `max-height` 嵌套滚动（见 [`docs/APP_WORKFLOW.md`](../docs/APP_WORKFLOW.md) § Demo 铺满）
- curated 注册表：`demos/registry.ts`（与 `demos/*/index.vue` 目录对齐）

详见 [`docs/APP_WORKFLOW.md`](../docs/APP_WORKFLOW.md) · 工程脚本 [`docs/ENGINEERING.md`](../docs/ENGINEERING.md)。
