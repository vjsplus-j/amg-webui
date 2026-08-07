# BatchUpload

BatchUpload：面向企业场景的 Upload 组件（成熟度 rc）。

## 组件介绍

BatchUpload：面向企业场景的 Upload 组件（成熟度 rc）。

## 核心特性

- Upload 家族组件
- v-model 双向绑定
- 事件回调

## 何时使用 / 不适用

**适用**

- 文件选择与上传
- 批量/分片上传

**不适用**

- 仅需下载链接时用 Link / Button

## 基础用法

> `import { BatchUpload } from 'amg-webui/form'`

```vue
<script setup>
import { BatchUpload } from 'amg-webui/form'
</script>

<template>
  <BatchUpload />
</template>
```

Curated demo：`example/demos/BatchUpload/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `BatchFileItem[]` | `() => []` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | 元素 id（无障碍）/ Element id for a11y |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `concurrent` | `number` | 2 | concurrent 数值 |
| `accept` | `string` | `*` | 接受的文件类型 / Accepted file types |
| `drag` | `boolean` | true | 是否启用 drag |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: BatchFileItem[]` | v-model 更新 / v-model update |
| `change` | `value: BatchFileItem[]` | 值变更 / Change |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `BatchFileItem`
- `BatchUploadProps`
- `BatchUploadEmits`

## 键盘交互

- 状态：`FAIL`
- 按键：`Tab` · `Enter` · `Escape` · `ArrowDown` · `ArrowUp` · `ArrowLeft` · `ArrowRight` · `Home` · `End` · `Space`
- keyboard PASS requires testCases[] with ≥1 PASS case including expected behavior text

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts BatchUpload uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts BatchUpload RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts BatchUpload client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/BatchUpload.json` |
| API extract | `generated/component-api/BatchUpload.json` |

> 完整 Demo 见 `example/demos/BatchUpload`（example 本地调试，不上线）。

