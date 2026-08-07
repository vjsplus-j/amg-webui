# Layout

Layout：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

Layout：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { Layout } from 'amg-webui/core'`

```vue
<script setup>
import { Layout, Header, Sider, Main, Footer } from 'amg-webui/core'
</script>

<template>
  <Layout>
    <Header>Header</Header>
    <Layout>
      <Sider>Sider</Sider>
      <Main>Main</Main>
    </Layout>
    <Footer>Footer</Footer>
  </Layout>
</template>
```

Curated demo：`example/demos/Layout/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `hasSider` | `boolean` | false | Force has-sider layout (also auto when a Sider child registers) |
| `direction` | `'horizontal' \| 'vertical'` | `vertical` | vertical = stack regions; horizontal = sider + content row |
| `shell` | `boolean` | false | Full-viewport app chrome (locks document scroll) |
| `fill` | `boolean` | false | Fill parent height (nested panels) |
| `ariaLabel` | `string` | `undefined` | Accessible label when the layout is used as a landmark |
| `as` | `'div' \| 'section' \| 'main'` | `section` | Root element; defaults to section |

### Public Types

- `LayoutContext`
- `LayoutProps`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Layout non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Layout uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Layout RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Layout client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Layout.json` |
| API extract | `generated/component-api/Layout.json` |

> 完整 Demo 见 `example/demos/Layout`（example 本地调试，不上线）。

