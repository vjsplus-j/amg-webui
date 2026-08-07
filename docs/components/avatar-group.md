# AvatarGroup

AvatarGroup 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

AvatarGroup 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { AvatarGroup } from '@amg-webui/core'
</script>

<template>
  <AvatarGroup />
</template>
```

Curated demo：`example/demos/AvatarGroup/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `max` | `number` | — | — |
| `size` | `AvatarSize` | — | 尺寸：`sm` · `md` · `lg` / Size variant |
| `shape` | `AvatarShape` | — | — |
| `variant` | `'default' \| 'neon'` | — | 外观变体：`solid` · `outlined` · `text` / Visual variant |
| `overlap` | `string` | — | — |
| `maxTooltip` | `string` | — | — |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |

## Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `props: Record<string, never>` | — |
| `overflowTooltip` | `props: { overflowCount: number; labels: string[] }` | — |

## Public types

- `AvatarGroupEmits`
- `AvatarGroupProps`
- `AvatarGroupSlots`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/AvatarGroup.json` |

> 完整 Demo 见 `example/demos/AvatarGroup`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
