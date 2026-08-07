# CanvasPreview

CanvasPreview：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 组件介绍

CanvasPreview：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 核心特性

- Lowcode 家族组件
- v-model 双向绑定
- 列配置
- 加载状态反馈
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 低代码画布与物料拖拽
- Schema 渲染

**不适用**

- 标准后台 CRUD 无需低代码层

## 基础用法

> `import { CanvasPreview } from 'amg-webui/lowcode'`

```vue
<script setup>
import { CanvasPreview } from 'amg-webui/lowcode'
</script>

<template>
  <CanvasPreview />
</template>
```

Curated demo：`example/demos/CanvasPreview/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `nodes` | `CanvasNodeData[]` | `() => []` | nodes 列表数据 |
| `modelValue` | `string \| null` | `null` | 绑定值 / Bound value (v-model) |
| `mode` | `"free" \| "grid"` | `free` | mode 配置项 |
| `scale` | `number \| "fit"` | `fit` | scale 数值 |
| `minScale` | `number` | 0.1 | minScale 数值 |
| `maxScale` | `number` | 2 | maxScale 数值 |
| `canvasWidth` | `number` | 960 | canvasWidth 数值 |
| `canvasHeight` | `number` | 540 | canvasHeight 数值 |
| `columns` | `number` | 24 | 列定义 / Column definitions |
| `showGrid` | `boolean` | false | 是否启用 showGrid |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `interactive` | `boolean` | true | 是否启用 interactive |
| `title` | `string` | `undefined` | 标题 / Title |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |
| `registry` | `ComponentRegistry` | `undefined` | When set with renderMode=`component`, mounts real components via registry. |
| `renderMode` | `SchemaRenderMode` | `chrome` | renderMode 配置项 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:modelValue` | `id: string \| null` | v-model 更新 / v-model update |
| `change` | `id: string \| null` | 值变更 / Change |
| `select` | `id: string` | 选中 / Select |
| `nodeActivate` | `node: CanvasNodeData, event: MouseEvent \| KeyboardEvent,` | nodeActivate 时触发 |
| `scaleChange` | `scale: number` | scaleChange 时触发 |
| `refresh` | `void` | refresh 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `CanvasPreviewProps`
- `CanvasPreviewEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts CanvasPreview interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasPreview uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasPreview RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts CanvasPreview client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/CanvasPreview.json` |
| API extract | `generated/component-api/CanvasPreview.json` |

> 完整 Demo 见 `example/demos/CanvasPreview`（example 本地调试，不上线）。

