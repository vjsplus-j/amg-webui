# Loading

Loading：面向企业场景的 Feedback 组件（成熟度 rc）。

## 组件介绍

Loading：面向企业场景的 Feedback 组件（成熟度 rc）。

## 核心特性

- Feedback 家族组件
- 多尺寸规格
- 事件回调

## 何时使用 / 不适用

**适用**

- 操作结果与状态提示
- 空态与加载反馈

**不适用**

- 需要模态决策时用 Dialog / Confirm

## 基础用法

> `import { Loading } from 'amg-webui/core'`

```vue
<script setup>
import { Loading } from 'amg-webui/core'
</script>

<template>
  <Loading />
</template>
```

Curated demo：`example/demos/Loading/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | true | 是否可见 / Visibility (v-model:visible) |
| `text` | `string` | `undefined` | text 字符串 |
| `fullscreen` | `boolean` | false | 是否启用 fullscreen |
| `size` | `LoadingSize` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `indicator` | `LoadingIndicator` | `spinner` | indicator 配置项 |
| `lockScroll` | `boolean` | true | 是否启用 lockScroll |
| `backdrop` | `boolean` | true | 是否启用 backdrop |
| `delay` | `number` | 0 | delay 数值 |
| `progress` | `number` | `undefined` | progress 数值 |
| `cancellable` | `boolean` | false | 是否启用 cancellable |
| `cancelText` | `string` | `undefined` | cancelText 字符串 |
| `zIndex` | `number` | `undefined` | zIndex 数值 |
| `live` | `"polite" \| "assertive" \| "off"` | `polite` | live 配置项 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:visible` | `value: boolean` | visible 更新 / visible update |
| `visibleChange` | `value: boolean` | visibleChange 时触发 |
| `cancel` | `event: MouseEvent` | cancel 时触发 |
| `after-enter` | `void` | after-enter 时触发 |
| `after-leave` | `void` | after-leave 时触发 |

### Public Types

- `LoadingSize`
- `LoadingIndicator`
- `LoadingProps`
- `LoadingEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Loading non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Loading uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Loading RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Loading client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Loading.json` |
| API extract | `generated/component-api/Loading.json` |

> 完整 Demo 见 `example/demos/Loading`（example 本地调试，不上线）。

