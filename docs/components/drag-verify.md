# DragVerify

DragVerify：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

DragVerify：面向企业场景的 Foundation 组件（成熟度 rc）。

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

> `import { DragVerify } from 'amg-webui/core'`

```vue
<script setup>
import { DragVerify } from 'amg-webui/core'
</script>

<template>
  <DragVerify />
</template>
```

Curated demo：`example/demos/DragVerify/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | false | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `threshold` | `number` | 0.92 | threshold 数值 |
| `width` | `string` | `100%` | width 字符串 |
| `resetOnFail` | `boolean` | true | 是否启用 resetOnFail |
| `keyboardStep` | `number` | 12 | keyboardStep 数值 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: boolean` | v-model 更新 / v-model update |
| `success` | `void` | success 时触发 |
| `fail` | `void` | fail 时触发 |
| `change` | `payload: { passed: boolean; offset: number; progress: number }` | 值变更 / Change |
| `reset` | `void` | reset 时触发 |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `DragVerifyProps`
- `DragVerifyEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts DragVerify interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DragVerify uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts DragVerify RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DragVerify client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/DragVerify.json` |
| API extract | `generated/component-api/DragVerify.json` |

> 完整 Demo 见 `example/demos/DragVerify`（example 本地调试，不上线）。

