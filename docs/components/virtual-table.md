# VirtualTable

VirtualTable：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

VirtualTable：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- 列配置
- 虚拟滚动
- v-model 双向绑定
- 支持禁用状态
- 加载状态反馈
- 事件回调
- 插槽自定义

## 何时使用 / 不适用

**适用**

- 结构化数据表格
- 排序筛选分页场景
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈
- 大数据量列表/表格性能场景

**不适用**

- 少量键值对用 Descriptions
- 无结构化列需求时避免过度使用表格

## 基础用法

> `import { VirtualTable } from 'amg-webui/data'`

```vue
<script setup>
import { VirtualTable } from 'amg-webui/data'
</script>

<template>
  <VirtualTable />
</template>
```

Curated demo：`example/demos/VirtualTable/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `data` | `Record<string, unknown>[]` | `undefined` | Legacy alias — prefer `rows` |
| `rows` | `Record<string, unknown>[]` | `() => []` | 每页行数 / Rows per page |
| `columns` | `TableColumn[]` | `() => []` | 列定义 / Column definitions |
| `virtual` | `boolean` | true | Virtual scroll (default ON) |
| `rowKey` | `string` | `id` | 行唯一键字段 / Unique row key field |
| `filterDebounce` | `number` | 200 | 筛选防抖毫秒 / Filter debounce (ms) |
| `modelValue` | `Record<string, unknown> \| null` | `undefined` | 绑定值 / Bound value (v-model) |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: Record<string, unknown>` | v-model 更新 / v-model update |
| `change` | `value: Record<string, unknown>` | 值变更 / Change |
| `click` | `event: MouseEvent` | 点击 / Click |

### Slots

| Slot | Props | 说明 |
| --- | --- | --- |
| `default` | `—` | 默认插槽 |
| `loading` | `—` | loading 插槽 |
| `empty` | `—` | empty 插槽 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `VirtualTableProps`
- `VirtualTableEmits`
- `VirtualTableSlots`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VirtualTable uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts VirtualTable RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts VirtualTable client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/VirtualTable.json` |
| API extract | `generated/component-api/VirtualTable.json` |

> 完整 Demo 见 `example/demos/VirtualTable`（example 本地调试，不上线）。

