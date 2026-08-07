# Row

Row：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

Row：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { Row } from 'amg-webui/core'`

```vue
<script setup>
import { Row } from 'amg-webui/core'
</script>

<template>
  <Row />
</template>
```

Curated demo：`example/demos/Row/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `gutter` | `RowGutter` | `md` | Gap between cols — token key, CSS length, or number × `--spacing-xs`. Default: md |
| `wrap` | `boolean` | true | 是否启用 wrap |
| `align` | `RowAlign` | `stretch` | align 配置项 |
| `justify` | `RowJustify` | `start` | justify 配置项 |

### Public Types

- `RowAlign`
- `RowJustify`
- `RowGutter`
- `RowProps`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Row non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Row uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Row RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Row client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Row.json` |
| API extract | `generated/component-api/Row.json` |

> 完整 Demo 见 `example/demos/Row`（example 本地调试，不上线）。

