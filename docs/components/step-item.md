# StepItem

StepItem：面向企业场景的 Navigation 组件（成熟度 rc）。

## 组件介绍

StepItem：面向企业场景的 Navigation 组件（成熟度 rc）。

## 核心特性

- Navigation 家族组件
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 菜单、标签页、面包屑等导航
- 页面结构引导
- 需要禁用/只读控制的表单场景

**不适用**

- 单页极简场景可省略复杂导航组件

## 基础用法

> `import { StepItem } from 'amg-webui/core'`

```vue
<script setup>
import { StepItem } from 'amg-webui/core'
</script>

<template>
  <StepItem />
</template>
```

Curated demo：`example/demos/StepItem/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `icon` | `string` | `undefined` | 图标名 / Icon name |
| `status` | `StepStatus` | `undefined` | Override computed state |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `index: number, event: MouseEvent` | 点击 / Click |

### Public Types

- `StepStatus`
- `StepItemProps`
- `StepItemEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts StepItem interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts StepItem uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts StepItem RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts StepItem client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/StepItem.json` |
| API extract | `generated/component-api/StepItem.json` |

> 完整 Demo 见 `example/demos/StepItem`（example 本地调试，不上线）。

