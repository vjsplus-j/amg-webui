# AMG-WebUI 大型组件库计划（锁定）

> **口号**：对标 Element Plus，超越 Element Plus —— 成为最强的国产 WebUI 库。  
> 愿景：`docs/VISION.md` · **深度超车**：`docs/OVERTAKE_ELEMENT_PLUS.md` · 记忆：`vue3-amg-webui-vision.mdc` · `vue3-amg-webui-overtake.mdc`  
> 目标：强大齐全 + 高性能的 Vue 3 UI 库（200+ 组件、多主题、多语言、业务复合模块）  
> Agent 记忆：`.cursor/rules/vue3-amg-webui-library-plan.mdc`  
> 状态：规划基线（与当前骨架对齐，分期落地）  
> 包边界：`packages/README.md` · 组件：`packages/components/README.md` · 遥测：`packages/telemetry/README.md`

---

## 近期落地（2026-07 · 摘要）

| 项 | 状态 |
|----|------|
| `@amg-webui/telemetry` 交互观测内核 | ✅ 默认关闭 · Provider · Sink · analyze · example `lab/telemetry` |
| 通用 catalog 加深 | ✅ Space / Spin / CopyText / Collapse / Statistic / CardWidgets（DnD）等入 `general` |
| 交互 emit 契约 | ✅ Badge / FloatButton / Progress / Collapse / Statistic / Ellipsis / CopyText 等补齐 |
| 工程护栏 | ✅ `validate:catalog` · `score:maturity` · `generate:icons` · `vue-tsc` 完成必验 |
| base 目录规模 | ✅ catalog **272** 组件目录（含行业扩展；成熟度不齐，持续 deepen） |

权威遥测文档：`docs/TELEMETRY.md`。

---

## 对标超车总原则

**避开** Element Plus「加组件 / 改 SCSS」常规优化；直击其 VDOM / 样式战争 / 无业务套件 / 微前端与信创薄弱 / 内存与虚拟滚动短板 / 无 AI·低代码标准等硬伤。  
落地条目一律对照 `docs/OVERTAKE_ELEMENT_PLUS.md` 六大维度。

---

## 核心优先级（自上而下）

1. **底层架构**：TS 分层、Token、`vp-` 前缀隔离  
2. **性能体系**：列表默认虚拟滚动、深度 Tree-Shaking、泄漏防护、更小包体积  
3. **功能闭环**：通用组件 + 5 大业务模块 + 多主题 + **Theme Studio** + i18n  
4. **工程自动化**：一键新建组件、自动入口、批量 i18n 提取、测试 / 文档  
5. **视觉质感**：现代产品感，差异化传统后台  
6. **兼容扩展 / 合规上架**：SSR、多构建、SemVer、商标风险  

---

## 一、底层架构（根基 · 决定上限）

### 必备要素

| 项 | 要求 |
|----|------|
| TypeScript 强类型 | 全组件 / hooks / 工具 / 主题 / i18n 输出完整 `.d.ts`；严格 Props；泛型组件（Table / Select / Tree）；统一导出全局类型 |
| 分层解耦 | **原子 base** 纯 UI、不耦合业务；**business** 只依赖 base；样式 / 逻辑 / 类型 / 测试隔离；模块不互相循环 |
| 可插拔 | 按需引入；主题 / i18n / 图标 / 动画可单独引入或移除；CDN 全量 · ESM 按需 · CJS 三种用法 |
| 设计 Token | 颜色 / 间距 / 圆角 / 阴影 / 字号全部 Token 化（见 `packages/theme/TOKENS.md`），禁止硬编码 |

### 必须解决

- 200+ 组件依赖混乱 / 循环导入 → **脚本自动生成入口**、拆分子包  
- TS 类型丢失、泛型提示差 → 通用泛型基类 + 统一 Props 导出规范  
- 业务耦合 / 冗余 → **单向依赖**：business 只可 import base（及 hooks / theme / utils）  

### 与现状对齐

- 已有：`packages/components/base` · `business` · `@amg-webui/*` 别名 · Token / SPEC · **`@amg-webui/telemetry`** · `generate:entry` / `create:component` / `extract:i18n`  
- 通用原子加深中：Button / Link / Tag / Avatar / Typography / CardWidgets / CopyText …（见 catalog `general`）  
- 待补：完整 `.d.ts` 流水线、子包拆分、`vp-` 前缀全面落地、列表虚拟滚动默认铺全、Theme Studio 对标 designmd 全能力  

---

## 二、功能完整性

### 1. 通用基础能力

