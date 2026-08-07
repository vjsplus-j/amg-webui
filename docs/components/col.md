# Col

Col：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

Col：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { Col } from 'amg-webui/core'`

```vue
<script setup>
import { Col } from 'amg-webui/core'
</script>

<template>
  <Col />
</template>
```

Curated demo：`example/demos/Col/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `span` | `number` | `undefined` | 1–24 column span |
| `offset` | `number` | 0 | Offset before this col (0–23) |
| `push` | `number` | 0 | push 数值 |
| `pull` | `number` | 0 | pull 数值 |
| `flex` | `boolean` | false | Grow to fill remaining row space |
| `order` | `number` | `undefined` | Order within the row |
| `ariaLabel` | `string` | `undefined` | Semantic label when used as a standalone layout cell |
| `as` | `"div" \| "article" \| "section"` | `undefined` | Whether to render as a landmark-like container |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `click` | `event: MouseEvent` | 点击 / Click |

### Public Types

- `ColProps`
- `ColEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Col non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Col uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Col RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Col client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Col.json` |
| API extract | `generated/component-api/Col.json` |

> 完整 Demo 见 `example/demos/Col`（example 本地调试，不上线）。

