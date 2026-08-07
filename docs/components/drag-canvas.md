# DragCanvas

DragCanvas：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 组件介绍

DragCanvas：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 核心特性

- Lowcode 家族组件
- v-model 双向绑定
- 只读模式
- 事件回调

## 何时使用 / 不适用

**适用**

- 低代码画布与物料拖拽
- Schema 渲染

**不适用**

- 标准后台 CRUD 无需低代码层

## 基础用法

> `import { DragCanvas } from 'amg-webui/lowcode'`

```vue
<script setup>
import { DragCanvas } from 'amg-webui/lowcode'
</script>

<template>
  <DragCanvas />
</template>
```

Curated demo：`example/demos/DragCanvas/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `modelValue` | `CanvasNodeData[]` | `() => []` | 绑定值 / Bound value (v-model) |
| `mode` | `'free' \| 'grid'` | `free` | mode 配置项 |
| `readonly` | `boolean` | false | 是否只读 / Read-only |
| `materials` | `CanvasMaterialItem[]` | `() => []` | materials 列表数据 |
| `gridCols` | `number` | 24 | gridCols 数值 |
| `registry` | `ComponentRegistry` | `undefined` | When set, canvas nodes mount real components (WYSIWYG). |
| `renderMode` | `'chrome' \| 'component'` | `chrome` | `component` = registry mount; `chrome` = label/type placeholder. |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `value: CanvasNodeData[]` | v-model 更新 / v-model update |
| `select` | `ids: string[]` | 选中 / Select |
| `change` | `value: CanvasNodeData[]` | 值变更 / Change |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `DragCanvasProps`
- `DragCanvasEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts DragCanvas non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DragCanvas uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts DragCanvas RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DragCanvas client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/DragCanvas.json` |
| API extract | `generated/component-api/DragCanvas.json` |

> 完整 Demo 见 `example/demos/DragCanvas`（example 本地调试，不上线）。

