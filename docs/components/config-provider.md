# ConfigProvider 全局配置

ConfigProvider 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { ConfigProvider } from '@amg-webui/core'
</script>

<template>
  <ConfigProvider />
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `size` | `Size` | — | — |
| `zIndex` | `number` | — | — |
| `namespace` | `string` | — | — |
| `empty` | `ConfigProviderEmptyConfig` | — | Empty component / message override |
| `button` | `ButtonGlobalConfig` | — | — |
| `tag` | `TagGlobalConfig` | — | — |
| `badge` | `BadgeGlobalConfig` | — | — |
| `avatar` | `AvatarGlobalConfig` | — | — |



> 完整 Demo 见 `example/demos/ConfigProvider/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
