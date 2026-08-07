# SchemaRenderer

SchemaRenderer：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 组件介绍

SchemaRenderer：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 核心特性

- Lowcode 家族组件
- 列配置
- 支持禁用状态
- 事件回调

## 何时使用 / 不适用

**适用**

- 低代码画布与物料拖拽
- Schema 渲染

**不适用**

- 标准后台 CRUD 无需低代码层

## 基础用法

> `import { SchemaRenderer } from 'amg-webui/lowcode'`

```vue
<script setup>
import { SchemaRenderer } from 'amg-webui/lowcode'
</script>

<template>
  <SchemaRenderer />
</template>
```

Curated demo：`example/demos/SchemaRenderer/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `schema` | `CanvasSchema \| CanvasNodeData[] \| null` | `null` | Full schema or nodes-only array. |
| `nodes` | `CanvasNodeData[]` | `() => []` | nodes 列表数据 |
| `mode` | `'free' \| 'grid'` | `free` | mode 配置项 |
| `registry` | `ComponentRegistry` | `undefined` | registry 配置项 |
| `renderMode` | `SchemaRenderMode` | `component` | `component` mounts real Vue components; `chrome` shows label/type placeholders. |
| `columns` | `number` | 24 | 列定义 / Column definitions |
| `selectedId` | `string \| null` | `null` | selectedId 字符串 |
| `interactive` | `boolean` | true | 是否启用 interactive |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |
| `context` | `LowcodeRenderContext` | `undefined` | Runtime state for `__bindings` path expressions (e.g. `form.name`). Prefer a reactive object so binding updates re-render. |
| `handlers` | `LowcodeEventHandlers` | `undefined` | Named handlers for `__events` / registry `events` stubs (same names as codegen). |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `select` | `id: string` | 选中 / Select |
| `nodeActivate` | `node: CanvasNodeData, event: MouseEvent \| KeyboardEvent` | nodeActivate 时触发 |
| `nodeEvent` | `payload: LowcodeNodeEventPayload` | nodeEvent 时触发 |

### Public Types

- `SchemaRendererProps`
- `SchemaRendererEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts SchemaRenderer non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts SchemaRenderer uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts SchemaRenderer RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts SchemaRenderer client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/SchemaRenderer.json` |
| API extract | `generated/component-api/SchemaRenderer.json` |

> 完整 Demo 见 `example/demos/SchemaRenderer`（example 本地调试，不上线）。

