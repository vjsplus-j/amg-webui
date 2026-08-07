# SelectNav

SelectNav：面向企业场景的 Selection 组件（成熟度 rc）。

## 组件介绍

SelectNav：面向企业场景的 Selection 组件（成熟度 rc）。

## 核心特性

- Selection 家族组件
- v-model 双向绑定
- 选项列表配置
- 占位提示
- 事件回调

## 何时使用 / 不适用

**适用**

- 下拉、级联、树选等选择场景
- 表单字段与筛选器

**不适用**

- 超大数据集未开启虚拟化时可能影响性能

## 基础用法

> `import { SelectNav } from 'amg-webui/form'`

```vue
<script setup>
import { SelectNav } from 'amg-webui/form'
</script>

<template>
  <SelectNav />
</template>
```

Curated demo：`example/demos/SelectNav/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number` | `undefined` | 绑定值 / Bound value (v-model) |
| `options` | `SelectNavItem[]` | `() => []` | 选项列表 / Option list |
| `ariaLabel` | `string` | `undefined` | Accessible name for the nav / select |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number` | v-model 更新 / v-model update |
| `change` | `value: string \| number` | 值变更 / Change |
| `select` | `item: SelectNavItem, event?: Event` | 选中 / Select |
| `navigate` | `item: SelectNavItem` | navigate 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `SelectNavItem`
- `SelectNavProps`
- `SelectNavEmits`

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

- [Select](./select)
- [Menu](./menu)

## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| import | `amg-webui/form` |
| metadata | `component-metadata/SelectNav.json` |
| API extract | `generated/component-api/SelectNav.json` |

> 完整 Demo 见 `example/demos/SelectNav`（example 本地调试，不上线）。

