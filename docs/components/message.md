# Message

Message：面向企业场景的 Feedback 组件（成熟度 rc）。

## 组件介绍

Message：面向企业场景的 Feedback 组件（成熟度 rc）。

## 核心特性

- Feedback 家族组件
- 语义色变体
- 可关闭
- 外观变体
- 事件回调

## 何时使用 / 不适用

**适用**

- 操作结果与状态提示
- 空态与加载反馈

**不适用**

- 需要模态决策时用 Dialog / Confirm

## 基础用法

> `import { Message } from 'amg-webui/overlay'`

```vue
<script setup>
import { Message } from 'amg-webui/overlay'
</script>

<template>
  <Message />
</template>
```

Curated demo：`example/demos/Message/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | `undefined` | 是否可见 / Visibility (v-model:visible) |
| `severity` | `Severity` | `info` | 语义色：`primary` · `secondary` · `danger` 等 / Semantic color |
| `title` | `string` | `undefined` | 标题 / Title |
| `text` | `string` | `undefined` | text 字符串 |
| `showIcon` | `boolean` | true | 是否启用 showIcon |
| `closable` | `boolean` | true | 显示关闭按钮 / Show close button |
| `autoHide` | `boolean` | false | 是否启用 autoHide |
| `hideDelay` | `number` | 3000 | hideDelay 数值 |
| `pauseOnHover` | `boolean` | true | 是否启用 pauseOnHover |
| `showProgress` | `boolean` | false | 是否启用 showProgress |
| `variant` | `MessageVariant` | `soft` | 外观变体：`solid` · `outlined` · `text` / Visual variant |
| `actionText` | `string` | `undefined` | actionText 字符串 |
| `ariaLive` | `"polite" \| "assertive" \| "off"` | `undefined` | ariaLive 配置项 |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:visible` | `value: boolean` | visible 更新 / visible update |
| `close` | `reason: MessageCloseReason, event?: Event` | 关闭 / Close |
| `action` | `event: MouseEvent` | action 时触发 |
| `closed` | `void` | closed 时触发 |

### Public Types

- `MessageVariant`
- `MessageCloseReason`
- `MessageProps`
- `MessageEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts Message interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Message uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Message RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Message client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Message.json` |
| API extract | `generated/component-api/Message.json` |

> 完整 Demo 见 `example/demos/Message`（example 本地调试，不上线）。

