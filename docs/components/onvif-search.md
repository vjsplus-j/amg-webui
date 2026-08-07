# OnvifSearch

OnvifSearch：面向企业场景的 ONVIF 组件（成熟度 rc）。

## 组件介绍

OnvifSearch：面向企业场景的 ONVIF 组件（成熟度 rc）。

## 核心特性

- ONVIF 家族组件
- 加载状态反馈
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- ONVIF 设备发现与管理
- IPC 运维面板

**不适用**

- 非 ONVIF 设备对接场景

## 基础用法

> `import { OnvifSearch } from 'amg-webui/onvif'`

```vue
<script setup>
import { OnvifSearch } from 'amg-webui/onvif'
</script>

<template>
  <OnvifSearch />
</template>
```

Curated demo：`example/demos/OnvifSearch/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `devices` | `OnvifDevice[]` | `() => [ { id: 'cam-01', name: 'IPC-Office-01', ip: '192.168.1.101', port: 80, online: true }, { id: 'cam-02', name: 'IPC-Gate-02', ip: '192.168.1.102', port: 80, online: true }, { id: 'nvr-01', name: 'NVR-Main', ip: '192.168.1.200', port: 8000, online: false } ]` | devices 列表数据 |
| `filter` | `string` | `` | filter 字符串 |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `pageSize` | `number` | 50 | Max rows before virtual hint (display only) |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:filter` | `v: string` | `filter` 更新时触发（v-model） |
| `discover` | `void` | discover 时触发 |
| `select` | `device: OnvifDevice` | 选中 / Select |

### Public Types

- `OnvifDevice`
- `OnvifSearchProps`
- `OnvifSearchEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts OnvifSearch interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifSearch uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifSearch RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifSearch client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/OnvifSearch.json` |
| API extract | `generated/component-api/OnvifSearch.json` |

> 完整 Demo 见 `example/demos/OnvifSearch`（example 本地调试，不上线）。

