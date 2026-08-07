# Exception

Exception：面向企业场景的 Feedback 组件（成熟度 rc）。

## 组件介绍

Exception：面向企业场景的 Feedback 组件（成熟度 rc）。

## 核心特性

- Feedback 家族组件
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 操作结果与状态提示
- 空态与加载反馈
- 异步提交或加载过程反馈

**不适用**

- 需要模态决策时用 Dialog / Confirm

## 基础用法

> `import { Exception } from 'amg-webui/core'`

```vue
<script setup>
import { Exception } from 'amg-webui/core'
</script>

<template>
  <Exception />
</template>
```

Curated demo：`example/demos/Exception/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `status` | `"403" \| "404" \| "500" \| "offline"` | `404` | status 配置项 |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |
| `actionText` | `string` | `undefined` | actionText 字符串 |
| `actionDisabled` | `boolean` | false | 是否启用 actionDisabled |
| `ariaLive` | `"polite" \| "assertive" \| "off"` | `polite` | ariaLive 配置项 |
| `secondaryActionText` | `string` | `undefined` | secondaryActionText 字符串 |
| `showCode` | `boolean` | true | 是否启用 showCode |
| `compact` | `boolean` | false | 是否启用 compact |
| `loading` | `boolean` | false | 加载中状态 / Loading state |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `action` | `event: MouseEvent` | action 时触发 |
| `secondaryAction` | `event: MouseEvent` | secondaryAction 时触发 |

### Public Types

- `ExceptionProps`
- `ExceptionEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts Exception interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Exception uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Exception RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Exception client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Exception.json` |
| API extract | `generated/component-api/Exception.json` |

> 完整 Demo 见 `example/demos/Exception`（example 本地调试，不上线）。

