# AdvancedSearch

AdvancedSearch：面向企业场景的 Form 组件（成熟度 rc）。

## 组件介绍

AdvancedSearch：面向企业场景的 Form 组件（成熟度 rc）。

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

> `import { AdvancedSearch } from 'amg-webui/form'`

```vue
<script setup>
import { AdvancedSearch } from 'amg-webui/form'
</script>

<template>
  <AdvancedSearch />
</template>
```

Curated demo：`example/demos/AdvancedSearch/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `FilterCondition[]` | `() => []` | 绑定值 / Bound value (v-model) |
| `logic` | `SearchLogic` | `and` | logic 配置项 |
| `fields` | `FilterFieldOption[]` | `() => []` | fields 列表数据 |
| `templates` | `{ id: string; name: string; conditions: FilterCondition[]; logic: SearchLogic }[]` | `() => []` | templates 字符串 |
| `loading` | `boolean` | false | 加载中状态 / Loading state |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: FilterCondition[]` | v-model 更新 / v-model update |
| `update:logic` | `value: SearchLogic` | `logic` 更新时触发（v-model） |
| `change` | `value: FilterCondition[]` | 值变更 / Change |
| `search` | `payload: { conditions: FilterCondition[]; logic: SearchLogic }` | search 时触发 |
| `save-template` | `payload: { conditions: FilterCondition[]; logic: SearchLogic }` | save-template 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `SearchLogic`
- `AdvancedSearchProps`
- `AdvancedSearchEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts AdvancedSearch uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts AdvancedSearch RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts AdvancedSearch client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/AdvancedSearch.json` |
| API extract | `generated/component-api/AdvancedSearch.json` |

> 完整 Demo 见 `example/demos/AdvancedSearch`（example 本地调试，不上线）。

