# StackLayout

StackLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

StackLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件
- 块级布局

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { StackLayout } from 'amg-webui/core'`

```vue
<script setup>
import { StackLayout } from 'amg-webui/core'
</script>

<template>
  <StackLayout />
</template>
```

Curated demo：`example/demos/StackLayout/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `direction` | `"vertical" \| "horizontal"` | `vertical` | direction 配置项 |
| `gap` | `StackGap` | `md` | gap 配置项 |
| `align` | `StackAlign` | `stretch` | align 配置项 |
| `justify` | `StackJustify` | `start` | justify 配置项 |
| `wrap` | `boolean` | false | Allow wrap (useful for horizontal stacks) |
| `inline` | `boolean` | false | inline-flex instead of flex + full width |
| `block` | `boolean` | true | Stretch to 100% parent width (default true unless inline) |
| `reverse` | `boolean` | false | Reverse visual order without changing slot source order. |
| `divider` | `boolean` | false | Draw token-based separators between direct children. |
| `as` | `"div" \| "section" \| "nav" \| "ul" \| "ol"` | `div` | as 配置项 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Public Types

- `StackGap`
- `StackAlign`
- `StackJustify`
- `StackLayoutEmits`
- `StackLayoutProps`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts StackLayout non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts StackLayout uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts StackLayout RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts StackLayout client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/StackLayout.json` |
| API extract | `generated/component-api/StackLayout.json` |

> 完整 Demo 见 `example/demos/StackLayout`（example 本地调试，不上线）。

