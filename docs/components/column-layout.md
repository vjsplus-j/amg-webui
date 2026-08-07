# ColumnLayout

ColumnLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

ColumnLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件
- 列配置
- 事件回调

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { ColumnLayout } from 'amg-webui/core'`

```vue
<script setup>
import { ColumnLayout } from 'amg-webui/core'
</script>

<template>
  <ColumnLayout />
</template>
```

Curated demo：`example/demos/ColumnLayout/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `columns` | `number` | 2 | 列定义 / Column definitions |
| `gap` | `ColumnGap` | `md` | gap 配置项 |
| `align` | `ColumnAlign` | `stretch` | align 配置项 |
| `dense` | `boolean` | false | 是否启用 dense |
| `label` | `string` | `undefined` | Accessible label for the column group |
| `class` | `string` | `undefined` | class 字符串 |
| `style` | `Record<string, string>` | `undefined` | style 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `columns-change` | `count: number` | columns-change 时触发 |

### Public Types

- `ColumnGap`
- `ColumnAlign`
- `ColumnLayoutProps`
- `ColumnLayoutEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ColumnLayout non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ColumnLayout uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ColumnLayout RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ColumnLayout client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/ColumnLayout.json` |
| API extract | `generated/component-api/ColumnLayout.json` |

> 完整 Demo 见 `example/demos/ColumnLayout`（example 本地调试，不上线）。

