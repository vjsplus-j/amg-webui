# PropPanel

PropPanel：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 组件介绍

PropPanel：面向企业场景的 Lowcode 组件（成熟度 rc）。

## 核心特性

- Lowcode 家族组件
- 只读模式
- v-model 双向绑定
- 事件回调

## 何时使用 / 不适用

**适用**

- 低代码画布与物料拖拽
- Schema 渲染

**不适用**

- 标准后台 CRUD 无需低代码层

## 基础用法

> `import { PropPanel } from 'amg-webui/lowcode'`

```vue
<script setup>
import { PropPanel } from 'amg-webui/lowcode'
</script>

<template>
  <PropPanel />
</template>
```

Curated demo：`example/demos/PropPanel/index.vue`

## API

### Props

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `fields` | `PropField[]` | `undefined` | fields 列表数据 |
| `registry` | `ComponentRegistry` | `undefined` | When set, merge layout fields + registry propsSchema for the selected node. |
| `readonly` | `boolean` | false | 是否只读 / Read-only |
| `modelValue` | `Record<string, unknown>` | `() => ({})` | 绑定值 / Bound value (v-model) |
| `title` | `string` | `undefined` | 标题 / Title |
| `emptyText` | `string` | `undefined` | emptyText 字符串 |

### Events

| 事件 | Payload | 说明 |
| --- | --- | --- |
| `update:prop` | `payload: { key: string; value: unknown }` | `prop` 更新时触发（v-model） |
| `update:modelValue` | `value: Record<string, unknown>` | v-model 更新 / v-model update |
| `change` | `payload: { key: string; value: unknown }` | 值变更 / Change |

### Models

| Model | 说明 |
| --- | --- |
| `modelValue` | v-model |

### Public Types

- `PropField`
- `PropPanelProps`
- `PropPanelEmits`

## 键盘交互

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts PropPanel non-interactive display — keyboard N/A

## 无障碍

- 状态：`PASS`
- A11Y_STRUCTURE=PASS; A11Y_CONTRAST=PASS

## Theme

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts PropPanel uses package styles / semantic tokens gate

## RTL

- 状态：`N/A`
- tests/unit/hardening/real-mount-remaining.spec.ts PropPanel RTL covered by theme/dir provider

## SSR

- 状态：`PASS`
- tests/unit/hardening/real-mount-remaining.spec.ts PropPanel client mount OK; no required browser-only top-level in package gate

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
| metadata | `component-metadata/PropPanel.json` |
| API extract | `generated/component-api/PropPanel.json` |

> 完整 Demo 见 `example/demos/PropPanel`（example 本地调试，不上线）。

