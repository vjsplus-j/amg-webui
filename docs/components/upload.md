# Upload

Upload 为 **RC** 公共组件（Contract maturity=`rc`）。本文档由 `generate-vitepress-api.mjs` 从 `generated/component-api` 生成。

## 概览

Upload 当前成熟度为 **RC**；下方 DocsDemo 提供 docs 站内嵌交互，完整场景见 example。

## 何时使用 / 何时不用

- **适用**：RC 阶段的标准 UI 场景（未宣称 Stable）。
- **不适用**：需要未实现能力（如分组虚拟化、复杂低代码编排）时请查阅 example 或等待后续阶段。

## 相关组件

— 见同包组件与 `Form` / `Select` 等表单家族。

## 基础用法

```vue
<script setup>
import { Upload } from '@amg-webui/form'
</script>

<template>
  <Upload />
</template>
```

Curated demo：`example/demos/Upload/index.vue`

## 交互演示

<DocsDemo name="upload-basic" />

## Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `UploadFile[]` | — | 绑定值 / Bound value (v-model) |
| `id` | `string` | — | 元素 id（无障碍）/ Element id for a11y |
| `invalid` | `boolean` | — | — |
| `multiple` | `boolean` | — | 多选模式 / Multiple selection |
| `accept` | `string` | — | 接受的文件类型 / Accepted file types |
| `drag` | `boolean` | — | — |
| `beforeUpload` | `(file: File) => boolean \| void \| Promise<boolean \| void>` | — | — |

## Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: UploadFile[]` | v-model 更新 / v-model update |
| `beforeUpload` | `file: File` | — |
| `change` | `files: UploadFile[]` | 值变更 / Change |
| `remove` | `file: UploadFile` | 移除文件 / Remove file |

## Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

## Public types

- `UploadFile`
- `UploadProps`
- `UploadEmits`


## 稳定性

| 字段 | 值 |
| --- | --- |
| maturity | `rc` |
| apiFreeze | `unfrozen` |
| API extract | `generated/component-api/Upload.json` |

> 上方 **DocsDemo** 为 docs 站内嵌交互演示。完整 curated demo 见 `example/demos/Upload`。
