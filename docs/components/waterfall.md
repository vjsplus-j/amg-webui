# Waterfall

Waterfall：面向企业场景的 Table 组件（成熟度 rc）。

## 组件介绍

Waterfall：面向企业场景的 Table 组件（成熟度 rc）。

## 核心特性

- Table 家族组件
- v-model 双向绑定
- 列配置
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

> `import { Waterfall } from 'amg-webui/data'`

```vue
<script setup>
import { Waterfall } from 'amg-webui/data'
</script>

<template>
  <Waterfall />
</template>
```

Curated demo：`example/demos/Waterfall/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `description` | `string` | `undefined` | description 字符串 |
| `data` | `WaterfallItem[]` | `() => []` | 树形数据 / Tree data |
| `items` | `WaterfallItem[]` | `() => []` | 菜单项 / Menu items |
| `modelValue` | `string \| number \| null` | `null` | 绑定值 / Bound value (v-model) |
| `columns` | `number` | 3 | 列定义 / Column definitions |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `clickable` | `boolean` | true | 是否启用 clickable |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number` | v-model 更新 / v-model update |
| `change` | `value: string \| number` | 值变更 / Change |
| `itemClick` | `item: WaterfallItem, event: MouseEvent \| KeyboardEvent,` | itemClick 时触发 |
| `imageLoad` | `item: WaterfallItem, event: Event` | imageLoad 时触发 |
| `imageError` | `item: WaterfallItem, event: Event` | imageError 时触发 |
| `layoutChange` | `columns: WaterfallItem[][]` | layoutChange 时触发 |
| `reachEnd` | `void` | reachEnd 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `WaterfallItem`
- `WaterfallProps`
- `WaterfallEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Waterfall uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Waterfall RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Waterfall client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Waterfall.json` |
| API extract | `generated/component-api/Waterfall.json` |

> 完整 Demo 见 `example/demos/Waterfall`（example 本地调试，不上线）。

