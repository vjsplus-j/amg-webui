# OnvifAlarmPanel

OnvifAlarmPanel：面向企业场景的 ONVIF 组件（成熟度 rc）。

## 组件介绍

OnvifAlarmPanel：面向企业场景的 ONVIF 组件（成熟度 rc）。

## 核心特性

- ONVIF 家族组件
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- ONVIF 设备发现与管理
- IPC 运维面板

**不适用**

- 非 ONVIF 设备对接场景

## 基础用法

> `import { OnvifAlarmPanel } from 'amg-webui/onvif'`

```vue
<script setup>
import { OnvifAlarmPanel } from 'amg-webui/onvif'
</script>

<template>
  <OnvifAlarmPanel />
</template>
```

Curated demo：`example/demos/OnvifAlarmPanel/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `alarms` | `OnvifAlarm[]` | `() => [ { id: 'a1', type: 'motion', time: '2026-07-14 10:00:00' }, { id: 'a2', type: 'tamper', time: '2026-07-14 09:30:00' } ]` | alarms 列表数据 |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `title` | `string` | `undefined` | 标题 / Title |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `acknowledge` | `id: string` | acknowledge 时触发 |

### Public Types

- `OnvifAlarm`
- `OnvifAlarmPanelProps`
- `OnvifAlarmPanelEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts OnvifAlarmPanel interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifAlarmPanel uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifAlarmPanel RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifAlarmPanel client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/onvif` |
| metadata | `component-metadata/OnvifAlarmPanel.json` |
| API extract | `generated/component-api/OnvifAlarmPanel.json` |

> 完整 Demo 见 `example/demos/OnvifAlarmPanel`（example 本地调试，不上线）。

