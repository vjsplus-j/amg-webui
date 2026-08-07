# Transfer

Transfer：面向企业场景的 Selection 组件（成熟度 rc）。

## 组件介绍

Transfer：面向企业场景的 Selection 组件（成熟度 rc）。

## 核心特性

- Selection 家族组件
- v-model 双向绑定
- 可筛选
- 虚拟滚动
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 下拉、级联、树选等选择场景
- 表单字段与筛选器
- 异步提交或加载过程反馈
- 大数据量列表/表格性能场景

**不适用**

- 超大数据集未开启虚拟化时可能影响性能

## 基础用法

> `import { Transfer } from 'amg-webui/form'`

```vue
<script setup>
import { Transfer } from 'amg-webui/form'
</script>

<template>
  <Transfer />
</template>
```

Curated demo：`example/demos/Transfer/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `id` | `string` | `undefined` | Native id — falls back to FormItem field id when nested |
| `name` | `string` | `undefined` | Native name — falls back to FormItem `prop` when nested |
| `data` | `TransferItem[]` | `() => []` | 树形数据 / Tree data |
| `modelValue` | `(string \| number)[]` | `() => []` | 绑定值 / Bound value (v-model) |
| `filterable` | `boolean` | false | 是否启用 filterable |
| `leftTitle` | `string` | `undefined` | leftTitle 字符串 |
| `rightTitle` | `string` | `undefined` | rightTitle 字符串 |
| `filterPlaceholder` | `string` | `undefined` | filterPlaceholder 字符串 |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |
| `filterDebounce` | `number` | 200 | Delay filtering for large data sets. @default 200 |
| `filterMethod` | `( query: string, item: TransferItem, direction: "left" \| "right", ) => boolean` | `undefined` | Custom filter predicate. |
| `virtual` | `boolean` | true | Native virtual scrolling is enabled by default. |
| `loading` | `boolean` | false | Marks both panels busy while data is being fetched. |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `filter-change` | `payload: { direction: "left" \| "right"; query: string },` | filter-change 时触发 |
| `reach-end` | `direction: "left" \| "right"` | reach-end 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `TransferItem`
- `TransferProps`
- `TransferEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Transfer uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Transfer RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Transfer client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/form` |
| metadata | `component-metadata/Transfer.json` |
| API extract | `generated/component-api/Transfer.json` |

> 完整 Demo 见 `example/demos/Transfer`（example 本地调试，不上线）。

