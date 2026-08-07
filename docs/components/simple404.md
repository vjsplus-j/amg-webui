# Simple404

Simple404：面向企业场景的 Special 组件（成熟度 rc）。

## 组件介绍

Simple404：面向企业场景的 Special 组件（成熟度 rc）。

## 核心特性

- Special 家族组件
- v-model 双向绑定
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 特殊场景组件
- 业务定制页面块
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 通用场景优先 foundation 组件

## 基础用法

> `import { Simple404 } from 'amg-webui/core'`

```vue
<script setup>
import { Simple404 } from 'amg-webui/core'
</script>

<template>
  <Simple404 />
</template>
```

Curated demo：`example/demos/Simple404/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `code` | `string \| number` | 404 | code 数值 |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `actions` | `Simple404Action[]` | `() => []` | actions 列表数据 |
| `homeHref` | `string` | `undefined` | homeHref 字符串 |
| `retryable` | `boolean` | false | 是否启用 retryable |
| `modelValue` | `string` | `undefined` | 绑定值 / Bound value (v-model) |
| `data` | `unknown` | `undefined` | 树形数据 / Tree data |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `change` | `value: string` | 值变更 / Change |
| `click` | `event: MouseEvent` | 点击 / Click |
| `action` | `action: Simple404Action, event: MouseEvent` | action 时触发 |
| `home` | `event: MouseEvent` | home 时触发 |
| `retry` | `event: MouseEvent` | retry 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `Simple404Action`
- `Simple404Props`
- `Simple404Emits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Simple404 non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Simple404 uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Simple404 RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Simple404 client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Simple404.json` |
| API extract | `generated/component-api/Simple404.json` |

> 完整 Demo 见 `example/demos/Simple404`（example 本地调试，不上线）。

