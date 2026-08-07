# TemplateSelect

TemplateSelect：面向企业场景的 Selection 组件（成熟度 rc）。

## 组件介绍

TemplateSelect：面向企业场景的 Selection 组件（成熟度 rc）。

## 核心特性

- Selection 家族组件
- v-model 双向绑定
- 可搜索
- 事件回调

## 何时使用 / 不适用

**适用**

- 下拉、级联、树选等选择场景
- 表单字段与筛选器

**不适用**

- 超大数据集未开启虚拟化时可能影响性能

## 基础用法

> `import { TemplateSelect } from 'amg-webui/lowcode'`

```vue
<script setup>
import { TemplateSelect } from 'amg-webui/lowcode'
</script>

<template>
  <TemplateSelect />
</template>
```

Curated demo：`example/demos/TemplateSelect/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| null` | `null` | 绑定值 / Bound value (v-model) |
| `templates` | `FormTemplate[]` | `() => []` | templates 列表数据 |
| `layout` | `'dropdown' \| 'cards'` | `dropdown` | Dropdown select or selectable card grid |
| `searchable` | `boolean` | true | Show search filter when templates.length > searchableMin |
| `searchableMin` | `number` | 4 | searchableMin 数值 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| null` | v-model 更新 / v-model update |
| `change` | `template: FormTemplate \| null` | 值变更 / Change |
| `apply` | `data: Record<string, unknown>` | apply 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `FormTemplate`
- `TemplateSelectProps`
- `TemplateSelectEmits`

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

— 见同包组件与 `Form` / `Select` 等表单家族。

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/lowcode` |
| metadata | `component-metadata/TemplateSelect.json` |
| API extract | `generated/component-api/TemplateSelect.json` |

> 完整 Demo 见 `example/demos/TemplateSelect`（example 本地调试，不上线）。

