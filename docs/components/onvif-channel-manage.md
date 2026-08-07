# OnvifChannelManage

OnvifChannelManage：面向企业场景的 ONVIF 组件（成熟度 rc）。

## 组件介绍

OnvifChannelManage：面向企业场景的 ONVIF 组件（成熟度 rc）。

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

> `import { OnvifChannelManage } from 'amg-webui/onvif'`

```vue
<script setup>
import { OnvifChannelManage } from 'amg-webui/onvif'
</script>

<template>
  <OnvifChannelManage />
</template>
```

Curated demo：`example/demos/OnvifChannelManage/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `channels` | `OnvifChannel[]` | `() => [{ id: 'ch1', name: 'Channel-01' }, { id: 'ch2', name: 'Channel-02' }]` | channels 列表数据 |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `title` | `string` | `undefined` | 标题 / Title |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `add` | `name: string` | add 时触发 |
| `remove` | `id: string` | 移除文件 / Remove file |

### Public Types

- `OnvifChannel`
- `OnvifChannelManageProps`
- `OnvifChannelManageEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts OnvifChannelManage interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifChannelManage uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifChannelManage RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts OnvifChannelManage client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/OnvifChannelManage.json` |
| API extract | `generated/component-api/OnvifChannelManage.json` |

> 完整 Demo 见 `example/demos/OnvifChannelManage`（example 本地调试，不上线）。

