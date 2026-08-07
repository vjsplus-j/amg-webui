# Popover

Popover：面向企业场景的 Overlay 组件（成熟度 rc）。

## 组件介绍

Popover：面向企业场景的 Overlay 组件（成熟度 rc）。

## 核心特性

- Overlay 家族组件
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 对话框、抽屉、气泡确认等浮层
- 阻断式交互
- 需要禁用/只读控制的表单场景

**不适用**

- 轻量提示优先 Toast / Message
- 非阻断提示不要用 Modal 对话框

## 基础用法

> `import { Popover } from 'amg-webui/overlay'`

```vue
<script setup>
import { Popover } from 'amg-webui/overlay'
</script>

<template>
  <Popover />
</template>
```

Curated demo：`example/demos/Popover/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | `undefined` | 是否可见 / Visibility (v-model:visible) |
| `title` | `string` | `undefined` | 标题 / Title |
| `placement` | `FloatingPlacement` | `top` | 抽屉方向 / Drawer placement |
| `trigger` | `PopoverTrigger` | `click` | trigger 配置项 |
| `dismissible` | `boolean` | true | 是否启用 dismissible |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `offset` | `number` | 8 | offset 数值 |
| `zIndex` | `number` | `undefined` | zIndex 数值 |
| `openDelay` | `number` | 100 | openDelay 数值 |
| `closeDelay` | `number` | 120 | closeDelay 数值 |
| `showArrow` | `boolean` | true | 是否启用 showArrow |
| `focusOnOpen` | `boolean` | false | 是否启用 focusOnOpen |
| `teleportTo` | `string \| HTMLElement` | `body` | teleportTo 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:visible` | `value: boolean` | visible 更新 / visible update |
| `open` | `event?: Event` | 打开 / Open |
| `close` | `reason: PopoverCloseReason, event?: Event` | 关闭 / Close |
| `openChange` | `value: boolean, reason?: PopoverCloseReason` | openChange 时触发 |

### Public Types

- `PopoverTrigger`
- `PopoverCloseReason`
- `PopoverProps`
- `PopoverEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`Enter` · `Escape`
- Enter: Enter on trigger opens popover panel; Escape: Escape closes open popover panel

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Popover uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Popover RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Popover client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Popover.json` |
| API extract | `generated/component-api/Popover.json` |

> 完整 Demo 见 `example/demos/Popover`（example 本地调试，不上线）。

