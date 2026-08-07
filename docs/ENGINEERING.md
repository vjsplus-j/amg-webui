# 工程自动化脚本（锁定）

> Agent 记忆：`.cursor/rules/vue3-amg-webui-engineering.mdc`  
> 总计划：`docs/LIBRARY_PLAN.md` § 工程 · 性能  
> 遥测内核：`docs/TELEMETRY.md`
> Skill Runtime：`docs/SKILL_RUNTIME.md`（experimental SR1 / SR2）

---

## npm 脚本

| 命令 | 作用 |
|------|------|
| `npm run create:component -- core Foo` | 一键新建 foundation/行业包组件骨架（`vp-`、types、style、桩；写入 `component-package-map`） |
| `npm run create:component -- business bar` | 一键新建 business 模块骨架 |
| `npm run generate:entry` | 按包扫描并生成 `core/form/data/…` 与 legacy `base→core` barrel |
| `npm run check:boundaries` | foundation 不得 import `gb28181/onvif/media`；core barrel 不得导出行业符号 |
| `npm run generate:locale-types` | 从 zh-CN 生成 `LocaleKey` / `LocaleMessages`（`message-schema.ts`） |
| `npm run extract:i18n` | 重生 schema + 校验全部语种 key 对齐 + `LocaleKeys` 叶子 ⊆ zh-CN（缺 key / 不对齐 = 失败） |
| `npm run check:dist` | `build:lib` 后校验：on-demand `@amg-webui` 改写、六品牌 `dist/themes/*.css`、`dist/runtime`、粗粒度体积预算 |
| `npm run generate:icons` | 刷新图标目录 / 解析表 |
| `npm run validate:catalog` | 校验 `example/component-catalog.json` ↔ 映射组件覆盖 |
| `npm run score:maturity` | 组件**开发盘点**启发式（能力档 thin/form/interaction/composite + 深度 stub→ready；**≠** 产品质量证书） |
| `npm run sync:example-zones` | 同步 example 专区侧栏 / 区域元数据 |
| `npm run generate:vitepress-api` | 根据 `types.ts` 生成 / 刷新 docs 组件 API stub |
| `node scripts/classify-mvp.mjs` | 深化波次清单 → `scripts/.component-waves.json` |
| `node scripts/check-coverage.mjs` | catalog / base 目录覆盖核对 |
| `npm run build` / `build:lib` | **full**：主库 ESM+UMD+css+dts → `dist/`，再编 **runtime 分包**、on-demand、skill、theme，并 `generate:exports` |
| `npm run build:runtime` | **runtime**：`telemetry` / `security` / `lowcode` / **`runtime`（Overlay 内核）** / `icons` / `hooks` / `utils` / `locale` / … → `dist/<pkg>/`（preserveModules） |
| `npm run build:ondemand` | **on-demand**：多入口 ESM → `dist/es/**`；外部依赖改写为 `amg-webui/*` |
| `npm run build:themes` | **multi-theme**：六品牌 CSS → `dist/themes/<brand>.css` |
| `npm run build:dts` | **dts**：仅刷新类型 → `dist/**/*.d.ts`（不重打 JS/CSS） |
| `npm run build:skill` | 仅构建独立 Skill Runtime → `dist/skill/`（ESM + CJS + `.d.ts`） |
| `npm run build:theme` | 仅构建主题运行时包 → `dist/theme/`（`index` / `core` + `style.css`） |
| `npm run generate:exports` | 扫描组件 + runtime 树，重写 `package.json` `exports` / `files`（**仅 dist**） |
| `npm run test:consumers` | `npm pack` → 安装进 `tests/consumer-{vite,webpack,nuxt}` 并 `build` |
| `npm run build:example` | example 本地冒烟 → `example-dist/`（**不上线**） |
| `npm run docs:dev` / `docs:build` | 官方文档站本地编写 / **可部署**构建 |
| `npm run test` | Vitest |
| `npm run dev` | example 热更（`vite.example.config.ts`） |

类名前缀新组件统一 **`vp-`**（遗留 `p-` 分批迁移）。

---

## 包别名（Vite / tsconfig）

