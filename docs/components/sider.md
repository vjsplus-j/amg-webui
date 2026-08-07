# Sider

Sider：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

Sider：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { Sider } from 'amg-webui/core'`

```vue
<script setup>
import { Sider } from 'amg-webui/core'
</script>

<template>
  <Sider />
</template>
```

Curated demo：`example/demos/Sider/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `width` | `string` | `var(--ln-sidebar-width)` | Expanded width (CSS length or token). Default: var(--ln-sidebar-width) |
| `collapsedWidth` | `string` | `var(--ln-sidebar-width-collapsed)` | Collapsed width. Default: var(--ln-sidebar-width-collapsed) |
| `collapsed` | `boolean` | false | 是否启用 collapsed |
| `collapsible` | `boolean` | true | 是否启用 collapsible |
| `side` | `'left' \| 'right'` | `left` | Which edge the sider docks to |
| `bordered` | `boolean` | true | Show edge border (default true) |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:collapsed` | `value: boolean` | `collapsed` 更新时触发（v-model） |
| `collapse` | `collapsed: boolean` | collapse 时触发 |

### Public Types

- `SiderProps`
- `SiderEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts Sider interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Sider uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Sider RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Sider client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Sider.json` |
| API extract | `generated/component-api/Sider.json` |

> 完整 Demo 见 `example/demos/Sider`（example 本地调试，不上线）。

