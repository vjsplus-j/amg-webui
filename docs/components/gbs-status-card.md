# GbsStatusCard

GbsStatusCard：面向企业场景的 GB28181 组件（成熟度 rc）。

## 组件介绍

GbsStatusCard：面向企业场景的 GB28181 组件（成熟度 rc）。

## 核心特性

- GB28181 家族组件
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 国标 GB28181 设备与级联
- 视频监控平台

**不适用**

- 非国标场景勿引入行业包

## 基础用法

> `import { GbsStatusCard } from 'amg-webui/gb28181'`

```vue
<script setup>
import { GbsStatusCard } from 'amg-webui/gb28181'
</script>

<template>
  <GbsStatusCard />
</template>
```

Curated demo：`example/demos/GbsStatusCard/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `registered` | `boolean` | true | 是否启用 registered |
| `deviceCount` | `number` | 12 | deviceCount 数值 |
| `channelCount` | `number` | 48 | channelCount 数值 |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `title` | `string` | `undefined` | 标题 / Title |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `refresh` | `void` | refresh 时触发 |

### Public Types

- `GbsStatusCardProps`
- `GbsStatusCardEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts GbsStatusCard interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts GbsStatusCard uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts GbsStatusCard RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts GbsStatusCard client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/gb28181` |
| metadata | `component-metadata/GbsStatusCard.json` |
| API extract | `generated/component-api/GbsStatusCard.json` |

> 完整 Demo 见 `example/demos/GbsStatusCard`（example 本地调试，不上线）。

