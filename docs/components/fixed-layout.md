# FixedLayout

FixedLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

FixedLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件
- 占位提示
- 事件回调

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { FixedLayout } from 'amg-webui/core'`

```vue
<script setup>
import { FixedLayout } from 'amg-webui/core'
</script>

<template>
  <FixedLayout />
</template>
```

Curated demo：`example/demos/FixedLayout/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `mode` | `"fixed" \| "absolute"` | `fixed` | mode 配置项 |
| `position` | `FixedLayoutPosition` | `top` | position 配置项 |
| `offset` | `"none" \| "sm" \| "md" \| "lg"` | `none` | offset 配置项 |
| `zIndex` | `number` | `undefined` | zIndex 数值 |
| `placeholder` | `boolean` | true | 占位提示 / Placeholder text |
| `safeArea` | `boolean` | false | 是否启用 safeArea |
| `as` | `"div" \| "header" \| "footer" \| "aside" \| "nav"` | `div` | as 配置项 |
| `role` | `string` | `undefined` | role 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `teleportTo` | `string \| HTMLElement` | `undefined` | teleportTo 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `resize` | `size: FixedLayoutSize` | resize 时触发 |

### Public Types

- `FixedLayoutPosition`
- `FixedLayoutSize`
- `FixedLayoutProps`
- `FixedLayoutEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts FixedLayout non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts FixedLayout uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts FixedLayout RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts FixedLayout client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/FixedLayout.json` |
| API extract | `generated/component-api/FixedLayout.json` |

> 完整 Demo 见 `example/demos/FixedLayout`（example 本地调试，不上线）。

