# Link

Link 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Link 当前成熟度为 **RC**；完整交互见本地 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { Link } from '@amg-webui/core'
</script>

<template>
  <Link />
</template>
```

Curated demo：`example/demos/Link/index.vue`

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `href` | `string` | — | — |
| `to` | `string` | — | — |
| `type` | `LinkType` | — | 输入类型 / Input type |
| `size` | `Size` | — | 尺寸：`sm` · `md` · `lg` / Size variant |
| `underline` | `LinkUnderline` | — | — |
| `disabled` | `boolean` | — | 是否禁用 / Whether disabled |
| `readonly` | `boolean` | — | 是否只读 / Read-only |
| `loading` | `boolean` | — | 加载中状态 / Loading state |
| `target` | `'_self' \| '_blank' \| '_parent' \| '_top' \| string` | — | — |
| `replace` | `boolean` | — | — |
| `icon` | `string` | — | 图标名 / Icon name |
| `iconPos` | `LinkIconPos` | — | 图标位置 / Icon position |
| `iconSize` | `Size` | — | — |
| `iconGap` | `Size \| string` | — | — |
| `ariaLabel` | `string` | — | 无障碍标签 / ARIA label |
| `tooltip` | `string` | — | — |
| `stopPropagation` | `boolean` | — | — |
| `permission` | `boolean \| (() => boolean)` | — | — |
| `permissionMode` | `LinkPermissionMode` | — | — |
| `permissionTip` | `string` | — | — |
| `beforeClick` | `(event: MouseEvent) => boolean \| void \| Promise<boolean \| void>` | — | — |
| `clickGuard` | `LinkClickGuard` | — | — |
| `wait` | `number` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | 点击 / Click |
| `focus` | `event: FocusEvent` | 聚焦 / Focus |
| `blur` | `event: FocusEvent` | 失焦 / Blur |

## Public types

- `LinkType`
- `LinkUnderline`
- `LinkIconPos`
- `LinkClickGuard`
- `LinkPermissionMode`
- `LinkProps`
- `LinkEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/Link.json` |

> 完整 Demo 见 `example/demos/Link`。对外 docs 为 API 导向页面；交互预览见本地 example（不上线）。
