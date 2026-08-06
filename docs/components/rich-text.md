# RichText

白名单消毒富文本编辑器。读写 / 粘贴经 `@amg-webui/security` 的 `sanitizeHtml`；排版使用 Selection API（**不使用**已废弃的 `document.execCommand`）；插入链接走 `sanitizeUrl`。

详见 [SECURITY.md](../SECURITY.md)。

## 基础用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { RichText } from '@amg-webui/components/base'

const html = ref('<p><strong>AMG</strong></p>')
</script>

<template>
  <RichText v-model="html" />
</template>
```

## Props

| Prop | 类型 | 默认 | 说明 |
|------|------|------|------|
| modelValue | `string` | `''` | HTML 内容 |
| sanitize | `boolean` | `true` | 是否消毒 |
| sanitizeOptions | `SanitizeHtmlOptions` | — | 传给 `sanitizeHtml` |
| placeholder | `string` | i18n | 空态提示 |
| historyLimit | `number` | `50` | 撤销栈深度 |
| disabled | `boolean` | — | 禁用 |
