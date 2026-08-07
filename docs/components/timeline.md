# Timeline

Timeline：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

Timeline：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- v-model 双向绑定
- 事件回调

## 何时使用 / 不适用

**适用**

- 结构化数据表格
- 排序筛选分页场景

**不适用**

- 少量键值对用 Descriptions
- 无结构化列需求时避免过度使用表格

## 基础用法

> `import { Timeline } from 'amg-webui/data'`

```vue
<script setup>
import { Timeline } from 'amg-webui/data'
</script>

<template>
  <Timeline />
</template>
```

Curated demo：`example/demos/Timeline/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `items` | `TimelineItemProps[]` | `() => []` | 菜单项 / Menu items |
| `mode` | `TimelineMode` | `left` | mode 配置项 |
| `pending` | `boolean \| string` | false | 是否启用 pending |
| `reverse` | `boolean` | false | 是否启用 reverse |
| `modelValue` | `TimelineKey \| null` | `null` | 绑定值 / Bound value (v-model) |
| `selectable` | `boolean` | false | 是否启用 selectable |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: TimelineKey` | v-model 更新 / v-model update |
| `change` | `value: TimelineKey` | 值变更 / Change |
| `itemClick` | `item: TimelineItemProps \| undefined, event: MouseEvent \| KeyboardEvent,` | itemClick 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `TimelineMode`
- `TimelineKey`
- `TimelineItemTimestampPlacement`
- `TimelineItemSide`
- `TimelineItemColor`
- `TimelineItemProps`
- `TimelineContext`
- `TimelineProps`
- `TimelineEmits`
- `TimelineItemEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Timeline uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Timeline RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Timeline client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Timeline.json` |
| API extract | `generated/component-api/Timeline.json` |

> 完整 Demo 见 `example/demos/Timeline`（example 本地调试，不上线）。

