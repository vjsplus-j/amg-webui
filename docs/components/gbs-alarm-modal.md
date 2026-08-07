# GbsAlarmModal

GbsAlarmModal 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

GbsAlarmModal 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { GbsAlarmModal } from '@amg-webui/gb28181'
</script>

<template>
  <GbsAlarmModal />
</template>
```

Curated demo：`example/demos/GbsAlarmModal/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `open` | `boolean` | — | — |
| `alarm` | `GbsAlarmInfo \| null` | — | — |
| `title` | `string` | — | 标题 / Title |
| `description` | `string` | — | — |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `closable` | `boolean` | — | 显示关闭按钮 / Show close button |
| `maskClosable` | `boolean` | — | 点击遮罩关闭 / Close on mask click |
| `closeOnEscape` | `boolean` | — | — |
| `lockScroll` | `boolean` | — | — |
| `destroyOnClose` | `boolean` | — | 关闭后销毁内容 / Destroy on close |
| `teleportTo` | `string \| HTMLElement` | — | — |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:open` | `value: boolean` | — |
| `acknowledge` | `alarm: GbsAlarmInfo \| null` | — |
| `close` | `reason: GbsAlarmCloseReason` | 关闭 / Close |
| `open` | `void` | 打开 / Open |
| `afterOpen` | `void` | — |

## Public types

- `GbsAlarmCloseReason`
- `GbsAlarmInfo`
- `GbsAlarmModalProps`
- `GbsAlarmModalEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/GbsAlarmModal.json` |

> 完整 Demo 见 `example/demos/GbsAlarmModal`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
