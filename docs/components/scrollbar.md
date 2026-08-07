# Scrollbar

Scrollbar：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Scrollbar：面向企业场景的 Foundation 组件（成熟度 rc）。

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

> `import { Scrollbar } from 'amg-webui/core'`

```vue
<script setup>
import { Scrollbar } from 'amg-webui/core'
</script>

<template>
  <Scrollbar />
</template>
```

Curated demo：`example/demos/Scrollbar/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `height` | `string \| number` | `undefined` | CSS length or spacing-step number (× --spacing-xs) |
| `maxHeight` | `string \| number` | `undefined` | maxHeight 数值 |
| `native` | `boolean` | false | Use browser native scrollbar chrome |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |
| `axis` | `"both" \| "x" \| "y"` | `both` | axis 配置项 |
| `tabindex` | `number` | 0 | Tab 焦点顺序 / Tab order |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `endThreshold` | `number` | 1 | endThreshold 数值 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `scroll` | `event: Event` | scroll 时触发 |
| `reach-start` | `position: { top: number; left: number }` | reach-start 时触发 |
| `reach-end` | `position: { top: number; left: number }` | reach-end 时触发 |

### Public Types

- `ScrollbarProps`
- `ScrollbarEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts Scrollbar interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Scrollbar uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Scrollbar RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Scrollbar client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Scrollbar.json` |
| API extract | `generated/component-api/Scrollbar.json` |

> 完整 Demo 见 `example/demos/Scrollbar`（example 本地调试，不上线）。

