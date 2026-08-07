# CardWidgets

CardWidgets：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

CardWidgets：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- v-model 双向绑定
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 需要禁用/只读控制的表单场景

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { CardWidgets } from 'amg-webui/core'`

```vue
<script setup>
import { CardWidgets } from 'amg-webui/core'
</script>

<template>
  <CardWidgets />
</template>
```

Curated demo：`example/demos/CardWidgets/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `CardWidgetKey[]` | `undefined` | Ordered widget keys. Defaults to ['a','b','c','d']. Dragging swaps two keys (and their slot contents) in this list. |
| `widgets` | `CardWidgetItem[]` | `undefined` | Optional metadata for tiles (title); missing keys fall back to modelValue order |
| `cols` | `1 \| 2 \| 3 \| 4` | 2 | Grid columns — 1 / 2 / 4 (default 2 for ABCD) |
| `disabled` | `boolean` | false | Disable drag & swap |
| `showHandle` | `boolean` | true | Show drag handle affordance (default true) |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: CardWidgetKey[]` | v-model 更新 / v-model update |
| `change` | `value: CardWidgetKey[]` | Fired after a successful slot swap |
| `swap` | `payload: { from: CardWidgetKey; to: CardWidgetKey; order: CardWidgetKey[] }` | Fired after a successful swap with from/to detail |
| `dragEnd` | `payload: { order: CardWidgetKey[] swapped: boolean from?: CardWidgetKey to?: CardWidgetKey }` | Fired when a drag gesture ends (drop or cancel). Use for toast / analytics; prefer `change` for persistence. |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `CardWidgetKey`
- `CardWidgetItem`
- `CardWidgetsProps`
- `CardWidgetsEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts CardWidgets non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CardWidgets uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts CardWidgets RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CardWidgets client mount OK; no required browser-only top-level in package gate

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/core` |
| metadata | `component-metadata/CardWidgets.json` |
| API extract | `generated/component-api/CardWidgets.json` |

> 完整 Demo 见 `example/demos/CardWidgets`（example 本地调试，不上线）。

