# Clipboard

Clipboard：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Clipboard：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- v-model 双向绑定
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Clipboard } from 'amg-webui/core'`

```vue
<script setup>
import { Clipboard } from 'amg-webui/core'
</script>

<template>
  <Clipboard />
</template>
```

Curated demo：`example/demos/Clipboard/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | `` | text 字符串 |
| `modelValue` | `string` | `` | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string` | v-model 更新 / v-model update |
| `copied` | `value: string` | copied 时触发 |
| `error` | `error: Error` | error 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `ClipboardProps`
- `ClipboardEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts Clipboard interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Clipboard uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Clipboard RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Clipboard client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Clipboard.json` |
| API extract | `generated/component-api/Clipboard.json` |

> 完整 Demo 见 `example/demos/Clipboard`（example 本地调试，不上线）。

