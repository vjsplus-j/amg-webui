# Segmented

Segmented：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Segmented：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- v-model 双向绑定
- 选项列表配置
- 多尺寸规格
- 块级布局
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Segmented } from 'amg-webui/core'`

```vue
<script setup>
import { Segmented } from 'amg-webui/core'
</script>

<template>
  <Segmented />
</template>
```

Curated demo：`example/demos/Segmented/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `string \| number \| boolean` | `undefined` | 绑定值 / Bound value (v-model) |
| `options` | `SegmentedOption[]` | `() => []` | 选项列表 / Option list |
| `size` | `Size` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `block` | `boolean` | false | 块级按钮（整行）/ Block-level button |
| `name` | `string` | `undefined` | 表单字段名 / Form field name |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: string \| number \| boolean` | v-model 更新 / v-model update |
| `change` | `value: string \| number \| boolean` | 值变更 / Change |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `SegmentedOption`
- `SegmentedProps`
- `SegmentedEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts Segmented interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Segmented uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Segmented RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Segmented client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/core` |
| metadata | `component-metadata/Segmented.json` |
| API extract | `generated/component-api/Segmented.json` |

> 完整 Demo 见 `example/demos/Segmented`（example 本地调试，不上线）。

