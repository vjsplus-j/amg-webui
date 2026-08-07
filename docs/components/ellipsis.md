# Ellipsis

Ellipsis：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Ellipsis：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Ellipsis } from 'amg-webui/core'`

```vue
<script setup>
import { Ellipsis } from 'amg-webui/core'
</script>

<template>
  <Ellipsis />
</template>
```

Curated demo：`example/demos/Ellipsis/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `lines` | `number` | 1 | Max visible lines (1 = single-line ellipsis) |
| `tooltip` | `boolean` | true | Show full text in Tooltip when overflowing |
| `tooltipPlacement` | `TooltipPlacement` | `top` | Tooltip placement when tooltip is enabled |
| `content` | `string` | `undefined` | Plain text fallback when slot is empty; also used as tooltip source when set |
| `ariaLabel` | `string` | `undefined` | Accessible name when truncated text is focusable |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `overflowChange` | `overflowing: boolean` | Overflow state changed (true = text is truncated) |

### Public Types

- `EllipsisProps`
- `EllipsisEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Ellipsis non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Ellipsis uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Ellipsis RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Ellipsis client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Ellipsis.json` |
| API extract | `generated/component-api/Ellipsis.json` |

> 完整 Demo 见 `example/demos/Ellipsis`（example 本地调试，不上线）。

