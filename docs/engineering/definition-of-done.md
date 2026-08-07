# AMG-WebUI Definition of Done

> 适用范围：AMG-WebUI 全仓库  
> 适用对象：Cursor、Codex、Claude Code、开发人员、Reviewer  
> 目的：统一“完成”的定义，禁止以“能运行”“大部分完成”“主要功能完成”代替真正交付。  
> Cursor：`.cursor/rules/02-verify-before-done.mdc`（alwaysApply）  
> 关联：[`COMPONENT_HARDENING.md`](../COMPONENT_HARDENING.md) · [`I18N.md`](../../packages/locale/I18N.md) · [`SPEC.md`](../../packages/theme/SPEC.md) · [`APP_WORKFLOW.md`](../APP_WORKFLOW.md) · [`ENGINEERING.md`](../ENGINEERING.md)

验证结果只允许：

```text
PASS | FAIL | N/A | BLOCKED
```

任一适用 Mandatory 项为 `FAIL`，任务不得标记 `DONE`。

---

# 1. 核心原则

任何任务只有满足本文件对应的全部 Mandatory 条件，才允许标记为：

```text
DONE
```

否则只能是：

```text
TODO
DOING
BLOCKED
REVIEW
```

禁止使用：

```text
基本完成
大部分完成
主要完成
核心完成
后续可补
基本可用
差不多完成
```

这些状态没有工程意义。

---

# 2. 完成必须有证据

任何 DONE 必须同时具备：

```text
Implementation
+
Verification
+
Documentation
+
State Update
```

只有代码修改，没有验证，不算完成。

只有测试通过，没有文档和状态更新，不算完成。

只有文档写完，没有真实实现，不算完成。

---

# 3. 通用任务 DoD

任何代码任务至少必须检查：

- [ ] 需求已完整实现
- [ ] 没有遗漏明确要求
- [ ] 没有留下无说明的 TODO
- [ ] 没有留下无说明的 FIXME
- [ ] 没有临时 Mock 伪装正式实现
- [ ] 没有调试代码残留
- [ ] 没有无必要 `console.log`
- [ ] TypeScript 通过（至少 `npx vue-tsc --noEmit`）
- [ ] 包边界通过（改 `packages/` 时：`npm run check:boundaries`）
- [ ] 相关测试通过
- [ ] 相关 lint / build 通过
- [ ] 没有破坏现有公开 API
- [ ] 没有引入明显重复实现
- [ ] 没有新增不必要技术债
- [ ] 文档已同步（README / CHANGELOG / 权威 docs / 相关 Cursor rules）
- [ ] 状态文件已更新（适用：hardening inventory / contracts / program-status）
- [ ] 验证结果有明确 PASS / FAIL / N/A / BLOCKED

任一 Mandatory 项未完成，不得 DONE。

---

# 4. 组件任务 DoD

公共组件只有全部通过以下适用项，才允许进入 STABLE。

## 4.1 API

- [ ] Props 完整且类型化
- [ ] Emits 完整且 Payload 类型化
- [ ] Slots 完整且有类型
- [ ] Expose 已审计
- [ ] Models 已审计
- [ ] Instance Type 已审计
- [ ] Programmatic API 已审计（适用）
- [ ] Public Types 已审计
- [ ] Context / Provider 已审计
- [ ] Behavioral Contract 已明确
- [ ] 无不必要 `any`
- [ ] API 命名与同 Family 一致
- [ ] API 文档与源码一致

---

## 4.2 行为

- [ ] 默认状态正确
- [ ] disabled 正确
- [ ] readonly 正确（适用）
- [ ] loading 正确（适用）
- [ ] empty 正确（适用）
- [ ] error / invalid 正确（适用）
- [ ] Controlled / Uncontrolled 行为正确
- [ ] v-model 行为正确
- [ ] 外部值变化可正确同步
- [ ] 不重复 emit
- [ ] 边界状态有测试