| 别名 | 指向 |
|------|------|
| `@amg-webui/core` · `form` · `data` · `overlay` | `packages/components/{core,form,data,overlay}` |
| `@amg-webui/charts` · `editor` | `packages/components/{charts,editor}` |
| `@amg-webui/media` · `gb28181` · `onvif` | `packages/components/{media,gb28181,onvif}`（行业 opt-in） |
| `@amg-webui/business` · `components/business` | `packages/components/business` |
| `@amg-webui/components/base` | **废弃**：仅再导出 `core` |
| `@amg-webui/telemetry` | `packages/telemetry/index.ts`（**写死到文件**，避免目录解析双实例） |
| `@amg-webui/security` | `packages/security/index.ts` |
| `@amg-webui/lowcode` | `packages/lowcode`（引擎 + `ui/`） |
| `@amg-webui/runtime` | `packages/runtime/index.ts` |
| `@amg-webui/skill` | `packages/skill/index.ts`（Core + Vue 集成） |
| `@amg-webui/skill/core` | `packages/skill/core.ts`（框架无关） |
| `@amg-webui/theme` | `packages/theme/index.ts`（本地）；发包 → `dist/theme` |
| `@amg-webui/theme/core` | `packages/theme/core.ts`（无 DOM Core） |
| `@amg-webui/hooks` · `locale` · `icons` · … | 对应 `packages/*` |

`package.json` `exports`（由 `generate:exports` 维护）暴露：`.` · `./button` 等 kebab 组件 · `./core` · `./form` · `./data` · `./overlay` · `./charts` · `./editor` · `./media` · `./gb28181` · `./onvif` · `./business` · `./telemetry` · `./security` · `./lowcode` · `./runtime` · `./skill` · `./skill/core` · `./theme*` · `./icons` · `./hooks` · `./utils` · `./locale` · `./components/base`（legacy→core）· `./components/business` · `./es/*` · `./themes/*`。

**根 barrel 不导出行业三包**（`media` / `gb28181` / `onvif`）与 `charts` / `editor` — 须显式子路径导入。归属 SSOT：`scripts/component-package-map.mjs`；CI 含 `check:boundaries`。

**全部公共子路径必须指向 `dist/**` 编译产物**（JS + `.d.ts`；样式走 `style.css` / `theme/style.css`）。禁止再把 `packages/**/*.ts` 写进 `exports`。`files` 仅含 `dist` + 合同文档。

On-demand / runtime 构建把内部 `@amg-webui/*` **改写**为消费者可解析的 `amg-webui/*`，并 external peers（`vue` · `@lucide/vue`）与已发布子路径；不再把「只有 monorepo alias 才能解析」的 import 留在产物里。

Skill / Theme 的 subpath 指向 `dist/skill/` · `dist/theme/` 独立产物；根入口 `packages/index.ts` **禁止** re-export Skill。Theme 根入口可再导出服务，但 SSR / 微前端应优先 `theme/core`。

Consumer 门禁：`tests/consumer-vite` · `tests/consumer-webpack` · `tests/consumer-nuxt` + `npm run test:consumers`（CI verify job）。这是包契约冒烟，不是成熟度算法 / E2E 深度验收。Overlay 内核见 `docs/OVERLAY.md`（发包后须存在 `dist/runtime` + `package.json` `./runtime`；`build:runtime` 后跑 `generate:exports` / `build:dts`）。

---

## CI 覆盖（诚实口径）

Workflow：`.github/workflows/ci.yml`。

| Job / 步骤 | 已覆盖 | 说明 |
|------------|--------|------|
| Typecheck / Catalog / Barrel sync | ✅ | 与本地 `vue-tsc` · `validate:catalog` · `generate:entry` 一致 |
| i18n key sync | ✅ | `extract:i18n` + `message-schema.ts` drift fail |
| Unit + `test:ssr` | ✅ | SSR 为 **无 DOM import / theme-core** 冒烟，**≠** Nuxt hydration 全矩阵 |
| `build:lib` + `check:dist` | ✅ | 隐式含 on-demand / multi-theme；`check:dist` 显式断言产物 + 粗体积预算 |
| `test:consumers` | ✅ | vite / webpack / **nuxt 构建**冒烟；**≠** 生产 SSR hydration / 视觉回归 |
| Docs build | ✅ | VitePress 可构建 |
| Playwright | ✅ 骨架加深 | **Chromium**：smoke + Dialog focus trap / Escape / axe serious+ + RTL 截图附件 + 六品牌 `data-design`；**Firefox / WebKit / Mobile Chrome**：smoke only |

**仍未宣称覆盖（公开 1.0 前债）：**

- 像素级视觉基线（全主题 × 全语种截图对比）
- 全组件键盘矩阵 / 读屏人工认证
- Nuxt / 通用框架 **hydration** 端到端
- Lighthouse / 交互性能基准入门禁（`check:dist` 只挡异常膨胀）
- 按需 **独立 CSS side-entry** 完备性

