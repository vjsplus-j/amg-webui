# Example Documentation System

> 目标：把 example 从「组件 Gallery / 排障壳」演进为**可对开发者交付的组件文档体验**（仍本地调试、不上线）。  
> 对外可部署站点仍是 **VitePress `docs/`**。  
> 与治理程序联动：[`COMPONENT_HARDENING.md`](./COMPONENT_HARDENING.md) Track C。

## 边界（锁定）

| | **example** | **docs（VitePress）** |
|--|-------------|------------------------|
| 角色 | 库作者调试 + 组件文档预览 | 对外标准文档 |
| 部署 | **禁止上线** | 可部署 |
| 内容 | 半成品 / 压测 / bug 复现 / 治理证据 lab | 标准示例 + API + 教程 |

## 每个组件页统一结构（目标态）

```text
Header：名称 / 一句话 / Family / Maturity / Since / Import
Overview：介绍 · 何时用 · 何时不用 · Related
Demos：Basic / States / …（源码与运行同源）
API：Props · Emits · Slots · Expose · Models · Types
A11Y / Keyboard / Tokens
Version：Since · Stable Since · Deprecated
```

## 与现有设施的关系

- Catalog / 成熟度：`example/component-catalog.json` · maturity（盘点用，≠ Stable）
- 治理契约：`component-hardening/contracts/*.json`
- API 表应逐步改为**从 types / contract 生成**，禁止纯手工 Demo 表漂移
- 治理证据 lab：`/lab/hardening`
- Lowcode Studio 调试：`/lab/lowcode-studio`

## 分期（摘要）

1. **P0**：Header + Overview 字段进 catalog/contract；Demo 布局铺满（已有 DemoBlock 契约）
2. **P1**：`hardening:extract-api` → `generated/component-api/*.json` → `example/components/docs/ApiRenderer.vue`（已接入 `ComponentDocPage`）
3. **P2**：A11Y / Keyboard / Token 段落模板化；Demo `?raw` 同源（模板五件推进中）
4. **P3**：与 VitePress 组件页生成脚本同源（减少双写）

状态：`component-hardening/program-status.json`。
