# SearchFilterPanel

SearchFilterPanel：面向企业场景的 Form 组件（成熟度 rc）。

## 组件介绍

SearchFilterPanel：面向企业场景的 Form 组件（成熟度 rc）。

## 核心特性

- Form 家族组件
- v-model 双向绑定
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单布局、校验与字段编排
- 动态/分步表单
- 异步提交或加载过程反馈

**不适用**

- 纯展示场景无需引入完整 Form

## 基础用法

> `import { SearchFilterPanel } from 'amg-webui/form'`

```vue
<script setup>
import { SearchFilterPanel } from 'amg-webui/form'
</script>

<template>
  <SearchFilterPanel />
</template>
```

Curated demo：`example/demos/SearchFilterPanel/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `keyword` | `string` | `` | keyword 字符串 |
| `modelValue` | `FilterCondition[]` | `() => []` | 绑定值 / Bound value (v-model) |
| `fields` | `FilterFieldOption[]` | `() => []` | fields 列表数据 |
| `collapsed` | `boolean` | false | 是否启用 collapsed |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `debounce` | `number` | 400 | debounce 数值 |
| `searchOnInput` | `boolean` | true | 是否启用 searchOnInput |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:keyword` | `value: string` | `keyword` 更新时触发（v-model） |
| `update:modelValue` | `value: FilterCondition[]` | v-model 更新 / v-model update |
| `update:collapsed` | `value: boolean` | `collapsed` 更新时触发（v-model） |
| `search` | `payload: { keyword: string; conditions: FilterCondition[] },` | search 时触发 |
| `reset` | `void` | reset 时触发 |
| `change` | `payload: { keyword: string; conditions: FilterCondition[] },` | 值变更 / Change |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `SearchFilterPanelProps`
- `SearchFilterPanelEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts SearchFilterPanel uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts SearchFilterPanel RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts SearchFilterPanel client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/SearchFilterPanel.json` |
| API extract | `generated/component-api/SearchFilterPanel.json` |

> 完整 Demo 见 `example/demos/SearchFilterPanel`（example 本地调试，不上线）。

