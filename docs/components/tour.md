# Tour

Tour：面向企业场景的 Overlay 组件（成熟度 rc）。

## 组件介绍

Tour：面向企业场景的 Overlay 组件（成熟度 rc）。

## 核心特性

- Overlay 家族组件
- v-model 双向绑定
- 事件回调

## 何时使用 / 不适用

**适用**

- 对话框、抽屉、气泡确认等浮层
- 阻断式交互

**不适用**

- 轻量提示优先 Toast / Message
- 非阻断提示不要用 Modal 对话框

## 基础用法

> `import { Tour } from 'amg-webui/overlay'`

```vue
<script setup>
import { Tour } from 'amg-webui/overlay'
</script>

<template>
  <Tour />
</template>
```

Curated demo：`example/demos/Tour/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `number` | `undefined` | 绑定值 / Bound value (v-model) |
| `current` | `number` | 0 | current 数值 |
| `steps` | `TourStep[]` | `() => []` | steps 列表数据 |
| `open` | `boolean` | false | 是否启用 open |
| `mask` | `boolean` | true | 是否启用 mask |
| `type` | `TourType` | `default` | 输入类型 / Input type |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:open` | `value: boolean` | `open` 更新时触发（v-model） |
| `update:current` | `index: number` | `current` 更新时触发（v-model） |
| `update:modelValue` | `index: number` | v-model 更新 / v-model update |
| `change` | `step: number` | 值变更 / Change |
| `finish` | `void` | finish 时触发 |
| `close` | `void` | 关闭 / Close |
| `skip` | `void` | skip 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `TourPlacement`
- `TourType`
- `TourStep`
- `TourProps`
- `TourEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Tour uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Tour RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Tour client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/overlay` |
| metadata | `component-metadata/Tour.json` |
| API extract | `generated/component-api/Tour.json` |

> 完整 Demo 见 `example/demos/Tour`（example 本地调试，不上线）。

