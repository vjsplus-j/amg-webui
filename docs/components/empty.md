# Empty

Empty：面向企业场景的 Foundation 组件（成熟度 rc）。

## 组件介绍

Empty：面向企业场景的 Foundation 组件（成熟度 rc）。

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

> `import { Empty } from 'amg-webui/core'`

```vue
<script setup>
import { Empty } from 'amg-webui/core'
</script>

<template>
  <Empty />
</template>
```

Curated demo：`example/demos/Empty/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `description` | `string` | `undefined` | Description under the illustration (defaults to `common.noData`) |
| `title` | `string` | `undefined` | Optional title above the description |
| `image` | `string` | `undefined` | Custom illustration URL; falls back to built-in SVG on `@error` |
| `imageAlt` | `string` | `undefined` | Accessible label for the custom image |
| `imageSize` | `EmptyImageSize` | `md` | Illustration size — Size token, CSS length, or number mapped to spacing scale |
| `imageStyle` | `Record<string, string>` | `undefined` | Inline styles applied to the image / placeholder host |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `imageError` | `event: Event` | Fired when a custom `image` fails to load (before SVG fallback) |

### Public Types

- `EmptyImageSize`
- `EmptyProps`
- `EmptyEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Empty non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Empty uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts Empty RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts Empty client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/Empty.json` |
| API extract | `generated/component-api/Empty.json` |

> 完整 Demo 见 `example/demos/Empty`（example 本地调试，不上线）。

