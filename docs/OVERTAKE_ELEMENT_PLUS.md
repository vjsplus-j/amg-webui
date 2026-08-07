# 对标 Element Plus · 六大维度深度超车（锁定）

> **口号**：对标 Element Plus，超越 Element Plus —— 成为最强的国产 WebUI 库。  
> 原则：**完全避开** Element Plus 常规优化路径，直击其底层硬伤、行业空白、下一代技术赛道。  
> Agent 记忆：`.cursor/rules/00-amg-webui-vision.mdc` · 愿景：`docs/VISION.md`

---

## 超车对照总表

| 赛道 | Element Plus 现状 | amg-webui 独家超车点 |
|------|-------------------|----------------------|
| 编译底层 | 纯运行时、VDOM、样式覆盖困难 | Vapor 无 VDOM 编译、Headless、编译型原子 CSS |
| 业务能力 | 仅基础控件，无业务页面 | 5 大完整业务模块、低代码 Schema、AI 组件套件 |
| 企业适配 | 微前端 / 信创弱、XSS 风险 | 原生微前端隔离、国产化、底层安全拦截 |
| 业务逻辑运行时 | 无独立逻辑单元、Scope 与安全编排协议 | **Skill Runtime**：Unit / Context / Scope、JSON Pipeline、Adapter / Observer，组件源码零依赖 |
| 性能内存 | 泄漏点多、虚拟滚动单一 | 统一资源回收、十万级分片虚拟滚动、跨端自适应 |
| 主题 i18n | 明暗预编译为主、无强类型 | 运行时动态主题、强类型 i18n、RTL |
| 下一代生态 | 无官方 AI / 低代码标准 | 原生 AI 流式组件、官方拖拽低代码预览器 |
| 无障碍 | 浅度适配 | 全组件 A11Y（焦点陷阱、读屏、政务对比度） |

---

## 一、底层编译架构超车

> EP 硬伤：纯运行时、无编译优化、虚拟 DOM 冗余。

### 1. 深度适配 Vue Vapor（无虚拟 DOM）

- **双模式**：Vapor 编译（默认生产）直出原生 DOM，跳过 VDOM —— 表格 / 表单目标 **+40% 渲染、−30% 内存**；保留传统 VDOM 兼容老 Vue3。  
- 列表 / 弹窗 / 表单对 Vapor **专属裁剪**；销毁回收 DOM 引用，根治 Electron 多窗口、EP TableV2 高频销毁内存暴涨。

### 2. 编译时样式系统（结束样式覆盖战争）

三层可切换：

| 模式 | 对象 | 要点 |
|------|------|------|
| 默认主题 | 开箱即用 | `vp-` 前缀 + CSS 变量，无硬编码色 |
| **Headless** | 深度定制 | 仅逻辑 / 键盘 / ARIA，对接 Tailwind / Panda，零覆盖成本 |
| **编译型原子 CSS** | 极致轻量 | 内置 Panda（或等价）编译时原子化，运行时 0 注入，LCP 优、CSS 体积封顶 |

一套组件同时服务「快开」「深定制」「极轻」三类用户 —— EP 只能二选一。

### 3. 组件静态分析编译链 `unplugin-amg-webui`

远超 `unplugin-vue-components` 自动导入：

- 编译期剥离未用逻辑、过滤冗余 props  
- 仅打包页面用到的主题 CSS 变量  
- 自动生成 TS 类型、API 文档、**拖拽低代码 Schema**  

---

## 二、企业级底层基础设施超车

> EP 只做 UI，缺工程底座。

### 1. 微前端隔离（qiankun / wujie 开箱）

`VpConfigProvider`：

- 子应用唯一样式命名空间  
- `$msg` / `$notify` 实例隔离  
- 弹窗 / 下拉挂载**当前子应用根**，不穿透主应用  
- 多子应用独立主题 / 语言  

### 2. 信创 / 国产化全栈

- 麒麟 / 统信浏览器；国产字体；高对比度无障碍  
- 国密表单、水印、留痕、脱敏复合模块  
- **纯离线内网**，无外网 CDN 依赖  

### 3. 安全防护层

