# 快速开始

## 最小应用

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import 'amg-webui/style.css'
import { ThemeService } from 'amg-webui'

ThemeService.init({ design: 'linear', scheme: 'light' })

createApp(App).mount('#app')
```

```vue
<!-- App.vue -->
<script setup>
import { Button, Card } from 'amg-webui'
</script>

<template>
  <Card>
    <Button label="Hello AMG-WebUI" @click="() => {}" />
  </Card>
</template>
```

## 按需引入（tree-shake）

```ts
import { Button, Select } from 'amg-webui/components/base'
import 'amg-webui/style.css'
```

## 主题切换

官方主题（designmd 六套 + WeChat / Alipay）只读；运行时通过 `ThemeService` 切换：

```ts
import { ThemeService } from 'amg-webui/theme'

ThemeService.setDesign('porsche')
ThemeService.setScheme('dark')
```

详见 [主题体系](/theme/)。

## 全局配置

```vue
<script setup>
import { ConfigProvider } from 'amg-webui/components/base'
</script>

<template>
  <ConfigProvider size="md">
    <!-- app shell -->
  </ConfigProvider>
</template>
```

## 0.1 边界

| 文档 | 说明 |
| --- | --- |
| [RELEASE_0.1.md](../RELEASE_0.1.md) | 试用发包说明 · API 可变 |
| [V0_1_SUBSET.md](../V0_1_SUBSET.md) | 承诺组件子集（Core ∪ B1–B4） |

子集外组件可能存在于包内，视为 **experimental**，不作 SLA。

## 下一步

- [组件概览](/components/) — v0.1 核心 API stub
- [业务模块](/business/) — login / users / orders / content / settings
- 完整交互 Demo：本地 `npm run dev`（example，不上线）