---

## 4.3 Native / Form

- [ ] `id` 正确透传
- [ ] `name` 正确透传
- [ ] `aria-*` 正确透传
- [ ] `autocomplete` 正确透传（适用）
- [ ] `inputmode` 正确透传（适用）
- [ ] `FormItem` 集成正确（适用）
- [ ] validation trigger 正确（适用）
- [ ] reset / clearValidate 正确（适用）

---

## 4.4 Keyboard

交互组件必须：

- [ ] Tab 行为正确
- [ ] Enter 行为正确（适用）
- [ ] Escape 行为正确（适用）
- [ ] Arrow Keys 行为正确（适用）
- [ ] Home / End 行为正确（适用）
- [ ] Focus 不丢失
- [ ] 嵌套组件键盘事件不冲突

---

## 4.5 Accessibility

- [ ] Role 正确
- [ ] aria-expanded 正确（适用）
- [ ] aria-controls 正确（适用）
- [ ] aria-selected 正确（适用）
- [ ] aria-disabled 正确
- [ ] aria-invalid 正确（适用）
- [ ] aria-describedby 正确（适用）
- [ ] Label 关系正确
- [ ] Focus Trap 正确（Overlay 类）
- [ ] Focus Restore 正确（Overlay 类）
- [ ] axe 无 Critical / Serious 问题

---

## 4.6 Theme / RTL

官方主题清单（SSOT：`packages/theme/core/registry.ts`）：

```text
mercedes | linear | porsche | lamborghini | ferrari | apple | wechat | alipay
```

- [ ] 无非法硬编码品牌色 / 魔法尺寸
- [ ] 使用语义 Token（`--ds-*` / `--surface-*` / `--theme-*`）
- [ ] 至少在默认主题 + 一档对比主题下可读
- [ ] Light Theme 正常（适用）
- [ ] Dark Theme 正常（`supportsScheme` 主题适用）
- [ ] Hover / Focus / Disabled / Error 正常
- [ ] **语种 ≠ 方向**：不假设 `ar-SA` / `ug-CN` 自动 `dir=rtl`
- [ ] RTL 在 `LocaleService.setDirection('rtl')` / `?dir=rtl` 下正常（适用）
- [ ] 使用 CSS logical properties（适用）
- [ ] 新增 `data-design` 皮肤时完成 Theme Registry DoD（§21）

---

## 4.7 SSR

- [ ] 模块顶层不非法访问 `window`
- [ ] 模块顶层不非法访问 `document`
- [ ] `renderToString` 通过
- [ ] Hydration 不产生关键不一致
- [ ] Teleport / Portal 在 SSR 下行为明确

---

## 4.8 Lifecycle / Cleanup

- [ ] event listener 清理
- [ ] timer 清理
- [ ] ResizeObserver 清理
- [ ] IntersectionObserver 清理
- [ ] AbortController 清理
- [ ] Worker 清理
- [ ] subscription 清理
- [ ] Teleport host 清理
- [ ] unmount 后无后台副作用

---

## 4.9 Tests

- [ ] 基础行为测试
- [ ] Edge Case 测试
- [ ] Model 测试
- [ ] Event 测试
- [ ] Cleanup 测试
- [ ] Keyboard 测试（适用）
- [ ] A11Y 测试（适用）
- [ ] SSR 测试
- [ ] Async race 测试（适用）

---

## 4.10 Visual

- [ ] Default
- [ ] Hover（适用）
- [ ] Active（适用）
- [ ] Focus
- [ ] Disabled
- [ ] Loading（适用）
- [ ] Error（适用）
- [ ] Dark（适用）
- [ ] RTL（适用）
- [ ] Visual Regression 通过（要求时）

---

## 4.11 Package

