# ConfirmDialog

ConfirmDialog：面向企业场景的 Overlay 组件（成熟度 rc）。

## 组件介绍

ConfirmDialog：面向企业场景的 Overlay 组件（成熟度 rc）。

## 核心特性

- Overlay 家族组件
- 模态遮罩
- 可关闭
- 事件回调

## 何时使用 / 不适用

**适用**

- 对话框、抽屉、气泡确认等浮层
- 阻断式交互

**不适用**

- 轻量提示优先 Toast / Message
- 非阻断提示不要用 Modal 对话框

## 基础用法

> `import { ConfirmDialog } from 'amg-webui/overlay'`

```vue
<script setup>
import { ConfirmDialog } from 'amg-webui/overlay'
</script>

<template>
  <ConfirmDialog />
</template>
```

Curated demo：`example/demos/ConfirmDialog/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | false | 是否可见 / Visibility (v-model:visible) |
| `title` | `string` | `` | 标题 / Title |
| `message` | `string` | `` | message 字符串 |
| `icon` | `ConfirmDialogIcon` | `warning` | 图标名 / Icon name |
| `confirmLabel` | `string` | `` | confirmLabel 字符串 |
| `cancelLabel` | `string` | `` | cancelLabel 字符串 |
| `modal` | `boolean` | true | 模态遮罩 / Modal overlay |
| `draggable` | `boolean` | false | 是否启用 draggable |
| `closable` | `boolean` | true | 显示关闭按钮 / Show close button |
| `dismissible` | `boolean` | true | 是否启用 dismissible |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `confirm` | `event: Event` | 确认时触发 |
| `cancel` | `event: Event` | cancel 时触发 |

### Public Types

- `ConfirmDialogIcon`
- `ConfirmDialogProps`
- `ConfirmDialogEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`Escape`
- Escape: Escape dismisses confirm dialog and emits update:visible false

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ConfirmDialog uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ConfirmDialog RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ConfirmDialog client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/ConfirmDialog.json` |
| API extract | `generated/component-api/ConfirmDialog.json` |

> 完整 Demo 见 `example/demos/ConfirmDialog`（example 本地调试，不上线）。

