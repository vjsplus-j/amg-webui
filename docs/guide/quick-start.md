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
import Button from 'amg-webui/button'
import 'amg-webui/button/style.css'
```

## Foundation Barrel

```ts
import { Button } from 'amg-webui/core'
import { Select } from 'amg-webui/form'
import { DataTable } from 'amg-webui/data'
import { Dialog } from 'amg-webui/overlay'
```

> `amg-webui/components/base` 仅再导出 **core**，不包含 Select / Form 等。请勿从 base 引入 form/data/overlay 组件。

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
import { ConfigProvider } from 'amg-webui/core'
</script>

<template>
  <ConfigProvider size="md">
    <!-- app shell -->
  </ConfigProvider>
</template>
```

## 版本边界

| 文档 | 说明 |
| --- | --- |
| [RELEASE.md](../RELEASE.md) | 发布说明 |
| [LIBRARY_PLAN.md](../LIBRARY_PLAN.md) | 分期计划 |

子集外组件可能存在于包内，视为 **experimental**，不作 SLA。以 Hardening `verifiedStable` 为准，不以目录数量为准。

## 下一步

- [组件概览](/components/) — API 与示例
- [业务模块](/business/) — login / users / orders / content / settings
- 完整交互 Demo：本地 `npm run dev`（example，不上线）
