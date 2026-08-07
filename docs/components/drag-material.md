# DragMaterial

DragMaterial：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 组件介绍

DragMaterial：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 核心特性

- Lowcode 家族组件
- 可搜索
- 支持禁用状态
- 加载状态反馈
- 事件回调

## 何时使用 / 不适用

**适用**

- 低代码画布与物料拖拽
- Schema 渲染

**不适用**

- 标准后台 CRUD 无需低代码层

## 基础用法

> `import { DragMaterial } from 'amg-webui/lowcode'`

```vue
<script setup>
import { DragMaterial } from 'amg-webui/lowcode'
</script>

<template>
  <DragMaterial />
</template>
```

Curated demo：`example/demos/DragMaterial/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `materials` | `CanvasMaterialItem[]` | `() => []` | materials 列表数据 |
| `filter` | `string` | `` | filter 字符串 |
| `group` | `string` | `undefined` | group 字符串 |
| `searchable` | `boolean` | true | 是否启用 searchable |
| `disabled` | `boolean` | false | 是否禁用 / Whether disabled |
| `loading` | `boolean` | false | 加载中状态 / Loading state |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |
| `ariaLabel` | `string` | `undefined` | 无障碍标签 / ARIA label |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:filter` | `query: string` | `filter` 更新时触发（v-model） |
| `drag-start` | `material: CanvasMaterialItem` | drag-start 时触发 |
| `dragStart` | `material: CanvasMaterialItem, event: DragEvent` | dragStart 时触发 |
| `dragEnd` | `material: CanvasMaterialItem, event: DragEvent` | dragEnd 时触发 |
| `search` | `query: string` | search 时触发 |
| `pick` | `material: CanvasMaterialItem, event: MouseEvent \| KeyboardEvent,` | pick 时触发 |

### Public Types

- `DragMaterialProps`
- `DragMaterialEmits`

## 键盘交互

- 状态：`FAIL`
- invalid keyboard evidence (mount/visibility only): "tests/unit/hardening/real-mount-remaining.spec.ts DragMaterial interactive surface present (keyboard applicable)"

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DragMaterial uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts DragMaterial RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts DragMaterial client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/DragMaterial.json` |
| API extract | `generated/component-api/DragMaterial.json` |

> 完整 Demo 见 `example/demos/DragMaterial`（example 本地调试，不上线）。

