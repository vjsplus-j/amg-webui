# Progress

Progress：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Progress：面向企业场景的 Foundation 组件（成熟度 rc）。

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

> `import { Progress } from 'amg-webui/core'`

```vue
<script setup>
import { Progress } from 'amg-webui/core'
</script>

<template>
  <Progress />
</template>
```

Curated demo：`example/demos/Progress/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `percentage` | `number` | **必填** | percentage 数值 |
| `type` | `ProgressType` | `line` | 输入类型 / Input type |
| `status` | `ProgressStatus` | `normal` | status 配置项 |
| `showText` | `boolean` | true | 是否启用 showText |
| `strokeWidth` | `number \| string` | `undefined` | strokeWidth 数值 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `change` | `percentage: number` | Percentage clamped value changed |
| `finish` | `void` | Fires once when percentage reaches 100 |

### Public Types

- `ProgressType`
- `ProgressStatus`
- `ProgressProps`
- `ProgressEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Progress non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Progress uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Progress RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Progress client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Progress.json` |
| API extract | `generated/component-api/Progress.json` |

> 完整 Demo 见 `example/demos/Progress`（example 本地调试，不上线）。

