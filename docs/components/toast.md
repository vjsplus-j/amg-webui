# Toast

Toast：面向企业场景的 Feedback 组件（成熟度 rc）。

## 组件介绍

Toast：面向企业场景的 Feedback 组件（成熟度 rc）。

## 核心特性

- Feedback 家族组件

## 何时使用 / 不适用

**适用**

- 操作结果与状态提示
- 空态与加载反馈

**不适用**

- 需要模态决策时用 Dialog / Confirm

## 基础用法

> `import { Toast } from 'amg-webui/overlay'`

```vue
<script setup>
import { Toast } from 'amg-webui/overlay'
</script>

<template>
  <Toast />
</template>
```

Curated demo：`example/demos/Toast/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| （无公开 Props） | | | |

### Public Types

- `ToastProps`
- `ToastEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Toast non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Toast uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Toast RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Toast client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Toast.json` |
| API extract | `generated/component-api/Toast.json` |

> 完整 Demo 见 `example/demos/Toast`（example 本地调试，不上线）。

