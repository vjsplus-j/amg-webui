# FreeLayoutDrag

FreeLayoutDrag：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 组件介绍

FreeLayoutDrag：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 核心特性

- Lowcode 家族组件
- 加载状态反馈
- 支持禁用状态
- v-model 双向绑定
- 事件回调

## 何时使用 / 不适用

**适用**

- 低代码画布与物料拖拽
- Schema 渲染

**不适用**

- 标准后台 CRUD 无需低代码层

## 基础用法

> `import { FreeLayoutDrag } from 'amg-webui/lowcode'`

```vue
<script setup>
import { FreeLayoutDrag } from 'amg-webui/lowcode'
</script>

<template>
  <FreeLayoutDrag />
</template>
```

Curated demo：`example/demos/FreeLayoutDrag/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `enabled` | `boolean` | true | 是否启用 enabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `title` | `string` | `undefined` | 标题 / Title |
| `telemetry` | `boolean` | `undefined` | 是否上报 Telemetry / Enable telemetry |
| `trackId` | `string` | `undefined` | Telemetry 追踪 id / Telemetry track id |
| `modelValue` | `{ x: number; y: number }` | `() => ({ x: 0, y: 0 })` | 绑定值 / Bound value (v-model) |
| `draggable` | `boolean` | true | 是否启用 draggable |
| `axis` | `"both" \| "x" \| "y"` | `both` | axis 配置项 |
| `constrainToParent` | `boolean` | true | 是否启用 constrainToParent |
| `activeText` | `string` | `undefined` | activeText 字符串 |
| `inactiveText` | `string` | `undefined` | inactiveText 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `mode` | `mode: "free"` | mode 时触发 |
| `toggle` | `enabled: boolean` | toggle 时触发 |
| `update:enabled` | `enabled: boolean` | `enabled` 更新时触发（v-model） |
| `update:modelValue` | `value: { x: number; y: number }` | v-model 更新 / v-model update |
| `change` | `value: { x: number; y: number }` | 值变更 / Change |
| `drag-start` | `value: { x: number; y: number }, event: PointerEvent` | drag-start 时触发 |
| `drag` | `value: { x: number; y: number }, event: PointerEvent` | drag 时触发 |
| `drag-end` | `value: { x: number; y: number }, event: PointerEvent` | drag-end 时触发 |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `FreeLayoutDragProps`
- `FreeLayoutDragEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts FreeLayoutDrag interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts FreeLayoutDrag uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts FreeLayoutDrag RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts FreeLayoutDrag client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/FreeLayoutDrag.json` |
| API extract | `generated/component-api/FreeLayoutDrag.json` |

> 完整 Demo 见 `example/demos/FreeLayoutDrag`（example 本地调试，不上线）。

