# Menu

Menu 为 **Stable** 公共组件（API frozen）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Menu 已通过 Component Hardening 证据门禁；完整交互演示见本地 example curated demo。

## 何时使用 / 何时不用

- **适用**：生产可用的 Stable 组件场景。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { Menu } from '@amg-webui/core'
</script>

<template>
  <Menu />
</template>
```

Curated demo：`example/demos/Menu/index.vue`

## 交互演示

<DocsDemo name="menu-basic" />

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `items` | `MenuItem[]` | — | 菜单项 / Menu items |
| `modelValue` | `string` | — | 绑定值 / Bound value (v-model) |
| `openKeys` | `string[]` | — | — |
| `collapsed` | `boolean` | — | — |
| `direction` | `'vertical' \| 'horizontal'` | — | — |
| `mode` | `'auto' \| 'inline' \| 'popup'` | — | — |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `trackId` | `string` | — | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | — | 是否上报 Telemetry / Enable telemetry |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `update:openKeys` | `value: string[]` | — |
| `change` | `value: string` | 值变更 / Change |
| `select` | `item: MenuItem, event: MouseEvent` | 选中 / Select |
| `openChange` | `openKeys: string[]` | — |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `MenuBadgeTone`
- `NavItem`
- `MenuBadge`
- `MenuItem`
- `MenuProps`
- `MenuEmits`

## 无障碍与键盘

交互行为与键盘路径以 `component-hardening/evidence/Menu/a11y.json` · `keyboard.json` 为准；本地可复现：`example/demos/Menu/`。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `stable` |
| apiFreeze | `frozen` |
| API extract | `generated/component-api/Menu.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/Menu`。
