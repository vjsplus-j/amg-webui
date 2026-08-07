# Drawer

Drawer 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Drawer 当前成熟度为 **RC**；下方 DocsDemo 提供 docs 站内嵌交互，完整场景见 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { Drawer } from '@amg-webui/overlay'
</script>

<template>
  <Drawer />
</template>
```

Curated demo：`example/demos/Drawer/index.vue`

## 交互演示

<DocsDemo name="drawer-basic" />

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | — | 是否显示（v-model:visible）/ Visibility |
| `title` | `string` | — | 标题 / Title |
| `placement` | `DrawerPlacement` | — | 抽屉方向 / Drawer placement |
| `width` | `string` | — | — |
| `height` | `string` | — | — |
| `modal` | `boolean` | — | 模态遮罩 / Modal overlay |
| `closable` | `boolean` | — | 显示关闭按钮 / Show close button |
| `dismissible` | `boolean` | — | — |
| `closeOnClickOverlay` | `boolean` | — | — |
| `closeOnPressEscape` | `boolean` | — | — |
| `lockScroll` | `boolean` | — | — |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `zIndex` | `number` | — | — |
| `teleportTo` | `string \| HTMLElement` | — | — |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |
| `beforeClose` | `( reason: DrawerCloseReason, event?: Event, ) => boolean \| Promise<boolean>` | — | — |
| `trackId` | `string` | — | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | — | 是否上报 Telemetry / Enable telemetry |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:visible` | `value: boolean` | visible 更新 / visible update |
| `show` | `event?: Event` | — |
| `hide` | `event?: Event` | — |
| `open` | `void` | 打开 / Open |
| `closed` | `void` | — |
| `close` | `event?: Event, reason?: DrawerCloseReason` | 关闭 / Close |
| `error` | `error: unknown` | — |

## Public types

- `DrawerPlacement`
- `DrawerCloseReason`
- `DrawerProps`
- `DrawerEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/Drawer.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/Drawer`。