- [ ] Package entry 正确
- [ ] Type export 正确
- [ ] Component export 正确
- [ ] Style export 正确（含按需 `amg-webui/<kebab>/style.css` 适用时）
- [ ] 独立 import 正常
- [ ] Vite consumer 正常
- [ ] Webpack consumer 正常（要求时）
- [ ] Nuxt consumer 正常（要求时）
- [ ] Public export 不暴露内部实现
- [ ] foundation ↛ industry（`check:boundaries`）

---

# 5. 文档任务 DoD

任何 STABLE 公共组件必须具备：

## Overview

- [ ] 中文名
- [ ] 一句话说明
- [ ] 详细介绍
- [ ] When To Use
- [ ] When Not To Use
- [ ] Related Components

## Demo

- [ ] Demo 数量达到 Family 最低要求
- [ ] Demo 可运行
- [ ] Demo 可复制
- [ ] Demo 源码与运行源码同源
- [ ] Edge Case 有覆盖
- [ ] 高级能力有示例
- [ ] example Demo 铺满内容列（无阅读栏 `max-width` / 无嵌套 `max-height` 小滚动盒）

## API

- [ ] Props 完整
- [ ] Events 完整
- [ ] Slots 完整
- [ ] Expose 完整
- [ ] Models 完整
- [ ] Public Types 完整

## Accessibility

- [ ] Keyboard 文档
- [ ] ARIA 文档
- [ ] Focus 行为文档

## Design

- [ ] Design Tokens 可查
- [ ] Theme 注意事项可查

## Version

- [ ] Since
- [ ] Stability
- [ ] Deprecated（适用）
- [ ] Replaced By（适用）
- [ ] Breaking Notes（适用）

文档与源码存在 Drift 时，不得 STABLE。

权威对外文档在 `docs/`（VitePress）；`example/` 仅本地调试，禁止当作对外文档站。

---

# 6. Shared Engine DoD

共享 Engine 只有满足以下条件才算完成：

- [ ] 至少被 2 个真实组件使用，或有明确统一职责
- [ ] API 边界清晰
- [ ] 不依赖具体业务组件
- [ ] 无隐藏全局状态
- [ ] 多实例行为正确
- [ ] dispose / cleanup 正确
- [ ] SSR 安全
- [ ] 单元测试通过
- [ ] 竞态行为有测试
- [ ] 错误处理明确
- [ ] 旧重复实现已迁移或记录迁移任务
- [ ] 文档说明使用边界

禁止创建“名义 Shared Engine”，但组件继续各自维护旧逻辑。

---

# 7. Overlay 类额外 DoD

Dialog / Drawer / Popover / Tooltip / Dropdown / Popconfirm 等必须：

- [ ] z-index 正确
- [ ] Escape Stack 正确
- [ ] Click Outside 正确
- [ ] Scroll Lock 正确
- [ ] Focus Trap 正确
- [ ] Focus Restore 正确
- [ ] Nested Overlay 正确
- [ ] Multiple Instance 正确
- [ ] Multiple Runtime 正确
- [ ] Teleport Target 正确
- [ ] SSR 正确
- [ ] dispose 不影响其他 Runtime

---

# 8. Form / Input 类额外 DoD

- [ ] IME / composition 正确
- [ ] 中文输入不丢字
- [ ] Autofill 行为正确（适用）
- [ ] maxlength 行为正确（适用）
- [ ] readonly / disabled 区分明确
- [ ] Form validation 集成正确
- [ ] native attrs 不丢
- [ ] Focus / Blur Event 正确

---

# 9. Selection 类额外 DoD

Select / AutoComplete / Cascader / TreeSelect / Mention 等：

- [ ] Selection Model 统一
- [ ] Active Option 正确
- [ ] Keyboard Navigation 正确
- [ ] Single / Multiple 行为正确
- [ ] Clear 行为正确
- [ ] Search / Filter 正确
- [ ] Remote stale request 正确
- [ ] Loading / Empty / Error 正确
- [ ] Floating Panel 正确
- [ ] Focus Restore 正确
- [ ] 10k options Benchmark（适用）

