# PageHeader

PageHeader：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

PageHeader：面向企业场景的 Foundation 组件（成熟度 rc）。

## 核心特性

- Foundation 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 基础 UI 交互与页面操作
- 按钮、标签、图标等原子组件

**不适用**

- 需要复杂业务编排时优先业务组件或组合模式

## 基础用法

> `import { PageHeader } from 'amg-webui/core'`

```vue
<script setup>
import { PageHeader } from 'amg-webui/core'
</script>

<template>
  <PageHeader />
</template>
```

Curated demo：`example/demos/PageHeader/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | 标题 / Title |
| `subtitle` | `string` | `undefined` | subtitle 字符串 |
| `back` | `boolean` | false | 是否启用 back |
| `backLabel` | `string` | `undefined` | backLabel 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `back` | `event: MouseEvent` | back 时触发 |

### Public Types

- `PageHeaderProps`
- `PageHeaderEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts PageHeader non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts PageHeader uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts PageHeader RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts PageHeader client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/PageHeader.json` |
| API extract | `generated/component-api/PageHeader.json` |

> 完整 Demo 见 `example/demos/PageHeader`（example 本地调试，不上线）。

