# Icon

Icon 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Icon 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { Icon } from '@amg-webui/core'
</script>

<template>
  <Icon />
</template>
```

Curated demo：`example/demos/Icon/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `spin` | `boolean` | — | — |
| `pulse` | `boolean` | — | — |
| `heartbeat` | `boolean` | — | — |
| `bounce` | `boolean` | — | — |
| `blink` | `boolean` | — | — |
| `breathe` | `boolean` | — | — |
| `glow` | `boolean` | — | — |
| `marqueeLeft` | `boolean` | — | — |
| `marqueeRight` | `boolean` | — | — |
| `scrollUp` | `boolean` | — | — |
| `scrollDown` | `boolean` | — | — |
| `dampOut` | `boolean` | — | — |
| `animationDuration` | `number \| string` | — | — |
| `name` | `IconName` | — | 表单字段名 / Form field name |
| `size` | `IconSize` | — | 尺寸：`sm` · `md` · `lg` / Size variant |
| `color` | `string` | — | — |
| `strokeWidth` | `number` | — | — |
| `absoluteStrokeWidth` | `boolean` | — | — |
| `rotate` | `number` | — | — |
| `flip` | `IconFlip` | — | — |
| `flipH` | `boolean` | — | — |
| `flipV` | `boolean` | — | — |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `selected` | `boolean` | — | — |
| `opacity` | `number` | — | — |
| `label` | `string` | — | 显示文案 / Display label |
| `alt` | `string` | — | — |
| `title` | `string` | — | 标题 / Title |
| `interactive` | `boolean` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | 点击 / Click |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |
| `keydown` | `event: KeyboardEvent` | — |

## Public types

- `IconName`
- `IconSize`
- `IconFlip`
- `IconProps`
- `IconEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/Icon.json` |

> 完整 Demo 见 `example/demos/Icon`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
