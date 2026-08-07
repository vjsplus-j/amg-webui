# Space

Space：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

Space：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件
- 多尺寸规格
- 块级布局

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { Space } from 'amg-webui/core'`

```vue
<script setup>
import { Space } from 'amg-webui/core'
</script>

<template>
  <Space />
</template>
```

Curated demo：`example/demos/Space/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `size` | `SpaceSize` | `md` | Gap: xs–xl（极小/小/中/大/极大）→ `--spacing-*`；默认 md |
| `gap` | `SpaceSize` | `undefined` | Alias of size |
| `gutter` | `number \| string` | `undefined` | gutter 数值 |
| `direction` | `SpaceDirection` | `horizontal` | direction 配置项 |
| `align` | `'start' \| 'end' \| 'center' \| 'baseline' \| 'stretch'` | `undefined` | align 配置项 |
| `justify` | `'start' \| 'end' \| 'center' \| 'space-between' \| 'space-around' \| 'space-evenly'` | `undefined` | justify 配置项 |
| `wrap` | `boolean` | true | Wrap onto new lines (default true for horizontal) |
| `block` | `boolean` | false | Stretch to 100% parent width |
| `ariaLabel` | `string` | `undefined` | Accessible name for the spacing group |

### Public Types

- `SpaceDirection`
- `SpaceSize`
- `SpaceProps`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Space non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Space uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Space RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Space client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/core` |
| metadata | `component-metadata/Space.json` |
| API extract | `generated/component-api/Space.json` |

> 完整 Demo 见 `example/demos/Space`（example 本地调试，不上线）。

