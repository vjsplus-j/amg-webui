# Print

Print：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Print：面向企业场景的 Foundation 组件（成熟度 rc）。

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

> `import { Print } from 'amg-webui/core'`

```vue
<script setup>
import { Print } from 'amg-webui/core'
</script>

<template>
  <Print />
</template>
```

Curated demo：`example/demos/Print/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `boolean` | `undefined` | 绑定值 / Bound value (v-model) |
| `title` | `string` | `undefined` | 标题 / Title |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `showToolbar` | `boolean` | true | 是否启用 showToolbar |
| `printClass` | `string` | `undefined` | CSS class injected into print window body |
| `copyStyles` | `boolean` | true | 是否启用 copyStyles |
| `pageStyle` | `string` | `undefined` | pageStyle 字符串 |
| `autoClose` | `boolean` | true | 是否启用 autoClose |
| `windowFeatures` | `string` | `noopener,noreferrer` | windowFeatures 字符串 |
| `pendingLabel` | `string` | `undefined` | pendingLabel 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `printing: boolean` | v-model 更新 / v-model update |
| `print` | `void` | print 时触发 |
| `before-print` | `void` | before-print 时触发 |
| `after-print` | `void` | after-print 时触发 |
| `error` | `error: Error` | error 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `PrintProps`
- `PrintEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts Print interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Print uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Print RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Print client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Print.json` |
| API extract | `generated/component-api/Print.json` |

> 完整 Demo 见 `example/demos/Print`（example 本地调试，不上线）。

