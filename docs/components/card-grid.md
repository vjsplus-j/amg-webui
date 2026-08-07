# CardGrid

CardGrid：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

CardGrid：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 列配置
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 异步提交或加载过程反馈

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { CardGrid } from 'amg-webui/core'`

```vue
<script setup>
import { CardGrid } from 'amg-webui/core'
</script>

<template>
  <CardGrid />
</template>
```

Curated demo：`example/demos/CardGrid/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `columns` | `number` | `undefined` | Fixed column count (1–6). When set, ignores minTrack auto grid. |
| `minTrack` | `CardGridMinTrack` | `md` | Min track width for auto-fill / auto-fit mode |
| `fit` | `CardGridFit` | `fill` | `fill` keeps empty tracks; `fit` collapses empty tracks |
| `gap` | `CardGridGap` | `lg` | gap 配置项 |
| `equalHeight` | `boolean` | true | Stretch cards to equal row height (default true) |
| `as` | `"div" \| "section" \| "ul" \| "ol"` | `div` | as 配置项 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `skeletonCount` | `number` | 3 | skeletonCount 数值 |
| `empty` | `boolean` | false | 是否启用 empty |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `layout-change` | `columns: number \| null` | layout-change 时触发 |

### Public Types

- `CardGridMinTrack`
- `CardGridGap`
- `CardGridFit`
- `CardGridProps`
- `CardGridEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts CardGrid non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CardGrid uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts CardGrid RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CardGrid client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/CardGrid.json` |
| API extract | `generated/component-api/CardGrid.json` |

> 完整 Demo 见 `example/demos/CardGrid`（example 本地调试，不上线）。