1. **原子 / 通用**：按钮、链接、标签、徽标、头像组、图标、分割线、Typography / Ellipsis、**CopyText**、**Space**、**Spin**、骨架、空状态、**Collapse**、**Statistic**、Progress、**CardWidgets**（可拖互换卡片槽）…  
2. **表单体系**：数字 / 日期 / 级联 / 树选 / 上传 / 富文本 / 校验 / 联动 / 动态表单项  
3. **数据展示**：表格（虚拟滚动 / 合并 / 树表 / 筛选排序）、树、分页、描述、卡片、时间线、日历  
4. **反馈**：弹窗、抽屉、消息、通知、警告、加载、骨架、结果页  
5. **导航布局**：菜单、标签页、面包屑、步骤、下拉、栅格、弹性、分栏、自适应容器  
6. **第三方封装**：图预览、文件预览、Excel、打印、裁剪、图表容器  
7. **企业基建（独家）**：**Vp Telemetry** 交互观测（默认关）· 微前端 ConfigProvider 规划 · 信创/离线（见 OVERTAKE）  

### 2. 五大业务复合模块（锁定）

`login` · `users` · `orders` · `content` · `settings`  

每模块：完整表单 + 筛选 + 列表 + 详情弹窗；插槽 / render / 属性透传可定制。

### 3. 多主题（硬性）

