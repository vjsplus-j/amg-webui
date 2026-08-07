# Center

Center：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

Center：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { Center } from 'amg-webui/core'`

```vue
<script setup>
import { Center } from 'amg-webui/core'
</script>

<template>
  <Center />
</template>
```

Curated demo：`example/demos/Center/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `axis` | `CenterAxis` | `both` | axis 配置项 |
| `flush` | `boolean` | true | Stick to edge; when false, inset with `--spacing-lg` on the flush side(s) |
| `minHeight` | `CenterMinHeight` | `none` | Minimum height — spacing tokens, `fill` (100%), or `viewport` (100dvh / shell height). Default `none` (content-sized); demos often pass `md`+ or `fill`. |
| `fill` | `boolean` | false | Stretch to 100% of parent height (sets height: 100%) |
| `textAlign` | `"start" \| "center" \| "end" \| "inherit"` | `inherit` | Inline / block centering hint on the content wrapper |
| `as` | `"div" \| "section" \| "main"` | `div` | as 配置项 |
| `contentAs` | `"div" \| "span"` | `div` | contentAs 配置项 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `maxWidth` | `string` | `undefined` | maxWidth 字符串 |

### Public Types

- `CenterAxis`
- `CenterMinHeight`
- `CenterEmits`
- `CenterProps`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Center non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Center uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Center RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Center client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Center.json` |
| API extract | `generated/component-api/Center.json` |

> 完整 Demo 见 `example/demos/Center`（example 本地调试，不上线）。

