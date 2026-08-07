# FormLayout

FormLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 组件介绍

FormLayout：面向企业场景的 Layout 组件（成熟度 rc）。

## 核心特性

- Layout 家族组件
- 列配置
- 事件回调

## 何时使用 / 不适用

**适用**

- 页面栅格与区域布局
- 响应式容器

**不适用**

- 简单页面可用原生 CSS 布局

## 基础用法

> `import { FormLayout } from 'amg-webui/core'`

```vue
<script setup>
import { FormLayout } from 'amg-webui/core'
</script>

<template>
  <FormLayout />
</template>
```

Curated demo：`example/demos/FormLayout/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `layout` | `FormLayoutMode` | `horizontal` | Label + control arrangement |
| `columns` | `FormLayoutColumns` | 1 | Multi-column grid for horizontal / vertical layouts |
| `colon` | `boolean` | false | Append colon suffix to labels via `--vp-form-layout-colon` |
| `labelWidth` | `"sm" \| "md" \| "lg" \| "auto"` | `md` | 标签宽度 / Label width |
| `gap` | `"sm" \| "md" \| "lg"` | `md` | gap 配置项 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `layout-change` | `layout: FormLayoutMode` | layout-change 时触发 |

### Public Types

- `FormLayoutMode`
- `FormLayoutColumns`
- `FormLayoutProps`
- `FormLayoutEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts FormLayout non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts FormLayout uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts FormLayout RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts FormLayout client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/FormLayout.json` |
| API extract | `generated/component-api/FormLayout.json` |

> 完整 Demo 见 `example/demos/FormLayout`（example 本地调试，不上线）。

