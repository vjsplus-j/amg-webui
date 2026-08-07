# EmbedLayout

EmbedLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

EmbedLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件
- 加载状态反馈
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器
- 需要禁用/只读控制的表单场景
- 异步提交或加载过程反馈

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { EmbedLayout } from 'amg-webui/core'`

```vue
<script setup>
import { EmbedLayout } from 'amg-webui/core'
</script>

<template>
  <EmbedLayout />
</template>
```

Curated demo：`example/demos/EmbedLayout/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `aspectRatio` | `EmbedAspect` | `16 / 9` | aspectRatio 配置项 |
| `fill` | `boolean` | false | 是否启用 fill |
| `rounded` | `boolean` | true | 圆角按钮 / Rounded shape |
| `bordered` | `boolean` | true | 是否启用 bordered |
| `objectFit` | `EmbedObjectFit` | `cover` | objectFit 配置项 |
| `label` | `string` | `undefined` | 显示文案 / Display label |
| `caption` | `string` | `undefined` | caption 字符串 |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `interactive` | `boolean` | false | 是否启用 interactive |
| `as` | `"div" \| "figure" \| "section"` | `figure` | as 配置项 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `frame-click` | `event: MouseEvent \| KeyboardEvent` | frame-click 时触发 |

### Public Types

- `EmbedAspect`
- `EmbedObjectFit`
- `EmbedLayoutProps`
- `EmbedLayoutEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts EmbedLayout non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts EmbedLayout uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts EmbedLayout RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts EmbedLayout client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/core` |
| metadata | `component-metadata/EmbedLayout.json` |
| API extract | `generated/component-api/EmbedLayout.json` |

> 完整 Demo 见 `example/demos/EmbedLayout`（example 本地调试，不上线）。