本地：默认 Playwright 仅 Chromium；设 `CI=1` 或 `PLAYWRIGHT_FULL=1` 跑浏览器矩阵。

---

## 构建模式（`build/index.mjs`）

入口：`node build/index.mjs <mode>`。未知 mode **非 0 退出**并打印 usage，禁止静默回落 `full`。

| Mode | npm | 可观测产物 | 配置 / 脚本 |
|------|-----|------------|-------------|
| **full** | `build:lib` | `dist/amg-webui.{js,umd.cjs}` · `style.css` · types · `dist/{security,telemetry,…}/` · `dist/es/**` · `dist/skill/` · `dist/theme/` · 刷新 exports | main → runtime → ondemand → skill → theme → generate:exports |
| **runtime** | `build:runtime` | `dist/security` · `telemetry` · `lowcode` · `runtime` · `icons` · `hooks` · `utils` · `locale` · … | `vite.runtime.config.ts` |
| **on-demand** | `build:ondemand` | `dist/es/components/{core\|form\|data\|overlay}/<Name>/…` · biz domains；import 为 `amg-webui/*` | `vite.ondemand.config.ts` |
| **multi-theme** | `build:themes` | `dist/themes/{mercedes,linear,porsche,lamborghini,ferrari,apple}.css`（与 `dist/theme/` JS 运行时分离） | `vite.themes.config.ts` |
| **dts** | `build:dts` | 刷新 `dist/**/*.d.ts`；不强制重编 JS/CSS | `build/emit-dts.mjs` + `tsconfig.dts.json` |
| **skill** | `build:skill` | `dist/skill/` | `vite.skill.config.ts` |
| **theme** | `build:theme` | `dist/theme/` | `vite.theme.config.ts` |

验收冒烟：

1. `node build/index.mjs on-demand` → 存在例如 `dist/es/components/core/Button/index.js`，且文件内 `import … from "amg-webui/…"`（无残留 `@amg-webui/`）
2. `node build/index.mjs runtime` → `dist/security/index.js` · `dist/utils/env.js`
3. `node build/index.mjs multi-theme` → 六品牌 CSS，内容/体积随品牌不同
4. `node build/index.mjs dts` → 更新 d.ts
5. `node build/index.mjs nope` → exit ≠ 0 + usage
6. `build:lib` + `test:consumers` 行为不回归
7. `package.json` `exports["./security"].import` 等以 `./dist/` 开头，不以 `./packages/` 开头

一次性 `patch-*` 类脚本不得冒充长期构建入口；模式差异必须是**真实产物差异**，禁止只改注释。

---

## 必须达成

1. **新建**：目录、`types`、`style`、单测桩、docs 桩一次生成；create 后建议自动 `generate:entry`。  
2. **入口**：禁止手改巨型 barrel；200+ 组件只信任脚本输出。  
3. **i18n**：提取硬编码字符串候选；新 key 同步 **全部** locale 目录；缺失 = CI fail。  
4. **性能包形**：产物 ESM 可 tree-shake；组件样式可拆；禁止无 sideEffects 的脏 barrel 拖垮体积。  
5. **Catalog**：通用 / 布局 / … / 行业分类与 `validate:catalog` 对齐；新 general 组件登记 `example/component-catalog.json`。  
6. **Telemetry**：交互件 `trackEmit` 旁路；`telemetry` prop 在 `withDefaults` 中默认 **`undefined`**（防 Vue Boolean 省略 → `false`）。
7. **Security**：富文本 / `v-html` / 链接出口走 `@amg-webui/security`；禁止裸 `innerHTML` 外部值。
8. **Low-code**：画布 Schema 经注册表渲染；代码生成只输出源码文本，禁止 eval。
9. **Skill Runtime**：Core 禁止依赖 Vue / components / telemetry / security / lowcode / DOM；Pipeline 条件只允许 `registerCondition()` 注册名，禁止执行配置字符串；实例与 Scope 销毁必须清理资源。
10. **完成必验**：改完 `packages/` / `example/` 至少 `npx vue-tsc --noEmit`；关键路径用 example 打开验证（见 `vue3-amg-webui-verify-before-done.mdc`）。

---

## Skill Runtime 独立构建（experimental）