---

# 10. DateTime 类额外 DoD

- [ ] format
- [ ] valueFormat
- [ ] parse
- [ ] min / max
- [ ] disabledDate / disabledTime（适用）
- [ ] range ordering
- [ ] leap year
- [ ] locale
- [ ] first day of week（适用）
- [ ] keyboard calendar
- [ ] invalid input
- [ ] timezone / DST 策略明确（适用）

---

# 11. Tree 类额外 DoD

- [ ] Node identity
- [ ] Expand / Collapse
- [ ] Selected state
- [ ] Checked state
- [ ] Half Checked
- [ ] Lazy loading race
- [ ] Keyboard Tree Navigation
- [ ] Virtualization
- [ ] 10k+ nodes
- [ ] Cleanup
- [ ] Benchmark（适用）

---

# 12. Table / Data 类额外 DoD

- [ ] Column Model
- [ ] Sort
- [ ] Filter
- [ ] Pagination
- [ ] Selection
- [ ] Fixed Column
- [ ] Resize
- [ ] Virtual Rows
- [ ] Virtual Columns（适用）
- [ ] Async stale protection
- [ ] Loading / Empty / Error
- [ ] Large Data Benchmark
- [ ] Memory / DOM Node 指标

---

# 13. Upload 类额外 DoD

- [ ] File validate
- [ ] Type validate
- [ ] Size validate
- [ ] Queue
- [ ] Progress
- [ ] Abort
- [ ] Retry
- [ ] Failure
- [ ] Duplicate
- [ ] Chunk（适用）
- [ ] Concurrency
- [ ] Unmount cleanup

---

# 14. Media / Domain 类额外 DoD

- [ ] Adapter abstraction
- [ ] Mock adapter
- [ ] Loading
- [ ] Connecting
- [ ] Playing / Running
- [ ] Error
- [ ] Offline
- [ ] Reconnect
- [ ] Permission denied
- [ ] Abort
- [ ] Destroy
- [ ] Event Contract
- [ ] 不依赖真实在线服务才能完成测试
- [ ] 不直接泄漏后端 DTO 作为组件 Public API
- [ ] 行业包（gb28181 / onvif / media）保持 opt-in，不得泄漏进 foundation / 根 barrel

---

# 15. API 变更 DoD

任何 Public API 变更必须：

- [ ] 更新 Type
- [ ] 更新 Contract
- [ ] 更新 Tests
- [ ] 更新 Docs
- [ ] 更新 Demo（适用）
- [ ] 更新 Changelog（适用）
- [ ] 更新 Migration（Breaking 时）
- [ ] 检查 API Drift
- [ ] 检查 SemVer 影响

STABLE API 禁止无版本策略的破坏性修改。

---

# 16. Batch DoD

一个 Component Batch 只有满足以下条件才允许 CLOSED：

- [ ] Batch 内组件范围固定
- [ ] Family Shared Engine 已完成
- [ ] 所有组件 API Contract 已审计
- [ ] 所有 Mandatory Gate 有结果
- [ ] 所有 FAIL 已修复或明确降级为 Beta
- [ ] Docs 完成
- [ ] Visual 完成
- [ ] Package 完成
- [ ] Inventory 已更新
- [ ] Maturity 已更新
- [ ] Dashboard 已更新
- [ ] 无未知 BLOCKED
- [ ] CI 通过

---

# 17. AI Agent 专用规则

Cursor / Codex / Claude Code 在执行任务时：

## 必须

- [ ] 读取当前 Task / Batch 状态
- [ ] 不重复已完成任务
- [ ] 不把计划文件修改当成实现
- [ ] 不跳过测试
- [ ] 不跳过文档
- [ ] 不跳过状态更新
- [ ] 不因任务量大而提前宣布完成
- [ ] 遇到阻塞时标记 BLOCKED，并继续其他不依赖任务
- [ ] 完成前重新扫描遗漏项
- [ ] Cursor rules 以编号集为准（`00`–`42`）；勿引用已废弃的 `vue3-amg-webui-*.mdc`

