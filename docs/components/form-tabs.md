# FormTabs

FormTabs：面向企业场景的 Form 组件（成熟度 rc）。

## 组件介绍

FormTabs：面向企业场景的 Form 组件（成熟度 rc）。

## 核心特性

- Form 家族组件
- v-model 双向绑定
- 校验规则
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单布局、校验与字段编排
- 动态/分步表单

**不适用**

- 纯展示场景无需引入完整 Form

## 基础用法

> `import { FormTabs } from 'amg-webui/form'`

```vue
<script setup>
import { FormTabs } from 'amg-webui/form'
</script>

<template>
  <FormTabs />
</template>
```

Curated demo：`example/demos/FormTabs/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `undefined` | 绑定值 / Bound value (v-model) |
| `tabs` | `FormTabItem[]` | `() => []` | tabs 列表数据 |
| `tabData` | `Record<string, Record<string, unknown>>` | `() => ({})` | tabData 字符串 |
| `fieldLabels` | `Record<string, Record<string, string>>` | `() => ({})` | Optional per-tab field labels: { [tabName]: { [field]: label } } |
| `rules` | `FormRules` | `undefined` | 校验规则 / Validation rules |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number` | v-model 更新 / v-model update |
| `update:tabData` | `value: Record<string, Record<string, unknown>>` | `tabData` 更新时触发（v-model） |
| `change` | `name: string \| number` | 值变更 / Change |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `FormTabItem`
- `FormTabsProps`
- `FormTabsEmits`

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

- [Form](./form)
- [FormItem](./form-item)
- [Tabs](./tabs)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/FormTabs.json` |
| API extract | `generated/component-api/FormTabs.json` |

> 完整 Demo 见 `example/demos/FormTabs`（example 本地调试，不上线）。

