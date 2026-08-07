# FlowLayout

FlowLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

FlowLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { FlowLayout } from 'amg-webui/core'`

```vue
<script setup>
import { FlowLayout } from 'amg-webui/core'
</script>

<template>
  <FlowLayout />
</template>
```

Curated demo：`example/demos/FlowLayout/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `gap` | `FlowGap` | `md` | gap 配置项 |
| `rowGap` | `FlowGap` | `undefined` | Row gap — defaults to `gap` when omitted |
| `columnGap` | `FlowGap` | `undefined` | Column gap — defaults to `gap` when omitted |
| `align` | `FlowAlign` | `start` | align 配置项 |
| `justify` | `FlowJustify` | `start` | justify 配置项 |
| `reverse` | `boolean` | false | Reverse wrap direction |
| `wrap` | `boolean` | true | 是否启用 wrap |
| `as` | `"div" \| "section" \| "ul" \| "ol"` | `div` | as 配置项 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Public Types

- `FlowGap`
- `FlowAlign`
- `FlowJustify`
- `FlowLayoutEmits`
- `FlowLayoutProps`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts FlowLayout non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts FlowLayout uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts FlowLayout RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts FlowLayout client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/FlowLayout.json` |
| API extract | `generated/component-api/FlowLayout.json` |

> 完整 Demo 见 `example/demos/FlowLayout`（example 本地调试，不上线）。