## 完成前必须执行遗漏扫描

至少检查：

```text
TODO
FIXME
NotImplemented
throw new Error
console.log
stub
placeholder
temporary
mock
```

并人工判断是否属于未完成实现。

---

# 18. AI 汇报格式

任何阶段汇报统一：

```text
本轮完成
- TASK-ID ...
- TASK-ID ...

验证结果
- typecheck: PASS / FAIL / N/A
- boundaries: PASS / FAIL / N/A
- unit: PASS / FAIL / N/A
- SSR: PASS / FAIL / N/A
- A11Y: PASS / FAIL / N/A
- visual: PASS / FAIL / N/A
- docs: PASS / FAIL / N/A
- package: PASS / FAIL / N/A
- i18n: PASS / FAIL / N/A
- theme: PASS / FAIL / N/A
- benchmark: PASS / FAIL / N/A

状态变化
- Stable: x → y
- RC: x → y
- Beta: x → y
- Draft: x → y

剩余 P0
- ...

当前阻塞
- none / ...
```

---

# 19. 最终专项 DoD

AMG-WebUI Component Hardening Program 只有满足以下条件才能宣布完成：

- [ ] Inventory SSOT 完整
- [ ] 100% Public Component 已分类
- [ ] 100% Public Component 有 API Contract
- [ ] Stable API Gate = 100%
- [ ] Stable Behavior Gate = 100%
- [ ] Stable SSR Gate = 100%
- [ ] Stable Documentation Gate = 100%
- [ ] Stable Package Gate = 100%
- [ ] Stable Visual Gate = 100%
- [ ] Interaction/Form/Overlay A11Y Gate = 100%
- [ ] Demo Copyable = 100%
- [ ] 性能组件都有 Benchmark
- [ ] 非 Stable 组件明确标记 Beta / Experimental
- [ ] API / Docs 无 Drift
- [ ] Dashboard 与 Inventory 一致
- [ ] CI 全部通过
- [ ] 无未说明 P0
- [ ] 无未说明 BLOCKED

只有以上条件满足，才允许输出：

```text
Component Hardening Program Completed
```

---

# 20. Scope Closure Rule

AI Agent 不得通过缩小任务范围来制造“完成”。

以下情况全部视为 UNFINISHED：

- 原计划中尚未实现的内容
- 执行过程中发现的新缺口
- 测试过程中发现的问题
- API Audit 发现的缺失
- Documentation Audit 发现的缺失
- Family Audit 发现的遗漏组件
- Inventory 中未治理的 Public Component
- Gate 为 FAIL 的组件
- Gate 缺少 Evidence 的组件
- 被标记为 deferred 的任务
- 被标记为 next batch / next step 的任务
- 不在原始 todo 中但属于当前专项目标的任务
- 已知但尚未实施的技术债
- 为完成当前专项而必须实施的依赖任务

禁止使用以下理由将未完成工作排除出任务范围：

- not in original todo
- deferred
- next batch
- future work
- follow-up
- optional later
- out of current round
- 下一步处理
- 后续处理
- 本轮不处理

如果发现新的未完成项，必须立即加入当前 Program Backlog。

`todo = []` 不能作为项目完成证据。

只有：

```text
Program Backlog = []
AND Known Deferred = []
AND Known Gaps = []
AND Mandatory Gate Failures = []
AND Mandatory Gate Missing Evidence = []
```

才允许判断当前专项没有剩余任务。

任何 `deferred` 项存在时：

```text
Program Status != DONE
```

否则必须继续执行。

---

# 21. Theme Registry DoD（新增设计风格）

新增 `data-design` 官方皮肤（如 `wechat` / `alipay`）必须：

