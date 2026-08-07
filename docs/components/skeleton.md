# Skeleton

Skeleton 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Skeleton 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { Skeleton } from '@amg-webui/core'
</script>

<template>
  <Skeleton />
</template>
```

Curated demo：`example/demos/Skeleton/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `variant` | `SkeletonVariant` | — | 外观变体：`solid` · `outlined` · `text` / Visual variant |
| `rows` | `number` | — | 每页行数 / Rows per page |
| `animated` | `boolean` | — | — |
| `animation` | `SkeletonAnimation` | — | — |
| `size` | `Size \| number \| string` | — | 尺寸：`sm` · `md` · `lg` / Size variant |
| `width` | `SkeletonWidth` | — | — |
| `height` | `string \| number` | — | — |
| `round` | `boolean` | — | — |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |

## Public types

- `SkeletonVariant`
- `SkeletonAnimation`
- `SkeletonWidth`
- `SkeletonProps`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/Skeleton.json` |

> 完整 Demo 见 `example/demos/Skeleton`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
