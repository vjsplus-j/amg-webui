# Calendar

Calendar：面向企业场景的 DateTime 组件（成熟度 rc）。

## 组件介绍

Calendar：面向企业场景的 DateTime 组件（成熟度 rc）。

## 核心特性

- DateTime 家族组件
- v-model 双向绑定
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 日期/时间选择与范围输入
- 表单与筛选面板
- 需要禁用/只读控制的表单场景

**不适用**

- 需要非标准历法或复杂排班规则时需自定义

## 基础用法

> `import { Calendar } from 'amg-webui/data'`

```vue
<script setup>
import { Calendar } from 'amg-webui/data'
</script>

<template>
  <Calendar />
</template>
```

Curated demo：`example/demos/Calendar/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `CalendarValue` | `null` | 绑定值 / Bound value (v-model) |
| `valueFormat` | `"date" \| "iso"` | `iso` | valueFormat 配置项 |
| `viewDate` | `CalendarValue` | `undefined` | viewDate 配置项 |
| `min` | `CalendarValue` | `undefined` | min 配置项 |
| `max` | `CalendarValue` | `undefined` | max 配置项 |
| `disabledDate` | `(date: Date) => boolean` | `undefined` | 是否启用 disabledDate |
| `firstDayOfWeek` | `0 \| 1 \| 2 \| 3 \| 4 \| 5 \| 6` | 0 | firstDayOfWeek 配置项 |
| `showAdjacent` | `boolean` | true | 是否启用 showAdjacent |
| `showToday` | `boolean` | true | 是否启用 showToday |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: CalendarValue` | v-model 更新 / v-model update |
| `update:viewDate` | `value: Date` | `viewDate` 更新时触发（v-model） |
| `select` | `value: string \| Date` | 选中 / Select |
| `change` | `value: CalendarValue` | 值变更 / Change |
| `monthChange` | `value: Date` | monthChange 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `CalendarValue`
- `CalendarProps`
- `CalendarEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`N/A`
- optional

## RTL

- 状态：`N/A`
- optional

## SSR

- 状态：`PASS`
- structural DOM + component entry

## 当前限制

- Interactive actions no-op when disabled
- API 尚未冻结，可能随 hardening 批次调整

## 相关组件

- [DatePicker](./date-picker)
- [DateTimePicker](./date-time-picker)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/data` |
| metadata | `component-metadata/Calendar.json` |
| API extract | `generated/component-api/Calendar.json` |

> 完整 Demo 见 `example/demos/Calendar`（example 本地调试，不上线）。

