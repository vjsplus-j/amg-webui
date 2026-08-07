# CanvasNode

CanvasNode：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 组件介绍

CanvasNode：面向企业场景的 Lowcode 组件（成熟度 rc）。

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

> `import { CanvasNode } from 'amg-webui/lowcode'`

```vue
<script setup>
import { CanvasNode } from 'amg-webui/lowcode'
</script>

<template>
  <CanvasNode />
</template>
```

Curated demo：`example/demos/CanvasNode/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `node` | `CanvasNodeData` | **必填** | node 配置项 |
| `nested` | `boolean` | false | Nested under a parent — flow layout, not free-canvas absolute. |
| `children` | `CanvasTreeNode[]` | `() => []` | Child tree from `buildCanvasTree` (recursive mount). |
| `selectable` | `boolean` | true | 是否启用 selectable |
| `draggable` | `boolean` | true | 是否启用 draggable |
| `keyboardStep` | `number` | 1 | keyboardStep 数值 |
| `registry` | `ComponentRegistry` | `undefined` | registry 配置项 |
| `renderMode` | `SchemaRenderMode` | `chrome` | renderMode 配置项 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `select` | `id: string` | 选中 / Select |
| `move` | `payload: { id: string; x: number; y: number }` | move 时触发 |
| `moveStart` | `payload: { id: string; x: number; y: number }` | moveStart 时触发 |
| `moveEnd` | `payload: { id: string; x: number; y: number }` | moveEnd 时触发 |

### Public Types

- `CanvasNodeProps`
- `CanvasNodeEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts CanvasNode interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasNode uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasNode RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasNode client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/CanvasNode.json` |
| API extract | `generated/component-api/CanvasNode.json` |

> 完整 Demo 见 `example/demos/CanvasNode`（example 本地调试，不上线）。

