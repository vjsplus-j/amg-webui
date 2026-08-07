# FlowPanel

FlowPanel：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

FlowPanel：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 结构化数据表格
- 排序筛选分页场景

**不适用**

- 少量键值对用 Descriptions
- 无结构化列需求时避免过度使用表格

## 基础用法

> `import { FlowPanel } from 'amg-webui/data'`

```vue
<script setup>
import { FlowPanel } from 'amg-webui/data'
</script>

<template>
  <FlowPanel />
</template>
```

Curated demo：`example/demos/FlowPanel/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `steps` | `FlowStep[]` | `() => []` | steps 列表数据 |
| `current` | `string` | `` | current 字符串 |
| `showNav` | `boolean` | false | Show wizard prev/next controls |
| `blockOnError` | `boolean` | true | Disable next when current step has error status |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `select` | `step: FlowStep` | 选中 / Select |
| `prev` | `step: FlowStep \| null` | prev 时触发 |
| `next` | `step: FlowStep \| null` | next 时触发 |
| `update:current` | `id: string` | `current` 更新时触发（v-model） |

### Public Types

- `FlowStep`
- `FlowPanelProps`
- `FlowPanelEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts FlowPanel uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts FlowPanel RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts FlowPanel client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/FlowPanel.json` |
| API extract | `generated/component-api/FlowPanel.json` |

> 完整 Demo 见 `example/demos/FlowPanel`（example 本地调试，不上线）。