- 文本默认 HTML 转义 + 白名单富文本 → **`@amg-webui/security`**（`sanitizeHtml` / `escapeHtml`）
- 链接拦截 `javascript:` / `data:` / `vbscript:` / `file:` → `isSafeHref` / `sanitizeUrl`（`Link` / `Button` / `RichText`）
- 表单过滤脚本与危险字符 → `filterDangerousInput`
- 开发环境安全告警与定位日志 → `SecurityService`
- 文档：[`docs/SECURITY.md`](./SECURITY.md)；example：`lab/security`

### 4. 交互观测内核（Vp Telemetry）

> EP 无此层。AMG 独家：组件 click / 回调 → 可配置结构化日志 → 习惯 / 告警 / 错误分析。

- **默认关闭**（隐私 / 信创 / 离线友好）；`TelemetryService.configure` 或 `TelemetryProvider` 显式开启  
- `trackEmit` 旁路业务 `emit`，失败不影响 UI；未开启近零成本  
- 契约：`interaction` / `alert` / `error` / `lifecycle`（习惯在分析侧聚合）  
- Sink：console / ring buffer / custom transport；无硬编码云后端  
- 组件级：`trackId` · `telemetry=false`（prop 默认必须为 `undefined`，防 Vue Boolean 省略）  
- 分析：`summarizeHabits` · `findAlerts` · `findErrors`  
- 文档：[`docs/TELEMETRY.md`](./TELEMETRY.md)；example：`lab/telemetry`

### 5. Skill Runtime（experimental SR1 / SR2）

> 区别于 ProComponent 与零散 Hooks：不换组件、不侵入组件源码，用独立运行时挂载业务逻辑。

- **SR1 Core**：SkillUnit / SkillContext / Runtime；每次 mount 独立 state / AbortSignal，统一 setup / teardown / dispose。
- **SR2 Compose + Vue**：Scope 显式共享事件与 scope state；Pipeline JSON v1 支持顺序、并行、注册条件、有限重试与 fallback；Vue 提供 `v-skill` / `AmgSkillScope`。
- **安全边界**：条件只引用 `registerCondition()` 注册的受信任谓词，禁止 `eval`、`new Function` 与任意表达式字符串。
- **后端无关**：Adapter 映射外部协议；Observer 只走旁路，失败不改变业务结果。
- **独立可选**：`amg-webui/skill/core` 框架无关，`amg-webui/skill` 包含 Vue 集成；根入口不导出，`npm run build:skill` 独立构建。
- **诚实状态**：当前 SR1 / SR2 为 pre-1.0 experimental；官方 built-ins、Telemetry bridge、DevTools 与 example Skill Lab 属 SR3，仍为 pending。

权威规范：[`docs/SKILL_RUNTIME.md`](./SKILL_RUNTIME.md)。

---

## 三、多主题 / i18n 下一代

### 主题三层

1. Design Token 原子（尺寸 / 圆角 / 阴影 / 动效）  
2. **色阶系统**：`generatePrimaryScale(primary)` → `--primary-50…900` + `--ds-accent` / focus 语义桥（`runtime.setPrimary` / ThemeProvider `primary`）  
3. **运行时 overlay**：`applyCustom`（增量）/ `replaceCustom`（全量，删缺 key）/ Provider `tokens` 热更新 CSS 变量，无需重打包  

运行时分层：Theme Core 多实例 + Host/Storage；`ThemeService` 仅应用默认单例；同页 / 微前端用 `ThemeProvider` · `ConfigProvider` · `useThemeRuntime()`。SSR：`serializeAttrs` + `toStyleTag`；Shadow：`createShadowHost`（host 写 attr/var）。  

诚实限制：Teleport 挂 `body` 可能逃出局部主题根；Shadow 完整品牌 SCSS `adoptedStyleSheets` 未交付。  

附加：主题缓存、无闪屏预加载、分系统主题存储；Theme Studio 可视化（见 `THEME_STUDIO.md`，UI 仍为后续）。

### 强类型 i18n

- TS 约束词条，缺 key **编译失败**  
- 脚本提取 base + 业务模块全文案  
- 校验提示 / 弹窗 / 空状态统一 i18n  
- 远程语言包、自定义语种、**原生 RTL**  

---

## 四、复合业务 + 低代码 + AI（EP 空白 · 核心壁垒）

### 1. 六大业务领域套件（完整页面模板）

