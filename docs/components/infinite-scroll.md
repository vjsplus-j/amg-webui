# InfiniteScroll

InfiniteScroll：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

InfiniteScroll：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 结构化数据表格
- 排序筛选分页场景
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 少量键值对用 Descriptions
- 无结构化列需求时避免过度使用表格

## 基础用法

> `import { InfiniteScroll } from 'amg-webui/data'`

```vue
<script setup>
import { InfiniteScroll } from 'amg-webui/data'
</script>

<template>
  <InfiniteScroll />
</template>
```

Curated demo：`example/demos/InfiniteScroll/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `distance` | `number` | 0 | distance 数值 |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `immediate` | `boolean` | true | 是否启用 immediate |
| `scrollTarget` | `string \| HTMLElement` | `undefined` | scrollTarget 字符串 |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `finished` | `boolean` | false | 是否启用 finished |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `load` | `void` | load 时触发 |

### Public Types

- `InfiniteScrollProps`
- `InfiniteScrollEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts InfiniteScroll uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts InfiniteScroll RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts InfiniteScroll client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/data` |
| metadata | `component-metadata/InfiniteScroll.json` |
| API extract | `generated/component-api/InfiniteScroll.json` |

> 完整 Demo 见 `example/demos/InfiniteScroll`（example 本地调试，不上线）。

