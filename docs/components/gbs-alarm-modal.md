# GbsAlarmModal

GbsAlarmModal：面向企业场景的 GB28181 组件（成熟度 rc）。

## 组件介绍

GbsAlarmModal：面向企业场景的 GB28181 组件（成熟度 rc）。

## 核心特性

- GB28181 家族组件
- 支持禁用状态
- 加载状态反馈
- 可关闭
- 事件回调

## 何时使用 / 不适用

**适用**

- 国标 GB28181 设备与级联
- 视频监控平台

**不适用**

- 非国标场景勿引入行业包

## 基础用法

> `import { GbsAlarmModal } from 'amg-webui/gb28181'`

```vue
<script setup>
import { GbsAlarmModal } from 'amg-webui/gb28181'
</script>

<template>
  <GbsAlarmModal />
</template>
```

Curated demo：`example/demos/GbsAlarmModal/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | false | 是否启用 open |
| `alarm` | `GbsAlarmInfo \| null` | `null` | alarm 配置项 |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `closable` | `boolean` | true | 显示关闭按钮 / Show close button |
| `maskClosable` | `boolean` | true | 点击遮罩关闭 / Close on mask click |
| `closeOnEscape` | `boolean` | true | 是否启用 closeOnEscape |
| `lockScroll` | `boolean` | true | 是否启用 lockScroll |
| `destroyOnClose` | `boolean` | true | 关闭后销毁内容 / Destroy on close |
| `teleportTo` | `string \| HTMLElement` | `body` | teleportTo 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:open` | `value: boolean` | `open` 更新时触发（v-model） |
| `acknowledge` | `alarm: GbsAlarmInfo \| null` | acknowledge 时触发 |
| `close` | `reason: GbsAlarmCloseReason` | 关闭 / Close |
| `open` | `void` | 打开 / Open |
| `afterOpen` | `void` | afterOpen 时触发 |

### Public Types

- `GbsAlarmCloseReason`
- `GbsAlarmInfo`
- `GbsAlarmModalProps`
- `GbsAlarmModalEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts GbsAlarmModal non-interactive display — keyboard N/A

## 无障碍

- 状态：`FAIL`
- a11y PASS requires A11Y_STRUCTURE/A11Y_CONTRAST or critical/serious counts (family name alone insufficient)

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts GbsAlarmModal uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts GbsAlarmModal RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts GbsAlarmModal client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/GbsAlarmModal.json` |
| API extract | `generated/component-api/GbsAlarmModal.json` |

> 完整 Demo 见 `example/demos/GbsAlarmModal`（example 本地调试，不上线）。

