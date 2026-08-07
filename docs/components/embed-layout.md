# EmbedLayout

EmbedLayout 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

EmbedLayout 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { EmbedLayout } from '@amg-webui/core'
</script>

<template>
  <EmbedLayout />
</template>
```

Curated demo：`example/demos/EmbedLayout/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `aspectRatio` | `EmbedAspect` | — | — |
| `fill` | `boolean` | — | — |
| `rounded` | `boolean` | — | 圆角按钮 / Rounded shape |
| `bordered` | `boolean` | — | — |
| `objectFit` | `EmbedObjectFit` | — | — |
| `label` | `string` | — | 显示文案 / Display label |
| `caption` | `string` | — | — |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `interactive` | `boolean` | — | — |
| `as` | `"div" \| "figure" \| "section"` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `frame-click` | `event: MouseEvent \| KeyboardEvent` | — |

## Public types

- `EmbedAspect`
- `EmbedObjectFit`
- `EmbedLayoutProps`
- `EmbedLayoutEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/EmbedLayout.json` |

> 完整 Demo 见 `example/demos/EmbedLayout`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
