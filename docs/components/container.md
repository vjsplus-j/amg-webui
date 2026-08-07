# Container

Container：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

Container：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件
- 多尺寸规格
- 宽度 100%

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { Container } from 'amg-webui/core'`

```vue
<script setup>
import { Container } from 'amg-webui/core'
</script>

<template>
  <Container />
</template>
```

Curated demo：`example/demos/Container/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `size` | `ContainerSize` | `lg` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `fluid` | `boolean` | false | 宽度 100% / Full width |
| `padded` | `boolean` | true | 是否启用 padded |
| `align` | `'start' \| 'center' \| 'end'` | `center` | align 配置项 |
| `gap` | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'section'` | `none` | gap 配置项 |
| `tag` | `'div' \| 'main' \| 'section' \| 'article'` | `div` | Landmark role when used as page shell segment |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `fullBleed` | `boolean` | false | 是否启用 fullBleed |
| `maxWidth` | `string` | `undefined` | maxWidth 字符串 |
| `class` | `string` | `undefined` | class 字符串 |
| `style` | `Record<string, string>` | `undefined` | style 字符串 |

### Public Types

- `ContainerSize`
- `ContainerProps`
- `ContainerEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Container non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Container uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Container RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Container client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Container.json` |
| API extract | `generated/component-api/Container.json` |

> 完整 Demo 见 `example/demos/Container`（example 本地调试，不上线）。

