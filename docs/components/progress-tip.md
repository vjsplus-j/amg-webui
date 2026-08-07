# ProgressTip

ProgressTip：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

ProgressTip：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- v-model 双向绑定
- 语义色变体
- 多尺寸规格
- 可关闭
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { ProgressTip } from 'amg-webui/core'`

```vue
<script setup>
import { ProgressTip } from 'amg-webui/core'
</script>

<template>
  <ProgressTip />
</template>
```

Curated demo：`example/demos/ProgressTip/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `undefined` | 绑定值 / Bound value (v-model) |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `message` | `string` | `undefined` | message 字符串 |
| `percentage` | `number` | 0 | percentage 数值 |
| `severity` | `Severity` | `info` | 语义色：`primary` · `secondary` · `danger` 等 / Semantic color |
| `size` | `ProgressTipSize` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `showText` | `boolean` | true | 是否启用 showText |
| `striped` | `boolean` | false | 斑马纹 / Striped rows |
| `indeterminate` | `boolean` | false | 半选状态 / Indeterminate |
| `closable` | `boolean` | false | 显示关闭按钮 / Show close button |
| `currentStep` | `number` | `undefined` | currentStep 数值 |
| `totalSteps` | `number` | `undefined` | totalSteps 数值 |
| `actionText` | `string` | `undefined` | actionText 字符串 |
| `state` | `ProgressTipState` | `active` | state 配置项 |
| `cancellable` | `boolean` | false | 是否启用 cancellable |
| `cancelText` | `string` | `undefined` | cancelText 字符串 |
| `retryable` | `boolean` | false | 是否启用 retryable |
| `retryText` | `string` | `undefined` | retryText 字符串 |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: number` | v-model 更新 / v-model update |
| `complete` | `void` | complete 时触发 |
| `close` | `void` | 关闭 / Close |
| `action` | `event: MouseEvent` | action 时触发 |
| `cancel` | `event: MouseEvent` | cancel 时触发 |
| `retry` | `event: MouseEvent` | retry 时触发 |
| `pause` | `event: MouseEvent` | pause 时触发 |
| `resume` | `event: MouseEvent` | resume 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `ProgressTipSize`
- `ProgressTipState`
- `ProgressTipProps`
- `ProgressTipEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ProgressTip non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ProgressTip uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ProgressTip RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ProgressTip client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/ProgressTip.json` |
| API extract | `generated/component-api/ProgressTip.json` |

> 完整 Demo 见 `example/demos/ProgressTip`（example 本地调试，不上线）。

