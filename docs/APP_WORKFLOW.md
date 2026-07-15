# example 调试工程规范（锁定）

> Agent：`.cursor/rules/vue3-amg-webui-app-workflow.mdc` · 路由表：`example/router/routes.ts`  
> 文档站索引：[`docs/index.md`](./index.md)

---

## 0. example 与 docs 核心区分（锁定）

| | **example** | **docs** |
|--|----------|----------|
| 定位 | **开发调试工具** | **对外官方文档站点**（VitePress） |
| 受众 | 组件库作者 / 维护者 | 业务开发者（宿主接入方） |
| 使用方式 | **仅本地** `npm run dev` | 打包部署线上查阅 + 本地 `docs:dev` |
| 内容 | 半成品、边界、压测、冗余日志、bug 复现、性能排查 | 简洁标准示例、API 参数、使用教程 |
| 禁止 | 打包部署到线上给业务方当 demo | 放压测页、bug 复现、内部排查链路 |
| 产物 | 无线上产物；`build:example` 仅可选本地冒烟 | 文档站静态产物（可部署） |

三者对照：

| 场景 | 目录 | 职责 |
|------|------|------|
| **组件库** | `packages/` | 可复用 base / business / theme / hooks / utils，**无页面路由** |
| **开发调试** | `example/` | 七大调试专区 · 路由 · mock · **不上线** |
| **官方文档** | `docs/`（VitePress） | API / 教程 / 标准示例 · **可上线** |

---

## 1. example 定位（硬规则）

**Do**

- 本地验证新组件、业务复合、主题、i18n、性能与边界
- 允许半成品页、压测代码、冗余日志、`dev/bug-repro` 复现场景
- 页面薄编排：`@amg-webui/*` + mock + Toast
- 业务 UI 下沉 `packages/components/business/<domain>`；原子 UI 在 `base/`

**Don't**

- **把 example 打包部署到线上**（不是对外 demo 站）
- 把 example / `example-dist` 当 npm 产物或业务文档替代品
- 在 `packages/` 写 router / `*Page.vue` / mock
- 用 `currentPage` 字符串导航；用 `router.push({ name })`
- 把 docs 该有的标准教程只写在 example 里（标准示例应进 docs）

---

## 2. 目录怎么分

```
VUE3-AMG-WEBUI/
├── packages/                 # 库：无路由、无业务 mock 页面
│   ├── components/base/
│   ├── components/business/
│   ├── theme/ · hooks/ · …
├── example/                     # 本地调试（不上线）
│   ├── layouts/ · pages/ · router/
│   ├── components/ · stores/ · mock/
│   ├── main.ts · index.html
├── docs/                     # 对外官方文档（VitePress，可部署）
├── dist/                     # 库产物（npm 发包）
├── example-dist/                # build:example 本地冒烟产物（不部署线上、不入库）
└── …
```

### 2.1 `example/pages/` 七大专区

```
example/pages/
├── auth/                     # 壳层登录门闸（mock，非产品）
├── overview/                 # 调试总览入口
├── base/                     # 一、通用基础组件（Ant 式一组件一页）
│   ├── CatalogPage.vue       # 组件总览 → 点名称进文档页
│   ├── ComponentDocPage.vue  # 动态 /base/:name（curated 或 fallback）
│   └── *Page.vue             # 旧 zone 页保留源码；路由已 redirect → overview
├── demos/                    # curated 演示（Button / FloatButton / Icon …）
├── biz/                      # 二、通用业务复合（一域一页）
│   ├── LoginBizPage.vue
│   ├── UsersBizPage.vue
│   ├── OrdersBizPage.vue
│   ├── ContentBizPage.vue
│   └── SettingsBizPage.vue
├── theme/                    # 三、多主题专项
├── i18n/                     # 四、国际化专项
├── perf/                     # 五、性能与边界
├── lab/                      # 六、底层公共能力
└── dev/                      # 七、开发辅助
```

**base 专区（Ant 式）：** 侧栏按「通用 / 布局 / 导航 / 数据录入 / 数据展示 / 反馈 / 其他 / 行业」分组；`example/component-catalog.json` 全量 **272**；文档骨架见 `DemoBlock` · `PropsTable` · `ComponentDocPage`。旧 zone 路径 redirect 到 `/base/overview`。

通用区（`general`）近期加深：Space · Spin · CopyText · Collapse · Statistic · **CardWidgets**（ABCD DnD）等；交互件可挂 `trackId` / Telemetry。

文件：`XxxPage.vue`（路由级）；`packages` 禁止 `*Page.vue`。

---

## 3. 七大调试专区说明

### 一、通用基础组件（`group: 'base'`）

| 页面 / 路由 | 覆盖 |
|------|------|
| `/base/overview` · `base-overview` | 全量目录检索；点击进入组件文档 |
| `/base/:name` · `base-component` | Ant 式：何时使用 + DemoBlock + Props；Button / FloatButton / Icon 为 curated 标杆；其余 fallback |
| 侧栏分类 | 通用 · 布局 · 导航 · 数据录入 · 数据展示 · 反馈 · 其他 · 行业（`component-catalog`） |
| 旧 zone 路径 | `/base/atoms\|forms\|…` → redirect `base-overview` |

### 二、通用业务复合（`group: 'biz'`）

每业务模块 **独立路由页**，模拟后台完整场景：

