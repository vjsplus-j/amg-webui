# ScaleLayout

ScaleLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

ScaleLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { ScaleLayout } from 'amg-webui/core'`

```vue
<script setup>
import { ScaleLayout } from 'amg-webui/core'
</script>

<template>
  <ScaleLayout />
</template>
```

Curated demo：`example/demos/ScaleLayout/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `scale` | `number` | 1 | Manual scale when fit is `manual` (also clamps auto scale display) |
| `width` | `number` | `undefined` | Design canvas width in px (required for auto fit) |
| `height` | `number` | `undefined` | Design canvas height in px (required for auto fit) |
| `fit` | `ScaleLayoutFit` | `manual` | How design size maps into the host: - manual: use `scale` - contain: fit inside (no crop; may letterbox) - cover: fill host (may crop) - width / height: lock one axis |
| `origin` | `ScaleLayoutOrigin` | `center` | origin 配置项 |
| `fill` | `boolean` | true | Root fills parent width/height (default true) |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `scaleChange` | `scale: number, hostSize: { width: number; height: number },` | scaleChange 时触发 |

### Public Types

- `ScaleLayoutFit`
- `ScaleLayoutOrigin`
- `ScaleLayoutProps`
- `ScaleLayoutEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ScaleLayout non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ScaleLayout uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts ScaleLayout RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts ScaleLayout client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/ScaleLayout.json` |
| API extract | `generated/component-api/ScaleLayout.json` |

> 完整 Demo 见 `example/demos/ScaleLayout`（example 本地调试，不上线）。

