# Spin 加载

区域 / 全屏旋转加载指示器：延迟显示防闪烁、嵌套遮罩、自定义指示器，尊重 `AnimationService` 运动总开关与 `prefers-reduced-motion`。

## 基础用法

```vue
<script setup>
import { Spin } from '@amg-webui/components/base'
</script>

<template>
  <Spin size="md" />
  <Spin :spinning="loading" :tip="t('common.loading')">
    <YourPanel />
  </Spin>
</template>
```

## 常用 API

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `spinning` | `boolean` | `true` | 是否进入加载态 |
| `tip` | `string` | `common.loading` | 指示器下方文案 |
| `size` | `Size` | `'md'` | 指示器尺寸 xs–xl |
| `delay` | `number` | `0` | 延迟显示（ms，防闪烁） |
| `fullscreen` | `boolean` | `false` | 全屏遮罩 |
| `ariaLabel` | `string` | — | 状态区无障碍名称（缺省用 tip） |

| 事件 | 说明 |
| --- | --- |
| `visibleChange` | 延迟后的可见加载态变化 |

| 插槽 | 说明 |
| --- | --- |
| `default` | 被遮罩覆盖的内容 |
| `indicator` | 自定义旋转 / 脉冲指示器 |

> 完整交互与边界见本地 example curated demo（`example/demos/Spin/`）。本阶段对外 docs 以薄 API stub 为主；无 Telemetry（纯展示件，见 `TELEMETRY.md`）。
