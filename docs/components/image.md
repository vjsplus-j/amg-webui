# Image

Image：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Image：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 远程/懒加载数据
- 占位提示
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 需要禁用/只读控制的表单场景

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Image } from 'amg-webui/core'`

```vue
<script setup>
import { Image } from 'amg-webui/core'
</script>

<template>
  <Image />
</template>
```

Curated demo：`example/demos/Image/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `src` | `string` | **必填** | src 字符串 |
| `alt` | `string` | `` | alt 字符串 |
| `fit` | `ImageFit` | `cover` | fit 配置项 |
| `lazy` | `boolean` | true | 远程数据模式 / Lazy remote data |
| `preview` | `boolean` | true | 是否启用 preview |
| `previewSrc` | `string` | `undefined` | previewSrc 字符串 |
| `previewSrcList` | `string[]` | `() => []` | previewSrcList 字符串 |
| `initialIndex` | `number` | 0 | initialIndex 数值 |
| `width` | `string` | `undefined` | width 字符串 |
| `height` | `string` | `undefined` | height 字符串 |
| `fallback` | `string` | `undefined` | fallback 字符串 |
| `placeholder` | `string` | `undefined` | 占位提示 / Placeholder text |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `load` | `event: Event` | load 时触发 |
| `error` | `event: Event` | error 时触发 |
| `click` | `event: MouseEvent` | 点击 / Click |
| `switch` | `index: number` | switch 时触发 |

### Public Types

- `ImageFit`
- `ImageProps`
- `ImageEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Image non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Image uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Image RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Image client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Image.json` |
| API extract | `generated/component-api/Image.json` |

> 完整 Demo 见 `example/demos/Image`（example 本地调试，不上线）。