- 亮 / 暗 + designmd 六套锁定主题；运行时切换无刷新  
- 自定义主色 / 辅色 / 圆角 / 尺寸；变量可导出覆写  
- **无样式污染**：统一 **`vp-` 前缀**（规避 Element Plus / PrimeVue 冲突）  
- **自定义主题生成工具（Theme Studio）**：对标 [designmd Build / Custom Remix](https://designmd.santiagoalonso.com/build?cat=Dev+Tools%2CSaaS&sort=popular)  
  - 活预览 Palette / Type / Button / Form / Card / Elevation / Alert / Table / Nav…  
  - 导出 `theme.ts` · CSS 变量 · SCSS；`ThemeService.applyCustom` 无刷新应用  
  - 权威说明：`docs/THEME_STUDIO.md` · 记忆：`vue3-amg-webui-theme-studio.mdc`  

### 3.1 视觉质感（差异化传统后台）

- **要**：产品级表面层次、有目的字阶、克制动效与阴影、壳层 / 内容分工清晰  
- **不要**：死灰厚框 ERP 脸、首屏堆满仪表盘卡片、紫渐变套壳、组件内硬编码色值尺寸  
- 落实：Theme Studio + SPEC/TOKENS；example 展台与文档视觉随基线升级  

### 4. 国际化

- 已内置语种基线：`zh-CN` · `zh-TW` · `en-US` · `ja-JP` · `ko-KR` · `ko-KP` · `ru-RU`（可无限扩展）  
- 组件文案托管语言包，禁止硬编码；`useLocale`；动态切换 + 本地缓存  
- 见 `packages/locale/I18N.md`（含中英长度膨胀防 `…`）  

### 5. 配套工具

全局 hooks、DOM、颜色转换、日期、树结构、防抖节流、权限、水印、复制文本。

### 必须解决（功能）

| 问题 | 对策 |
|------|------|
| API 碎片化 | 统一：弹窗 `visible`、表单 `modelValue`、尺寸 `sm/md/lg` |
| 主题闪屏 / 变量失效 | CSS 变量运行时覆盖；预加载主题样式 |
| i18n 词条分散 | 脚本批量提取 → 一键生成多语言模板 |
| 业务模块不灵活 | 插槽 + render + attrs 透传 |

---

## 三、高性能（默认更强）

### 必备方案

- **列表默认虚拟滚动**：DataTable / Tree / Select 下拉 / 无限列表 / 可滚动菜单 —— **默认开启**，仅显式 prop 可关闭并写进文档警告  
- **组件**：`v-memo` / `computed`；弹窗抽屉懒渲染；图/图标懒加载  
- **深度 Tree-Shaking**：标准 ESM、`sideEffects` 诚实声明；组件级 SCSS 可拆；图标按需；禁止「胖 barrel」拖死体积  
- **更小打包体积**：runtime / 组件 / 样式分离；消费方提供 unplugin-vue-components（或等价）解析器  
- **渲染**：浅层响应式大列表；滚动/resize 节流；批量 DOM 更新  
- **内存**：`onUnmounted` 解绑；虚拟列表回收 DOM  

### 必须解决（性能）

| 痛点 | 对策 |
|------|------|
| 全量包膨胀 | 深度 tree-shake + 按需插件 + 拆样式 |
| 大数据表格卡顿 | **默认**虚拟滚动 + 分页分片 |
| 监听泄漏 | 统一销毁清理封装 |
| 主题切换卡顿 | CSS 变量换肤，禁整树 class 重渲染 |

---

## 四、工程化基建

### 必备工具链

| 域 | 内容 |
|----|------|
| 构建 | Vite：全量 / ES / 主题 / 类型分层脚本（`build/`） |
| 脚本 | 见 `docs/ENGINEERING.md`：`create:component` · `generate:entry` · `extract:i18n` · `validate:catalog` · `score:maturity` |
| 质量 | ESLint + Prettier；Vitest 单测；E2E（表 / 弹 / 表单） |
| 调试 | `example/` 独立热更预览 + Theme Studio |
| 文档 | VitePress：预览、API 表、主题 / i18n / Studio 教程 |

### 必须解决（工程）

- 入口遗漏 → **`npm run generate:entry`** 扫描生成  
- 新建低效 → **`npm run create:component`** 一键骨架（`vp-`、types、style、测试/文档桩）  
- 词条漂移 → **`npm run extract:i18n`** 批量提取并补齐全部语种模板  
- 打包慢 / 冗余 → 增量 / 分层只编变更组件  
- 回归 → 新组件强制单测模板  
- 文档漂移 → 注释解析生成 API 表  

---

## 五、兼容与扩展

### 环境

- Vue 3（Composition 优先，兼容 Options）  
- Vite / Webpack / Vue CLI；Chrome / Firefox / Safari / Edge + 移动端  
- SSR（Nuxt3）：禁裸 `window`/`document`，统一环境判断 hooks  

### 扩展

- Props / 插槽 / 事件透传；全局配置（尺寸、主题、语言、弹窗默认）  
- 插件化：`$msg` / `$notify` 等；业务侧 Token 覆写无需改库源码  

### 必须解决（兼容）

- SSR 报错 → 环境判断工具  
- Vite/Webpack 按需差异 → 标准 ESM 产物统一  
- 全局样式冲突 → `vp-` 前缀 + 合理选择器权重  

---

## 六、长期稳定与商用上架

| 项 | 要求 |
|----|------|
| 版本 | SemVer；完善 CHANGELOG + 破坏性变更迁移指南 |
| 错误 | 开发环境友好告警 |
| 协议 | MIT（公开上架） |
| 样式 | `vp-` 隔离；文档声明与 PrimeVue **无关联** |
| 商标 | 公开 npm：**评估改名**规避 PrimeTek；私有包强制 `vp-` |
| 依赖 | `peerDependencies` 合理锁定 Vue 范围 |

---

## 分期落地建议（执行顺序）

| 阶段 | 重点 | 验收 |
|------|------|------|
| P0 地基 | Token · `vp-` · base/business · i18n · example | 可 dev / build |
| P0.5 视觉与 Studio 骨架 | 现代质感基线；Theme Studio 页 + Token 导出契约 | 对照 designmd 能力可走通主路径 |
| P1 性能与包形 | **列表默认虚拟滚动**、深度 Tree-Shake、按需插件、销毁清理 | 万级表流畅；按需体积明显更小 |
| P1.5 工程脚本闭环 | create / generate:entry / extract:i18n 进 CI | 漏入口 / 漏语种被拦住 |
| P2 组件扩容 | 统一 API 补齐通用清单 | 文档有页 |
| P3 业务深化 | 五模块插槽化闭环 | 可替换子区域 |
| P4 工程 / 文档 | Vitest/E2E、VitePress API 表 | CI 绿 |
| P5 上架就绪 | SSR、迁移指南、商标决策 | 可发版 |

---

## 关联文档

| 主题 | 文档 |
|------|------|
| 愿景口号 | `docs/VISION.md` |
| **深度超车 EP** | `docs/OVERTAKE_ELEMENT_PLUS.md` |
| 目录边界 | `README.md` · structure rule |
| Token / 变量 | `packages/theme/TOKENS.md` |
| 布局密度 | `packages/theme/SPEC.md` |
| i18n | `packages/locale/I18N.md` |
| 路由 / 启停 / 部署 | `docs/APP_WORKFLOW.md` |
| Theme Studio | `docs/THEME_STUDIO.md` |
| 工程脚本 · 性能包形 | `docs/ENGINEERING.md` |
| **Vp Telemetry** | `docs/TELEMETRY.md` |
| 本计划入口 | `docs/plan.md` |
| 近期变更札记 | `docs/CHANGELOG.md` |
