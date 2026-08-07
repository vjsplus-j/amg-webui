# CopyText

CopyText：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

CopyText：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 多尺寸规格
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { CopyText } from 'amg-webui/core'`

```vue
<script setup>
import { CopyText } from 'amg-webui/core'
</script>

<template>
  <CopyText />
</template>
```

Curated demo：`example/demos/CopyText/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `text` | `string` | **必填** | Text written to the clipboard (required for copy) |
| `label` | `string` | `undefined` | Visible label — defaults to `text` |
| `truncate` | `boolean` | true | Truncate display with ellipsis |
| `maxWidth` | `string` | `undefined` | Max visible characters when truncate (graphemes approx via CSS) |
| `size` | `Size` | `md` | 尺寸：`sm` · `md` · `lg` / Size variant |
| `showButton` | `boolean` | true | Show copy control (default true) |
| `copyTooltip` | `string` | `undefined` | Tooltip / aria for the copy control |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `copy` | `text: string` | copy 时触发 |
| `copyError` | `error: unknown` | Preferred — aligns with Typography |
| `error` | `error: unknown` | error 时触发 |

### Public Types

- `CopyTextProps`
- `CopyTextEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts CopyText interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CopyText uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts CopyText RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CopyText client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/CopyText.json` |
| API extract | `generated/component-api/CopyText.json` |

> 完整 Demo 见 `example/demos/CopyText`（example 本地调试，不上线）。