- `npm run build:skill` 只运行 `vite.skill.config.ts`，输出 `dist/skill/index.*` 与 `dist/skill/core.*`。
- `npm run build:lib` 构建主库后再构建 Skill；两个产物仍通过独立入口消费，主入口不导出 Skill。
- `amg-webui/skill/core` 必须可在无 Vue / 无 DOM 环境导入；`amg-webui/skill` 才包含 `vSkill`、`AmgSkillScope` 与 `createSkillPlugin`。
- `tests/unit/skill-runtime.spec.ts` 当前覆盖多实例与嵌套 Scope 隔离、迟到结果抑制、Adapter signal、Observer 脱敏、Pipeline 五类基础语义与并行重试隔离、非法 JSON / 未注册条件、Vue 指令 / Scope 与 SSR core import；stable 前仍须补齐逐节点失败 / 取消矩阵并固化包形 smoke。
- SR1 / SR2 处于 experimental：API 可在 1.0 前调整。SR3 built-ins、Telemetry bridge、DevTools 与 example 页面不得提前写成已交付。

---

## 性能默认（非协商）

- **列表类**（DataTable、Tree、Select 下拉、无限列表、可滚动菜单）：**虚拟滚动默认 ON**（仅显式 prop 可关 + 文档警告）。  
- 卸载清理监听 / 定时器；大行数组优先浅层响应式。  
- Telemetry **未 enable** 时热路径 early return，不分配重对象。
- Skill 未从独立 subpath 导入时不得初始化 Runtime；`skill/core` 保持框架无关且无 Telemetry 依赖。

---

## 脚本目录（仅保留长期工具）

```
scripts/
├── create-component.mjs           # 骨架
├── generate-entry.mjs             # 自动入口
├── extract-i18n.mjs               # 多语言批量提取 / 模板补齐
├── check-dist-artifacts.mjs       # build:lib 后产物 / 体积预算
├── generate-icon-catalog.mjs      # 图标目录（读 lucide-meta/）
├── generate-component-catalog.mjs
├── validate-component-catalog.mjs
├── score-component-maturity.mjs
├── sync-example-zones.mjs
├── generate-vitepress-api.mjs     # docs 组件 API stub
├── classify-mvp.mjs               # 深化波次清单 → .component-waves.json
├── check-coverage.mjs             # catalog / 目录覆盖核对
├── lucide-meta/                   # 图标元数据
└── .component-waves.json          # classify-mvp 产物
```

一次性 `patch-*` / `upgrade-*` / `fix-*` / `inject-*` / demo 生成脚本**不得长期入库**；用完即删。新自动化优先挂到上表 npm 脚本。

---

## 组件成熟度评分契约（`score:maturity` v2）

产物：`example/component-maturity.json`（`role: "dev-inventory"`）。

| 用途 | 不是 |
|------|------|
| 作者盘点：谁缺 FormItem / native attrs / 交互契约；下一波加深哪一档 | **产品质量证书** / 发版门禁 / 对外「满分」营销 |
| 能力档 + 深度标签，帮 example Gallery 筛选与优先级 | 键盘正确、多实例隔离、异步无竞态、SSR Hydration、无泄漏、读屏可用、API 稳定、性能达标的证明 |

评分本质是**静态启发式**（行数、Props 数、源码/测试中是否出现某字符串或 composable 目录等）。出现 `aria` / `trackEmit` / behavior 测试路径只说明「有信号」，不证明行为正确。真实质量仍靠：`vue-tsc`、单测/E2E、consumer 构建、人工 a11y、性能剖析与发版评审。

| 轴 | 含义 |
|----|------|
| `total` | **仅目录库存**（base 文件夹数）。禁止把它读成「已成熟组件数」或 1.0 就绪度。 |
| `byCapability` | **主轴**：`thin`（薄封装）· `form`（FormItem 自动接线）· `interaction`（权限/确认/节流等完整交互）· `composite`（复合面） |
| `summary` / `level` | **深度副轴**：`stub` → `shell` → `beta` → `ready`（`ready` = 该能力档启发式基线，**≠** 库整体 1.0 / 质量证明） |

硬规则：

- 表单族（InputText / Textarea / Select…）缺 `useFormItem` → 强制 `capability: thin` + `level` 上限 `shell`。
- 原生文本控件还须 `useNativeInputAttrs`（`inheritAttrs: false` + 落到真实 input）才可进 form 档 `ready`。
- `thin` **永不**标 `ready`；行数/props 堆高不能单独刷成熟度。
- 强组件参照：`Button`（interaction）；表单参照：已接线的 `InputText`（form）。
- **禁止**把 `ready` / 高分写成「产品质量已证明」或对外 1.0 证书。

控制台会打印 `byCapability` 与 `thinFormGaps`。Gallery 仍可按 depth level 筛选；读报告时先看能力档，再决定加深与测试投入。
