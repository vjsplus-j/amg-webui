# Confirm

Confirm：面向企业场景的 Feedback 组件（成熟度 rc）。

## 组件介绍

Confirm：面向企业场景的 Feedback 组件（成熟度 rc）。

## 核心特性

- Feedback 家族组件
- 可关闭
- 语义色变体
- 事件回调

## 何时使用 / 不适用

**适用**

- 操作结果与状态提示
- 空态与加载反馈

**不适用**

- 需要模态决策时用 Dialog / Confirm

## 基础用法

> `import { Confirm } from 'amg-webui/overlay'`

```vue
<script setup>
import { Confirm } from 'amg-webui/overlay'
</script>

<template>
  <Confirm />
</template>
```

Curated demo：`example/demos/Confirm/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | false | 是否可见 / Visibility (v-model:visible) |
| `title` | `string` | `undefined` | 标题 / Title |
| `message` | `string` | `undefined` | message 字符串 |
| `closable` | `boolean` | true | 显示关闭按钮 / Show close button |
| `dismissible` | `boolean` | true | 是否启用 dismissible |
| `confirmLabel` | `string` | `` | confirmLabel 字符串 |
| `cancelLabel` | `string` | `` | cancelLabel 字符串 |
| `severity` | `ConfirmSeverity` | `warning` | 语义色：`primary` · `secondary` · `danger` 等 / Semantic color |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:visible` | `value: boolean` | visible 更新 / visible update |
| `confirm` | `event: Event` | 确认时触发 |
| `cancel` | `event: Event` | cancel 时触发 |

### Public Types

- `ConfirmSeverity`
- `ConfirmProps`
- `ConfirmEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Confirm non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Confirm uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Confirm RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Confirm client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/overlay` |
| metadata | `component-metadata/Confirm.json` |
| API extract | `generated/component-api/Confirm.json` |

> 完整 Demo 见 `example/demos/Confirm`（example 本地调试，不上线）。