登录（账密 / 短信 / 扫码 / 找回 / 三方）· 用户 · 订单全链路 · 内容发布 · 系统设置 · 多租户 —— 均可按需导入，自带 TS / i18n / 主题。

### 2. 低代码 Schema

- 每组件标准化 JSON Schema（物料 `propsSchema` + 注册表）
- Schema 渲染器 `SchemaRenderer` / `CanvasPreview`（`renderMode: component`）
- 拖拽编排：`DragMaterial` + `DragCanvas` + `PropPanel` + `CanvasIo` + undo/redo/clipboard
- Schema → Vue 代码生成：`generateVueSfc`
- 包：`@amg-webui/lowcode`；文档：[`docs/LOWCODE.md`](./LOWCODE.md)；example：`lab/lowcode`
- Skill Pipeline JSON v1 只保存 Skill / 条件注册名与 JSON 配置，为 SR4 可视化编排提供可审计底座；不把代码字符串当低代码协议
- **后续**：完整组件 Schema 目录自动生成、`unplugin-amg-webui`、文档站拖拽器上线
### 3. AI 原生套件（2026 赛道）

- 对话气泡、流式输出、思考骨架  
- AI 填表、智能筛选表、总结卡、代码解释器、AI 配置弹窗  
- `useAI`：流式、打字动画、中断输出  

---

## 五、性能与内存根治

| 能力 | 要求 |
|------|------|
| 统一资源回收 | 弹窗 / 下拉 / 监听 / 定时器 / 滚动 —— 卸载自动清理 |
| 双虚拟滚动 | 轻量万级；高性能分片 **十万级** + 分页结合；列表**默认开** |
| 跨端一套 | PC / 平板 / 大屏 / 移动管理页：软键盘、滚动穿透、触摸长按、大屏密度放大 |

---

## 六、A11Y · 插件核 · 工程护城河

### A11Y

完整 ARIA、键盘导航、弹窗焦点陷阱、读屏播报、高对比度（政务标准）；表格 / 树 / 业务模块也必须过线，禁止「仅按钮有 tab」。

### 插件化内核

可关：图标 / 动画 / i18n / 虚拟滚动 / 微前端；可扩：校验、Token、业务模块；配置分层（基础 / 表单 / 表格 / 业务）互不抢占。Skill Runtime 通过独立 subpath 显式启用，base / business 组件不反向依赖。

### 自动化流水线

一键新建（类型 / 单测 / 样式 / i18n）→ 缺类型 / 语种 / 单测 **阻断打包** → 注释生成 API 文档 → 版本 / CHANGELOG / 双渠道发包 → 组件体积与渲染耗时报告。

---

## 分期落地（与 LIBRARY_PLAN 对齐）

| 阶段 | 超车重点 |
|------|----------|
| P0–P1 | `vp-` Token、列表默认虚拟滚动、统一回收、强类型 i18n、工程脚本 |
| P1–P2 | Headless 出口、`unplugin-amg-webui` 雏形、微前端 ConfigProvider、安全转义层 |
| P2–P3 | 业务套件页模板化、主题运行时色阶、Theme Studio |
| P3–P4 | 低代码 Schema、文档拖拽器、信创离线审计 |
| P4–P5 | Vapor 双模式、原子 CSS 编译链路、AI 套件、A11Y 全过关、性能报告入 CI |

Skill Runtime 采用并行 SR 轨道：**SR1 / SR2 experimental 已进入工程**；SR3（built-ins / Telemetry bridge / DevTools / example）与 SR4（低代码可视化编排）后续推进，不等同于当前完成。

---

## Agent / 开发硬规则

1. **禁止**把路线图写成「抄 EP 组件 API + 换皮」。  
2. 新能力优先对应上表「独家超车点」。  
3. 样式默认 `vp-` + Token；提供 / 演进 Headless；禁止靠 `!important` 堆覆盖。  
4. 列表默认虚拟滚动；弹层销毁必须走统一回收。  
5. 业务模块是产品壁垒，不得弱化为「几个零散 Demo 按钮」。  
6. Skill Runtime 不侵入组件源码；Pipeline 禁止执行字符串代码；Core 不依赖 Vue / Telemetry / 后端。
7. 变更同步本文 + `VISION.md` + `.cursor/rules/00-amg-webui-vision.mdc` + `LIBRARY_PLAN.md` + `SKILL_RUNTIME.md`。
