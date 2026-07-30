# Form

Form 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { ref } from 'vue'
import { Form, FormItem, InputText } from '@amg-webui/components/base'

const model = ref({ name: '' })
</script>

<template>
  <Form :model="model">
    <FormItem label="Name" prop="name">
      <InputText v-model="model.name" />
    </FormItem>
  </Form>
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | — | — |
| `rules` | `FormRules` | — | — |
| `disabled` | `boolean` | — | — |
| `labelWidth` | `string` | — | — |
| `labelPosition` | `'left' \| 'top'` | — | — |
| `trackId` | `string` | — | — |
| `telemetry` | `boolean` | — | — |


| 事件 | 说明 |
| --- | --- |
| `validate` | — |
| `submit` | — |

> 完整 Demo 见 `example/demos/Form/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
