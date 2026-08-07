# Header

Header：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

Header：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件
- 多尺寸规格

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { Header } from 'amg-webui/core'`

```vue
<script setup>
import { Header } from 'amg-webui/core'
</script>

<template>
  <Header />
</template>
```

Curated demo：`example/demos/Header/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `sticky` | `boolean` | false | 是否启用 sticky |
| `fixed` | `boolean` | false | Viewport-fixed bar (implies sticky stacking) |
| `bordered` | `boolean` | true | 是否启用 bordered |
| `size` | `'sm' \| 'md' \| 'lg'` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `padding` | `HeaderPadding` | `page` | Horizontal padding token; default follows size / page pad |
| `translucent` | `boolean` | true | Soft glass surface (default true) |
| `elevated` | `boolean` | false | 是否启用 elevated |
| `centered` | `boolean` | false | 是否启用 centered |
| `title` | `string` | `undefined` | 标题 / Title |
| `subtitle` | `string` | `undefined` | subtitle 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `as` | `'header' \| 'div'` | `header` | as 配置项 |

### Public Types

- `HeaderPadding`
- `HeaderProps`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Header non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Header uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Header RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Header client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Header.json` |
| API extract | `generated/component-api/Header.json` |

> 完整 Demo 见 `example/demos/Header`（example 本地调试，不上线）。

