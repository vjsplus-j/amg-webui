# Split

Split：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Split：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 多尺寸规格
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Split } from 'amg-webui/core'`

```vue
<script setup>
import { Split } from 'amg-webui/core'
</script>

<template>
  <Split />
</template>
```

Curated demo：`example/demos/Split/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `direction` | `SplitDirection` | `horizontal` | direction 配置项 |
| `min` | `number` | 48 | min 数值 |
| `max` | `number` | `undefined` | max 数值 |
| `size` | `number \| string` | `50%` | 尺寸：`sm` · `md` · `lg` / Size variant |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:size` | `value: number \| string` | `size` 更新时触发（v-model） |

### Public Types

- `SplitDirection`
- `SplitProps`
- `SplitEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Split non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Split uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Split RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Split client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Split.json` |
| API extract | `generated/component-api/Split.json` |

> 完整 Demo 见 `example/demos/Split`（example 本地调试，不上线）。

