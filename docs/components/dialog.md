# Dialog

Dialog 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Dialog 当前成熟度为 **RC**；下方 DocsDemo 提供 docs 站内嵌交互，完整场景见 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

- [Button](./button)
- [Form](./form)

## 基础用法

```vue
<script setup>
import { Dialog } from '@amg-webui/overlay'
</script>

<template>
  <Dialog />
</template>
```

Curated demo：`example/demos/Dialog/index.vue`

## 交互演示

<DocsDemo name="dialog-basic" />

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `visible` | `boolean` | — | 是否显示（v-model:visible）/ Visibility |
| `header` | `string` | — | — |
| `footer` | `string` | — | — |
| `title` | `string` | — | 标题 / Title |
| `modal` | `boolean` | — | 模态遮罩 / Modal overlay |
| `dismissible` | `boolean` | — | — |
| `closable` | `boolean` | — | 显示关闭按钮 / Show close button |
| `maximizable` | `boolean` | — | — |
| `minimizable` | `boolean` | — | — |
| `size` | `DialogSize` | — | 尺寸：`sm` · `md` · `lg` / Size variant |
| `width` | `string` | — | — |
| `lockScroll` | `boolean` | — | — |
| `closeOnPressEscape` | `boolean` | — | — |
| `closeOnClickOverlay` | `boolean` | — | — |
| `teleportTo` | `string \| HTMLElement` | — | — |
| `zIndex` | `number` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `maximize` | `maximized: boolean` | — |
| `close` | `event?: Event, reason?: DialogCloseReason` | 关闭 / Close |

## Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | — |
| `header` | `props: Record<string, never>` | — |
| `footer` | `props: Record<string, never>` | — |

## Expose

| Expose | 类型 | 说明 |
| --- | --- | --- |
| `open` | `() => void` | — |
| `close` | `(reason?: DialogCloseReason) => void` | — |

## Public types

- `DialogSize`
- `DialogCloseReason`
- `DialogInstance`
- `DialogProps`
- `DialogEmits`
- `DialogSlots`
- `DialogExpose`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/Dialog.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/Dialog`。
