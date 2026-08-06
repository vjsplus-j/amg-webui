# 工程自动化脚本（锁定）

> Agent 记忆：`.cursor/rules/vue3-amg-webui-engineering.mdc`  
> 总计划：`docs/LIBRARY_PLAN.md` § 工程 · 性能  
> 遥测内核：`docs/TELEMETRY.md`
> Skill Runtime：`docs/SKILL_RUNTIME.md`（experimental SR1 / SR2）

---

## npm 脚本

| 命令 | 作用 |
|------|------|
| `npm run create:component -- base Foo` | 一键新建 base 组件骨架（`vp-`、types、style、桩） |
| `npm run create:component -- industry Foo` | 一键新建 industry 行业套件骨架 |
| `npm run create:component -- business bar` | 一键新建 business 模块骨架 |
| `npm run generate:entry` | 扫描 `packages/components/**` 自动生成 / 刷新 `index.ts` 导出 |
| `npm run generate:locale-types` | 从 zh-CN 生成 `LocaleKey` / `LocaleMessages`（`message-schema.ts`） |
| `npm run extract:i18n` | 重生 schema + 校验全部语种 key 对齐 + `LocaleKeys` 叶子 ⊆ zh-CN（缺 key / 不对齐 = 失败） |
| `npm run generate:icons` | 刷新图标目录 / 解析表 |
| `npm run validate:catalog` | 校验 `example/component-catalog.json` ↔ base 目录覆盖 |
| `npm run score:maturity` | 组件成熟度评分（**能力档** thin/form/interaction/composite + 深度 stub→ready；目录数≠成熟度） |
| `npm run sync:example-zones` | 同步 example 专区侧栏 / 区域元数据 |
| `npm run generate:vitepress-api` | 根据 `types.ts` 生成 / 刷新 docs 组件 API stub |
| `node scripts/classify-mvp.mjs` | 深化波次清单 → `scripts/.component-waves.json` |
| `node scripts/check-coverage.mjs` | catalog / base 目录覆盖核对 |
| `npm run build` / `build:lib` | **full**：主库 → runtime 分包 → on-demand → skill → theme → `generate:exports` |
| `npm run build:runtime` | **runtime**：`security` / `telemetry` / `lowcode` / `icons` / `hooks` / `utils` / `locale` / … → `dist/<pkg>/` |
| `npm run build:ondemand` | **on-demand**：多入口 ESM → `dist/es/**`；`@amg-webui/*` 改写为 `amg-webui/*` |
| `npm run build:themes` | **multi-theme**：六品牌 CSS → `dist/themes/<brand>.css` |
| `npm run build:dts` | **dts**：仅刷新类型 → `dist/**/*.d.ts`（不重打 JS/CSS） |
| `npm run build:skill` | 仅构建独立 Skill Runtime → `dist/skill/`（ESM + CJS + `.d.ts`） |
| `npm run build:theme` | 仅构建主题运行时包 → `dist/theme/`（`index` / `core` + `style.css`） |
| `npm run generate:exports` | 重写 `package.json` `exports` / `files`（**仅 dist**） |
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
| `@amg-webui/components/base` | `packages/components/base` |
| `@amg-webui/components/business` | `packages/components/business` |
| `@amg-webui/telemetry` | `packages/telemetry/index.ts`（**写死到文件**，避免目录解析双实例） |
| `@amg-webui/security` | `packages/security/index.ts` |
| `@amg-webui/lowcode` | `packages/lowcode/index.ts` |
| `@amg-webui/skill` | `packages/skill/index.ts`（Core + Vue 集成） |
| `@amg-webui/skill/core` | `packages/skill/core.ts`（框架无关） |
| `@amg-webui/theme` | `packages/theme/index.ts`（本地）；发包 → `dist/theme` |
| `@amg-webui/theme/core` | `packages/theme/core.ts`（无 DOM Core） |
| `@amg-webui/hooks` · `locale` · `icons` · … | 对应 `packages/*` |

