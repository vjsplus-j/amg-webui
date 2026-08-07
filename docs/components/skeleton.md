# Skeleton

Skeleton：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Skeleton：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 加载状态反馈
- 外观变体
- 多尺寸规格

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件
- 异步提交或加载过程反馈

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { Skeleton } from 'amg-webui/core'`

```vue
<script setup>
import { Skeleton } from 'amg-webui/core'
</script>

<template>
  <Skeleton />
</template>
```

Curated demo：`example/demos/Skeleton/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `loading` | `boolean` | true | Show skeleton when true; otherwise render default slot (real content) |
| `variant` | `SkeletonVariant` | `text` | Layout preset |
| `rows` | `number` | 3 | Paragraph / text line count |
| `animated` | `boolean` | true | Soft loading animation (false disables) |
| `animation` | `SkeletonAnimation` | `shimmer` | Animation kind — shimmer (default) / pulse |
| `size` | `Size \| number \| string` | `undefined` | Circle / avatar diameter — Size token or CSS length / number(px) |
| `width` | `SkeletonWidth` | `undefined` | Block / line width — CSS length, % or per-row array |
| `height` | `string \| number` | `undefined` | Block / line height — CSS length or number(px) |
| `round` | `boolean` | false | Fully rounded rect/image |
| `ariaLabel` | `string` | `undefined` | Accessible loading label (defaults via i18n caller / aria) |

### Public Types

- `SkeletonVariant`
- `SkeletonAnimation`
- `SkeletonWidth`
- `SkeletonProps`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Skeleton non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Skeleton uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Skeleton RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Skeleton client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Skeleton.json` |
| API extract | `generated/component-api/Skeleton.json` |

> 完整 Demo 见 `example/demos/Skeleton`（example 本地调试，不上线）。

