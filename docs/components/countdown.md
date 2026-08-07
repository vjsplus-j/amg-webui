# Countdown

Countdown：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Countdown：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- v-model 双向绑定
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Countdown } from 'amg-webui/core'`

```vue
<script setup>
import { Countdown } from 'amg-webui/core'
</script>

<template>
  <Countdown />
</template>
```

Curated demo：`example/demos/Countdown/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `undefined` | 绑定值 / Bound value (v-model) |
| `value` | `number \| Date` | **必填** | 表格行数据或绑定值 / Row data or bound value |
| `format` | `string` | `HH:mm:ss` | 日期格式 / Date format |
| `millisecond` | `boolean` | false | 是否启用 millisecond |
| `autoStart` | `boolean` | true | 是否启用 autoStart |
| `paused` | `boolean` | false | 是否启用 paused |
| `interval` | `number` | `undefined` | interval 数值 |
| `prefix` | `string` | `undefined` | prefix 字符串 |
| `suffix` | `string` | `undefined` | suffix 字符串 |
| `showControls` | `boolean` | false | 是否启用 showControls |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `remainingMs: number` | v-model 更新 / v-model update |
| `finish` | `void` | finish 时触发 |
| `tick` | `remainingMs: number` | tick 时触发 |
| `start` | `remainingMs: number` | start 时触发 |
| `pause` | `remainingMs: number` | pause 时触发 |
| `resume` | `remainingMs: number` | resume 时触发 |
| `reset` | `remainingMs: number` | reset 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `CountdownProps`
- `CountdownEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Countdown non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Countdown uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Countdown RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Countdown client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Countdown.json` |
| API extract | `generated/component-api/Countdown.json` |

> 完整 Demo 见 `example/demos/Countdown`（example 本地调试，不上线）。

