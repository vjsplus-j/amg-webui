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
| `npm run create:component -- business bar` | 一键新建 business 模块骨架 |
| `npm run generate:entry` | 扫描 `packages/components/**` 自动生成 / 刷新 `index.ts` 导出 |
| `npm run extract:i18n` | 批量扫描文案 → 补全 `LocaleKeys` + **全部**语种模板（缺 key 告警） |
| `npm run generate:icons` | 刷新图标目录 / 解析表 |
| `npm run validate:catalog` | 校验 `example/component-catalog.json` ↔ base 目录覆盖 |
| `npm run score:maturity` | 组件成熟度评分（脚手架 vs 实现深度） |
| `npm run sync:example-zones` | 同步 example 专区侧栏 / 区域元数据 |
| `npm run build` / `build:lib` | 库发包构建 → `dist/` |
| `npm run build:skill` | 仅构建独立 Skill Runtime → `dist/skill/`（ESM + CJS + `.d.ts`） |
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
| `@amg-webui/skill` | `packages/skill/index.ts`（Core + Vue 集成） |
| `@amg-webui/skill/core` | `packages/skill/core.ts`（框架无关） |
| `@amg-webui/theme` · `hooks` · `locale` · `icons` · … | 对应 `packages/*` |

`package.json` `exports` 同步暴露：`.` · `./telemetry` · `./skill` · `./skill/core` · `./theme` · `./icons` · `./components/base` · `./components/business`。

Skill 两个 subpath 指向 `dist/skill/` 独立产物；根入口 `packages/index.ts` **禁止** re-export Skill，避免主包产生隐式运行时依赖。

---

## 必须达成

1. **新建**：目录、`types`、`style`、单测桩、docs 桩一次生成；create 后建议自动 `generate:entry`。  
2. **入口**：禁止手改巨型 barrel；200+ 组件只信任脚本输出。  
3. **i18n**：提取硬编码字符串候选；新 key 同步 **全部** locale 目录；缺失 = CI fail。  
4. **性能包形**：产物 ESM 可 tree-shake；组件样式可拆；禁止无 sideEffects 的脏 barrel 拖垮体积。  
5. **Catalog**：通用 / 布局 / … / 行业分类与 `validate:catalog` 对齐；新 general 组件登记 `example/component-catalog.json`。  
6. **Telemetry**：交互件 `trackEmit` 旁路；`telemetry` prop 在 `withDefaults` 中默认 **`undefined`**（防 Vue Boolean 省略 → `false`）。  
7. **Skill Runtime**：Core 禁止依赖 Vue / components / telemetry / DOM；Pipeline 条件只允许 `registerCondition()` 注册名，禁止执行配置字符串；实例与 Scope 销毁必须清理资源。
8. **完成必验**：改完 `packages/` / `example/` 至少 `npx vue-tsc --noEmit`；关键路径用 example 打开验证（见 `vue3-amg-webui-verify-before-done.mdc`）。

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

## 脚本目录

```
scripts/
├── create-component.mjs          # 骨架
├── generate-entry.mjs            # 自动入口
├── extract-i18n.mjs              # 多语言批量提取 / 模板补齐
├── generate-icon-catalog.mjs     # 图标目录
├── generate-component-catalog.mjs
├── validate-component-catalog.mjs
├── score-component-maturity.mjs
├── sync-example-zones.mjs
└── …                             # 迁移 / 深度补强 / 编码修复（一次性 patch_* 可归档）
```

临时诊断脚本勿入库长期保留；修复完成后删除。