- [ ] `packages/theme/styles/design/<id>.scss` 完整 Token 合同（`theme-type-scale` / `theme-spacing` / `theme-shape` / `bridge-ds`）
- [ ] `styles/design/index.scss` 已 `@import`
- [ ] `brand-entries/<id>.{ts,scss}` 已添加
- [ ] `DesignStyleName` + `designStyles[]` 已登记（`registry.ts`）
- [ ] `vite.themes.config.ts` brands 已包含
- [ ] `scripts/check-dist-artifacts.mjs` `BRANDS` 已包含
- [ ] `tests/e2e/helpers.ts` `DESIGN_BRANDS` 已包含
- [ ] `DESIGNMD_THEMES` / COMPOSITION_RULES 已同步（适用）
- [ ] example `ThemeSwitchPage` palette map 已补齐
- [ ] 全语种 i18n：`page.intro.design.style.<id>` + `npm run extract:i18n`
- [ ] 单测期望数量已更新（如 `designStyles.length`）
- [ ] `npm run build:themes` 产出 `dist/themes/<id>.css`
- [ ] README / SPEC / THEME_STUDIO / ENGINEERING / CHANGELOG 官方主题口径已同步
- [ ] 深链 `/?design=<id>` 可切换

禁止只改 registry 标签而不交付 Token SCSS / 构建入口。

---

# 22. i18n / Direction DoD

- [ ] 用户可见文案走 `LocaleKey`（含 example chrome）
- [ ] 全语种包对齐（`npm run extract:i18n` PASS）
- [ ] **语种与阅读方向解耦**：`setLocale` 不改写 `html[dir]`
- [ ] 方向仅由 `setDirection` / `toggleDirection` / `?dir=` / 顶栏 LTR·RTL 控制
- [ ] 默认方向 `ltr`；`ar-SA` / `ug-CN` 只换文案包（自然方向仅为 meta 提示）
- [ ] 繁体内置码为 `zh-HK`；`zh-TW` 仅作别名映射
- [ ] `ConfigProvider` 未显式 `direction` 时跟随 `LocaleService.getDir()`
- [ ] RTL 相关样式用逻辑属性；需镜像图标使用约定类
- [ ] 文档（`I18N.md` / APP_WORKFLOW / README）不宣传「阿语自动镜像」

相关单测 / E2E（适用）：`tests/unit/locale-direction.spec.ts` · `tests/e2e/rtl-theme.spec.ts`

---

# 23. Example Chrome DoD

改动 `example/layouts/AppShell.vue` / `AppHeaderActions.vue` 时：

- [ ] 侧栏筛选无多余分区标题；Search 有 `aria-label` + placeholder
- [ ] `≤768px` 时 docked 侧栏隐藏后，顶栏仍有可打开的移动导航（Drawer / 等价替代），不得无入口丢导航
- [ ] 顶栏溢出不展示原生滚动条轨道（避免误读成进度条）
- [ ] 语种下拉与方向开关职责分离
- [ ] 文案 / 色值 / 尺寸禁止硬编码
- [ ] 右键菜单仅暴露约定项（复制 / 粘贴 / 选择 / 全选 / 检查）；组件 Demo `ContextMenu` 不被全局菜单抢占

---

# 24. 建议验证命令（按改动面选用）

| 改动面 | 至少验证 |
|--------|----------|
| `packages/**` / `example/**` | `npx vue-tsc --noEmit` · `npm run check:boundaries` |
| locale keys | `npm run extract:i18n` |
| 主题皮肤 | `npm run build:themes` · `tests/unit/theme-core.spec.ts` |
| 方向 / RTL | `tests/unit/locale-direction.spec.ts`（+ E2E 适用） |
| 发包契约 | `npm run build:lib` · `npm run check:dist` |
| Hardening | `npm run hardening:all` / 相关 `verify:component` |

验证结果写入汇报时，未跑项标 `N/A`，失败项标 `FAIL` 并继续修复，不得用叙述掩盖。
