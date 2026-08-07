# CanvasLayer

CanvasLayer：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 组件介绍

CanvasLayer：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 核心特性

- Lowcode 家族组件
- 事件回调

## 何时使用 / 不适用

**适用**

- 低代码画布与物料拖拽
- Schema 渲染

**不适用**

- 标准后台 CRUD 无需低代码层

## 基础用法

> `import { CanvasLayer } from 'amg-webui/lowcode'`

```vue
<script setup>
import { CanvasLayer } from 'amg-webui/lowcode'
</script>

<template>
  <CanvasLayer />
</template>
```

Curated demo：`example/demos/CanvasLayer/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `compact` | `boolean` | false | 是否启用 compact |
| `showActions` | `boolean` | true | 是否启用 showActions |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `select` | `id: string` | 选中 / Select |
| `reorder` | `payload: { id: string; direction: 'up' \| 'down' \| 'top' \| 'bottom' }` | reorder 时触发 |
| `visibility-change` | `payload: { id: string; hidden: boolean }` | visibility-change 时触发 |

### Public Types

- `CanvasLayerProps`
- `CanvasLayerEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts CanvasLayer interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasLayer uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasLayer RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasLayer client mount OK; no required browser-only top-level in package gate

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
| import | `amg-webui/lowcode` |
| metadata | `component-metadata/CanvasLayer.json` |
| API extract | `generated/component-api/CanvasLayer.json` |

> 完整 Demo 见 `example/demos/CanvasLayer`（example 本地调试，不上线）。

