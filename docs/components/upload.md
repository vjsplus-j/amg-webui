# Upload 上传

Upload 上传：面向企业场景的 Upload 组件（成熟度 rc）。

## 组件介绍

Upload 上传：面向企业场景的 Upload 组件（成熟度 rc）。

## 核心特性

- Upload 家族组件
- v-model 双向绑定
- 多选模式
- 事件回调

## 何时使用 / 不适用

**适用**

- 文件选择与上传
- 批量/分片上传

**不适用**

- 仅需下载链接时用 Link / Button

## 基础用法

> `import { Upload } from 'amg-webui/form'`

```vue
<script setup>
import { Upload } from 'amg-webui/form'
</script>

<template>
  <Upload />
</template>
```

Curated demo：`example/demos/Upload/index.vue`

## 示例

<DocsDemo name="upload-basic" />

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `UploadFile[]` | `() => []` | 绑定值 / Bound value (v-model) |
| `id` | `string` | `undefined` | 元素 id（无障碍）/ Element id for a11y |
| `invalid` | `boolean` | `undefined` | 是否启用 invalid |
| `multiple` | `boolean` | false | 多选模式 / Multiple selection |
| `accept` | `string` | `undefined` | 接受的文件类型 / Accepted file types |
| `drag` | `boolean` | true | 是否启用 drag |
| `beforeUpload` | `(file: File) => boolean \| void \| Promise<boolean \| void>` | `undefined` | 是否启用 beforeUpload |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: UploadFile[]` | v-model 更新 / v-model update |
| `beforeUpload` | `file: File` | beforeUpload 时触发 |
| `change` | `files: UploadFile[]` | 值变更 / Change |
| `remove` | `file: UploadFile` | 移除文件 / Remove file |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `UploadFile`
- `UploadProps`
- `UploadEmits`

## 键盘交互

- 状态：`PASS`
- 按键：`Enter` · `Space`
- Enter: Enter on dropzone invokes hidden file input click; Space: disabled dropzone does not open file picker on Space

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Upload uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Upload RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Upload client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Upload.json` |
| API extract | `generated/component-api/Upload.json` |

> **DocsDemo** 为 docs 站内嵌演示；完整 curated demo 见 `example/demos/Upload`。

