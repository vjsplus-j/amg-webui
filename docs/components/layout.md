# Layout

Layout 组件 API（v0.1 子集）。

## 基础用法

```vue
<script setup>
import { Layout, Header, Sider, Main, Footer } from '@amg-webui/components/base'
</script>

<template>
  <Layout>
    <Header>Header</Header>
    <Layout>
      <Sider>Sider</Sider>
      <Main>Main</Main>
    </Layout>
    <Footer>Footer</Footer>
  </Layout>
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `hasSider` | `boolean` | — | Force has-sider layout (also auto when a Sider child registers) |
| `direction` | `'horizontal' \| 'vertical'` | — | vertical = stack regions; horizontal = sider + content row |
| `shell` | `boolean` | — | Full-viewport app chrome (locks document scroll) |
| `fill` | `boolean` | — | Fill parent height (nested panels) |



> 完整 Demo 见 `example/demos/Layout/`。本阶段对外 docs 为薄 API stub；交互预览仅在本地 example（不上线）。