| 域 | 场景要点 |
|----|----------|
| login | 多方式登录、验证码、找回密码、校验流程 |
| users | 列表、筛选、详情弹窗、头像、角色权限 |
| orders | 筛选、状态、详情、退款/售后、批量 |
| content | 列表、分类树、富文本、草稿、上下架 |
| settings | 主题面板、语言、账号安全、全局参数 |

**新增业务域**：`packages/components/business/<domain>` + `example/pages/biz/<Domain>BizPage.vue` + `routes.ts` 登记即可。

### 三、多主题专项（`group: 'theme'`）

- 一键切换亮 / 暗与六套官方设计，实时看色彩、阴影、圆角、间距
- 自定义主色 → 衍生色阶 → 全局预览（Theme Studio / Token overlay）
- 持久化、切页无闪屏、多区域主题隔离等边界

### 四、国际化专项（`group: 'i18n'`）

- 全局语种切换（7 语种全量 key）
- 基础内置文案、校验提示、弹窗操作、业务词条同步跟随
- 自定义词条扩展、远程动态加载、RTL / 双向布局预留

### 五、性能与边界（`group: 'perf'`）

- 海量表格 / 超长树下拉 / 无限列表 → 虚拟滚动、分片、内存
- 高频开关弹窗、实时输入、持续滚动 → 泄漏与重复渲染
- 弹窗 / 抽屉 / 路由分包懒加载验证

### 六、底层公共能力（`group: 'lab'`）

- hooks：主题、语言、弹窗、尺寸、表单等单独演示
- utils：日期、树转换、颜色、脱敏等可视化
- a11y：键盘、焦点陷阱、读屏文本、高对比
- 微前端：多实例 / 样式隔离 / 全局方法冲突复现
- **Telemetry**：`/lab/telemetry` — 开关观测、事件流、习惯/告警汇总、导出 JSON（仅本地；见 `docs/TELEMETRY.md`）

### 七、开发辅助（`group: 'dev'`）

- 全局配置：默认尺寸、弹窗行为、表单校验规则批改
- 扩展演示：插槽、自定义渲染、二次封装示例
- 问题复现：迭代 bug / 边界场景，供回归

---

## 4. 路由怎么写

### 4.1 单一路由表

全部写在 **`example/router/routes.ts`**。导航只用 `name`。

### 4.2 `meta.group`（侧栏七组 + overview）

| group | 专区 |
|-------|------|
| `overview` | 调试总览 |
| `base` | 通用基础 |
| `biz` | 业务复合 |
| `theme` | 多主题 |
| `i18n` | 国际化 |
| `perf` | 性能边界 |
| `lab` | 公共能力 |
| `dev` | 开发辅助 |

其他 meta：`title` · `titleKey` · `public` · `requiresAuth` · `icon` · `tab`。

### 4.3 路径约定

| 专区 | path 前缀 | name 示例 |
|------|-----------|-----------|
| base | `/base/overview` · `/base/:Name` | `base-overview` · `base-component`（tab id `base:Name`） |
| biz | `/biz/login\|users\|orders\|content\|settings` | `biz-*` |
| theme | `/theme` · `/theme/custom` | `theme` · `theme-custom` |
| i18n | `/i18n` | `i18n` |
| perf | `/perf/massive\|high-frequency\|lazy` | `perf-*` |
| lab | `/lab/hooks\|utils\|a11y\|micro-fe\|telemetry` | `lab-*` |
| dev | `/dev/config\|extensibility\|bug-repro` | `dev-*` |

主题查询：`?design=linear`（`main.ts` → ThemeService）。语种：`?lang=ja-JP`。

### 4.4 守卫

- `public` → 已登录可去默认页（`dashboard`）
- `requiresAuth` → 未登录 → `login` + `redirect`
- 切页：`document.title`；壳层 `ensureTab(route.name)`

---

## 5. 启动与构建

### 5.1 命令

```bash
npm install
npm run dev          # example：仅本地调试（不上线）
npm run docs:dev     # docs：本地写官方文档
npm run build        # 库 → dist/（npm 发包）
npm run build:example   # 可选：本地冒烟构建 example → example-dist/（禁止部署线上）
# docs 构建：vitepress build docs（对外站点部署用此产物，勿部署 example）
```

Node ≥ 18。example Boot：Font → IconStyle → Theme → URL → app + router。

### 5.2 产物勿混

| 产物 | 命令 | 输出 | 部署？ |
|------|------|------|--------|
| 组件库 | `npm run build` | `dist/` | npm / 私服 **是** |
| 官方文档 | `vitepress build docs` | docs 产物目录 | 文档站 **是** |
| example 冒烟 | `npm run build:example` | `example-dist/` | **否**（本地-only） |

禁止 example mock 泄漏进 packages；禁止用 example 代替 docs 对外。

---

## 6. 页面模板骨架

```vue
<script setup lang="ts">
// 只从 @amg-webui/* 引库；mock / store / router 来自 example
</script>

<template>
  <div class="page">
    <header class="ln-page-hero">…</header>
    <!-- base / Biz* 组件编排 -->
  </div>
</template>
```

服从 `packages/theme/SPEC.md`（hero → 内容；内容区不造 Tabs 壳）。

---

## 7. 变更流程

1. 改约定先改本文 + `vue3-amg-webui-app-workflow.mdc` + `docs/workflow.md`
2. 新调试页 → `example/pages/<zone>/` + `routes.ts` + 侧栏 `group`
3. 新业务域 → business 包 + `biz/*BizPage.vue` + 路由
4. 同步 `AGENTS.md` / structure rule 若影响分层叙述
