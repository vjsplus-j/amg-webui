# FormGroup

FormGroup：面向企业场景的 Form 组件（成熟度 rc）。

## 组件介绍

FormGroup：面向企业场景的 Form 组件（成熟度 rc）。

## 核心特性

- Form 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 表单布局、校验与字段编排
- 动态/分步表单

**不适用**

- 纯展示场景无需引入完整 Form

## 基础用法

> `import { FormGroup } from 'amg-webui/form'`

```vue
<script setup>
import { FormGroup } from 'amg-webui/form'
</script>

<template>
  <FormGroup />
</template>
```

Curated demo：`example/demos/FormGroup/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `collapsible` | `boolean` | true | 是否启用 collapsible |
| `collapsed` | `boolean` | false | 是否启用 collapsed |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:collapsed` | `value: boolean` | `collapsed` 更新时触发（v-model） |
| `toggle` | `collapsed: boolean` | toggle 时触发 |

### Public Types

- `FormGroupProps`
- `FormGroupEmits`

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

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/FormGroup.json` |
| API extract | `generated/component-api/FormGroup.json` |

> 完整 Demo 见 `example/demos/FormGroup`（example 本地调试，不上线）。