`package.json` `exports`（由 `generate:exports` 维护）暴露：`.` · kebab 组件（`./button`…）· `./telemetry` · `./security` · `./lowcode` · `./skill` · `./theme` · `./icons` · `./hooks` · `./utils`（及显式深路径）· `./locale` · `./components/base` · `./components/business` · `./es/*` · `./themes/*`。

**全部公共子路径必须指向 `dist/**` 编译产物**。禁止再把 `packages/**/*.ts` 写进 `exports`。`files` 仅含 `dist` + 合同文档。On-demand / runtime 构建把内部 `@amg-webui/*` 改写为 `amg-webui/*`。

Consumer 门禁：`tests/consumer-vite` · `consumer-webpack` · `consumer-nuxt` + `npm run test:consumers`（CI）。

Skill / Theme 的 subpath 指向 `dist/skill/` · `dist/theme/`；根入口 **禁止** re-export Skill。

---

## 构建模式（`build/index.mjs`）

入口：`node build/index.mjs <mode>`。未知 mode **非 0 退出**并打印 usage，禁止静默回落 `full`。

| Mode | npm | 可观测产物 | 配置 / 脚本 |
|------|-----|------------|-------------|
| **full** | `build:lib` | 主库 · runtime 分包 · `dist/es/**` · skill · theme · 刷新 exports | main → runtime → ondemand → skill → theme → generate:exports |
| **runtime** | `build:runtime` | `dist/security` · `telemetry` · `lowcode` · `hooks` · `utils` · … | `vite.runtime.config.ts` |
| **on-demand** | `build:ondemand` | `dist/es/components/base/<Name>/…`；import 为 `amg-webui/*` | `vite.ondemand.config.ts` |
| **multi-theme** | `build:themes` | `dist/themes/<brand>.css` | `vite.themes.config.ts` |
| **dts** | `build:dts` | 刷新 `dist/**/*.d.ts` | `build/emit-dts.mjs` |
| **skill** | `build:skill` | `dist/skill/` | `vite.skill.config.ts` |
| **theme** | `build:theme` | `dist/theme/` | `vite.theme.config.ts` |

验收冒烟：

1. `node build/index.mjs on-demand` → `dist/es/components/base/Button/index.js`，且无残留 `@amg-webui/`
2. `node build/index.mjs runtime` → `dist/security/index.js` · `dist/utils/env.js`
3. `node build/index.mjs multi-theme` → 六品牌 CSS
4. `node build/index.mjs dts` → 更新 d.ts
5. `node build/index.mjs nope` → exit ≠ 0 + usage
6. `build:lib` + `test:consumers` 行为不回归
7. `exports["./security"].import` 以 `./dist/` 开头，不以 `./packages/` 开头

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

产物：`example/component-maturity.json`（example 调试用启发式，**非**对外 1.0 宣称）。

| 轴 | 含义 |
|----|------|
| `total` | **仅目录库存**（base 文件夹数）。禁止把它读成「已成熟组件数」或 1.0 就绪度。 |
| `byCapability` | **主轴**：`thin`（薄封装）· `form`（FormItem 自动接线）· `interaction`（权限/确认/节流等完整交互）· `composite`（复合面） |
| `summary` / `level` | **深度副轴**：`stub` → `shell` → `beta` → `ready`（`ready` = 该能力档基线，**≠** 库整体 1.0） |

硬规则：

- 表单族（InputText / Textarea / Select…）缺 `useFormItem` → 强制 `capability: thin` + `level` 上限 `shell`。
- 原生文本控件还须 `useNativeInputAttrs`（`inheritAttrs: false` + 落到真实 input）才可进 form 档 `ready`。
- `thin` **永不**标 `ready`；行数/props 堆高不能单独刷成熟度。
- 强组件参照：`Button`（interaction）；表单参照：已接线的 `InputText`（form）。

控制台会打印 `byCapability` 与 `thinFormGaps`。Gallery 仍可按 depth level 筛选；读报告时先看能力档。
